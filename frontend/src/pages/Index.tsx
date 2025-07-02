import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTutors } from '@/lib/api';
import UserMenu from '@/components/UserMenu';

const HomePage = () => {
  const { data: tutorsData, isLoading } = useTutors();

  // Use real data from API instead of mock data
  const featuredTutors = tutorsData?.tutors.slice(0, 3).map(tutor => ({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: tutor.subjects || ['Mathematics', 'Physics'],
    rating: tutor.rating || 4.8,
    experience: `${tutor.experience_years || 3} years`,
    hourlyRate: tutor.hourly_rate || 45,
    availableSlots: 8, // Default slots since not in API
    image: '/placeholder.svg'
  })) || [];

  const stats = [
    { icon: Users, label: 'Expert Tutors', value: tutorsData?.tutors.length ? `${tutorsData.tutors.length}+` : '0+' },
    { icon: BookOpen, label: 'Subjects Covered', value: '25+' },
    { icon: Calendar, label: 'Sessions Completed', value: '5000+' },
    { icon: Star, label: 'Average Rating', value: '4.8' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TutorHub</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/tutors">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm">
                  Find Tutors
                </Button>
              </Link>
              <Link to="/student-dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm">
                  My Bookings
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm">
                  Admin
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Tutor</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with expert tutors, book sessions instantly, and achieve your learning goals with personalized one-on-one instruction.
          </p>
          
          <Link to="/tutors">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 text-base rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              Browse All Tutors
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Tutors</h2>
            <p className="text-lg text-gray-600">Meet some of our top-rated tutors</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading tutors...</p>
            </div>
          ) : featuredTutors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tutors available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.map((tutor) => (
                <Card key={tutor.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {tutor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{tutor.name}</CardTitle>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{tutor.rating}</span>
                          <span className="text-xs text-gray-400 ml-2">{tutor.experience}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tutor.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">{tutor.availableSlots} slots available</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">${tutor.hourlyRate}</div>
                        <div className="text-xs text-gray-500">per hour</div>
                      </div>
                    </div>
                    <Link to={`/tutor/${tutor.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm">
                        View Profile & Book
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/tutors">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base rounded-full">
                View All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Learning?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
            Join thousands of students who have already found their perfect tutor and are achieving their learning goals.
          </p>
          <Link to="/tutors">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-base rounded-full shadow-xl">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
