import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

interface NavbarProps {
  variant?: 'default' | 'admin';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const isAdmin = variant === 'admin';
  const icon = isAdmin ? Settings : BookOpen;
  const title = isAdmin ? 'Admin Panel' : 'TutorHub';
  const IconComponent = icon;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{title}</span>
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
  );
};

export default Navbar;