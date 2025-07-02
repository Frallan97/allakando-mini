import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, BookOpen, ChevronRight, Award, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTutors } from '@/lib/api';
import UserMenu from '@/components/UserMenu';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HomePage = () => {
  const { data: tutorsData, isLoading } = useTutors();
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });

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
    { icon: Users, label: 'Expert Tutors', value: tutorsData?.tutors.length ? `${tutorsData.tutors.length}+` : '50+' },
    { icon: BookOpen, label: 'Subjects Covered', value: '25+' },
    { icon: Calendar, label: 'Sessions Completed', value: '5000+' },
    { icon: Star, label: 'Average Rating', value: '4.8' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "TutorHub helped me find the perfect coding mentor. My programming skills improved dramatically in just 3 months!",
      rating: 5,
      avatar: "SC"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "High School Student",
      content: "The math tutors here are incredible. I went from struggling with calculus to acing my exams. Highly recommended!",
      rating: 5,
      avatar: "MR"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "MBA Student",
      content: "Found an amazing economics tutor who made complex concepts so easy to understand. The booking system is super convenient.",
      rating: 5,
      avatar: "ET"
    }
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
              <Link to="/tutor-admin">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm">
                  Tutor Admin
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform -skew-y-6 scale-110"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Zap className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">Transform Your Learning Journey</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learning Partner
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with world-class tutors, book sessions instantly, and achieve your learning goals with 
              <span className="font-semibold text-gray-700"> personalized one-on-one instruction</span> that adapts to your pace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/tutors">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  Browse All Tutors
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg rounded-full transition-all duration-300">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                <span>Verified Tutors</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Top Rated</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-blue-500 mr-2" />
                <span>Instant Booking</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Students Worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who have transformed their learning journey</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:from-blue-200 group-hover:to-indigo-200">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-base text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how TutorHub has transformed learning experiences for students worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-lg font-bold text-blue-600">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Featured Tutors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from the best educators who are passionate about helping you succeed
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-3xl"></div>
                </div>
              ))}
            </div>
          ) : featuredTutors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">Great tutors are joining us soon!</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTutors.map((tutor, index) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 transform border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
                    <CardHeader className="pb-4 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-bl-3xl opacity-10"></div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-blue-600">
                            {tutor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-900 mb-1">{tutor.name}</CardTitle>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center mr-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(tutor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">{tutor.rating}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 font-medium">{tutor.experience} experience</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutor.subjects.slice(0, 2).map((subject) => (
                          <Badge key={subject} variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border-0 font-medium">
                            {subject}
                          </Badge>
                        ))}
                        {tutor.subjects.length > 2 && (
                          <Badge variant="outline" className="border-gray-300 text-gray-600">
                            +{tutor.subjects.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{tutor.availableSlots} slots available</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${tutor.hourlyRate}</div>
                          <div className="text-sm text-gray-500">per hour</div>
                        </div>
                      </div>
                      
                      <Link to={`/tutor/${tutor.id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                          View Profile & Book
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/tutors">
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                View All Tutors
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Start Your
              <span className="block">Learning Journey?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have already found their perfect tutor and are achieving their learning goals with personalized instruction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/tutors">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Get Started Today
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300">
                Learn More
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90">
              <div className="flex items-center justify-center">
                <Shield className="h-6 w-6 mr-3" />
                <span>100% Verified Tutors</span>
              </div>
              <div className="flex items-center justify-center">
                <Award className="h-6 w-6 mr-3" />
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center justify-center">
                <Zap className="h-6 w-6 mr-3" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
