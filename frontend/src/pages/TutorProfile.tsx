import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Mail, Calendar, CheckCircle, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTutors, useTutorAvailability, useCreateBooking } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import UserMenu from '@/components/UserMenu';

const TutorProfilePage = () => {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tutorsData, isLoading: tutorsLoading, error: tutorsError } = useTutors();
  const { data: availabilityData, isLoading: availabilityLoading, refetch: refetchAvailability } = useTutorAvailability(id || '');
  const createBookingMutation = useCreateBooking();
  const { currentUser } = useUser();

  // Find the specific tutor
  const tutor = tutorsData?.tutors.find(t => t.id === id);
  
  // Transform API data to match the original structure
  const tutorProfile = tutor ? {
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: tutor.subjects || ['Mathematics', 'Physics'],
    rating: tutor.rating || 4.9,
    reviews: 127, // Default reviews since not in API
    experience: `${tutor.experience_years || 5} years`,
    hourlyRate: tutor.hourly_rate || 45,
    description: tutor.about || 'Experienced math and physics tutor with a passion for helping students excel in STEM subjects. I hold a Master\'s degree in Applied Mathematics and have been teaching for over 5 years. My approach focuses on building strong fundamentals while making learning engaging and fun.',
    achievements: tutor.qualifications || [
      'Master\'s in Applied Mathematics',
      '5+ years teaching experience',
      '127 positive student reviews',
      'Specialized in exam preparation'
    ],
    availableSlots: availabilityData?.slots
      .filter(slot => !slot.is_booked)
      .map(slot => ({
        id: slot.id,
        date: new Date(slot.start_time).toISOString().split('T')[0],
        time: new Date(slot.start_time).toTimeString().slice(0, 5),
        duration: '1 hour'
      })) || []
  } : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!currentUser) {
      toast.error('No student account found. Please create a student account first.');
      return;
    }

    setIsBooking(true);
    
    try {
      await createBookingMutation.mutateAsync({
        student_id: currentUser.id,
        slot_id: selectedSlot.id
      });
      
      toast.success('Session booked successfully! You will receive a confirmation email shortly.', {
        action: {
          label: 'View My Bookings',
          onClick: () => window.location.href = '/student-dashboard'
        }
      });
      setIsBooking(false);
      setSelectedSlot(null);
      setIsDialogOpen(false);
      
      // Immediately refetch availability to update the UI
      await refetchAvailability();
    } catch (error) {
      toast.error('Failed to book session');
      setIsBooking(false);
    }
  };

  if (tutorsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading tutor: {tutorsError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (tutorsLoading || !tutorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading tutor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No student account found</h3>
            <p className="text-gray-600 mb-4">Please create a student account first to book sessions</p>
            <Link to="/admin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Admin
              </Button>
            </Link>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tutor Profile */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {tutorProfile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-gray-900 mb-2">{tutorProfile.name}</CardTitle>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold text-gray-700 ml-1">{tutorProfile.rating}</span>
                        <span className="text-gray-500 ml-1">({tutorProfile.reviews} reviews)</span>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {tutorProfile.experience}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{tutorProfile.email}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Subjects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutorProfile.subjects.map((subject) => (
                      <Badge key={subject} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{tutorProfile.description}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications & Achievements</h3>
                  <div className="space-y-2">
                    {tutorProfile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Book a Session
                </CardTitle>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-gray-900">${tutorProfile.hourlyRate}</div>
                  <div className="text-gray-500">per hour</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Time Slots</h4>
                  {availabilityLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">Loading availability...</p>
                    </div>
                  ) : tutorProfile.availableSlots.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No available slots</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tutorProfile.availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          className={`w-full justify-start text-left p-3 h-auto ${
                            selectedSlot?.id === slot.id 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <div>
                            <div className="font-medium">{formatDate(slot.date)}</div>
                            <div className="text-sm text-gray-600">
                              {formatTime(slot.time)} • {slot.duration}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSlot && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        Book This Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Session with {tutorProfile.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Selected Time</h4>
                          <p className="text-gray-700">
                            {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.time)}
                          </p>
                          <p className="text-sm text-gray-500">Duration: {selectedSlot.duration}</p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Booking for</h4>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">
                                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{currentUser.name}</p>
                              <p className="text-sm text-gray-600">{currentUser.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleBooking}
                          disabled={isBooking}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isBooking ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;
