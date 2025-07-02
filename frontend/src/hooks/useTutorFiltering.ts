import { useMemo } from 'react';

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  hourlyRate: number;
  availableSlots: number;
}

interface FilterState {
  searchTerm: string;
  subjectFilter: string;
  sortBy: string;
}

export const useTutorFiltering = (tutors: Tutor[], filters: FilterState) => {
  const { searchTerm, subjectFilter, sortBy } = filters;

  const filteredTutors = useMemo(() => {
    return tutors
      .filter(tutor => 
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(tutor => 
        subjectFilter === 'all' || tutor.subjects.includes(subjectFilter)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.hourlyRate - b.hourlyRate;
          case 'availability':
            return b.availableSlots - a.availableSlots;
          default:
            return 0;
        }
      });
  }, [tutors, searchTerm, subjectFilter, sortBy]);

  return filteredTutors;
};