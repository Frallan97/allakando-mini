import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTutors, useBulkAvailability } from '@/lib/api';
import Navbar from '@/components/Navbar';


const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDate, setSelectedDate] = useState('any');

  const { data: tutorsData, isLoading, error } = useTutors();

  // Generate available dates (today + 2 weeks)
  const generateAvailableDates = () => {
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
  };

  const availableDates = generateAvailableDates();
  
  // Pre-load 2 weeks of availability data
  const today = new Date().toISOString().split('T')[0];
  const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { 
    data: bulkAvailabilityData, 
    isLoading: isLoadingAvailability 
  } = useBulkAvailability(today, twoWeeksFromNow);

  // Transform API data to match the original structure
  const tutors = tutorsData?.tutors.map(tutor => ({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: tutor.subjects || ['Mathematics', 'Physics'],
    rating: tutor.rating || 4.8,
    experience: `${tutor.experience_years || 3} years`,
    hourlyRate: tutor.hourly_rate || 45,
    availableSlots: 8, // Default slots since not in API
    description: tutor.about || 'Experienced tutor with a passion for helping students excel in their studies.',
  })) || [];

  // Get available tutors for selected date using pre-loaded data
  const availableTutors = useMemo(() => {
    if (!tutors.length) return [];
    
    // If no date filter, return all tutors
    if (selectedDate === 'any') {
      return tutors;
    }

    // If we don't have availability data yet, return empty array
    if (!bulkAvailabilityData) {
      return [];
    }

    // Filter tutors based on availability for the selected date
    const availableTutorIds = new Set();
    
    bulkAvailabilityData.availability.forEach(tutorAvailability => {
      const dateAvailability = tutorAvailability.dates[selectedDate];
      if (dateAvailability && dateAvailability.has_availability) {
        availableTutorIds.add(tutorAvailability.tutor_id);
      }
    });

    return tutors.filter(tutor => availableTutorIds.has(tutor.id));
  }, [tutors, selectedDate, bulkAvailabilityData]);

  const subjects = ['all', 'Mathematics', 'Physics', 'English', 'Literature', 'Chemistry', 'Biology', 'Computer Science', 'Programming', 'Spanish', 'French', 'History', 'Social Studies'];

  // Filter tutors based on search term, subject, and date availability
  const filteredTutors = availableTutors
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tutors or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="availability">Most Available</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any date</SelectItem>
                {availableDates.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label} {date.isToday && '(Today)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoadingAvailability && selectedDate !== 'any' ? (
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
        ) : isLoadingAvailability && selectedDate !== 'any' ? (
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
              <Card key={tutor.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{tutor.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{tutor.rating}</span>
                        <span className="text-sm text-gray-400 ml-2">{tutor.experience}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-2">{tutor.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{tutor.availableSlots} slots available</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${tutor.hourlyRate}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>
                  
                  <Link to={`/tutor/${tutor.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      View Profile & Book
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsPage;
