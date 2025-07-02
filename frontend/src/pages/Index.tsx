import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Search, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTutors } from '@/lib/api';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: tutorsData, isLoading } = useTutors();

  // Use real data from API instead of mock data
  const featuredTutors = tutorsData?.tutors.slice(0, 3).map(tutor => ({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    subjects: ['Mathematics', 'Physics'], // Default subjects since not in API
    rating: 4.8, // Default rating since not in API
    experience: '3 years', // Default experience since not in API
    hourlyRate: 45, // Default rate since not in API
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
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Tutor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with expert tutors, book sessions instantly, and achieve your learning goals with personalized one-on-one instruction.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for tutors, subjects, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
              />
            </div>
          </div>

          <Link to="/tutors">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              Browse All Tutors
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Tutors</h2>
            <p className="text-xl text-gray-600">Meet some of our top-rated tutors</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading tutors...</p>
            </div>
          ) : featuredTutors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No tutors available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTutors.map((tutor) => (
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

          <div className="text-center mt-12">
            <Link to="/tutors">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-full">
                View All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already found their perfect tutor and are achieving their learning goals.
          </p>
          <Link to="/tutors">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-xl">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
