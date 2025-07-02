const request = require('supertest');
const express = require('express');
const studentsRouter = require('../routes/students');

// Mock the database pool
jest.mock('../database/config', () => ({
  query: jest.fn()
}));

const pool = require('../database/config');

// Create a test app
const app = express();
app.use(express.json());
app.use('/students', studentsRouter);

describe('Students API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /students', () => {
    it('should create a new student', async () => {
      const newStudent = { name: 'John Student', email: 'john.student@example.com' };
      const createdStudent = { id: '1', ...newStudent, created_at: '2023-01-01' };
      
      pool.query.mockResolvedValue({ rows: [createdStudent] });

      const response = await request(app)
        .post('/students')
        .send(newStudent)
        .expect(201);

      expect(response.body).toEqual(createdStudent);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
        [newStudent.name, newStudent.email]
      );
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/students')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Name and email are required' });
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/students')
        .send({ name: 'Test User' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Name and email are required' });
    });

    it('should handle unique constraint violation (duplicate email)', async () => {
      const error = new Error('Duplicate email');
      error.code = '23505';
      pool.query.mockRejectedValue(error);

      const response = await request(app)
        .post('/students')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect(409);

      expect(response.body).toEqual({ error: 'Email already exists' });
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/students')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});