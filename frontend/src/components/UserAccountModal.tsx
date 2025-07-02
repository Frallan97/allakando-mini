import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateStudent } from '@/lib/api';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (userId: string) => void;
}

const UserAccountModal: React.FC<UserAccountModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const createStudentMutation = useCreateStudent();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsCreating(true);
    
    try {
      const student = await createStudentMutation.mutateAsync({
        name: name.trim(),
        email: email.trim()
      });
      
      toast.success('Account created successfully!');
      onUserCreated(student.id);
      setIsCreating(false);
      setName('');
      setEmail('');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Create Your Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Welcome to TutorHub!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create your account to start booking tutoring sessions and managing your learning journey.
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isCreating}
                className="h-12 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isCreating}
                className="h-12 text-base"
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isCreating}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isCreating ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAccountModal; 