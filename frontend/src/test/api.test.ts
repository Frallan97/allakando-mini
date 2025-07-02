import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from '../lib/api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Tutors API', () => {
    it('should fetch tutors successfully', async () => {
      const mockTutors = {
        tutors: [
          { id: '1', name: 'John Tutor', email: 'john@example.com', created_at: '2023-01-01' }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTutors),
      });

      const result = await api.getTutors();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/tutors');
      expect(result).toEqual(mockTutors);
    });

    it('should throw error when fetch tutors fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getTutors()).rejects.toThrow('Failed to fetch tutors');
    });

    it('should create tutor successfully', async () => {
      const newTutor = { name: 'Jane Tutor', email: 'jane@example.com' };
      const createdTutor = { id: '1', ...newTutor, created_at: '2023-01-01' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdTutor),
      });

      const result = await api.createTutor(newTutor);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTutor),
      });
      expect(result).toEqual(createdTutor);
    });

    it('should add availability successfully', async () => {
      const tutorId = '1';
      const availabilityData = {
        start_time: '2023-12-01T10:00:00Z',
        end_time: '2023-12-01T11:00:00Z'
      };
      const createdSlot = {
        id: '1',
        tutor_id: tutorId,
        ...availabilityData,
        is_booked: false,
        created_at: '2023-01-01'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdSlot),
      });

      const result = await api.addAvailability(tutorId, availabilityData);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/v1/tutors/${tutorId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availabilityData),
      });
      expect(result).toEqual(createdSlot);
    });

    it('should get tutor availability successfully', async () => {
      const tutorId = '1';
      const mockSlots = {
        slots: [
          {
            id: '1',
            tutor_id: tutorId,
            start_time: '2023-12-01T10:00:00Z',
            end_time: '2023-12-01T11:00:00Z',
            is_booked: false,
            created_at: '2023-01-01'
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSlots),
      });

      const result = await api.getTutorAvailability(tutorId);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/v1/tutors/${tutorId}/availability`);
      expect(result).toEqual(mockSlots);
    });
  });

  describe('Students API', () => {
    it('should create student successfully', async () => {
      const newStudent = { name: 'John Student', email: 'john.student@example.com' };
      const createdStudent = { id: '1', ...newStudent, created_at: '2023-01-01' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdStudent),
      });

      const result = await api.createStudent(newStudent);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      expect(result).toEqual(createdStudent);
    });

    it('should throw error when create student fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.createStudent({ name: 'Test', email: 'test@example.com' }))
        .rejects.toThrow('Failed to create student');
    });

    it('should get students successfully', async () => {
      const mockStudents = {
        students: [
          { id: '1', name: 'John Student', email: 'john@example.com', created_at: '2023-01-01' }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStudents),
      });

      const result = await api.getStudents();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/students');
      expect(result).toEqual(mockStudents);
    });
  });

  describe('Bookings API', () => {
    it('should create booking successfully', async () => {
      const bookingData = { student_id: '1', slot_id: '1' };
      const createdBooking = {
        booking: {
          id: '1',
          slot_id: '1',
          student_id: '1',
          booked_at: '2023-01-01',
          tutor_id: '1',
          start_time: '2023-12-01T10:00:00Z',
          end_time: '2023-12-01T11:00:00Z'
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdBooking),
      });

      const result = await api.createBooking(bookingData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      expect(result).toEqual(createdBooking);
    });

    it('should get student bookings successfully', async () => {
      const studentId = '1';
      const mockBookings = {
        bookings: [
          {
            id: '1',
            tutor: {
              id: '1',
              name: 'John Tutor'
            },
            start_time: '2023-12-01T10:00:00Z',
            end_time: '2023-12-01T11:00:00Z',
            booked_at: '2023-01-01'
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBookings),
      });

      const result = await api.getStudentBookings(studentId);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/v1/bookings?student_id=${studentId}`);
      expect(result).toEqual(mockBookings);
    });

    it('should throw error when create booking fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.createBooking({ student_id: '1', slot_id: '1' }))
        .rejects.toThrow('Failed to create booking');
    });
  });
});