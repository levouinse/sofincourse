-- Seed dummy data for testing dashboard
-- Run this in Supabase SQL Editor AFTER running supabase-add-firebase-uid.sql

-- Insert test user (if not exists)
INSERT INTO users (id, email, name, firebase_uid, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'test@example.com', 'Test User', 'test-firebase-uid-1', 'user', NOW() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'admin@example.com', 'Admin User', 'test-firebase-uid-2', 'admin', NOW() - INTERVAL '20 days'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'student@example.com', 'Student', 'test-firebase-uid-3', 'user', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Insert test courses (if not exists)
INSERT INTO courses (id, slug, title, description, category, published, order_index, created_at)
VALUES
  ('10000000-0000-0000-0000-000000000001'::uuid, 'test-python', 'Python Basics', 'Learn Python programming', 'coding', true, 1, NOW() - INTERVAL '25 days'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'test-security', 'Security Fundamentals', 'Learn cybersecurity', 'security', true, 2, NOW() - INTERVAL '20 days'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'test-javascript', 'JavaScript Basics', 'Learn JavaScript', 'coding', true, 3, NOW() - INTERVAL '15 days')
ON CONFLICT (slug) DO NOTHING;

-- Insert test lessons
INSERT INTO lessons (id, course_id, slug, title, content_markdown, order_index, created_at)
VALUES
  ('20000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, 'lesson-1', 'Python Intro', '# Python Introduction\n\nWelcome to Python!', 1, NOW() - INTERVAL '25 days'),
  ('20000000-0000-0000-0000-000000000002'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, 'lesson-2', 'Variables', '# Variables in Python', 2, NOW() - INTERVAL '24 days'),
  ('20000000-0000-0000-0000-000000000003'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, 'lesson-1', 'Security Basics', '# Security Fundamentals', 1, NOW() - INTERVAL '20 days'),
  ('20000000-0000-0000-0000-000000000004'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, 'lesson-1', 'JS Intro', '# JavaScript Introduction', 1, NOW() - INTERVAL '15 days')
ON CONFLICT (course_id, slug) DO NOTHING;

-- Insert test progress
INSERT INTO user_lesson_progress (user_id, lesson_id, course_id, completed, last_accessed)
VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, true, NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000002'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, true, NOW() - INTERVAL '4 days'),
  ('00000000-0000-0000-0000-000000000003'::uuid, '20000000-0000-0000-0000-000000000003'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, true, NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Insert test completions
INSERT INTO course_completions (user_id, course_id, completed_at)
VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000003'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'Progress', COUNT(*) FROM user_lesson_progress
UNION ALL
SELECT 'Completions', COUNT(*) FROM course_completions;
