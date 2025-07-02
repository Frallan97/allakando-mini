const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// POST /bookings - Book a slot
router.post('/', async (req, res) => {
  const { student_id, slot_id } = req.body;
  
  if (!student_id || !slot_id) {
    return res.status(400).json({ error: 'Student ID and slot ID are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if student exists
    const studentCheck = await client.query('SELECT id FROM students WHERE id = $1', [student_id]);
    if (studentCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if slot exists and is available
    const slotCheck = await client.query(
      'SELECT id, tutor_id, start_time, end_time, is_booked FROM availability_slots WHERE id = $1',
      [slot_id]
    );
    
    if (slotCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    const slot = slotCheck.rows[0];
    if (slot.is_booked) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Slot is already booked' });
    }
    
    // Create booking
    const bookingResult = await client.query(
      'INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2) RETURNING id, slot_id, student_id, booked_at',
      [slot_id, student_id]
    );
    
    // Mark slot as booked
    await client.query(
      'UPDATE availability_slots SET is_booked = true WHERE id = $1',
      [slot_id]
    );
    
    await client.query('COMMIT');
    
    // Return booking with additional info
    const booking = {
      ...bookingResult.rows[0],
      tutor_id: slot.tutor_id,
      start_time: slot.start_time,
      end_time: slot.end_time
    };
    
    res.status(201).json({ booking });
    
  } catch (error) {
    await client.query('ROLLBACK');
    
    if (error.code === '23505') { // Unique violation (double booking)
      return res.status(409).json({ error: 'Slot is already booked' });
    }
    
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// GET /bookings?student_id={student_id} - List a student's bookings
router.get('/', async (req, res) => {
  const { student_id } = req.query;
  
  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }
  
  try {
    // Check if student exists
    const studentCheck = await pool.query('SELECT id FROM students WHERE id = $1', [student_id]);
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const { rows } = await pool.query(
      `SELECT 
        b.id,
        b.booked_at,
        t.id as tutor_id,
        t.name as tutor_name,
        s.start_time,
        s.end_time
       FROM bookings b
       JOIN availability_slots s ON b.slot_id = s.id
       JOIN tutors t ON s.tutor_id = t.id
       WHERE b.student_id = $1
       ORDER BY s.start_time DESC`,
      [student_id]
    );
    
    const bookings = rows.map(row => ({
      id: row.id,
      tutor: {
        id: row.tutor_id,
        name: row.tutor_name
      },
      start_time: row.start_time,
      end_time: row.end_time,
      booked_at: row.booked_at
    }));
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bookings/recent - Get recent bookings for admin dashboard
router.get('/recent', async (req, res) => {
  const { limit = 10 } = req.query;
  
  try {
    const { rows } = await pool.query(
      `SELECT 
        b.id,
        b.booked_at,
        t.id as tutor_id,
        t.name as tutor_name,
        st.id as student_id,
        st.name as student_name,
        s.start_time,
        s.end_time
       FROM bookings b
       JOIN availability_slots s ON b.slot_id = s.id
       JOIN tutors t ON s.tutor_id = t.id
       JOIN students st ON b.student_id = st.id
       ORDER BY b.booked_at DESC
       LIMIT $1`,
      [parseInt(limit)]
    );
    
    const bookings = rows.map(row => ({
      id: row.id,
      student: {
        id: row.student_id,
        name: row.student_name
      },
      tutor: {
        id: row.tutor_id,
        name: row.tutor_name
      },
      start_time: row.start_time,
      end_time: row.end_time,
      booked_at: row.booked_at
    }));
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 