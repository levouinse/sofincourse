-- Additional indexes to prevent N+1 queries and optimize performance
-- Run this migration after supabase-schema-v2.sql

-- Index for course_completions join with courses (used in /api/admin/stats and /api/progress)
CREATE INDEX IF NOT EXISTS idx_course_completions_course_id ON course_completions(course_id);

-- Composite index for user_lesson_progress queries (used in /api/progress)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_lesson_progress(user_id, course_id);

-- Index for lessons slug lookup within a course
CREATE INDEX IF NOT EXISTS idx_lessons_course_slug ON lessons(course_id, slug);

-- Index for courses category filtering (used in /api/stats)
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category) WHERE published = true;

-- Index for user_lesson_progress completed status
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_lesson_progress(user_id, completed);

-- Analyze tables to update statistics for query planner
ANALYZE courses;
ANALYZE lessons;
ANALYZE users;
ANALYZE user_lesson_progress;
ANALYZE course_completions;
