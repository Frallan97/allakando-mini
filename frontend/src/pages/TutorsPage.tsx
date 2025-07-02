import { useState } from 'react';
import { Plus, Calendar, Mail, User } from 'lucide-react';
import { useTutors, useCreateTutor, useAddAvailability, useTutorAvailability } from '../lib/api';
import { toast } from 'sonner';

export default function TutorsPage() {
  const [showAddTutor, setShowAddTutor] = useState(false);
  const [showAddAvailability, setShowAddAvailability] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [availabilityData, setAvailabilityData] = useState({ start_time: '', end_time: '' });

  const { data: tutorsData, isLoading, error } = useTutors();
  const createTutorMutation = useCreateTutor();
  const addAvailabilityMutation = useAddAvailability();

  const handleCreateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTutorMutation.mutateAsync(formData);
      setFormData({ name: '', email: '' });
      setShowAddTutor(false);
      toast.success('Tutor created successfully!');
    } catch (error) {
      toast.error('Failed to create tutor');
    }
  };

  const handleAddAvailability = async (tutorId: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAvailabilityMutation.mutateAsync({ tutorId, data: availabilityData });
      setAvailabilityData({ start_time: '', end_time: '' });
      setShowAddAvailability(null);
      toast.success('Availability added successfully!');
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading tutors: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tutors</h1>
        <button
          onClick={() => setShowAddTutor(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tutor
        </button>
      </div>

      {/* Add Tutor Modal */}
      {showAddTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Tutor</h2>
            <form onSubmit={handleCreateTutor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createTutorMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createTutorMutation.isPending ? 'Creating...' : 'Create Tutor'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTutor(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tutors List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading tutors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorsData?.tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm">{tutor.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowAddAvailability(tutor.id)}
                  className="w-full flex items-center justify-center px-3 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Availability
                </button>

                <TutorAvailability tutorId={tutor.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Availability Modal */}
      {showAddAvailability && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Availability</h2>
            <form onSubmit={(e) => handleAddAvailability(showAddAvailability, e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={availabilityData.start_time}
                  onChange={(e) => setAvailabilityData({ ...availabilityData, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={availabilityData.end_time}
                  onChange={(e) => setAvailabilityData({ ...availabilityData, end_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={addAvailabilityMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {addAvailabilityMutation.isPending ? 'Adding...' : 'Add Availability'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAvailability(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TutorAvailability({ tutorId }: { tutorId: string }) {
  const { data: availabilityData, isLoading } = useTutorAvailability(tutorId);
  const slots = availabilityData?.slots || [];

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading availability...</div>;
  }

  if (slots.length === 0) {
    return <div className="text-sm text-gray-500">No availability slots</div>;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Available Slots:</h4>
      <div className="space-y-1">
        {slots.slice(0, 3).map((slot) => (
          <div key={slot.id} className="text-xs text-gray-600">
            {new Date(slot.start_time).toLocaleDateString()} {new Date(slot.start_time).toLocaleTimeString()} - {new Date(slot.end_time).toLocaleTimeString()}
          </div>
        ))}
        {slots.length > 3 && (
          <div className="text-xs text-gray-500">+{slots.length - 3} more slots</div>
        )}
      </div>
    </div>
  );
} 