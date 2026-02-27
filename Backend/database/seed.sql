USE B2C_future_B2B_PartnersStaff;

START TRANSACTION;

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (full_name, email, password, role, phone, is_verified)
VALUES
  ('Lebo Customer', 'lebo@example.com', 'password123', 'customer', '+27110000001', TRUE),
  ('Amo Partner',   'amo@lumiskin.com',  'password123', 'partner',  '+27110000002', TRUE),
  ('Admin FaceIT',  'admin@faceit.com',  'admin',       'admin',    '+27110000003', TRUE)
AS new_u
ON DUPLICATE KEY UPDATE full_name = new_u.full_name;


-- ─────────────────────────────────────────────────────────────────────────────
-- BRANDS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO brands (name, contact_email, website_url, logo_url, partnership_status, contract_start)
VALUES
  ('The Ordinary', 'partners@theordinary.com', 'https://theordinary.com',    NULL, 'active', '2026-01-01'),
  ('Nivea',        'partners@nivea.co.za',     'https://www.nivea.co.za',    NULL, 'active', '2026-01-05'),
  ('Neutrogena',   'partners@neutrogena.com',  'https://www.neutrogena.com', NULL, 'active', '2026-01-10')
AS new_b
ON DUPLICATE KEY UPDATE partnership_status = new_b.partnership_status;


-- ─────────────────────────────────────────────────────────────────────────────
-- Resolve brand IDs into variables (avoids subqueries inside VALUES rows)
-- ─────────────────────────────────────────────────────────────────────────────
SET @brand_to = (SELECT id FROM brands WHERE name = 'The Ordinary' LIMIT 1);
SET @brand_nv = (SELECT id FROM brands WHERE name = 'Nivea'        LIMIT 1);
SET @brand_ng = (SELECT id FROM brands WHERE name = 'Neutrogena'   LIMIT 1);


-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCTS
-- IDs 1-3   : Face.IT Scanners
-- IDs 4-8   : Face.IT Own Skincare Range
-- IDs 9-13  : The Ordinary
-- IDs 14-16 : Nivea
-- IDs 17-21 : Neutrogena
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO products
  (id, brand_id, sku, name, description, product_type, category, price,
   stock_qty, low_stock_threshold, image_url, is_active)
VALUES
  (1,  NULL,      'FI-LITE-001',   'Face.IT Lite',
   'Compact home-use scanner with full hydration, oil balance, and skin type analysis via Bluetooth.',
   'machine', 'scanner', 1499.00, 50, 3, '/assets/products/The_Face_I_T_1.png', TRUE),

  (2,  NULL,      'FI-PRO-001',    'Face.IT Pro',
   'Flagship device with UV damage detection, aging analysis, tone and texture, and full routine builder AI.',
   'machine', 'scanner', 3299.00, 30, 3, '/assets/products/The_Face_I_T_Pro_1.jpg', TRUE),

  (3,  NULL,      'FI-CLINIC-001', 'Face.IT Clinic',
   'Professional multi-client scanner for dermatologists and beauty professionals. Clinical PDF reports and practice dashboard.',
   'machine', 'scanner', 0.00, 10, 2, '/assets/products/face_scanner.jpg', TRUE),

  (4,  NULL,      'FI-MOIST-001',  'FI Daily Moisturiser',
   'Lightweight non-comedogenic daily hydration for all skin types.',
   'skincare', 'moisturiser', 299.00, 100, 10, NULL, TRUE),

  (5,  NULL,      'FI-SERUM-001',  'FI Peptide Serum',
   'High-potency peptide complex targeting fine lines and loss of firmness.',
   'skincare', 'serum', 449.00, 80, 10, NULL, TRUE),

  (6,  NULL,      'FI-SPF-001',    'FI SPF 50 Shield',
   'Broad-spectrum mineral SPF 50, invisible finish, no white cast.',
   'skincare', 'sunscreen', 349.00, 120, 15, NULL, TRUE),

  (7,  NULL,      'FI-CLEAN-001',  'FI Gentle Cleanser',
   'pH-balanced gel cleanser that removes impurities without stripping barrier.',
   'skincare', 'cleanser', 199.00, 150, 15, NULL, TRUE),

  (8,  NULL,      'FI-TONER-001',  'FI Balancing Toner',
   'Alcohol-free toner with niacinamide and witch hazel.',
   'skincare', 'toner', 249.00, 90, 10, NULL, TRUE),

  (9,  @brand_to, 'TO-ESSENCE-001','Multi-Active Delivery Essence',
   'A hydrating essence that primes skin and improves absorption of subsequent skincare steps.',
   'skincare', 'essence', 189.00, 80, 10, '/assets/products/Delivery_Essence.jpg', TRUE),

  (10, @brand_to, 'TO-GLYCO-001',  'Glycolic Acid 7% Exfoliating Toner',
   'Exfoliating toner that smooths texture and brightens skin tone with AHA at pH 3.6.',
   'skincare', 'toner', 149.00, 100, 12, '/assets/products/Glycolic_Acid.jpg', TRUE),

  (11, @brand_to, 'TO-LACTIC-001', 'Lactic Acid 10% + HA',
   'High-strength lactic acid superficial peeling formulation for improved clarity and anti-aging.',
   'skincare', 'treatment', 175.00, 90, 10, '/assets/products/Lactic_Acid.jpg', TRUE),

  (12, @brand_to, 'TO-NIAC-001',   'Niacinamide 5% Face and Body Emulsion',
   'Multi-functional face and body emulsion targeting brighter, more even skin tone.',
   'skincare', 'treatment', 219.00, 110, 12, '/assets/products/Niacinmaide.jpg', TRUE),

  (13, @brand_to, 'TO-RETI-001',   'Retinol 1% in Squalane',
   'High-strength retinol in water-free squalane base. Targets signs of aging and skin texture.',
   'skincare', 'retinoid', 289.00, 75, 8, '/assets/products/retinol.jpg', TRUE),

  (14, @brand_nv, 'NV-DERMA-001',  'Derma Dry Control Anti-Perspirant',
   '96-hour extreme sweat defence with DermaDry technology that protects and cares for the skin.',
   'skincare', 'body-care', 129.00, 120, 15, '/assets/products/Nivea_derma_dry_control.jpg', TRUE),

  (15, @brand_nv, 'NV-CELL-001',   'Cellular Filler Intensive Anti-Age Gift Set',
   'Intensive anti-age set with 20% Hydra Elixir. Includes day cream and serum for visible line correction.',
   'skincare', 'gift-set', 549.00, 40, 5, '/assets/products/The_Cellular_Filler_Set_Nivea.jpg', TRUE),

  (16, @brand_nv, 'NV-LUM-001',    'Cellular Luminous 630 Anti-Spot Serum',
   'Intensive serum with Luminous630 technology that visibly reduces dark spots and hyperpigmentation.',
   'skincare', 'serum', 349.00, 65, 8, '/assets/products/The_Nivea_Cellular_Luminous_630_Antispot_Serum.jpg', TRUE),

  (17, @brand_ng, 'NG-BBSER-001',  'Bright Boost Illuminating Serum',
   'Activates skin natural renewal process with highly concentrated neoglucosamine for brighter, even-toned skin.',
   'skincare', 'serum', 299.00, 85, 10, '/assets/products/BoostIlluminatingserum.jpg', TRUE),

  (18, @brand_ng, 'NG-BBPOL-001',  'Bright Boost Resurfacing Polish',
   'AHA + natural exfoliators resurface and reveal smoother, more radiant skin. 75ml.',
   'skincare', 'exfoliator', 229.00, 90, 10, '/assets/products/Bright_Boost_resurfacing.jpg', TRUE),

  (19, @brand_ng, 'NG-RETDAY-001', 'Retinol Boost Day Cream SPF 15',
   'Anti-age day cream with retinol and SPF 15. Fights wrinkles, dryness, and age spots.',
   'skincare', 'day-cream', 319.00, 70, 8, '/assets/products/renitol_boost_day_cream.jpg', TRUE),

  (20, @brand_ng, 'NG-REPAIR-001', 'Intense Repair Cica Body Lotion',
   'Norwegian Formula with 10% glycerin + Centella Asiatica. Instant relief for very dry, rough skin.',
   'skincare', 'body-lotion', 189.00, 100, 12, '/assets/products/repair_body_lotion.jpg', TRUE),

  (21, @brand_ng, 'NG-SPOT-001',   'Spot Controlling+ Face Wash',
   'Salicylic Acid + 2% PHA. Fragrance-free formula improves the look of spot marks in 1 week.',
   'skincare', 'cleanser', 149.00, 110, 15, '/assets/products/Spot_controling_wash.jpg', TRUE)

AS new_p
ON DUPLICATE KEY UPDATE
  name        = new_p.name,
  description = new_p.description,
  price       = new_p.price,
  stock_qty   = new_p.stock_qty,
  image_url   = new_p.image_url,
  is_active   = new_p.is_active;


-- ─────────────────────────────────────────────────────────────────────────────
-- SKIN CONCERNS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO skin_concerns (concern_name, description)
VALUES
  ('Dehydration',       'Lack of moisture in skin layers'),
  ('Hyperpigmentation', 'Dark spots or uneven skin tone'),
  ('Barrier Damage',    'Compromised skin protective barrier'),
  ('Oil Imbalance',     'Excess or insufficient sebum production'),
  ('Acne Tendency',     'Prone to inflammatory breakouts'),
  ('Aging',             'Fine lines, loss of firmness, age spots'),
  ('Dullness',          'Lack of radiance and uneven texture')
AS new_sc
ON DUPLICATE KEY UPDATE description = new_sc.description;


-- ─────────────────────────────────────────────────────────────────────────────
-- RESOLVE VARIABLES needed for subsequent inserts
-- ─────────────────────────────────────────────────────────────────────────────
SET @lebo_id         = (SELECT id FROM users         WHERE email        = 'lebo@example.com'  LIMIT 1);
SET @concern_dehyd   = (SELECT id FROM skin_concerns WHERE concern_name = 'Dehydration'       LIMIT 1);
SET @concern_barrier = (SELECT id FROM skin_concerns WHERE concern_name = 'Barrier Damage'    LIMIT 1);
SET @concern_pigment = (SELECT id FROM skin_concerns WHERE concern_name = 'Hyperpigmentation' LIMIT 1);


-- ─────────────────────────────────────────────────────────────────────────────
-- CART
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO carts (id, user_id)
VALUES ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', @lebo_id)
AS new_cart
ON DUPLICATE KEY UPDATE user_id = new_cart.user_id;

-- product 9 = TO-ESSENCE-001 | product 16 = NV-LUM-001
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 9,  1),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 16, 1)
AS new_ci
ON DUPLICATE KEY UPDATE quantity = new_ci.quantity;


-- ─────────────────────────────────────────────────────────────────────────────
-- SCAN SESSION
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO scan_sessions (id, user_id, scanner_serial, overall_score, scan_data)
VALUES (
  'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  @lebo_id, 'SCN-FACEIT-0001', 62,
  JSON_OBJECT('hydration', 42, 'oil_balance', 55, 'pigmentation', 68, 'barrier', 40)
) AS new_ss
ON DUPLICATE KEY UPDATE
  overall_score = new_ss.overall_score,
  scan_data     = new_ss.scan_data;


-- ─────────────────────────────────────────────────────────────────────────────
-- SCAN RESULTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO scan_results (scan_session_id, skin_concern_id, severity_level, confidence_score, note)
VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', @concern_dehyd,   4, 91.50, 'Hydration below target range.'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', @concern_barrier, 3, 86.20, 'Barrier support recommended.'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', @concern_pigment, 2, 79.00, 'Mild uneven tone detected.')
AS new_sr
ON DUPLICATE KEY UPDATE
  severity_level   = new_sr.severity_level,
  confidence_score = new_sr.confidence_score,
  note             = new_sr.note;


-- ─────────────────────────────────────────────────────────────────────────────
-- RECOMMENDATIONS
-- product 9  = TO-ESSENCE-001
-- product 4  = FI-MOIST-001
-- product 16 = NV-LUM-001
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO recommendations
  (scan_session_id, product_id, skin_concern_id, reason, priority_rank, is_accepted)
VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 9,  @concern_dehyd,
   'Low hydration detected; delivery essence improves absorption and moisture levels.',   1, TRUE),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 4,  @concern_barrier,
   'Barrier stress detected; lightweight daily moisturiser to rebuild barrier function.', 2, TRUE),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 16, @concern_pigment,
   'Uneven tone detected; Luminous630 serum clinically proven to reduce dark spots.',     3, FALSE)
AS new_rec
ON DUPLICATE KEY UPDATE
  reason        = new_rec.reason,
  priority_rank = new_rec.priority_rank,
  is_accepted   = new_rec.is_accepted;


-- ─────────────────────────────────────────────────────────────────────────────
-- ORDER
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO orders
  (order_uuid, order_number, user_id, order_status, payment_status,
   total_amount, shipping_address, billing_address, payment_method, tracking_number, notes)
SELECT
  'ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'ORD-20260217-000001',
  @lebo_id, 'processing', 'paid', 538.00,
  JSON_OBJECT('street','12 Main Rd','city','Johannesburg','postal_code','2000','country','ZA'),
  JSON_OBJECT('street','12 Main Rd','city','Johannesburg','postal_code','2000','country','ZA'),
  'simulated', 'TRK-FAKE-1001', 'Seed order for testing checkout flow'
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE order_uuid = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1'
);

SET @seed_order_id = (
  SELECT id FROM orders WHERE order_uuid = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1' LIMIT 1
);


-- ─────────────────────────────────────────────────────────────────────────────
-- ORDER ITEMS  (product 9 | product 16)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
SELECT @seed_order_id, p.id, p.name, 1, p.price
FROM products p WHERE p.id = 9
  AND NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.order_id = @seed_order_id AND oi.product_id = 9
  );

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
SELECT @seed_order_id, p.id, p.name, 1, p.price
FROM products p WHERE p.id = 16
  AND NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.order_id = @seed_order_id AND oi.product_id = 16
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENT
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO payments
  (payment_uuid, order_id, amount, payment_method, transaction_id, status, metadata)
SELECT
  'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
  @seed_order_id, 538.00, 'simulated', 'SIM-1000001', 'completed',
  JSON_OBJECT('card_last4','4242','gateway','demo')
WHERE NOT EXISTS (
  SELECT 1 FROM payments WHERE payment_uuid = 'ddddddd1-dddd-dddd-dddd-ddddddddddd1'
);

COMMIT;