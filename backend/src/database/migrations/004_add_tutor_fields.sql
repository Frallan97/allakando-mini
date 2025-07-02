-- Add additional fields to tutors table
-- Migration: 004_add_tutor_fields.sql

-- Add new columns to tutors table
ALTER TABLE tutors 
ADD COLUMN IF NOT EXISTS subjects TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS qualifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 45.00,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 4.8,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 3;

-- Update existing tutors with detailed information
UPDATE tutors SET 
  subjects = ARRAY['Mathematics', 'Physics'],
  about = 'Experienced math and physics tutor with a passion for helping students excel in STEM subjects. I hold a Master''s degree in Applied Mathematics and have been teaching for over 5 years. My approach focuses on building strong fundamentals while making learning engaging and fun.',
  qualifications = ARRAY['Master''s in Applied Mathematics', '5+ years teaching experience', '127 positive student reviews', 'Specialized in exam preparation'],
  hourly_rate = 45.00,
  rating = 4.9,
  experience_years = 5
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE tutors SET 
  subjects = ARRAY['English', 'Literature'],
  about = 'Passionate English tutor with expertise in literature analysis and creative writing. I have a Bachelor''s degree in English Literature and 3 years of teaching experience. I help students develop critical thinking skills and improve their writing abilities.',
  qualifications = ARRAY['Bachelor''s in English Literature', '3+ years teaching experience', '89 positive student reviews', 'Creative writing specialist'],
  hourly_rate = 40.00,
  rating = 4.7,
  experience_years = 3
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE tutors SET 
  subjects = ARRAY['Chemistry', 'Biology'],
  about = 'Dedicated science tutor specializing in chemistry and biology. With a PhD in Biochemistry and 7 years of teaching experience, I make complex scientific concepts accessible and engaging for students of all levels.',
  qualifications = ARRAY['PhD in Biochemistry', '7+ years teaching experience', '156 positive student reviews', 'Research experience in molecular biology'],
  hourly_rate = 55.00,
  rating = 4.8,
  experience_years = 7
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE tutors SET 
  subjects = ARRAY['Computer Science', 'Programming'],
  about = 'Experienced software engineer and programming tutor. I have a Master''s degree in Computer Science and 4 years of industry experience. I teach programming fundamentals, algorithms, and help students build real-world projects.',
  qualifications = ARRAY['Master''s in Computer Science', '4+ years industry experience', '203 positive student reviews', 'Full-stack development expertise'],
  hourly_rate = 50.00,
  rating = 4.9,
  experience_years = 4
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE tutors SET 
  subjects = ARRAY['Spanish', 'French'],
  about = 'Bilingual language tutor with native fluency in Spanish and French. I have a degree in Modern Languages and 6 years of teaching experience. I focus on conversational skills, grammar, and cultural understanding.',
  qualifications = ARRAY['Bachelor''s in Modern Languages', '6+ years teaching experience', '134 positive student reviews', 'Native Spanish and French speaker'],
  hourly_rate = 42.00,
  rating = 4.6,
  experience_years = 6
WHERE id = '550e8400-e29b-41d4-a716-446655440005';

UPDATE tutors SET 
  subjects = ARRAY['History', 'Social Studies'],
  about = 'History enthusiast and social studies tutor with a deep passion for making the past come alive. I hold a Master''s degree in History and have 8 years of teaching experience. I help students develop analytical thinking and research skills.',
  qualifications = ARRAY['Master''s in History', '8+ years teaching experience', '178 positive student reviews', 'Specialized in American and European history'],
  hourly_rate = 48.00,
  rating = 4.7,
  experience_years = 8
WHERE id = '550e8400-e29b-41d4-a716-446655440006'; 