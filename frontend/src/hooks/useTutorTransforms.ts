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

interface TransformedTutor {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  rating: number;
  experience: string;
  hourlyRate: number;
  availableSlots: number;
  description: string;
}

export const useTutorTransforms = (tutorsData: { tutors: ApiTutor[] } | undefined) => {
  const transformedTutors = useMemo(() => {
    if (!tutorsData?.tutors) return [];
    
    return tutorsData.tutors.map(tutor => ({
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      subjects: tutor.subjects || ['Mathematics', 'Physics'],
      rating: tutor.rating || 4.8,
      experience: `${tutor.experience_years || 3} years`,
      hourlyRate: tutor.hourly_rate || 45,
      availableSlots: 8, // Default slots since not in API
      description: tutor.about || 'Experienced tutor with a passion for helping students excel in their studies.',
    }));
  }, [tutorsData]);

  return transformedTutors;
};

export const useAvailableDates = () => {
  return useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0
      });
    }
    return dates;
  }, []);
};

export const TUTOR_SUBJECTS = [
  'all', 
  'Mathematics', 
  'Physics', 
  'English', 
  'Literature', 
  'Chemistry', 
  'Biology', 
  'Computer Science', 
  'Programming', 
  'Spanish', 
  'French', 
  'History', 
  'Social Studies'
];