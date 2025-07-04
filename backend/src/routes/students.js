const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET /students - List all students
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM students ORDER BY created_at DESC'
    );
    
    res.json({ students: rows });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /students - Create a student
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  try {
    const { rows } = await pool.query(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [name, email]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 