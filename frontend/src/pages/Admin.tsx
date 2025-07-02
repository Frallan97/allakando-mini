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
import { useTutors, useCreateTutor, useRecentBookings } from '@/lib/api';
import { useAdminTutorTransforms, useAdminBookingTransforms } from '@/hooks/useAdminTransforms';
import UserMenu from '@/components/UserMenu';

const AdminPage = () => {
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorEmail, setNewTutorEmail] = useState('');
  const [newTutorSubjects, setNewTutorSubjects] = useState('');
  const [newTutorAbout, setNewTutorAbout] = useState('');
  const [newTutorQualifications, setNewTutorQualifications] = useState('');
  const [newTutorHourlyRate, setNewTutorHourlyRate] = useState('45');
  const [newTutorRating, setNewTutorRating] = useState('4.8');
  const [newTutorExperience, setNewTutorExperience] = useState('3');
  const [isAddTutorDialogOpen, setIsAddTutorDialogOpen] = useState(false);
  const [selectedTutorForDetails, setSelectedTutorForDetails] = useState<Tutor | null>(null);
  const [isTutorDetailsDialogOpen, setIsTutorDetailsDialogOpen] = useState(false);

  const { data: tutorsData, isLoading, error } = useTutors();
  const { data: recentBookingsData, isLoading: recentBookingsLoading } = useRecentBookings(5);
  const createTutorMutation = useCreateTutor();

  // Transform data using custom hooks
  const tutors = useAdminTutorTransforms(tutorsData);
  const recentBookings = useAdminBookingTransforms(recentBookingsData);

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
        email: newTutorEmail,
        subjects: newTutorSubjects ? newTutorSubjects.split(',').map(s => s.trim()) : [],
        about: newTutorAbout,
        qualifications: newTutorQualifications ? newTutorQualifications.split(',').map(q => q.trim()) : [],
        hourly_rate: parseFloat(newTutorHourlyRate) || 45,
        rating: parseFloat(newTutorRating) || 4.8,
        experience_years: parseInt(newTutorExperience) || 3
      });
      
      // Reset form
      setNewTutorName('');
      setNewTutorEmail('');
      setNewTutorSubjects('');
      setNewTutorAbout('');
      setNewTutorQualifications('');
      setNewTutorHourlyRate('45');
      setNewTutorRating('4.8');
      setNewTutorExperience('3');
      
      // Close the dialog
      setIsAddTutorDialogOpen(false);
      
      toast.success('Tutor created successfully!');
    } catch (error) {
      toast.error('Failed to create tutor');
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

  const handleViewTutorDetails = (tutor: Tutor) => {
    setSelectedTutorForDetails(tutor);
    setIsTutorDetailsDialogOpen(true);
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
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Admin Panel</span>
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
              <Link to="/tutor-admin">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Tutor Admin
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
                  <Dialog open={isAddTutorDialogOpen} onOpenChange={setIsAddTutorDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tutor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Tutor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={newTutorName}
                              onChange={(e) => setNewTutorName(e.target.value)}
                              placeholder="Enter tutor name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newTutorEmail}
                              onChange={(e) => setNewTutorEmail(e.target.value)}
                              placeholder="Enter tutor email"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                          <Input
                            id="subjects"
                            value={newTutorSubjects}
                            onChange={(e) => setNewTutorSubjects(e.target.value)}
                            placeholder="e.g., Mathematics, Physics, Chemistry"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="about">About</Label>
                          <Textarea
                            id="about"
                            value={newTutorAbout}
                            onChange={(e) => setNewTutorAbout(e.target.value)}
                            placeholder="Tell us about the tutor's background, teaching style, and expertise..."
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                          <Input
                            id="qualifications"
                            value={newTutorQualifications}
                            onChange={(e) => setNewTutorQualifications(e.target.value)}
                            placeholder="e.g., Master's Degree, 5 years experience, Teaching certification"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                            <Input
                              id="hourlyRate"
                              type="number"
                              value={newTutorHourlyRate}
                              onChange={(e) => setNewTutorHourlyRate(e.target.value)}
                              placeholder="45"
                            />
                          </div>
                          <div>
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={newTutorRating}
                              onChange={(e) => setNewTutorRating(e.target.value)}
                              placeholder="4.8"
                            />
                          </div>
                          <div>
                            <Label htmlFor="experience">Experience (years)</Label>
                            <Input
                              id="experience"
                              type="number"
                              value={newTutorExperience}
                              onChange={(e) => setNewTutorExperience(e.target.value)}
                              placeholder="3"
                            />
                          </div>
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
                              <span className="text-sm text-gray-500">${tutor.hourlyRate}/hr</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{tutor.subjects[0]}</Badge>
                          <Button variant="outline" size="sm" onClick={() => handleViewTutorDetails(tutor)}>
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
            {/* Recent Bookings */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookingsLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Loading recent bookings...</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No recent bookings</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tutor Details Dialog */}
      <Dialog open={isTutorDetailsDialogOpen} onOpenChange={setIsTutorDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tutor Details</DialogTitle>
          </DialogHeader>
          {selectedTutorForDetails && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedTutorForDetails.name}</h3>
                  <p className="text-gray-600">{selectedTutorForDetails.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">★ {selectedTutorForDetails.rating}</span>
                    <span className="text-sm text-gray-500">${selectedTutorForDetails.hourlyRate}/hr</span>
                    <span className="text-sm text-gray-500">{selectedTutorForDetails.experience}</span>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTutorForDetails.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>

              {/* About */}
              {selectedTutorForDetails.about && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700">{selectedTutorForDetails.about}</p>
                </div>
              )}

              {/* Qualifications */}
              {selectedTutorForDetails.qualifications && selectedTutorForDetails.qualifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedTutorForDetails.qualifications.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedTutorForDetails.totalSessions}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedTutorForDetails.availableSlots}</div>
                  <div className="text-sm text-gray-600">Available Slots</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedTutorForDetails.experience_years || 3}</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
