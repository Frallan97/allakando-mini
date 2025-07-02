
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Mail, Calendar, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const TutorProfilePage = () => {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Mock data - will be replaced with API calls
  const tutor = {
    id: id,
    name: 'Alice Smith',
    email: 'alice@example.com',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    reviews: 127,
    experience: '5 years',
    hourlyRate: 45,
    description: 'Experienced math and physics tutor with a passion for helping students excel in STEM subjects. I hold a Master\'s degree in Applied Mathematics and have been teaching for over 5 years. My approach focuses on building strong fundamentals while making learning engaging and fun.',
    achievements: [
      'Master\'s in Applied Mathematics',
      '5+ years teaching experience',
      '127 positive student reviews',
      'Specialized in exam preparation'
    ],
    availableSlots: [
      { id: '1', date: '2025-07-05', time: '14:00', duration: '1 hour' },
      { id: '2', date: '2025-07-05', time: '15:00', duration: '1 hour' },
      { id: '3', date: '2025-07-06', time: '10:00', duration: '1 hour' },
      { id: '4', date: '2025-07-06', time: '11:00', duration: '1 hour' },
      { id: '5', date: '2025-07-07', time: '14:00', duration: '1 hour' },
      { id: '6', date: '2025-07-07', time: '16:00', duration: '1 hour' },
      { id: '7', date: '2025-07-08', time: '09:00', duration: '1 hour' },
      { id: '8', date: '2025-07-08', time: '13:00', duration: '1 hour' },
    ]
  };

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
    if (!selectedSlot || !studentName || !studentEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Session booked successfully! You will receive a confirmation email shortly.');
      setIsBooking(false);
      setSelectedSlot(null);
      setStudentName('');
      setStudentEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/tutors">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tutors
              </Button>
            </Link>
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
                      {tutor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-gray-900 mb-2">{tutor.name}</CardTitle>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold text-gray-700 ml-1">{tutor.rating}</span>
                        <span className="text-gray-500 ml-1">({tutor.reviews} reviews)</span>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {tutor.experience}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{tutor.email}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Subjects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{tutor.description}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications & Achievements</h3>
                  <div className="space-y-2">
                    {tutor.achievements.map((achievement, index) => (
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
                  <div className="text-4xl font-bold text-gray-900">${tutor.hourlyRate}</div>
                  <div className="text-gray-500">per hour</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Time Slots</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tutor.availableSlots.map((slot) => (
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
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      disabled={!selectedSlot}
                    >
                      {selectedSlot ? 'Book Selected Slot' : 'Select a Time Slot'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Your Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {selectedSlot && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900">Selected Session</h4>
                          <p className="text-blue-700">{formatDate(selectedSlot.date)}</p>
                          <p className="text-blue-700">{formatTime(selectedSlot.time)} • {selectedSlot.duration}</p>
                          <p className="text-blue-700 font-semibold">Total: ${tutor.hourlyRate}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="studentName">Your Name *</Label>
                          <Input
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="studentEmail">Your Email *</Label>
                          <Input
                            id="studentEmail"
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleBooking}
                        disabled={isBooking || !selectedSlot || !studentName || !studentEmail}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isBooking ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;
