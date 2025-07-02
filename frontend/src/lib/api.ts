import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API base URL
const API_BASE_URL = 'http://localhost:3000/v1';

// Types
export interface Tutor {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  student_id: string;
  booked_at: string;
  tutor_id?: string;
  start_time?: string;
  end_time?: string;
}

export interface BookingWithDetails {
  id: string;
  tutor: {
    id: string;
    name: string;
  };
  start_time: string;
  end_time: string;
  booked_at: string;
}

// API functions
const api = {
  // Tutors
  async getTutors(): Promise<{ tutors: Tutor[] }> {
    const response = await fetch(`${API_BASE_URL}/tutors`);
    if (!response.ok) throw new Error('Failed to fetch tutors');
    return response.json();
  },

  async createTutor(data: { name: string; email: string }): Promise<Tutor> {
    const response = await fetch(`${API_BASE_URL}/tutors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create tutor');
    return response.json();
  },

  async addAvailability(tutorId: string, data: { start_time: string; end_time: string }): Promise<AvailabilitySlot> {
    const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add availability');
    return response.json();
  },

  async getTutorAvailability(tutorId: string): Promise<{ slots: AvailabilitySlot[] }> {
    const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}/availability`);
    if (!response.ok) throw new Error('Failed to fetch tutor availability');
    return response.json();
  },

  // Students
  async createStudent(data: { name: string; email: string }): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  },

  async getStudents(): Promise<{ students: Student[] }> {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  // Bookings
  async createBooking(data: { student_id: string; slot_id: string }): Promise<{ booking: Booking }> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  },

  async getStudentBookings(studentId: string): Promise<{ bookings: BookingWithDetails[] }> {
    const response = await fetch(`${API_BASE_URL}/bookings?student_id=${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student bookings');
    return response.json();
  },
};

// React Query hooks
export const useTutors = () => {
  return useQuery({
    queryKey: ['tutors'],
    queryFn: api.getTutors,
  });
};

export const useCreateTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
};

export const useAddAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tutorId, data }: { tutorId: string; data: { start_time: string; end_time: string } }) =>
      api.addAvailability(tutorId, data),
    onSuccess: (_, { tutorId }) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-availability', tutorId] });
    },
  });
};

export const useTutorAvailability = (tutorId: string) => {
  return useQuery({
    queryKey: ['tutor-availability', tutorId],
    queryFn: () => api.getTutorAvailability(tutorId),
    enabled: !!tutorId,
  });
};

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: api.createStudent,
  });
};

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: api.getStudents,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createBooking,
    onSuccess: (_, { student_id }) => {
      queryClient.invalidateQueries({ queryKey: ['student-bookings', student_id] });
    },
  });
};

export const useStudentBookings = (studentId: string) => {
  return useQuery({
    queryKey: ['student-bookings', studentId],
    queryFn: () => api.getStudentBookings(studentId),
    enabled: !!studentId,
  });
};

export { api }; 