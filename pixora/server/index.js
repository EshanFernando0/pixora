const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// --- THE DIGITAL BOUNCER (MIDDLEWARE) ---
const authorize = (req, res, next) => {
  // Grab the token from the header of the request
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(403).json({ error: "Access Denied: No token provided" });
  }

  try {
    // Verify the token using our secret key
    const verified = jwt.verify(token, JWT_SECRET);
    // Attach the verified user ID to the request so the routes can use it safely
    req.user_id = verified.id; 
    next(); // Let them pass
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// --- AUTHENTICATION ROUTES (No token needed to login/register) ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) return res.status(400).json({ error: "Email already exists" });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, passwordHash]
    );
    
    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });
    
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/api/auth/anonymous', async (req, res) => {
  try {
    const timestamp = Date.now();
    const username = `Guest_${timestamp}`;
    const email = `anon_${timestamp}@pixora.guest`; 
    const passwordHash = await bcrypt.hash(`${timestamp}_${Math.random()}`, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash, is_anonymous) VALUES ($1, $2, $3, TRUE) RETURNING id, username, email",
      [username, email, passwordHash]
    );
    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// --- SECURE WATCHLIST ROUTES (Protected by 'authorize') ---
// Notice: We don't ask for the user_id anymore. We grab it securely from req.user_id!

app.get('/api/watchlist', authorize, async (req, res) => {
  try {
    const watchlist = await pool.query("SELECT * FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC", [req.user_id]);
    res.json(watchlist.rows);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/api/watchlist', authorize, async (req, res) => {
  try {
    const { tmdb_id, media_type } = req.body;
    const newEntry = await pool.query(
      "INSERT INTO watchlist (user_id, tmdb_id, media_type) VALUES ($1, $2, $3) RETURNING *",
      [req.user_id, tmdb_id, media_type]
    );
    res.json(newEntry.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: "Item already in watchlist" });
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete('/api/watchlist/:tmdb_id', authorize, async (req, res) => {
  try {
    const { tmdb_id } = req.params;
    await pool.query("DELETE FROM watchlist WHERE user_id = $1 AND tmdb_id = $2", [req.user_id, tmdb_id]);
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure Pixora backend API running on port ${PORT}`);
});