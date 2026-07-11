-- =========================================================
-- Taible DB Seed — single-restaurant pilot (Taible Bistro)
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- =========================================================

-- 1. Restaurant
insert into public.restaurants (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'Taible Bistro', 'taible-bistro');


-- 2. Menu Items
-- Categories: Drinks, Breakfast, Mains, Sides, Desserts

insert into public.menu_items (id, restaurant_id, name, description, price, category) values
  -- Drinks
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'Flat White',
   'Double espresso with velvety steamed milk. Smooth and strong.',
   4.50, 'Drinks'),

  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   'Fresh Orange Juice',
   'Cold-pressed oranges, no added sugar.',
   4.00, 'Drinks'),

  ('10000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'Still Water (500ml)',
   'Chilled still mineral water.',
   1.50, 'Drinks'),

  -- Breakfast
  ('10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'Avocado Toast',
   'Sourdough toast with smashed avocado, chilli flakes, poached egg. Contains gluten, eggs.',
   12.00, 'Breakfast'),

  ('10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000001',
   'Granola Bowl',
   'House-made oat granola, seasonal fruit, honey, Greek yoghurt. Contains gluten, nuts, milk.',
   9.50, 'Breakfast'),

  ('10000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000001',
   'Full English Breakfast',
   'Two eggs (your choice), back bacon, sausage, grilled tomato, mushrooms, sourdough toast.',
   14.50, 'Breakfast'),

  -- Mains
  ('10000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000001',
   'Chicken Caesar Salad',
   'Grilled chicken breast, romaine, parmesan, croutons, house Caesar dressing.',
   13.50, 'Mains'),

  ('10000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000001',
   'Taible Burger',
   'Dry-aged beef patty, cheddar, lettuce, tomato, pickles, house sauce, brioche bun. Served with fries.',
   16.00, 'Mains'),

  -- Desserts
  ('10000000-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000001',
   'Chocolate Lava Cake',
   'Warm dark chocolate cake with liquid centre. Served with vanilla ice cream.',
   8.50, 'Desserts'),

  ('10000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000001',
   'Seasonal Fruit Sorbet',
   'Two scoops, ask your waiter for today''s flavour. Vegan, gluten-free.',
   6.00, 'Desserts');


-- 3. Modifiers

-- Flat White milk alternatives
insert into public.modifiers (menu_item_id, name, price_delta) values
  ('10000000-0000-0000-0000-000000000001', 'Oat Milk', 0.50),
  ('10000000-0000-0000-0000-000000000001', 'Almond Milk', 0.50),
  ('10000000-0000-0000-0000-000000000001', 'Soy Milk', 0.50),
  ('10000000-0000-0000-0000-000000000001', 'Extra Shot', 0.80);

-- Avocado Toast extras
insert into public.modifiers (menu_item_id, name, price_delta) values
  ('10000000-0000-0000-0000-000000000004', 'Add Smoked Salmon', 3.50),
  ('10000000-0000-0000-0000-000000000004', 'No Egg (Vegan)', 0.00);

-- Full English egg choice
insert into public.modifiers (menu_item_id, name, price_delta) values
  ('10000000-0000-0000-0000-000000000006', 'Eggs — Fried', 0.00),
  ('10000000-0000-0000-0000-000000000006', 'Eggs — Scrambled', 0.00),
  ('10000000-0000-0000-0000-000000000006', 'Eggs — Poached', 0.00);

-- Taible Burger
insert into public.modifiers (menu_item_id, name, price_delta) values
  ('10000000-0000-0000-0000-000000000008', 'Add Bacon', 1.50),
  ('10000000-0000-0000-0000-000000000008', 'Add Fried Egg', 1.00),
  ('10000000-0000-0000-0000-000000000008', 'Make it Veggie Patty', 0.00);
