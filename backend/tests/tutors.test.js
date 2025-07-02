const request = require('supertest');
const app = require('../src/server');

describe('Tutors API', () => {
  describe('GET /v1/tutors', () => {
    it('should return all tutors', async () => {
      const response = await request(app)
        .get('/v1/tutors')
        .expect(200);

      expect(response.body).toHaveProperty('tutors');
      expect(Array.isArray(response.body.tutors)).toBe(true);
    });
  });

  describe('POST /v1/tutors', () => {
    it('should create a new tutor', async () => {
      const tutorData = {
        name: 'Test Tutor',
        email: 'test.tutor@example.com'
      };

      const response = await request(app)
        .post('/v1/tutors')
        .send(tutorData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(tutorData.name);
      expect(response.body.email).toBe(tutorData.email);
    });

    it('should reject tutor creation with missing fields', async () => {
      const response = await request(app)
        .post('/v1/tutors')
        .send({ name: 'Incomplete Tutor' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Name and email are required');
    });
  });
}); 