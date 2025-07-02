import { Link } from 'react-router-dom';
import { Users, Calendar, BookOpen, Plus } from 'lucide-react';
import { useTutors } from '../lib/api';

export default function HomePage() {
  const { data: tutorsData, isLoading } = useTutors();
  const tutorCount = tutorsData?.tutors.length || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Allakando
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect students with qualified tutors for personalized learning experiences
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tutors</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : tutorCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Sessions</p>
              <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/tutors"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium text-gray-900">View Tutors</span>
          </Link>

          <Link
            to="/students"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Users className="h-5 w-5 text-green-600 mr-3" />
            <span className="font-medium text-gray-900">Manage Students</span>
          </Link>

          <Link
            to="/bookings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <Calendar className="h-5 w-5 text-purple-600 mr-3" />
            <span className="font-medium text-gray-900">View Bookings</span>
          </Link>

          <Link
            to="/tutors"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <Plus className="h-5 w-5 text-orange-600 mr-3" />
            <span className="font-medium text-gray-900">Add Tutor</span>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">For Tutors</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Create your profile and set availability</li>
            <li>• Manage your tutoring sessions</li>
            <li>• Track your bookings and earnings</li>
            <li>• Connect with students easily</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">For Students</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Find qualified tutors in your area</li>
            <li>• Book sessions at your convenience</li>
            <li>• Track your learning progress</li>
            <li>• Manage your bookings</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 