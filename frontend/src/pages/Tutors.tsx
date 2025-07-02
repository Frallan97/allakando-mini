import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutors, api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { TutorFilters } from '@/components/TutorFilters';
import { TutorCard } from '@/components/TutorCard';
import { useTutorTransforms, useAvailableDates } from '@/hooks/useTutorTransforms';
import { useTutorFiltering } from '@/hooks/useTutorFiltering';


// Custom hook to get all tutors with availability for a date
const useTutorsWithAvailability = (tutors, selectedDate) => {
  const [availableTutors, setAvailableTutors] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Memoize the tutors array to prevent unnecessary re-renders
  const tutorIds = useMemo(() => tutors.map(t => t.id).join(','), [tutors]);
  const memoizedTutors = useMemo(() => tutors, [tutorIds]);

  // Memoize the checkAvailability function
  const checkAvailability = useCallback(async () => {
    if (!selectedDate) {
      setAvailableTutors(memoizedTutors);
      setIsCheckingAvailability(false);
      return;
    }

    setIsCheckingAvailability(true);
    
    const available = [];
    
    for (const tutor of memoizedTutors) {
      try {
        const data = await api.getTutorAvailability(tutor.id);
        
        const hasAvailability = data.slots.some(slot => {
          const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
          return slotDate === selectedDate && !slot.is_booked;
        });
        
        if (hasAvailability) {
          available.push(tutor);
        }
      } catch (error) {
        console.error(`Error checking availability for tutor ${tutor.id}:`, error);
        continue;
      }
    }
    
    setAvailableTutors(available);
    setIsCheckingAvailability(false);
  }, [memoizedTutors, selectedDate]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return { availableTutors, isCheckingAvailability };
};

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDate, setSelectedDate] = useState('any');

  const { data: tutorsData, isLoading, error } = useTutors();
  
  // Transform API data using custom hook
  const tutors = useTutorTransforms(tutorsData);
  
  // Get available dates using custom hook
  const availableDates = useAvailableDates();

  // Get tutors with availability for selected date
  const { availableTutors, isCheckingAvailability } = useTutorsWithAvailability(tutors, selectedDate === 'any' ? null : selectedDate);

  // Filter tutors using custom hook
  const filteredTutors = useTutorFiltering(availableTutors, {
    searchTerm,
    subjectFilter, 
    sortBy
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading tutors: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Tutor</h1>
          <p className="text-xl text-gray-600">Browse our community of expert tutors and book your perfect learning session</p>
        </div>

        {/* Filters */}
        <TutorFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDates={availableDates}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isCheckingAvailability ? (
              <span>Checking availability...</span>
            ) : (
              <>
                Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''}
                {selectedDate !== 'any' && (
                  <span className="ml-2 text-blue-600">
                    available on {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Tutors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading tutors...</p>
          </div>
        ) : isCheckingAvailability ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Checking tutor availability...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {selectedDate !== 'any' 
                ? `No tutors available on ${new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                : 'No tutors found matching your criteria'
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsPage;
