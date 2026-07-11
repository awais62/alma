# mcp-server

The menu/order **MCP tools** the voice agent's LLM calls.

Tools: `get_menu`, `get_item_details`, `get_specials`, `place_order`, `call_waiter`.

Reads/writes Postgres / Supabase and pushes orders to the POS/kitchen (webhook). Deploys to a small VPS / Fly.io / Railway over streamable HTTP.

Architecture: [Taible-io/architecture](https://github.com/Taible-io/architecture) · New here? [playbook_startup](https://github.com/Taible-io/playbook_startup).

_Stage: 🔧 empty scaffold. Never commit secrets._

## Database schema

Schema v1 (single-restaurant pilot) lives in [`db/schema.sql`](db/schema.sql) — paste it into the Supabase SQL Editor (`taibledb` project) to provision the database.

**Access model:** every table has RLS enabled with **zero policies**, which locks it to service-role (secret key) access only. Guests and staff never touch Supabase from the browser — all reads/writes flow through the FastMCP server on Cloud Run using the secret key. The publishable/anon key can reach nothing here.

`restaurant_id` is carried on every table so restaurant #2 needs no migration.

| Table | Purpose |
| --- | --- |
| `restaurants` | One row per restaurant; `slug` is used in the QR code URL. |
| `menu_items` | Menu the voice agent reads via `get_menu`; `is_available` is the staff stock toggle. |
| `modifiers` | Per-item add-ons (e.g. "Extra cheese", "No onions") with a `price_delta`. |
| `sessions` | One per guest visit / table; opened by an MCP tool on QR scan — no guest auth. |
| `orders` | An order within a session; `status` moves pending → confirmed → preparing → served / cancelled. |
| `order_items` | Line items on an order; `unit_price` snapshots the price at order time. |
| `order_item_modifiers` | Chosen modifiers per line item; `price_delta` snapshotted at order time. |

## Storage

### Bucket: `menu-images`

Supabase Storage bucket holding menu item images (referenced by `menu_items.image_url`).

| Property | Value |
| --- | --- |
| Public | `true` — files are publicly accessible via URL |
| Type | `STANDARD` |
| File size limit | `3145728` bytes (3 MB) |
| Allowed MIME types | `image/png`, `image/jpeg` |
