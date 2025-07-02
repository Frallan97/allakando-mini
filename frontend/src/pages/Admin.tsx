
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Calendar, BookOpen, Settings, User, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminPage = () => {
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorEmail, setNewTutorEmail] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [availabilityTime, setAvailabilityTime] = useState('');

  // Mock data - will be replaced with API calls
  const tutors = [
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      subjects: ['Mathematics', 'Physics'],
      totalSessions: 45,
      availableSlots: 12,
      rating: 4.9
    },
    {
      id: '2',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      subjects: ['English', 'Literature'],
      totalSessions: 32,
      availableSlots: 8,
      rating: 4.8
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      subjects: ['Chemistry', 'Biology'],
      totalSessions: 58,
      availableSlots: 15,
      rating: 4.7
    }
  ];

  const recentBookings = [
    {
      id: '1',
      student: 'John Doe',
      tutor: 'Alice Smith',
      subject: 'Mathematics',
      date: '2025-07-05',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: '2',
      student: 'Jane Smith',
      tutor: 'Bob Johnson',
      subject: 'English',
      date: '2025-07-06',
      time: '10:00',
      status: 'confirmed'
    },
    {
      id: '3',
      student: 'Mike Wilson',
      tutor: 'Carol Davis',
      subject: 'Chemistry',
      date: '2025-07-07',
      time: '16:00',
      status: 'completed'
    }
  ];

  const stats = [
    { icon: Users, label: 'Total Tutors', value: tutors.length },
    { icon: BookOpen, label: 'Total Sessions', value: '135' },
    { icon: Calendar, label: 'This Week', value: '23' },
    { icon: Settings, label: 'Active Now', value: '8' }
  ];

  const handleCreateTutor = () => {
    if (!newTutorName || !newTutorEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Tutor created successfully!');
      setNewTutorName('');
      setNewTutorEmail('');
    }, 1000);
  };

  const handleAddAvailability = () => {
    if (!selectedTutor || !availabilityDate || !availabilityTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Availability slot added successfully!');
      setSelectedTutor('');
      setAvailabilityDate('');
      setAvailabilityTime('');
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
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
                <Settings className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/tutors">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  View Tutors
                </Button>
              </Link>
              <Link to="/student-dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Student View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage tutors, availability, and monitor platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Management Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Platform Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tutors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tutors">Tutors</TabsTrigger>
                    <TabsTrigger value="availability">Availability</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tutors" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Tutor Management</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Tutor
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Tutor</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="tutorName">Name *</Label>
                                <Input
                                  id="tutorName"
                                  value={newTutorName}
                                  onChange={(e) => setNewTutorName(e.target.value)}
                                  placeholder="Enter tutor's full name"
                                />
                              </div>
                              <div>
                                <Label htmlFor="tutorEmail">Email *</Label>
                                <Input
                                  id="tutorEmail"
                                  type="email"
                                  value={newTutorEmail}
                                  onChange={(e) => setNewTutorEmail(e.target.value)}
                                  placeholder="Enter tutor's email"
                                />
                              </div>
                              <Button 
                                onClick={handleCreateTutor}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                Create Tutor
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="space-y-3">
                        {tutors.map((tutor) => (
                          <Card key={tutor.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-blue-600">
                                      {tutor.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{tutor.name}</div>
                                    <div className="text-sm text-gray-600">{tutor.email}</div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {tutor.totalSessions} sessions
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {tutor.availableSlots} available
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="availability" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Availability Management</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Slot
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Availability Slot</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="tutorSelect">Select Tutor *</Label>
                                <select
                                  id="tutorSelect"
                                  value={selectedTutor}
                                  onChange={(e) => setSelectedTutor(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                  <option value="">Choose a tutor</option>
                                  {tutors.map((tutor) => (
                                    <option key={tutor.id} value={tutor.id}>
                                      {tutor.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="availabilityDate">Date *</Label>
                                <Input
                                  id="availabilityDate"
                                  type="date"
                                  value={availabilityDate}
                                  onChange={(e) => setAvailabilityDate(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="availabilityTime">Time *</Label>
                                <Input
                                  id="availabilityTime"
                                  type="time"
                                  value={availabilityTime}
                                  onChange={(e) => setAvailabilityTime(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={handleAddAvailability}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                Add Availability
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Availability slots will be displayed here</p>
                        <p className="text-sm">Add slots for tutors to make them bookable</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bookings" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                      <div className="space-y-3">
                        {recentBookings.map((booking) => (
                          <Card key={booking.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{booking.subject}</div>
                                  <div className="text-sm text-gray-600">
                                    {booking.student} with {booking.tutor}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(booking.date)} at {booking.time}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(booking.status)}
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Tutors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedules
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Session Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform Status</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-semibold">120ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
