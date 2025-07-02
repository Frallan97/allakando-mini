const request = require('supertest');
const express = require('express');
const tutorsRouter = require('../routes/tutors');

// Mock the database pool
jest.mock('../database/config', () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

const pool = require('../database/config');

// Create a test app
const app = express();
app.use(express.json());
app.use('/tutors', tutorsRouter);

describe('Tutors API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tutors', () => {
    it('should return list of tutors', async () => {
      const mockTutors = [
        { id: '1', name: 'John Doe', email: 'john@example.com', created_at: '2023-01-01' }
      ];
      
      pool.query.mockResolvedValue({ rows: mockTutors });

      const response = await request(app)
        .get('/tutors')
        .expect(200);

      expect(response.body).toEqual({ tutors: mockTutors });
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, created_at FROM tutors ORDER BY created_at DESC'
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/tutors')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /tutors', () => {
    it('should create a new tutor', async () => {
      const newTutor = { name: 'Jane Doe', email: 'jane@example.com' };
      const createdTutor = { id: '1', ...newTutor, created_at: '2023-01-01' };
      
      pool.query.mockResolvedValue({ rows: [createdTutor] });

      const response = await request(app)
        .post('/tutors')
        .send(newTutor)
        .expect(201);

      expect(response.body).toEqual(createdTutor);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO tutors (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
        [newTutor.name, newTutor.email]
      );
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/tutors')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Name and email are required' });
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/tutors')
        .send({ name: 'Test User' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Name and email are required' });
    });

    it('should handle unique constraint violation (duplicate email)', async () => {
      const error = new Error('Duplicate email');
      error.code = '23505';
      pool.query.mockRejectedValue(error);

      const response = await request(app)
        .post('/tutors')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect(409);

      expect(response.body).toEqual({ error: 'Email already exists' });
    });
  });

  describe('POST /tutors/:tutor_id/availability', () => {
    it('should add availability slot for tutor', async () => {
      const tutorId = '1';
      const availabilityData = {
        start_time: '2023-12-01T10:00:00Z',
        end_time: '2023-12-01T11:00:00Z'
      };
      
      // Mock tutor check
      pool.query.mockResolvedValueOnce({ rows: [{ id: tutorId }] });
      
      // Mock slot creation
      const createdSlot = {
        id: '1',
        tutor_id: tutorId,
        ...availabilityData,
        is_booked: false,
        created_at: '2023-01-01'
      };
      pool.query.mockResolvedValueOnce({ rows: [createdSlot] });

      const response = await request(app)
        .post(`/tutors/${tutorId}/availability`)
        .send(availabilityData)
        .expect(201);

      expect(response.body).toEqual(createdSlot);
    });

    it('should return 404 if tutor not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/tutors/999/availability')
        .send({
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z'
        })
        .expect(404);

      expect(response.body).toEqual({ error: 'Tutor not found' });
    });

    it('should return 400 if start_time is missing', async () => {
      const response = await request(app)
        .post('/tutors/1/availability')
        .send({ end_time: '2023-12-01T11:00:00Z' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Start time and end time are required' });
    });

    it('should handle constraint violations', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: '1' }] }); // tutor exists
      
      const error = new Error('Constraint violation');
      error.code = '23514'; // Check constraint violation
      pool.query.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/tutors/1/availability')
        .send({
          start_time: '2023-12-01T11:00:00Z',
          end_time: '2023-12-01T10:00:00Z'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'End time must be after start time' });
    });
  });
});