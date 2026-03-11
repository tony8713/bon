const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// In-memory user store (replace with database)
const users = new Map();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (users.has(username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(username, { username, password: hashedPassword });
  
  res.json({ success: true, message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.get(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
