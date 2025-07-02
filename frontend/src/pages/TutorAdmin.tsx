import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, BookOpen, Settings, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTutors, useAddAvailability, useTutorAvailability } from '@/lib/api';
import UserMenu from '@/components/UserMenu';

const TutorAdmin = () => {
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [availabilityTime, setAvailabilityTime] = useState('');
  const [isAddAvailabilityDialogOpen, setIsAddAvailabilityDialogOpen] = useState(false);

  const { data: tutorsData, isLoading: tutorsLoading } = useTutors();
  const { data: availabilityData, isLoading: availabilityLoading } = useTutorAvailability(selectedTutorId);
  const addAvailabilityMutation = useAddAvailability();

  const tutors = tutorsData?.tutors || [];
  const availabilitySlots = availabilityData?.slots || [];

  const selectedTutor = tutors.find(tutor => tutor.id === selectedTutorId);

  const handleAddAvailability = async () => {
    if (!selectedTutorId || !availabilityDate || !availabilityTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startTime = new Date(`${availabilityDate}T${availabilityTime}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      await addAvailabilityMutation.mutateAsync({
        tutorId: selectedTutorId,
        data: {
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        }
      });
      
      setAvailabilityDate('');
      setAvailabilityTime('');
      setIsAddAvailabilityDialogOpen(false);
      toast.success('Availability slot added successfully!');
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })
    };
  };

  const getStatusBadge = (isBooked: boolean) => {
    return isBooked ? (
      <Badge className="bg-red-100 text-red-800">Booked</Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800">Available</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Tutor Admin</span>
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
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Admin
                </Button>
              </Link>
              <Link to="/tutor-admin">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutor Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your availability and view your bookings</p>
        </div>

        {/* Tutor Selector */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Select Tutor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <select
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Choose a tutor to manage</option>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name} - {tutor.subjects?.join(', ') || 'General'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </CardContent>
        </Card>

        {selectedTutor && (
          <>
            {/* Selected Tutor Info */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedTutor.name}</h3>
                    <p className="text-gray-600">{selectedTutor.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">★ {selectedTutor.rating || 4.8}</span>
                      <span className="text-sm text-gray-500">${selectedTutor.hourly_rate || 45}/hr</span>
                      <span className="text-sm text-gray-500">{selectedTutor.experience_years || 3} years experience</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTutor.subjects?.map((subject, index) => (
                        <Badge key={index} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="availability" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="availability" className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Manage Availability
                      </CardTitle>
                      <Dialog open={isAddAvailabilityDialogOpen} onOpenChange={setIsAddAvailabilityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {availabilityLoading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Loading availability...</p>
                      </div>
                    ) : availabilitySlots.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No availability slots</h3>
                        <p className="text-gray-600">Add your first availability slot to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {(() => {
                          // Group slots by month and day
                          const groupedSlots = availabilitySlots.reduce((acc, slot) => {
                            const date = new Date(slot.start_time);
                            const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                            const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                            
                            if (!acc[monthKey]) {
                              acc[monthKey] = {};
                            }
                            if (!acc[monthKey][dayKey]) {
                              acc[monthKey][dayKey] = [];
                            }
                            acc[monthKey][dayKey].push(slot);
                            return acc;
                          }, {});

                          return Object.entries(groupedSlots).map(([month, days]) => (
                            <div key={month} className="space-y-4">
                              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                {month}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Object.entries(days).map(([dayKey, slots]) => {
                                  const date = new Date(dayKey);
                                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                  const dayNumber = date.getDate();
                                  const isToday = new Date().toDateString() === date.toDateString();
                                  
                                  return (
                                    <div 
                                      key={dayKey} 
                                      className={`p-4 rounded-lg border-2 ${
                                        isToday 
                                          ? 'border-blue-500 bg-blue-50' 
                                          : 'border-gray-200 bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div>
                                          <div className="text-sm text-gray-500">{dayName}</div>
                                          <div className={`text-lg font-semibold ${
                                            isToday ? 'text-blue-600' : 'text-gray-900'
                                          }`}>
                                            {dayNumber}
                                          </div>
                                        </div>
                                        {isToday && (
                                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                                            Today
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2">
                                        {(slots as any[]).map((slot) => {
                                          const { time } = formatDateTime(slot.start_time);
                                          return (
                                            <div 
                                              key={slot.id} 
                                              className={`p-2 rounded text-sm flex items-center justify-between ${
                                                slot.is_booked 
                                                  ? 'bg-red-100 text-red-800' 
                                                  : 'bg-green-100 text-green-800'
                                              }`}
                                            >
                                              <span className="font-medium">{time}</span>
                                              {getStatusBadge(slot.is_booked)}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!selectedTutor && tutors.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tutor</h3>
              <p className="text-gray-600">Choose a tutor from the dropdown above to manage their availability and bookings</p>
            </CardContent>
          </Card>
        )}

        {tutorsLoading && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading tutors...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TutorAdmin; 