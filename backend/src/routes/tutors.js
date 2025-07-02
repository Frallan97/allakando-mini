const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET /tutors - List all tutors
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, subjects, about, qualifications, hourly_rate, rating, experience_years, created_at 
       FROM tutors ORDER BY created_at DESC`
    );
    
    res.json({ tutors: rows });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tutors - Create a tutor
router.post('/', async (req, res) => {
  const { 
    name, 
    email, 
    subjects = [], 
    about = '', 
    qualifications = [], 
    hourly_rate = 45.00, 
    rating = 4.8, 
    experience_years = 3 
  } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO tutors (name, email, subjects, about, qualifications, hourly_rate, rating, experience_years) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, email, subjects, about, qualifications, hourly_rate, rating, experience_years, created_at`,
      [name, email, subjects, about, qualifications, hourly_rate, rating, experience_years]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating tutor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tutors/:tutor_id/availability - Add availability for a tutor
router.post('/:tutor_id/availability', async (req, res) => {
  const { tutor_id } = req.params;
  const { start_time, end_time } = req.body;
  
  if (!start_time || !end_time) {
    return res.status(400).json({ error: 'Start time and end time are required' });
  }
  
  try {
    // Check if tutor exists
    const tutorCheck = await pool.query('SELECT id FROM tutors WHERE id = $1', [tutor_id]);
    if (tutorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    
    const { rows } = await pool.query(
      `INSERT INTO availability_slots (tutor_id, start_time, end_time) 
       VALUES ($1, $2, $3) 
       RETURNING id, tutor_id, start_time, end_time, is_booked, created_at`,
      [tutor_id, start_time, end_time]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    if (error.code === '23P01') { // Exclusion constraint violation
      return res.status(409).json({ error: 'Time slot overlaps with existing availability' });
    }
    console.error('Error creating availability slot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /tutors/:tutor_id/availability - List a tutor's available slots
router.get('/:tutor_id/availability', async (req, res) => {
  const { tutor_id } = req.params;
  
  try {
    // Check if tutor exists
    const tutorCheck = await pool.query('SELECT id FROM tutors WHERE id = $1', [tutor_id]);
    if (tutorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    
    const { rows } = await pool.query(
      `SELECT id, start_time, end_time, is_booked
       FROM availability_slots 
       WHERE tutor_id = $1 AND start_time > now()
       ORDER BY start_time ASC`,
      [tutor_id]
    );
    
    res.json({ slots: rows });
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 