const request = require('supertest');
const app = require('../src/server');

describe('Availability API', () => {
  describe('GET /v1/availability', () => {
    it('should return 400 when no date parameters provided', async () => {
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

    it('should return availability data for valid date', async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await request(app)
        .get(`/v1/availability?date=${today}`)
        .expect(200);

      expect(response.body).toHaveProperty('availability');
      expect(response.body).toHaveProperty('query');
      expect(Array.isArray(response.body.availability)).toBe(true);
      expect(response.body.query).toHaveProperty('start_date');
      expect(response.body.query).toHaveProperty('end_date');
    });

    it('should return availability data for date range', async () => {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await request(app)
        .get(`/v1/availability?start_date=${startDate}&end_date=${endDate}`)
        .expect(200);

      expect(response.body).toHaveProperty('availability');
      expect(response.body).toHaveProperty('query');
      expect(Array.isArray(response.body.availability)).toBe(true);
    });
  });
});