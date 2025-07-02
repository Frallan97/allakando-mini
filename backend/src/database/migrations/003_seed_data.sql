-- Seed data migration
-- This migration adds sample data to populate the application

-- Insert sample tutors
INSERT INTO tutors (id, name, email, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alice Smith', 'alice@example.com', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Bob Johnson', 'bob@example.com', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Carol Davis', 'carol@example.com', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'David Wilson', 'david@example.com', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Emma Brown', 'emma@example.com', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Frank Miller', 'frank@example.com', NOW());

-- Insert sample students
INSERT INTO students (id, name, email, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Mike Wilson', 'mike@example.com', NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Sarah Johnson', 'sarah@example.com', NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Tom Davis', 'tom@example.com', NOW());

-- Insert sample availability slots for Alice Smith (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '15 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '16 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '11 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '16 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '17 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '9 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '10 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '14 hours', false, NOW());

-- Insert sample availability slots for Bob Johnson (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '11 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '15 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '16 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '11 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '15 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '16 hours', false, NOW());

-- Insert sample availability slots for Carol Davis (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '16 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '17 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '17 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '18 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '9 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '10 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '11 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '16 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '17 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '17 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '18 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '9 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '10 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440003', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '11 hours', false, NOW());

-- Insert sample availability slots for David Wilson (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '15 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440004', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '15 hours', false, NOW());

-- Insert sample availability slots for Emma Brown (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '14 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440005', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '13 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '14 hours', false, NOW());

-- Insert sample availability slots for Frank Miller (next few days)
INSERT INTO availability_slots (id, tutor_id, start_time, end_time, is_booked, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '1 day')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '2 days')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '3 days')::timestamp + INTERVAL '13 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '12 hours', false, NOW()),
('770e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440006', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '12 hours', (CURRENT_DATE + INTERVAL '4 days')::timestamp + INTERVAL '13 hours', false, NOW()); 