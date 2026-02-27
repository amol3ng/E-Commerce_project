CREATE DATABASE IF NOT EXISTS B2C_future_B2B_PartnersStaff
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE B2C_future_B2B_PartnersStaff;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- USERS --
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'partner', 'admin') NOT NULL DEFAULT 'customer',
  phone VARCHAR(20) NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_users_name_len CHECK (CHAR_LENGTH(TRIM(full_name)) >= 2),
  CONSTRAINT chk_users_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users(role);


-- BRANDS --
CREATE TABLE IF NOT EXISTS brands (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  contact_email VARCHAR(160) NULL,
  website_url VARCHAR(500) NULL,
  logo_url VARCHAR(500) NULL,
  partnership_status ENUM('active', 'pending', 'suspended') NOT NULL DEFAULT 'active',
  contract_start DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_brands_name UNIQUE (name),
  CONSTRAINT chk_brands_email_format CHECK (
    contact_email IS NULL OR contact_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  )
) ENGINE=InnoDB;

CREATE INDEX idx_brands_status ON brands(partnership_status);


-- PRODUCTS --
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  brand_id BIGINT UNSIGNED NULL,
  sku VARCHAR(50) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  product_type ENUM('machine', 'skincare', 'accessory') NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  price DECIMAL(10,2) NOT NULL,
  stock_qty INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  image_url VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  review_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_products_sku UNIQUE (sku),
  CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  CONSTRAINT chk_products_price CHECK (price >= 0),
  CONSTRAINT chk_products_stock CHECK (stock_qty >= 0),
  CONSTRAINT chk_products_threshold CHECK (low_stock_threshold >= 0),
  CONSTRAINT chk_products_rating CHECK (average_rating >= 0 AND average_rating <= 5),
  CONSTRAINT chk_products_review_count CHECK (review_count >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_active ON products(is_active);


-- SKIN CONCERNS --
CREATE TABLE IF NOT EXISTS skin_concerns (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  concern_name VARCHAR(80) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_skin_concerns_name UNIQUE (concern_name)
) ENGINE=InnoDB;


-- SCAN SESSIONS --
CREATE TABLE IF NOT EXISTS scan_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id INT UNSIGNED NULL,
  scanner_serial VARCHAR(80) NOT NULL,
  overall_score TINYINT UNSIGNED NULL,
  scan_data JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_scan_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_scan_overall_score CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
) ENGINE=InnoDB;

CREATE INDEX idx_scan_sessions_user ON scan_sessions(user_id);
CREATE INDEX idx_scan_sessions_created ON scan_sessions(created_at);


-- SCAN RESULTS --
CREATE TABLE IF NOT EXISTS scan_results (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scan_session_id CHAR(36) NOT NULL,
  skin_concern_id BIGINT UNSIGNED NOT NULL,
  severity_level TINYINT UNSIGNED NOT NULL,
  confidence_score DECIMAL(5,2) NULL,
  note TEXT NULL,

  CONSTRAINT fk_scan_results_session FOREIGN KEY (scan_session_id) REFERENCES scan_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_scan_results_concern FOREIGN KEY (skin_concern_id) REFERENCES skin_concerns(id),
  CONSTRAINT uq_scan_results_session_concern UNIQUE (scan_session_id, skin_concern_id),
  CONSTRAINT chk_scan_results_severity CHECK (severity_level >= 1 AND severity_level <= 5),
  CONSTRAINT chk_scan_results_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100))
) ENGINE=InnoDB;

CREATE INDEX idx_scan_results_session ON scan_results(scan_session_id);


-- RECOMMENDATIONS --
CREATE TABLE IF NOT EXISTS recommendations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scan_session_id CHAR(36) NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  skin_concern_id BIGINT UNSIGNED NULL,
  reason TEXT NOT NULL,
  priority_rank INT NOT NULL,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_reco_session FOREIGN KEY (scan_session_id) REFERENCES scan_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_reco_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_reco_concern FOREIGN KEY (skin_concern_id) REFERENCES skin_concerns(id),
  CONSTRAINT uq_reco_session_product UNIQUE (scan_session_id, product_id),
  CONSTRAINT chk_reco_priority CHECK (priority_rank >= 1)
) ENGINE=InnoDB;

CREATE INDEX idx_reco_session ON recommendations(scan_session_id);


-- CARTS --
CREATE TABLE IF NOT EXISTS carts (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_carts_user UNIQUE (user_id),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- CART ITEMS --
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  cart_id CHAR(36) NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
  CONSTRAINT chk_cart_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);


-- ORDERS --
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_uuid CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id INT UNSIGNED NULL,
  order_number VARCHAR(30) NOT NULL,
  order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSON NOT NULL,
  billing_address JSON NULL,
  payment_method ENUM('card', 'eft', 'cod', 'simulated', 'payfast', 'paypal') NOT NULL DEFAULT 'card',
  tracking_number VARCHAR(100) NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_orders_uuid UNIQUE (order_uuid),
  CONSTRAINT uq_orders_number UNIQUE (order_number),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_orders_total CHECK (total_amount >= 0),
  CONSTRAINT chk_orders_shipping_json CHECK (JSON_VALID(shipping_address)),
  CONSTRAINT chk_orders_billing_json CHECK (billing_address IS NULL OR JSON_VALID(billing_address))
) ENGINE=InnoDB;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);


-- ORDER ITEMS --
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
  CONSTRAINT chk_order_items_price CHECK (unit_price >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_order_items_order ON order_items(order_id);


-- PAYMENTS --
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  payment_uuid CHAR(36) NOT NULL DEFAULT (UUID()),
  order_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('simulated', 'payfast', 'paypal', 'eft', 'cod', 'card') NOT NULL,
  transaction_id VARCHAR(100) NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_payments_uuid UNIQUE (payment_uuid),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT chk_payments_amount CHECK (amount >= 0),
  CONSTRAINT chk_payments_metadata_json CHECK (metadata IS NULL OR JSON_VALID(metadata))
) ENGINE=InnoDB;

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

SHOW INDEX FROM users;
DROP INDEX idx_users_role ON users;
ALTER TABLE users ADD INDEX idx_users_role (role);

ALTER TABLE users AUTO_INCREMENT = 4;

SELECT id, full_name, email FROM users;

SELECT * FROM users;

DESCRIBE orders;
DESCRIBE order_items;

DESCRIBE products;