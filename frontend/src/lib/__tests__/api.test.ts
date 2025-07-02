import { api } from '../api';

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

    it('should throw error when fetch fails', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getTutors()).rejects.toThrow('Network error');
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
  });
}); 