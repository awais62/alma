"""
Taible FastMCP server.

Exposes the tools the voice orchestrator calls during a guest's visit:
start a session, read the menu, build an order, confirm it, and check
its status -- plus one staff tool to toggle stock.

All database access uses the Supabase SECRET key (service-role
equivalent), read from the environment. This process is the only
thing that is ever allowed to read or write the taibledb tables --
see taible_schema.sql for the RLS design this depends on.
"""

import os
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
from fastmcp import FastMCP
from supabase import create_client, Client

# Loads variables from a local .env file if one exists. On Cloud Run
# there is no .env file, so this is a no-op there and the real
# environment variables (set via Secret Manager) are used instead.
load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SECRET_KEY = os.environ["SUPABASE_SECRET_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

mcp = FastMCP("taible-mcp")


def _get_restaurant_id(restaurant_slug: str) -> str:
    res = (
        supabase.table("restaurants")
        .select("id")
        .eq("slug", restaurant_slug)
        .single()
        .execute()
    )
    return res.data["id"]


def _recalculate_order_total(order_id: str) -> None:
    items = (
        supabase.table("order_items")
        .select("quantity, unit_price, order_item_modifiers(price_delta)")
        .eq("order_id", order_id)
        .execute()
    ).data

    total = 0.0
    for item in items:
        modifiers_total = sum(m["price_delta"] for m in item["order_item_modifiers"])
        total += item["quantity"] * (item["unit_price"] + modifiers_total)

    supabase.table("orders").update({"total": round(total, 2)}).eq("id", order_id).execute()


@mcp.tool
def get_restaurants() -> list[dict]:
    """Return all restaurants, so a guest or the orchestrator can discover valid restaurant slugs."""
    res = (
        supabase.table("restaurants")
        .select("id, slug, name")
        .order("name")
        .execute()
    )
    return res.data


@mcp.tool
def get_menu(restaurant_slug: str) -> list[dict]:
    """Return all currently available menu items, with their modifiers, for a restaurant."""
    restaurant_id = _get_restaurant_id(restaurant_slug)
    res = (
        supabase.table("menu_items")
        .select(
            "id, name, description, price, category, image_url, "
            "modifiers(id, name, price_delta, is_available)"
        )
        .eq("restaurant_id", restaurant_id)
        .eq("is_available", True)
        .execute()
    )
    return res.data


@mcp.tool
def start_session(restaurant_slug: str, table_number: Optional[str] = None) -> dict:
    """Start a new guest session -- called the moment a guest scans the table QR / connects by voice."""
    restaurant_id = _get_restaurant_id(restaurant_slug)
    res = (
        supabase.table("sessions")
        .insert({"restaurant_id": restaurant_id, "table_number": table_number})
        .execute()
    )
    return res.data[0]


@mcp.tool
def create_order(session_id: str) -> dict:
    """Create a new pending order for a session."""
    session = (
        supabase.table("sessions")
        .select("restaurant_id")
        .eq("id", session_id)
        .single()
        .execute()
    )
    res = (
        supabase.table("orders")
        .insert({"session_id": session_id, "restaurant_id": session.data["restaurant_id"]})
        .execute()
    )
    return res.data[0]


@mcp.tool
def add_item_to_order(
    order_id: str,
    menu_item_id: str,
    quantity: int = 1,
    modifier_ids: Optional[list[str]] = None,
) -> dict:
    """Add a menu item, with optional modifiers, to an existing order. Recomputes the order total."""
    modifier_ids = modifier_ids or []

    item = (
        supabase.table("menu_items")
        .select("price, is_available")
        .eq("id", menu_item_id)
        .single()
        .execute()
    )
    if not item.data["is_available"]:
        raise ValueError("This item is currently out of stock.")

    order_item = (
        supabase.table("order_items")
        .insert(
            {
                "order_id": order_id,
                "menu_item_id": menu_item_id,
                "quantity": quantity,
                "unit_price": item.data["price"],
            }
        )
        .execute()
    ).data[0]

    if modifier_ids:
        modifiers = (
            supabase.table("modifiers")
            .select("id, price_delta")
            .in_("id", modifier_ids)
            .execute()
        ).data
        supabase.table("order_item_modifiers").insert(
            [
                {
                    "order_item_id": order_item["id"],
                    "modifier_id": m["id"],
                    "price_delta": m["price_delta"],
                }
                for m in modifiers
            ]
        ).execute()

    _recalculate_order_total(order_id)
    return order_item


@mcp.tool
def confirm_order(order_id: str) -> dict:
    """Mark an order as confirmed and ready to be sent to the kitchen."""
    res = supabase.table("orders").update({"status": "confirmed"}).eq("id", order_id).execute()
    return res.data[0]


@mcp.tool
def get_order_status(order_id: str) -> dict:
    """Get the current status, total, and items of an order."""
    res = (
        supabase.table("orders")
        .select("id, status, total, order_items(quantity, unit_price, menu_items(name))")
        .eq("id", order_id)
        .single()
        .execute()
    )
    return res.data


@mcp.tool
def toggle_stock(menu_item_id: str, is_available: bool) -> dict:
    """Staff tool: mark a menu item as in stock or out of stock."""
    res = (
        supabase.table("menu_items")
        .update({"is_available": is_available})
        .eq("id", menu_item_id)
        .execute()
    )
    return res.data[0]


@mcp.tool
def close_session(session_id: str) -> dict:
    """Close a guest session once they've left or paid."""
    res = (
        supabase.table("sessions")
        .update({"status": "closed", "closed_at": datetime.now(timezone.utc).isoformat()})
        .eq("id", session_id)
        .execute()
    )
    return res.data[0]


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    mcp.run(transport="streamable-http", host="0.0.0.0", port=port)
