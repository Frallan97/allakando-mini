import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  hourlyRate: number;
  availableSlots: number;
  description: string;
  experience: string;
}

interface TutorCardProps {
  tutor: Tutor;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {getInitials(tutor.name)}
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
        <p className="text-gray-600 mb-4 line-clamp-2">{tutor.description}</p>
        
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
  );
};