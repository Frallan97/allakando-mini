import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { APIError, NetworkError, getErrorMessage, formatErrorForLogging } from './errors';

// API base URL
const API_BASE_URL = 'http://localhost:3000/v1';

// Types
export interface Tutor {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  about: string;
  qualifications: string[];
  hourly_rate: number;
  rating: number;
  experience_years: number;
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

export interface TutorDateAvailability {
  date: string;
  total_slots: number;
  available_slots: number;
  has_availability: boolean;
  slots: AvailabilitySlot[];
}

export interface TutorAvailabilityData {
  tutor_id: string;
  tutor_name: string;
  dates: Record<string, TutorDateAvailability>;
}

export interface BulkAvailabilityResponse {
  availability: TutorAvailabilityData[];
  query: {
    start_date: string;
    end_date: string;
  };
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

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If we can't parse the error response, use default error
    }
    
    const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
    const error = new APIError(errorMessage, response.status, errorData.code, errorData);
    
    console.error(formatErrorForLogging(error, context));
    throw error;
  }
  
  return response.json();
}

// Helper function to handle fetch errors
function handleFetchError(error: unknown, context: string): never {
  if (error instanceof APIError) {
    throw error; // Re-throw API errors as they're already handled
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    const networkError = new NetworkError();
    console.error(formatErrorForLogging(networkError, context));
    throw networkError;
  }
  
  console.error(formatErrorForLogging(error, context));
  throw error;
}

// API functions
const api = {
  // Tutors
  async getTutors(): Promise<{ tutors: Tutor[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors`);
      return handleApiResponse(response, 'getTutors');
    } catch (error) {
      handleFetchError(error, 'getTutors');
    }
  },

  async createTutor(data: { 
    name: string; 
    email: string; 
    subjects?: string[]; 
    about?: string; 
    qualifications?: string[]; 
    hourly_rate?: number; 
    rating?: number; 
    experience_years?: number; 
  }): Promise<Tutor> {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response, 'createTutor');
    } catch (error) {
      handleFetchError(error, 'createTutor');
    }
  },

  async addAvailability(tutorId: string, data: { start_time: string; end_time: string }): Promise<AvailabilitySlot> {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response, 'addAvailability');
    } catch (error) {
      handleFetchError(error, 'addAvailability');
    }
  },

  async getTutorAvailability(tutorId: string): Promise<{ slots: AvailabilitySlot[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/${tutorId}/availability`);
      return handleApiResponse(response, 'getTutorAvailability');
    } catch (error) {
      handleFetchError(error, 'getTutorAvailability');
    }
  },

  // Bulk availability for all tutors
  async getBulkAvailability(startDate: string, endDate?: string): Promise<BulkAvailabilityResponse> {
    try {
      const params = new URLSearchParams();
      if (endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      } else {
        params.append('date', startDate);
      }
      
      const response = await fetch(`${API_BASE_URL}/availability?${params}`);
      return handleApiResponse(response, 'getBulkAvailability');
    } catch (error) {
      handleFetchError(error, 'getBulkAvailability');
    }
  },

  // Students
  async createStudent(data: { name: string; email: string }): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response, 'createStudent');
    } catch (error) {
      handleFetchError(error, 'createStudent');
    }
  },

  async getStudents(): Promise<{ students: Student[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      return handleApiResponse(response, 'getStudents');
    } catch (error) {
      handleFetchError(error, 'getStudents');
    }
  },

  // Bookings
  async createBooking(data: { student_id: string; slot_id: string }): Promise<{ booking: Booking }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response, 'createBooking');
    } catch (error) {
      handleFetchError(error, 'createBooking');
    }
  },

  async getStudentBookings(studentId: string): Promise<{ bookings: BookingWithDetails[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?student_id=${studentId}`);
      return handleApiResponse(response, 'getStudentBookings');
    } catch (error) {
      handleFetchError(error, 'getStudentBookings');
    }
  },

  async getRecentBookings(limit: number = 10): Promise<{ bookings: BookingWithDetails[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/recent?limit=${limit}`);
      return handleApiResponse(response, 'getRecentBookings');
    } catch (error) {
      handleFetchError(error, 'getRecentBookings');
    }
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

export const useBulkAvailability = (startDate: string, endDate?: string) => {
  return useQuery({
    queryKey: ['bulk-availability', startDate, endDate],
    queryFn: () => api.getBulkAvailability(startDate, endDate),
    enabled: !!startDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export const useRecentBookings = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-bookings', limit],
    queryFn: () => api.getRecentBookings(limit),
  });
};

export { api }; 