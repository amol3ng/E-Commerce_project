// controllers/cartController.js
import { randomUUID } from 'crypto';
import pool from '../config/db.js';

// ─────────────────────────────────────────────
// GET /api/carts/:userId
// ─────────────────────────────────────────────
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT
        ci.id,
        ci.product_id,
        p.sku,
        p.name,
        p.price,
        p.image_url,
        ci.quantity,
        (p.price * ci.quantity) AS subtotal
      FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      JOIN products p ON p.id = ci.product_id
      WHERE c.user_id = ?
    `, [userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/carts/:userId/items
// ─────────────────────────────────────────────
export const addCartItem = async (req, res) => {
  const { userId } = req.params;
  const { product_id, quantity } = req.body;

  if (!product_id || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'product_id and a valid quantity (>= 1) are required' });
  }

  try {
    // Check if user already has a cart
    let [[cart]] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);

    if (!cart) {
      const newCartId = randomUUID();
      await pool.query('INSERT INTO carts (id, user_id) VALUES (?, ?)', [newCartId, userId]);
      cart = { id: newCartId };
    }

    await pool.query(`
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [cart.id, product_id, quantity]);

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/carts/:userId/item/:itemId
// ─────────────────────────────────────────────
export const updateCartItem = async (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'A valid quantity (>= 1) is required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      SET ci.quantity = ?
      WHERE ci.id = ? AND c.user_id = ?
    `, [quantity, itemId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found or does not belong to this user' });
    }

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/carts/:userId/item/:itemId
// ─────────────────────────────────────────────
export const deleteCartItem = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const [result] = await pool.query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      WHERE ci.id = ? AND c.user_id = ?
    `, [itemId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found or does not belong to this user' });
    }

    res.json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};