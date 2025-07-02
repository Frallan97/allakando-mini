const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET /availability - Get availability for all tutors within a date range
router.get('/', async (req, res) => {
  const { start_date, end_date, date } = req.query;
  
  let startDate, endDate;
  
  if (date) {
    // Single date query
    startDate = new Date(date);
    endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // End of day
  } else if (start_date && end_date) {
    // Date range query
    startDate = new Date(start_date);
    endDate = new Date(end_date);
    endDate.setDate(endDate.getDate() + 1); // Include end date
  } else {
    return res.status(400).json({ 
      error: 'Either "date" or both "start_date" and "end_date" parameters are required' 
    });
  }
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }
  
  try {
    const { rows } = await pool.query(
      `SELECT 
        t.id as tutor_id,
        t.name as tutor_name,
        DATE(s.start_time) as date,
        COUNT(s.id) as total_slots,
        COUNT(CASE WHEN s.is_booked = false THEN 1 END) as available_slots,
        ARRAY_AGG(
          CASE WHEN s.is_booked = false THEN 
            json_build_object(
              'id', s.id,
              'start_time', s.start_time,
              'end_time', s.end_time
            )
          END
        ) FILTER (WHERE s.is_booked = false) as available_slot_details
      FROM tutors t
      LEFT JOIN availability_slots s ON t.id = s.tutor_id 
        AND s.start_time >= $1 
        AND s.start_time < $2
        AND s.start_time > now()
      GROUP BY t.id, t.name, DATE(s.start_time)
      ORDER BY t.name, DATE(s.start_time)`,
      [startDate.toISOString(), endDate.toISOString()]
    );
    
    // Group results by tutor and date
    const availability = {};
    
    rows.forEach(row => {
      const tutorId = row.tutor_id;
      const date = row.date;
      
      if (!availability[tutorId]) {
        availability[tutorId] = {
          tutor_id: tutorId,
          tutor_name: row.tutor_name,
          dates: {}
        };
      }
      
      if (date) {
        availability[tutorId].dates[date] = {
          date: date,
          total_slots: parseInt(row.total_slots) || 0,
          available_slots: parseInt(row.available_slots) || 0,
          has_availability: (parseInt(row.available_slots) || 0) > 0,
          slots: row.available_slot_details || []
        };
      }
    });
    
    // Add tutors with no availability in the date range
    const allTutors = await pool.query('SELECT id, name FROM tutors ORDER BY name');
    allTutors.rows.forEach(tutor => {
      if (!availability[tutor.id]) {
        availability[tutor.id] = {
          tutor_id: tutor.id,
          tutor_name: tutor.name,
          dates: {}
        };
      }
    });
    
    res.json({ 
      availability: Object.values(availability),
      query: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;