import { useState } from 'react';
import { Plus, Calendar, User, Clock } from 'lucide-react';
import { useTutors, useCreateBooking, useStudentBookings } from '../lib/api';
import { toast } from 'sonner';

export default function BookingsPage() {
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([]);

  const { data: tutorsData, isLoading: tutorsLoading } = useTutors();
  const createBookingMutation = useCreateBooking();

  // Get all available slots from all tutors
  const allSlots = tutorsData?.tutors.flatMap(tutor => 
    tutor.availability_slots?.filter(slot => !slot.is_booked) || []
  ) || [];

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedSlotId) {
      toast.error('Please select both student and slot');
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        student_id: selectedStudentId,
        slot_id: selectedSlotId,
      });
      setSelectedStudentId('');
      setSelectedSlotId('');
      setShowAddBooking(false);
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  const handleAddStudent = () => {
    const name = prompt('Enter student name:');
    const email = prompt('Enter student email:');
    if (name && email) {
      const newStudent = { id: Date.now().toString(), name, email };
      setStudents([newStudent, ...students]);
      setSelectedStudentId(newStudent.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <button
          onClick={() => setShowAddBooking(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Booking
        </button>
      </div>

      {/* Create Booking Modal */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <div className="space-y-2">
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add new student
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a slot</option>
                  {allSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {new Date(slot.start_time).toLocaleDateString()} {new Date(slot.start_time).toLocaleTimeString()} - {new Date(slot.end_time).toLocaleTimeString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createBookingMutation.isPending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {createBookingMutation.isPending ? 'Creating...' : 'Create Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBooking(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-6">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">Create your first booking to get started</p>
            <button
              onClick={() => setShowAddBooking(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Booking
            </button>
          </div>
        ) : (
          students.map((student) => (
            <StudentBookings key={student.id} student={student} />
          ))
        )}
      </div>
    </div>
  );
}

function StudentBookings({ student }: { student: { id: string; name: string; email: string } }) {
  const { data: bookingsData, isLoading } = useStudentBookings(student.id);
  const bookings = bookingsData?.bookings || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-purple-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-sm text-gray-500">No bookings for this student</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.tutor.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(booking.start_time).toLocaleDateString()} {new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Booked: {new Date(booking.booked_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 