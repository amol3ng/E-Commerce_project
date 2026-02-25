import pool from '../config/db.js';

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

// GET /api/products
export const getProducts = async (req, res) => {
  const { type, category, brand_id, active } = req.query;
  try {
    let query = `
      SELECT
        p.id, p.sku, p.name, p.description,
        p.product_type, p.category, p.price,
        p.stock_qty, p.low_stock_threshold,
        p.image_url, p.is_active,
        p.average_rating, p.review_count,
        b.name AS brand_name,
        p.created_at
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE 1=1
    `;
    const params = [];

    if (type)     { query += ' AND p.product_type = ?'; params.push(type); }
    if (category) { query += ' AND p.category = ?';    params.push(category); }
    if (brand_id) { query += ' AND p.brand_id = ?';    params.push(brand_id); }
    if (active !== undefined) { query += ' AND p.is_active = ?'; params.push(active === 'true' ? 1 : 0); }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[product]] = await pool.query(`
      SELECT
        p.*, b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.id = ?
    `, [id]);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/sku/:sku
export const getProductBySku = async (req, res) => {
  const { sku } = req.params;
  try {
    const [[product]] = await pool.query(`
      SELECT p.*, b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.sku = ?
    `, [sku]);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────

// POST /api/products  (admin)
export const createProduct = async (req, res) => {
  const {
    brand_id, sku, name, description,
    product_type, category, price,
    stock_qty, low_stock_threshold, image_url, is_active
  } = req.body;

  if (!sku || !name || !product_type || price === undefined) {
    return res.status(400).json({ message: 'sku, name, product_type, and price are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO products
        (brand_id, sku, name, description, product_type, category, price,
         stock_qty, low_stock_threshold, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      brand_id ?? null,
      sku, name,
      description ?? null,
      product_type,
      category ?? 'general',
      price,
      stock_qty ?? 0,
      low_stock_threshold ?? 5,
      image_url ?? null,
      is_active !== undefined ? is_active : true
    ]);

    const [[created]] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A product with this SKU already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/products/:id  (admin) — partial update
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const allowed = [
    'brand_id', 'sku', 'name', 'description',
    'product_type', 'category', 'price',
    'stock_qty', 'low_stock_threshold', 'image_url', 'is_active'
  ];

  const fields = Object.keys(req.body).filter(k => allowed.includes(k));
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    const setClauses = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(id);

    const [result] = await pool.query(
      `UPDATE products SET ${setClauses} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [[updated]] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A product with this SKU already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/products/:id/stock  (admin) — adjust stock only
export const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { adjustment } = req.body; // positive = restock, negative = deduct

  if (typeof adjustment !== 'number') {
    return res.status(400).json({ message: 'adjustment must be a number' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE products SET stock_qty = GREATEST(0, stock_qty + ?) WHERE id = ?',
      [adjustment, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [[updated]] = await pool.query('SELECT id, sku, name, stock_qty FROM products WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id  (admin) — soft delete (sets is_active = false)
export const deactivateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE products SET is_active = FALSE WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id/hard  (admin) — hard delete (use with caution)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/admin/low-stock  (admin)
export const getLowStockProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.sku, p.name, p.stock_qty, p.low_stock_threshold, b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.stock_qty <= p.low_stock_threshold AND p.is_active = TRUE
      ORDER BY p.stock_qty ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};