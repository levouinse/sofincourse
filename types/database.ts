export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface CoursePrerequisite {
  course_id: string;
  prerequisite_course_id: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content_markdown: string;
  video_url?: string;
  video_provider?: 'youtube' | 'vimeo' | 'other';
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  course_id: string;
  last_accessed: string;
  created_at: string;
}
