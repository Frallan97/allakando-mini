import { api } from '../api';
import { APIError, NetworkError } from '../errors';

// Mock fetch globally
(global as any).fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('getTutors', () => {
    it('should fetch tutors successfully', async () => {
      const mockTutors = [
        {
          id: '1',
          name: 'Test Tutor',
          email: 'test@example.com',
          subjects: ['Math'],
          about: 'Test about',
          qualifications: ['Degree'],
          hourly_rate: 50,
          rating: 4.8,
          experience_years: 5,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tutors: mockTutors })
      } as Response);

      const result = await api.getTutors();
      expect(result.tutors).toEqual(mockTutors);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/tutors');
    });

    it('should throw APIError when server returns error', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      } as Response);

      await expect(api.getTutors()).rejects.toThrow(APIError);
      await expect(api.getTutors()).rejects.toMatchObject({
        status: 500,
        message: 'Internal server error'
      });
    });

    it('should throw NetworkError when fetch fails', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(api.getTutors()).rejects.toThrow(NetworkError);
    });
  });

  describe('createTutor', () => {
    it('should create tutor successfully', async () => {
      const mockTutor = {
        id: '1',
        name: 'New Tutor',
        email: 'new@example.com',
        subjects: ['Math'],
        about: 'New about',
        qualifications: ['Degree'],
        hourly_rate: 50,
        rating: 4.8,
        experience_years: 5,
        created_at: '2024-01-01T00:00:00Z'
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTutor
      } as Response);

      const tutorData = {
        name: 'New Tutor',
        email: 'new@example.com',
        subjects: ['Math'],
        about: 'New about',
        qualifications: ['Degree'],
        hourly_rate: 50,
        rating: 4.8,
        experience_years: 5
      };

      const result = await api.createTutor(tutorData);
      expect(result).toEqual(mockTutor);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorData)
      });
    });

    it('should throw APIError with validation details', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: { field: 'email', message: 'Invalid email format' }
        })
      } as Response);

      const tutorData = { name: 'Test', email: 'invalid-email' };

      await expect(api.createTutor(tutorData)).rejects.toThrow(APIError);
      await expect(api.createTutor(tutorData)).rejects.toMatchObject({
        status: 400,
        code: 'VALIDATION_ERROR',
        details: { field: 'email', message: 'Invalid email format' }
      });
    });
  });

  describe('getBulkAvailability', () => {
    it('should fetch bulk availability for a single date', async () => {
      const mockResponse = {
        availability: [
          {
            tutor_id: '1',
            tutor_name: 'Test Tutor',
            dates: {
              '2024-01-01': {
                date: '2024-01-01',
                total_slots: 3,
                available_slots: 2,
                has_availability: true,
                slots: []
              }
            }
          }
        ],
        query: {
          start_date: '2024-01-01',
          end_date: '2024-01-02'
        }
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await api.getBulkAvailability('2024-01-01');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/availability?date=2024-01-01');
    });

    it('should fetch bulk availability for a date range', async () => {
      const mockResponse = {
        availability: [],
        query: {
          start_date: '2024-01-01',
          end_date: '2024-01-07'
        }
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await api.getBulkAvailability('2024-01-01', '2024-01-07');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/availability?start_date=2024-01-01&end_date=2024-01-07');
    });

    it('should throw APIError when bulk availability fetch fails', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid date format' })
      } as Response);

      await expect(api.getBulkAvailability('invalid-date')).rejects.toThrow(APIError);
    });
  });
}); 