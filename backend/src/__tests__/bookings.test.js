const request = require('supertest');
const express = require('express');
const bookingsRouter = require('../routes/bookings');

// Mock the database pool
jest.mock('../database/config', () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

const pool = require('../database/config');

// Create a test app
const app = express();
app.use(express.json());
app.use('/bookings', bookingsRouter);

describe('Bookings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /bookings', () => {
    it('should create a new booking', async () => {
      const bookingData = { student_id: '1', slot_id: '1' };
      
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };
      pool.connect.mockResolvedValue(mockClient);

      // Mock all the sequential queries
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: '1' }] }) // student check
        .mockResolvedValueOnce({ rows: [{ // slot check
          id: '1',
          tutor_id: '1',
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z',
          is_booked: false
        }] })
        .mockResolvedValueOnce({ rows: [{ // booking creation
          id: '1',
          slot_id: '1',
          student_id: '1',
          booked_at: '2023-01-01'
        }] })
        .mockResolvedValueOnce({}) // slot update
        .mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .post('/bookings')
        .send(bookingData)
        .expect(201);

      expect(response.body.booking).toEqual({
        id: '1',
        slot_id: '1',
        student_id: '1',
        booked_at: '2023-01-01',
        tutor_id: '1',
        start_time: '2023-12-01T10:00:00Z',
        end_time: '2023-12-01T11:00:00Z'
      });

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return 400 if student_id is missing', async () => {
      const response = await request(app)
        .post('/bookings')
        .send({ slot_id: '1' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Student ID and slot ID are required' });
    });

    it('should return 400 if slot_id is missing', async () => {
      const response = await request(app)
        .post('/bookings')
        .send({ student_id: '1' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Student ID and slot ID are required' });
    });

    it('should return 404 if student not found', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };
      pool.connect.mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // student not found
        .mockResolvedValueOnce({}); // ROLLBACK

      const response = await request(app)
        .post('/bookings')
        .send({ student_id: '999', slot_id: '1' })
        .expect(404);

      expect(response.body).toEqual({ error: 'Student not found' });
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should return 404 if slot not found', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };
      pool.connect.mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: '1' }] }) // student exists
        .mockResolvedValueOnce({ rows: [] }) // slot not found
        .mockResolvedValueOnce({}); // ROLLBACK

      const response = await request(app)
        .post('/bookings')
        .send({ student_id: '1', slot_id: '999' })
        .expect(404);

      expect(response.body).toEqual({ error: 'Slot not found' });
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should return 409 if slot is already booked', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };
      pool.connect.mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: '1' }] }) // student exists
        .mockResolvedValueOnce({ rows: [{ // slot check - already booked
          id: '1',
          tutor_id: '1',
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z',
          is_booked: true
        }] })
        .mockResolvedValueOnce({}); // ROLLBACK

      const response = await request(app)
        .post('/bookings')
        .send({ student_id: '1', slot_id: '1' })
        .expect(409);

      expect(response.body).toEqual({ error: 'Slot is already booked' });
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('GET /bookings', () => {
    it('should return student bookings', async () => {
      const studentId = '1';
      const mockRows = [
        {
          id: '1',
          booked_at: '2023-01-01',
          tutor_id: '1', 
          tutor_name: 'John Tutor',
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z'
        }
      ];

      // Mock student check
      pool.query.mockResolvedValueOnce({ rows: [{ id: studentId }] });
      
      // Mock bookings query
      pool.query.mockResolvedValueOnce({ rows: mockRows });

      const response = await request(app)
        .get('/bookings')
        .query({ student_id: studentId })
        .expect(200);

      expect(response.body).toEqual({ 
        bookings: [{
          id: '1',
          tutor: {
            id: '1',
            name: 'John Tutor'
          },
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z',
          booked_at: '2023-01-01'
        }]
      });
    });

    it('should return 400 if student_id is missing', async () => {
      const response = await request(app)
        .get('/bookings')
        .expect(400);

      expect(response.body).toEqual({ error: 'Student ID is required' });
    });

    it('should return 404 if student not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/bookings')
        .query({ student_id: '999' })
        .expect(404);

      expect(response.body).toEqual({ error: 'Student not found' });
    });
  });
});