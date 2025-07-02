import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Mail, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentBookings } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';

const StudentDashboardPage = () => {
  const { currentUser } = useUser();
  const { data: bookingsData, isLoading, error } = useStudentBookings(currentUser?.id || '');

  // Transform API data to match the original structure
  const studentBookings = bookingsData?.bookings.map(booking => ({
    id: booking.id,
    tutor: {
      id: booking.tutor.id,
      name: booking.tutor.name,
      subjects: ['Mathematics', 'Physics'] // Default subjects since not in API
    },
    date: new Date(booking.start_time).toISOString().split('T')[0],
    startTime: new Date(booking.start_time).toTimeString().slice(0, 5),
    endTime: new Date(booking.end_time).toTimeString().slice(0, 5),
    status: 'confirmed', // Default status since not in API
    subject: 'Mathematics', // Default subject since not in API
    bookedAt: booking.booked_at
  })) || [];

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading bookings: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard...</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No student found</h3>
            <p className="text-gray-600 mb-4">Please create a student account first</p>
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
      <Navbar />

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
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                  <TabsTrigger value="history">History ({pastBookings.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="mt-6">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
                      <p className="text-gray-600 mb-4">You don't have any upcoming tutoring sessions</p>
                      <Link to="/tutors">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Find a Tutor
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(booking.status)}
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.tutor.name}</h4>
                              <p className="text-sm text-gray-600">{booking.subject}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(booking.date)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(booking.status)}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No past sessions</h3>
                      <p className="text-gray-600">Your completed sessions will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(booking.status)}
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.tutor.name}</h4>
                              <p className="text-sm text-gray-600">{booking.subject}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(booking.date)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(booking.status)}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
