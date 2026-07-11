# Populate the pilot database + `menu-images` bucket

**What this does:** seeds the `taibledb` Supabase project with a demo restaurant (**Taible Bistro**), its menu items, and modifiers — then sources a licensed photo for each dish, stores it in the public `menu-images` bucket, and links it back to the row.

Like the other files here, this is a **prompt playbook**: connect the Supabase MCP, paste the prompt below into Claude Code, and check the Success Criteria at the end.

---

## Prerequisites

- **Supabase MCP connected** to the `taibledb` project (org `TaibleStartup`, region São Paulo). Verify with `mcp__supabase__list_tables` — you should see `restaurants`, `menu_items`, `modifiers`, `sessions`, `orders`, `order_items`, `order_item_modifiers`.
- The schema is **already created**. This playbook only inserts rows and uploads images — it does **not** run migrations.
- **RLS:** every table has RLS enabled with **zero policies** (locked to service-role / MCP access). Do **not** add, remove, or modify any policy as part of this task.

### `menu-images` bucket config — the prompt must not violate these

| Setting            | Value                                        |
|--------------------|----------------------------------------------|
| Public             | `true` — files are publicly accessible via URL |
| Type               | `STANDARD`                                    |
| File size limit    | `3145728` bytes (3 MB)                         |
| Allowed MIME types | `image/png`, `image/jpeg`                      |

Any file that doesn't satisfy **both** the size limit and the MIME type is rejected by the bucket — convert/compress **before** uploading, don't upload and hope.

---

## ⚠️ Known gotcha — storage upload is not an MCP tool

The Supabase MCP (as of this writing) exposes **no storage-object upload capability**. Its storage tools are `list_storage_buckets`, `get_storage_config`, and `update_storage_config` — all **config-level**, none write file bytes into a bucket.

So **Step 4 (upload each image) cannot be done through the MCP alone.** To place bytes in `menu-images` you need one of:

- the **Supabase Storage REST API** — `POST /storage/v1/object/menu-images/<file>` with a **`service_role` key** in the `Authorization: Bearer` header (required because RLS has zero policies, so only service-role can write); **or**
- the **Supabase CLI** / dashboard uploader; **or**
- a small script using `@supabase/supabase-js` with the service-role key.

`execute_sql` **cannot** substitute — inserting into `storage.objects` does not place the backing bytes and leaves broken references.

**Practical split:** Steps 1–3 (all row inserts) run entirely through `mcp__supabase__execute_sql`. Steps 4–5 (image sourcing, upload, URL attach) need the service-role key out-of-band. If the key isn't available, run Steps 1–3 now and leave every `image_url = null` (Step 7 explicitly permits this), then backfill images once credentials exist.

---

## The prompt

> You have access to the Supabase MCP, connected to the `taibledb` project (organization `TaibleStartup`, region South America / São Paulo). The schema is already created — tables: `restaurants`, `menu_items`, `modifiers`, `sessions`, `orders`, `order_items`, `order_item_modifiers`. All tables have RLS enabled with zero policies (locked to service-role/MCP access only) — do not add, remove, or modify any RLS policy as part of this task.
>
> **Bucket `menu-images`:** public `true`, STANDARD, 3 MB (3145728 bytes) limit, MIME `image/png` or `image/jpeg` only. Convert/compress before uploading — the bucket rejects anything out of spec.
>
> ### Step 1 — Insert the restaurant
> `name: "Taible Bistro"`, `slug: "taible-bistro"`.
>
> ### Step 2 — Insert all menu items with `image_url = null`
> Insert every row below under the restaurant's `restaurant_id`, `image_url = null`, `is_available = true`. Keep each returned `id`. Prices are placeholder USD.
>
> | Category   | Name                   | Price | Description                                                   |
> |------------|------------------------|-------|--------------------------------------------------------------|
> | Appetizers | Crispy Calamari        | 9.50  | Lightly battered calamari served with lemon aioli.           |
> | Appetizers | Burrata Caprese        | 11.00 | Fresh burrata, heirloom tomatoes, basil, olive oil.          |
> | Mains      | Grilled Salmon         | 18.50 | Atlantic salmon, roasted vegetables, lemon butter sauce.     |
> | Mains      | Classic Beef Burger    | 14.00 | Beef patty, cheddar, lettuce, tomato, brioche bun.           |
> | Mains      | Margherita Pizza       | 13.50 | San Marzano tomato, mozzarella, fresh basil.                 |
> | Mains      | Mushroom Risotto       | 15.00 | Creamy arborio rice, wild mushrooms, parmesan. (vegetarian)  |
> | Desserts   | Tiramisu               | 7.00  | Classic Italian dessert with mascarpone and espresso.        |
> | Desserts   | Chocolate Lava Cake    | 8.00  | Warm chocolate cake with a molten center, vanilla ice cream. |
> | Drinks     | Sparkling Water        | 3.00  | 500ml bottle.                                                |
> | Drinks     | House Red Wine (glass) | 6.50  | Glass of the house red.                                      |
>
> ### Step 3 — Insert modifiers (linked to the correct `menu_item_id`)
>
> | Menu item            | Modifier name            | Price delta |
> |----------------------|--------------------------|-------------|
> | Classic Beef Burger  | Add bacon                | 2.00        |
> | Classic Beef Burger  | Extra cheese             | 1.50        |
> | Classic Beef Burger  | No onion                 | 0.00        |
> | Margherita Pizza     | Extra cheese             | 2.00        |
> | Margherita Pizza     | Add mushrooms            | 1.50        |
> | Grilled Salmon       | Substitute fries for veg | 0.00        |
> | Mushroom Risotto     | Add grilled chicken      | 3.00        |
>
> ### Step 4 — For each of the 10 items: source → download → validate/convert → upload → attach
> 1. **Source** a photo from **Unsplash or Pexels** (or another site that explicitly grants a **free commercial/marketing-use** license — this is a public-facing, revenue product; a personal/editorial-only license is not enough). Must be **real photography** of the actual food (no illustrations, renders, AI-looking or clip-art images) and **marketing-quality** (well-lit, appetizing, professional).
> 2. **Download** the real image bytes (not the source page).
> 3. **Validate/convert:** ensure MIME is `image/png`/`image/jpeg` and size < 3145728 bytes; convert/compress/resize until both hold before uploading.
> 4. **Upload** the validated file to `menu-images`, named `<slugified-dish-name>.jpg`/`.png` to match its format (e.g. `crispy-calamari.jpg`).
> 5. **Get the public URL** Supabase generates for that object (a `menu-images` bucket URL — not the Unsplash/Pexels URL).
> 6. **Attach:** `UPDATE menu_items SET image_url = <that URL> WHERE id = <saved id>`.
> 7. If no suitably-licensed, valid image can be found after a reasonable search, leave that item's `image_url = null` — never upload anything unlicensed or out-of-spec just to fill the field. Note the skipped item in the report.
>
> ### Step 5 — Verify and report
> Query `menu_items` joined with `modifiers` and `restaurants`, and report: every item with its final `image_url` (confirm each is a `menu-images` bucket URL); any item left `null` and why; and confirm no RLS policies were added/removed/modified.

---

## Success criteria

- [ ] Exactly **1** restaurant row: `Taible Bistro` / `taible-bistro`.
- [ ] **10** `menu_items` rows under that restaurant, correct categories/prices/descriptions, `is_available = true`.
- [ ] **7** `modifiers` rows, each linked to the right `menu_item_id`.
- [ ] Each `image_url` is either a **`menu-images` bucket public URL** or `null` (never an external Unsplash/Pexels URL).
- [ ] Every uploaded object is ≤ 3 MB and `image/png` or `image/jpeg`.
- [ ] **No RLS policy** was added, removed, or modified on any table.
- [ ] Final report lists every item's image status and names any skipped items.
