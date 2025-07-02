import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCreateTutor } from '@/lib/api';

interface AddTutorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AddTutorDialog: React.FC<AddTutorDialogProps> = ({ isOpen, setIsOpen }) => {
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorEmail, setNewTutorEmail] = useState('');
  const [newTutorSubjects, setNewTutorSubjects] = useState('');
  const [newTutorAbout, setNewTutorAbout] = useState('');
  const [newTutorQualifications, setNewTutorQualifications] = useState('');
  const [newTutorHourlyRate, setNewTutorHourlyRate] = useState('45');
  const [newTutorRating, setNewTutorRating] = useState('4.8');
  const [newTutorExperience, setNewTutorExperience] = useState('3');

  const createTutorMutation = useCreateTutor();

  const handleAddTutor = async () => {
    if (!newTutorName || !newTutorEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTutorMutation.mutateAsync({
        name: newTutorName,
        email: newTutorEmail,
        subjects: newTutorSubjects.split(',').map(s => s.trim()).filter(Boolean),
        about: newTutorAbout,
        qualifications: newTutorQualifications.split(',').map(s => s.trim()).filter(Boolean),
        hourly_rate: parseFloat(newTutorHourlyRate),
        rating: parseFloat(newTutorRating),
        experience_years: parseInt(newTutorExperience)
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
      setIsOpen(false);
      
      toast.success('Tutor added successfully!');
    } catch (error) {
      toast.error('Failed to add tutor');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Tutor</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Tutor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tutorName">Name *</Label>
            <Input
              id="tutorName"
              value={newTutorName}
              onChange={(e) => setNewTutorName(e.target.value)}
              placeholder="Enter tutor name"
            />
          </div>
          <div>
            <Label htmlFor="tutorEmail">Email *</Label>
            <Input
              id="tutorEmail"
              type="email"
              value={newTutorEmail}
              onChange={(e) => setNewTutorEmail(e.target.value)}
              placeholder="Enter tutor email"
            />
          </div>
          <div>
            <Label htmlFor="tutorSubjects">Subjects (comma-separated)</Label>
            <Input
              id="tutorSubjects"
              value={newTutorSubjects}
              onChange={(e) => setNewTutorSubjects(e.target.value)}
              placeholder="Mathematics, Physics, Chemistry"
            />
          </div>
          <div>
            <Label htmlFor="tutorAbout">About</Label>
            <Textarea
              id="tutorAbout"
              value={newTutorAbout}
              onChange={(e) => setNewTutorAbout(e.target.value)}
              placeholder="Brief description about the tutor"
            />
          </div>
          <div>
            <Label htmlFor="tutorQualifications">Qualifications (comma-separated)</Label>
            <Input
              id="tutorQualifications"
              value={newTutorQualifications}
              onChange={(e) => setNewTutorQualifications(e.target.value)}
              placeholder="Master's in Mathematics, Teaching Certificate"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tutorRate">Hourly Rate ($)</Label>
              <Input
                id="tutorRate"
                type="number"
                value={newTutorHourlyRate}
                onChange={(e) => setNewTutorHourlyRate(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="tutorRating">Rating (1-5)</Label>
              <Input
                id="tutorRating"
                type="number"
                value={newTutorRating}
                onChange={(e) => setNewTutorRating(e.target.value)}
                min="1"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="tutorExperience">Experience (years)</Label>
              <Input
                id="tutorExperience"
                type="number"
                value={newTutorExperience}
                onChange={(e) => setNewTutorExperience(e.target.value)}
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTutor} disabled={createTutorMutation.isPending}>
              {createTutorMutation.isPending ? 'Adding...' : 'Add Tutor'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};