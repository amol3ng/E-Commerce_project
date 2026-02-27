import pool from '../config/db.js';
import { sendOrderConfirmation } from '../config/emailService.js';

const isAdmin = (user) => user?.role === 'admin';
const canAccessUserResource = (authUser, targetUserId) =>
  isAdmin(authUser) || authUser?.id === Number(targetUserId);

export const createOrder = async (req, res) => {
  const { items, shipping_address, billing_address, payment_method } = req.body;
  const userId = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0 || !shipping_address || !payment_method) {
    return res.status(400).json({
      message: 'items, shipping_address and payment_method are required',
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[user]] = await connection.query(
      'SELECT id, full_name, email FROM users WHERE id = ?',
      [userId]
    );
    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    let totalAmount = 0;

    for (const item of items) {
      const [[product]] = await connection.query(
        'SELECT id, name, price, stock_qty FROM products WHERE id = ?',
        [item.product_id]
      );
      if (!product) {
        await connection.rollback();
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }
      if (product.stock_qty < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: `Insufficient stock for "${product.name}"` });
      }
      totalAmount += product.price * item.quantity;
    }

    const orderNumber = `ORD-${Date.now()}`;

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
        (user_id, order_number, total_amount, shipping_address, billing_address, payment_method)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        orderNumber,
        totalAmount,
        JSON.stringify(shipping_address),
        billing_address ? JSON.stringify(billing_address) : null,
        payment_method,
      ]
    );

    const orderId = orderResult.insertId;
    const orderItemsForEmail = [];

    for (const item of items) {
      const [[product]] = await connection.query(
        'SELECT id, name, price FROM products WHERE id = ?',
        [item.product_id]
      );

      await connection.query(
        `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?)
        `,
        [orderId, product.id, product.name, item.quantity, product.price]
      );

      await connection.query(
        'UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?',
        [item.quantity, product.id]
      );

      orderItemsForEmail.push({
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
      });
    }

    const [[cart]] = await connection.query(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );
    if (cart) {
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }

    await connection.commit();

    sendOrderConfirmation({
      to: user.email,
      full_name: user.full_name,
      order_number: orderNumber,
      items: orderItemsForEmail,
      total_amount: totalAmount,
      shipping_address,
      payment_method,
    }).catch((err) => console.error('Email send failed:', err.message));

    return res.status(201).json({
      message: 'Order created successfully',
      order_id: orderId,
      order_number: orderNumber,
      total_amount: totalAmount,
    });
  } catch (err) {
    await connection.rollback();
    return res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  if (!canAccessUserResource(req.user, userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [orders] = await pool.query(
      `
      SELECT
        o.id, o.order_number, o.order_status, o.payment_status,
        o.total_amount, o.payment_method, o.tracking_number, o.created_at,
        o.shipping_address
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        'SELECT product_name, quantity, unit_price, subtotal FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
      if (typeof order.shipping_address === 'string') {
        try {
          order.shipping_address = JSON.parse(order.shipping_address);
        } catch {
          // keep raw value
        }
      }
    }

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const trackOrder = async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const [[order]] = await pool.query(
      `
      SELECT
        o.id, o.user_id, o.order_number, o.order_status, o.payment_status,
        o.total_amount, o.payment_method, o.tracking_number,
        o.created_at, o.updated_at, o.shipping_address
      FROM orders o
      WHERE o.order_number = ?
      `,
      [orderNumber]
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessUserResource(req.user, order.user_id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [items] = await pool.query(
      'SELECT product_name, quantity, unit_price, subtotal FROM order_items WHERE order_id = ?',
      [order.id]
    );

    if (typeof order.shipping_address === 'string') {
      try {
        order.shipping_address = JSON.parse(order.shipping_address);
      } catch {
        // keep raw value
      }
    }

    return res.json({ ...order, items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[order]] = await pool.query(
      'SELECT * FROM orders WHERE id = ? OR order_uuid = ?',
      [id, id]
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessUserResource(req.user, order.user_id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    return res.json({ ...order, items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { status, payment_status, limit = 50, offset = 0 } = req.query;
  try {
    let query = `
      SELECT o.*, u.full_name, u.email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      query += ' AND o.order_status = ?';
      params.push(status);
    }
    if (payment_status) {
      query += ' AND o.payment_status = ?';
      params.push(payment_status);
    }
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [orders] = await pool.query(query, params);
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { id } = req.params;
  const { order_status, payment_status, tracking_number } = req.body;

  const allowedOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const allowedPayment = ['pending', 'paid', 'failed', 'refunded'];

  const sets = [];
  const params = [];
  if (order_status && allowedOrder.includes(order_status)) {
    sets.push('order_status = ?');
    params.push(order_status);
  }
  if (payment_status && allowedPayment.includes(payment_status)) {
    sets.push('payment_status = ?');
    params.push(payment_status);
  }
  if (tracking_number) {
    sets.push('tracking_number = ?');
    params.push(tracking_number);
  }

  if (!sets.length) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  params.push(id);
  try {
    const [result] = await pool.query(
      `UPDATE orders SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json({ message: 'Order updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
