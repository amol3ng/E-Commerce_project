import pool from '../config/db.js';

// POST /api/orders  — place order from cart
export const createOrder = async (req, res) => {
  const { user_id, items, shipping_address, payment_method, total_amount } = req.body;

  if (!user_id || !items?.length || !shipping_address) {
    return res.status(400).json({ message: 'user_id, items, and shipping_address are required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Generate order number
    const order_number = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const order_uuid = crypto.randomUUID();

    // Create order
    const [orderResult] = await conn.query(`
      INSERT INTO orders
        (order_uuid, user_id, order_number, order_status, payment_status,
         total_amount, shipping_address, payment_method)
      VALUES (?, ?, ?, 'pending', 'pending', ?, ?, ?)
    `, [
      order_uuid, user_id, order_number,
      total_amount,
      JSON.stringify(shipping_address),
      payment_method || 'card'
    ]);

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await conn.query(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.product_name, item.quantity, item.unit_price]);
    }

    // Simulated payment record
    await conn.query(`
      INSERT INTO payments (payment_uuid, order_id, amount, payment_method, transaction_id, status, metadata)
      VALUES (?, ?, ?, ?, ?, 'completed', ?)
    `, [
      crypto.randomUUID(), orderId, total_amount, payment_method || 'simulated',
      'SIM-' + Date.now(),
      JSON.stringify({ gateway: 'simulated' })
    ]);

    // Update order payment status to paid (simulated)
    await conn.query(
      `UPDATE orders SET payment_status = 'paid', order_status = 'processing' WHERE id = ?`,
      [orderId]
    );

    // Clear the user's cart
    await conn.query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      WHERE c.user_id = ?
    `, [user_id]);

    await conn.commit();

    res.status(201).json({ message: 'Order placed', order_number, order_uuid });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

// GET /api/orders/user/:userId
export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.order_number, o.order_status, o.payment_status,
             o.total_amount, o.payment_method, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[order]] = await pool.query(
      'SELECT * FROM orders WHERE id = ? OR order_uuid = ?', [id, id]
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?', [order.id]
    );

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// GET /api/orders  (admin — all orders)
export const getAllOrders = async (req, res) => {
  const { status, payment_status, limit = 50, offset = 0 } = req.query;
  try {
    let query = `
      SELECT o.*, u.full_name, u.email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE 1=1
    `;
    const params = [];
    if (status)         { query += ' AND o.order_status = ?';   params.push(status); }
    if (payment_status) { query += ' AND o.payment_status = ?'; params.push(payment_status); }
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [orders] = await pool.query(query, params);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/orders/:id/status  (admin)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { order_status, payment_status, tracking_number } = req.body;

  const allowed_order   = ['pending','processing','shipped','delivered','cancelled','refunded'];
  const allowed_payment = ['pending','paid','failed','refunded'];

  const sets = []; const params = [];
  if (order_status   && allowed_order.includes(order_status))     { sets.push('order_status = ?');   params.push(order_status); }
  if (payment_status && allowed_payment.includes(payment_status)) { sets.push('payment_status = ?'); params.push(payment_status); }
  if (tracking_number) { sets.push('tracking_number = ?'); params.push(tracking_number); }

  if (!sets.length) return res.status(400).json({ message: 'No valid fields to update' });

  params.push(id);
  try {
    const [result] = await pool.query(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};