const request = require('supertest');
const app = require('../src/server');

// Simple test to verify route registration
describe('Route Registration Test', () => {
  describe('GET /v1/availability', () => {
    it('should return 400 when no date parameters provided (proving endpoint exists)', async () => {
      const response = await request(app)
        .get('/v1/availability')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    it('should return 400 when invalid date format provided', async () => {
      const response = await request(app)
        .get('/v1/availability?date=invalid-date')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid date format');
    });
  });
});