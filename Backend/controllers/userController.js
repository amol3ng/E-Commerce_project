import pool from '../config/db.js';

// ========================
// CREATE USER
// ========================
export const createUser = async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'full_name, email and password are required' });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, phone, role, is_verified) VALUES (?, ?, ?, ?, 'customer', FALSE)",
      [full_name, email, password, phone]
    );

    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// LOGIN
// ========================
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

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: 'mock-token-for-testing',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// GET PROFILE
// ========================
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, created_at FROM users WHERE id = ? AND role = 'customer'",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// UPDATE PROFILE
// ========================
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE users SET full_name = ?, phone = ? WHERE id = ? AND role = 'customer'",
      [full_name, phone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// DELETE PROFILE
// ========================
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ? AND role = 'customer'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};