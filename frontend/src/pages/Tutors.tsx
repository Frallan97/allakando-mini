import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTutors, api } from '@/lib/api';
import UserMenu from '@/components/UserMenu';

// Custom hook to get all tutors with availability for a date
const useTutorsWithAvailability = (tutors, selectedDate) => {
  const [availableTutors, setAvailableTutors] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Memoize the tutors array to prevent unnecessary re-renders
  const memoizedTutors = useMemo(() => tutors, [tutors.map(t => t.id).join(',')]);

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

  // Transform API data to match the original structure
  const tutors = tutorsData?.tutors.map(tutor => ({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: ['Mathematics', 'Physics'], // Default subjects since not in API
    rating: 4.8, // Default rating since not in API
    experience: '3 years', // Default experience since not in API
    hourlyRate: 45, // Default rate since not in API
    availableSlots: 8, // Default slots since not in API
    description: 'Experienced tutor with a passion for helping students excel in their studies.',
  })) || [];

  const subjects = ['all', 'Mathematics', 'Physics', 'English', 'Literature', 'Chemistry', 'Biology', 'Computer Science', 'Programming', 'Spanish', 'French', 'History', 'Social Studies'];

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

  // Get tutors with availability for selected date
  const { availableTutors, isCheckingAvailability } = useTutorsWithAvailability(tutors, selectedDate === 'any' ? null : selectedDate);

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
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TutorHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Home
                </Button>
              </Link>
              <Link to="/tutors">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Find Tutors
                </Button>
              </Link>
              <Link to="/student-dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  My Bookings
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Admin
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

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
