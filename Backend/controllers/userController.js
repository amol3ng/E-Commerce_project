import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendRegistrationConfirmation } from '../config/emailService.js';

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const createUser = async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'full_name, email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, phone, role, is_verified) VALUES (?, ?, ?, ?, 'customer', FALSE)",
      [full_name, email, hashedPassword, phone]
    );

    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = rows[0];
    const token = signToken(user);

    sendRegistrationConfirmation({
      to: user.email,
      full_name: user.full_name,
    }).catch((err) => {
      console.error('Registration email failed:', err.message);
    });

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND role = 'customer'",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ? AND role = 'customer'",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const requestedUserId = Number(req.params.id);

  if (req.user.role !== 'admin' && req.user.id !== requestedUserId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, created_at FROM users WHERE id = ? AND role = 'customer'",
      [requestedUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const requestedUserId = Number(req.params.id);
  const { full_name, phone } = req.body;

  if (req.user.role !== 'admin' && req.user.id !== requestedUserId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET full_name = ?, phone = ? WHERE id = ? AND role = 'customer'",
      [full_name, phone, requestedUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const requestedUserId = Number(req.params.id);

  if (req.user.role !== 'admin' && req.user.id !== requestedUserId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ? AND role = 'customer'",
      [requestedUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
