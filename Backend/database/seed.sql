USE B2C_future_B2B_PartnersStaff;

START TRANSACTION;

-- USERS --
INSERT INTO users (full_name, email, password, role, phone, is_verified)
VALUES
  ('Lebo Customer', 'lebo@example.com', 'password123', 'customer', '+27110000001', TRUE),
  ('Amo Partner', 'amo@lumiskin.com', 'password123', 'partner', '+27110000002', TRUE),
  ('Admin FaceIT', 'admin@faceit.com', 'admin', 'admin', '+27110000003', TRUE)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name);


-- BRANDS --
INSERT INTO brands (name, contact_email, website_url, logo_url, partnership_status, contract_start)
VALUES
  ('LumiSkin', 'partners@lumiskin.com', 'https://lumiskin.example', 'https://cdn.example/logos/lumiskin.png', 'active', '2026-01-01'),
  ('DermaPure', 'b2b@dermapure.example', 'https://dermapure.example', 'https://cdn.example/logos/dermapure.png', 'active', '2026-01-10'),
  ('HydraLab', 'sales@hydralab.example', 'https://hydralab.example', 'https://cdn.example/logos/hydralab.png', 'pending', '2026-02-01')
ON DUPLICATE KEY UPDATE
  partnership_status = VALUES(partnership_status);


-- PRODUCTS --
INSERT INTO products (brand_id, sku, name, description, product_type, category, price, stock_qty, low_stock_threshold, image_url, is_active)
VALUES
  ((SELECT id FROM brands WHERE name='LumiSkin'), 'MACH-SCAN-001', 'FaceIT Skin Scanner', 'AI-assisted scanner for hydration, oil balance, and tone analysis.', 'machine', 'scanner-pro', 2999.99, 20, 3, 'https://cdn.example/products/scanner.png', TRUE),
  ((SELECT id FROM brands WHERE name='LumiSkin'), 'ACC-STAND-001', 'Scanner Stand', 'Anti-theft stand for in-store placement.', 'accessory', 'stand', 249.99, 50, 10, 'https://cdn.example/products/stand.png', TRUE),
  ((SELECT id FROM brands WHERE name='DermaPure'), 'SKN-CLN-001', 'Gentle Gel Cleanser', 'Low-foam cleanser for sensitive skin.', 'skincare', 'cleanser', 14.99, 120, 15, 'https://cdn.example/products/cleanser.png', TRUE),
  ((SELECT id FROM brands WHERE name='DermaPure'), 'SKN-SRM-001', 'Hyaluronic Serum 2%', 'Hydration-focused serum.', 'skincare', 'serum', 24.99, 95, 12, 'https://cdn.example/products/hyaluronic.png', TRUE),
  ((SELECT id FROM brands WHERE name='DermaPure'), 'SKN-CRM-001', 'Barrier Repair Cream', 'Ceramide moisturizer for barrier support.', 'skincare', 'moisturizer', 22.50, 80, 10, 'https://cdn.example/products/barrier-cream.png', TRUE),
  ((SELECT id FROM brands WHERE name='HydraLab'), 'SKN-SPF-001', 'Daily SPF 50', 'Broad-spectrum sunscreen.', 'skincare', 'sunscreen', 18.99, 150, 20, 'https://cdn.example/products/spf50.png', TRUE),
  ((SELECT id FROM brands WHERE name='HydraLab'), 'SKN-TRT-001', 'Niacinamide 10%', 'Tone-evening treatment serum.', 'skincare', 'treatment', 19.99, 110, 15, 'https://cdn.example/products/niacinamide.png', TRUE),
  ((SELECT id FROM brands WHERE name='HydraLab'), 'SKN-MASK-001', 'Hydrating Sheet Mask (5)', 'Quick hydration boost masks.', 'skincare', 'mask', 12.99, 140, 20, 'https://cdn.example/products/mask.png', TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  stock_qty = VALUES(stock_qty),
  is_active = VALUES(is_active);


-- SKIN CONCERNS --
INSERT INTO skin_concerns (concern_name, description)
VALUES
  ('Dehydration', 'Lack of moisture in skin layers'),
  ('Hyperpigmentation', 'Dark spots or uneven skin tone'),
  ('Barrier Damage', 'Compromised skin protective barrier'),
  ('Oil Imbalance', 'Excess or insufficient sebum production'),
  ('Acne Tendency', 'Prone to inflammatory breakouts')
ON DUPLICATE KEY UPDATE
  description = VALUES(description);


-- STORE USER ID --
SET @lebo_id = (SELECT id FROM users WHERE email = 'lebo@example.com' LIMIT 1);


-- CART + CART ITEMS --
INSERT INTO carts (id, user_id)
VALUES ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', @lebo_id)
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id);

INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', (SELECT id FROM products WHERE sku='SKN-SRM-001'), 1),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', (SELECT id FROM products WHERE sku='SKN-CRM-001'), 1)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);


-- SCAN SESSIONS --
INSERT INTO scan_sessions (id, user_id, scanner_serial, overall_score, scan_data)
VALUES (
  'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  @lebo_id,
  'SCN-FACEIT-0001',
  62,
  JSON_OBJECT('hydration', 42, 'oil_balance', 55, 'pigmentation', 68, 'barrier', 40)
)
ON DUPLICATE KEY UPDATE
  overall_score = VALUES(overall_score),
  scan_data = VALUES(scan_data);


-- SCAN RESULTS --
INSERT INTO scan_results (scan_session_id, skin_concern_id, severity_level, confidence_score, note)
VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', (SELECT id FROM skin_concerns WHERE concern_name='Dehydration'), 4, 91.50, 'Hydration below target range.'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', (SELECT id FROM skin_concerns WHERE concern_name='Barrier Damage'), 3, 86.20, 'Barrier support recommended.'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', (SELECT id FROM skin_concerns WHERE concern_name='Hyperpigmentation'), 2, 79.00, 'Mild uneven tone detected.')
ON DUPLICATE KEY UPDATE
  severity_level = VALUES(severity_level),
  confidence_score = VALUES(confidence_score),
  note = VALUES(note);


-- RECOMMENDATIONS --
INSERT INTO recommendations (scan_session_id, product_id, skin_concern_id, reason, priority_rank, is_accepted)
VALUES
  (
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    (SELECT id FROM products WHERE sku='SKN-SRM-001'),
    (SELECT id FROM skin_concerns WHERE concern_name='Dehydration'),
    'Low hydration detected; hyaluronic acid recommended.',
    1, TRUE
  ),
  (
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    (SELECT id FROM products WHERE sku='SKN-CRM-001'),
    (SELECT id FROM skin_concerns WHERE concern_name='Barrier Damage'),
    'Barrier stress detected; ceramide moisturizer recommended.',
    2, TRUE
  ),
  (
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    (SELECT id FROM products WHERE sku='SKN-TRT-001'),
    (SELECT id FROM skin_concerns WHERE concern_name='Hyperpigmentation'),
    'Tone unevenness detected; niacinamide treatment recommended.',
    3, FALSE
  )
ON DUPLICATE KEY UPDATE
  reason = VALUES(reason),
  priority_rank = VALUES(priority_rank),
  is_accepted = VALUES(is_accepted);


-- ORDER --
INSERT INTO orders (order_uuid, order_number, user_id, order_status, payment_status, total_amount, shipping_address, billing_address, payment_method, tracking_number, notes)
SELECT
  'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
  'ORD-20260217-000001',
  @lebo_id,
  'processing',
  'paid',
  47.49,
  JSON_OBJECT('street','12 Main Rd','city','Johannesburg','postal_code','2000','country','ZA'),
  JSON_OBJECT('street','12 Main Rd','city','Johannesburg','postal_code','2000','country','ZA'),
  'simulated',
  'TRK-FAKE-1001',
  'Seed order for testing checkout flow'
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE order_uuid = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1'
);

SET @seed_order_id = (
  SELECT id FROM orders WHERE order_uuid = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1' LIMIT 1
);


-- ORDER ITEMS --
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
SELECT @seed_order_id, p.id, p.name, 1, p.price
FROM products p
WHERE p.sku = 'SKN-SRM-001'
  AND NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.order_id = @seed_order_id AND oi.product_id = p.id
  );

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
SELECT @seed_order_id, p.id, p.name, 1, p.price
FROM products p
WHERE p.sku = 'SKN-CRM-001'
  AND NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.order_id = @seed_order_id AND oi.product_id = p.id
  );


-- PAYMENT --
INSERT INTO payments (payment_uuid, order_id, amount, payment_method, transaction_id, status, metadata)
SELECT
  'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
  @seed_order_id,
  47.49,
  'simulated',
  'SIM-1000001',
  'completed',
  JSON_OBJECT('card_last4','4242','gateway','demo')
WHERE NOT EXISTS (
  SELECT 1 FROM payments WHERE payment_uuid = 'ddddddd1-dddd-dddd-dddd-ddddddddddd1'
);

COMMIT;
```

---

**.env**
```
PORT=5000