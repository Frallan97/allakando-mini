import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Calendar, BookOpen, Settings, User, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTutors, useCreateTutor, useAddAvailability } from '@/lib/api';
import Navbar from '@/components/Navbar';

const AdminPage = () => {
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorEmail, setNewTutorEmail] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [availabilityTime, setAvailabilityTime] = useState('');

  const { data: tutorsData, isLoading, error } = useTutors();
  const createTutorMutation = useCreateTutor();
  const addAvailabilityMutation = useAddAvailability();

  // Transform API data to match the original structure
  const tutors = tutorsData?.tutors.map(tutor => ({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: ['Mathematics', 'Physics'], // Default subjects since not in API
    totalSessions: 25, // Default sessions since not in API
    availableSlots: 8, // Default slots since not in API
    rating: 4.8 // Default rating since not in API
  })) || [];

  // Mock recent bookings since not in API
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

  const handleCreateTutor = async () => {
    if (!newTutorName || !newTutorEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTutorMutation.mutateAsync({
        name: newTutorName,
        email: newTutorEmail
      });
      setNewTutorName('');
      setNewTutorEmail('');
      toast.success('Tutor created successfully!');
    } catch (error) {
      toast.error('Failed to create tutor');
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedTutor || !availabilityDate || !availabilityTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startTime = new Date(`${availabilityDate}T${availabilityTime}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      await addAvailabilityMutation.mutateAsync({
        tutorId: selectedTutor,
        data: {
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        }
      });
      setSelectedTutor('');
      setAvailabilityDate('');
      setAvailabilityTime('');
      toast.success('Availability slot added successfully!');
    } catch (error) {
      toast.error('Failed to add availability');
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading data: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar variant="admin" />

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
          {/* Tutors Management */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-2 text-blue-600" />
                    Tutors Management
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tutor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Tutor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newTutorName}
                            onChange={(e) => setNewTutorName(e.target.value)}
                            placeholder="Enter tutor name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newTutorEmail}
                            onChange={(e) => setNewTutorEmail(e.target.value)}
                            placeholder="Enter tutor email"
                          />
                        </div>
                        <Button 
                          onClick={handleCreateTutor}
                          disabled={createTutorMutation.isPending}
                          className="w-full"
                        >
                          {createTutorMutation.isPending ? 'Creating...' : 'Create Tutor'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading tutors...</p>
                  </div>
                ) : tutors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tutors yet</h3>
                    <p className="text-gray-600">Add your first tutor to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tutors.map((tutor) => (
                      <div key={tutor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{tutor.name}</h4>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Mail className="h-4 w-4 mr-1" />
                              <span>{tutor.email}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{tutor.totalSessions} sessions</span>
                              <span className="text-sm text-gray-500">{tutor.availableSlots} slots</span>
                              <span className="text-sm text-gray-500">★ {tutor.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{tutor.subjects[0]}</Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Add Availability */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Add Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tutor">Select Tutor</Label>
                    <select
                      id="tutor"
                      value={selectedTutor}
                      onChange={(e) => setSelectedTutor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={availabilityTime}
                      onChange={(e) => setAvailabilityTime(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddAvailability}
                    disabled={addAvailabilityMutation.isPending}
                    className="w-full"
                  >
                    {addAvailabilityMutation.isPending ? 'Adding...' : 'Add Slot'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.student}</h4>
                        <p className="text-sm text-gray-600">{booking.tutor} • {booking.subject}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(booking.date)} at {booking.time}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  ))}
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
