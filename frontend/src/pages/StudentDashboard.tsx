
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Mail, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboardPage = () => {
  // Mock data - will be replaced with API calls
  const studentBookings = [
    {
      id: '1',
      tutor: {
        id: '1',
        name: 'Alice Smith',
        subjects: ['Mathematics', 'Physics']
      },
      date: '2025-07-05',
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
      subject: 'Mathematics',
      bookedAt: '2025-07-01T10:05:00Z'
    },
    {
      id: '2',
      tutor: {
        id: '2',
        name: 'Bob Johnson',
        subjects: ['English', 'Literature']
      },
      date: '2025-07-06',
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
      subject: 'English',
      bookedAt: '2025-07-01T15:20:00Z'
    },
    {
      id: '3',
      tutor: {
        id: '1',
        name: 'Alice Smith',
        subjects: ['Mathematics', 'Physics']
      },
      date: '2025-07-02',
      startTime: '16:00',
      endTime: '17:00',
      status: 'completed',
      subject: 'Physics',
      bookedAt: '2025-06-28T12:00:00Z'
    },
    {
      id: '4',
      tutor: {
        id: '3',
        name: 'Carol Davis',
        subjects: ['Chemistry', 'Biology']
      },
      date: '2025-07-01',
      startTime: '09:00',
      endTime: '10:00',
      status: 'cancelled',
      subject: 'Chemistry',
      bookedAt: '2025-06-25T14:30:00Z'
    }
  ];

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const upcomingBookings = studentBookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.date) >= new Date()
  );

  const pastBookings = studentBookings.filter(booking => 
    booking.status === 'completed' || (booking.status === 'cancelled' && new Date(booking.date) < new Date())
  );

  const stats = [
    { label: 'Total Sessions', value: studentBookings.length },
    { label: 'Upcoming', value: upcomingBookings.length },
    { label: 'Completed', value: pastBookings.filter(b => b.status === 'completed').length },
    { label: 'Different Tutors', value: new Set(studentBookings.map(b => b.tutor.id)).size }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">TutorHub</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/tutors">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Find Tutors
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your tutoring sessions and track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-blue-600" />
              My Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="history">History ({pastBookings.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600 mb-4">Book a session with one of our expert tutors</p>
                    <Link to="/tutors">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        Find Tutors
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(booking.status)}
                              <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">{booking.subject}</h3>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm space-x-4">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>{booking.tutor.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{formatDate(booking.date)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to={`/tutor/${booking.tutor.id}`}>
                                <Button variant="outline" size="sm">
                                  View Tutor
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No session history</h3>
                    <p className="text-gray-600">Your completed and past sessions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(booking.status)}
                              <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">{booking.subject}</h3>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm space-x-4">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>{booking.tutor.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{formatDate(booking.date)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to={`/tutor/${booking.tutor.id}`}>
                                <Button variant="outline" size="sm">
                                  View Tutor
                                </Button>
                              </Link>
                              {booking.status === 'completed' && (
                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                  Book Again
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
