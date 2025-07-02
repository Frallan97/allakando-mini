import { useMemo } from 'react';

interface ApiTutor {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
  rating?: number;
  experience_years?: number;
  hourly_rate?: number;
  about?: string;
}

interface AdminTutor {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  totalSessions: number;
  availableSlots: number;
  rating: number;
  hourlyRate: number;
  experience: string;
}

interface ApiBooking {
  id: string;
  student: { name: string };
  tutor: { name: string };
  slot: { 
    start_time: string;
    end_time: string;
  };
  status: string;
}

interface AdminBooking {
  id: string;
  student: string;
  tutor: string;
  time: string;
  status: string;
}

export const useAdminTutorTransforms = (tutorsData: { tutors: ApiTutor[] } | undefined) => {
  const transformedTutors = useMemo(() => {
    if (!tutorsData?.tutors) return [];
    
    return tutorsData.tutors.map(tutor => ({
      ...tutor, // Keep all original API fields
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      subjects: tutor.subjects || ['Mathematics', 'Physics'],
      totalSessions: 25, // Default sessions since not in API
      availableSlots: 8, // Default slots since not in API
      rating: tutor.rating || 4.8,
      hourlyRate: tutor.hourly_rate || 45,
      experience: `${tutor.experience_years || 3} years`
    }));
  }, [tutorsData]);

  return transformedTutors;
};

export const useAdminBookingTransforms = (bookingsData: { bookings: ApiBooking[] } | undefined) => {
  const transformedBookings = useMemo(() => {
    if (!bookingsData?.bookings) return [];
    
    return bookingsData.bookings.map(booking => ({
      id: booking.id,
      student: booking.student.name,
      tutor: booking.tutor.name,
      time: new Date(booking.slot.start_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: booking.status
    }));
  }, [bookingsData]);

  return transformedBookings;
};