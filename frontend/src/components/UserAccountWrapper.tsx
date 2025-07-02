import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStudents } from '@/lib/api';
import UserAccountModal from './UserAccountModal';

interface UserAccountWrapperProps {
  children: React.ReactNode;
}

const UserAccountWrapper: React.FC<UserAccountWrapperProps> = ({ children }) => {
  const { currentUser, setCurrentUser, isLoading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const { data: studentsData, refetch: refetchStudents } = useStudents();

  useEffect(() => {
    // For demo purposes, automatically set a demo user
    if (!isLoading && !currentUser) {
      setCurrentUser({
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@tutorhub.com'
      });
    }
  }, [currentUser, isLoading, setCurrentUser]);

  const handleUserCreated = async (userId: string) => {
    // Refetch students to get the newly created user
    await refetchStudents();
    
    // Find the created user in the students list
    const createdUser = studentsData?.students.find(student => student.id === userId);
    
    if (createdUser) {
      setCurrentUser({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
      });
    } else {
      // Fallback if we can't find the user immediately
      setCurrentUser({
        id: userId,
        name: 'New User',
        email: 'user@example.com'
      });
    }
    
    setShowModal(false);
  };

  const handleCloseModal = () => {
    // Don't allow closing the modal if no user exists
    if (!currentUser) {
      return;
    }
    setShowModal(false);
  };

  // Show loading state while checking for user
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show modal if no user exists
  if (!currentUser) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TutorHub</h1>
            <p className="text-xl text-gray-600 mb-8">Create your account to get started</p>
          </div>
        </div>
        <UserAccountModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onUserCreated={handleUserCreated}
        />
      </>
    );
  }

  // Show the app content when user exists
  return <>{children}</>;
};

export default UserAccountWrapper; 