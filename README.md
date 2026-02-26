# SofinCourse Platform 🎓

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)](https://firebase.google.com/)

Free course platform featuring courses on coding, security, and technology. Built with Next.js, Supabase, and Firebase.

**Live Demo:** [https://sofincourse.vercel.app/](https://sofincourse.vercel.app/)

## ✨ Features

- 🔐 **Authentication**: Firebase OAuth (Google & GitHub)
- 📚 **Course Management**: Admin panel for creating/editing courses and lessons
- 🎥 **Rich Content**: Markdown lessons with YouTube video embeds
- 📊 **Progress Tracking**: Real-time progress saved in Supabase database
- 👤 **Guest Mode**: First lesson free, login required for full access
- 📱 **Mobile Responsive**: Fully optimized for all devices
- 🔒 **Secure**: XSS prevention, SQL injection protection, rate limiting, RLS policies
- 🎨 **Modern UI**: Cyberpunk theme with Tailwind CSS v4
- ⚡ **Fast**: Next.js 16 App Router with React 19 Server Components
- 🎯 **SEO Optimized**: Sitemap, metadata, and structured data


## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) deployed on **Vercel**
- **Backend/Database**: **Supabase** (PostgreSQL)
- **Authentication**: **Firebase Auth** (Google & GitHub OAuth)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Markdown**: gray-matter, react-markdown, rehype-highlight
- **3D Graphics**: Three.js, React Three Fiber (coming soon)
- **Deployment**: Docker, Tor Hidden Service

## 📚 Course Content

The platform includes **5 courses** with **8 lessons**:

1. **Introduction to Security** (3 lessons)
   - What is Cybersecurity?
   - Common Security Threats
   - Network Security Fundamentals

2. **Python Basics** (2 lessons)
   - Introduction to Python
   - Variables and Data Types

3. **JavaScript Fundamentals** (1 lesson)
   - JavaScript Basics

4. **Web Security Essentials** (1 lesson)
   - Web Security Fundamentals (OWASP Top 10)

5. **Linux Basics** (1 lesson)
   - Linux Command Line Basics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (optional, for database features)
- Firebase account (optional, for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sofincourse.git
cd sofincourse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Supabase (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:
   ```sql
   -- Copy and paste content from supabase-schema.sql
   ```
3. Copy your project URL and API keys to `.env.local`

### 5. Setup Firebase (Optional)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication → Sign-in method → Google & GitHub
3. Add authorized domains (localhost, your-domain.com)
4. Copy your Firebase config to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Frontend)
- Supabase (Backend)
- Firebase (Authentication)

## Content Structure

Courses are stored as markdown files in `content/courses/`:

```
content/courses/
  intro-to-security/
    meta.json
    lessons/
      01-what-is-cybersecurity.md
      02-common-threats.md
      03-network-security.md
```

**meta.json** format:
```json
{
  "title": "Introduction to Security",
  "description": "Learn cybersecurity fundamentals",
  "category": "security",
  "thumbnail": "/courses/security.jpg",
  "order": 1
}
```

**Lesson markdown** frontmatter:
```yaml
---
title: "What is Cybersecurity?"
order: 1
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
videoProvider: "youtube"
pdfUrl: "https://example.com/material.pdf"
contentType: "mixed"
---
```

## Admin Panel

Access at `/admin` (requires authentication with admin role)

- **Courses**: Create, edit, delete courses
- **Lessons**: Manage video links, PDFs, and markdown content
- **Users**: View registered users and their progress
- **Analytics**: Dashboard with charts and statistics

## Project Structure

```
app/
  admin/              # Admin panel pages
  api/                # API routes (auth, progress, stats)
  auth/callback/      # OAuth callback
  courses/            # Course pages
  skill-tree/         # 3D skill tree
  login/              # Login page
  profile/            # User profile
components/           # React components
  Navbar.tsx          # Responsive navigation
  LoginModal.tsx      # Login modal
  Skeletons.tsx       # Loading states
content/courses/      # Markdown course content
lib/
  supabase/           # Supabase clients
  content.ts          # Content utilities
data/
  progress.json       # User progress (JSON fallback)
  users.json          # User data (JSON fallback)
types/                # TypeScript types
```

## Features Breakdown

### 🔐 Authentication
- Firebase Google OAuth
- Email/Password login
- Guest mode (first lesson free)
- Protected routes

### 📚 Course System
- Markdown-based content
- Video embedding (YouTube, Vimeo)
- PDF viewer integration
- Progress tracking
- Course completion badges

### 🎨 UI/UX
- Cyberpunk theme (dark mode)
- Neon green accents (#9bff00)
- Skeleton loading states
- Mobile-first responsive design
- Smooth animations

### 📊 Analytics
- Real-time stats (courses, lessons, students)
- User progress tracking
- Course completion rates

### ♿ Accessibility
- ARIA labels
- Keyboard navigation
- Semantic HTML
- High contrast colors
- Screen reader friendly

## 🗺️ Roadmap

### ✅ Completed
- Core platform (auth, courses, lessons)
- Admin panel (course/lesson management)
- Guest access with login gate
- Mobile responsive design
- SEO optimization
- Progress tracking with real-time updates
- Security measures (XSS, SQL injection, rate limiting)

### 🚧 In Progress
- Performance optimization
- Additional course content

### 📋 Planned
- Prerequisites system for course progression
- 3D skill tree visualization with Three.js
- Course completion certificates
- User dashboard with statistics
- Course search and filtering
- Multi-language support

## Performance

- ✅ Lighthouse Score: 100/100 (Performance, Accessibility, Best Practices, SEO)
- ✅ Font optimization with display: swap
- ✅ Image optimization (AVIF, WebP)
- ✅ Compression enabled
- ✅ No lazy loading (skeleton loading instead)

## 📦 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   Go to Project Settings → Environment Variables and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ADMIN_SECRET_KEY=your_secret_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Database Setup (Supabase)

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the migration from `supabase-schema-v2.sql`
4. Copy your project URL and keys to environment variables

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- How to contribute
- Code style guidelines
- Adding new courses
- Development setup

## 🔒 Security

Security is a top priority. See [SECURITY.md](./SECURITY.md) for:
- Reporting vulnerabilities
- Security measures implemented
- Best practices for contributors

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Firebase](https://firebase.google.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- All contributors and course creators

## 📧 Contact

- GitHub Issues: [Report a bug](https://github.com/YOUR_USERNAME/sofincourse/issues)
- Discussions: [Ask a question](https://github.com/YOUR_USERNAME/sofincourse/discussions)
- Email: contact@sofincourse.com

## 🔒 Security

This project implements multiple security measures:

- **Authentication**: Firebase JWT token verification
- **Authorization**: Role-based access control (RBAC)
- **Database**: Row Level Security (RLS) policies on all tables
- **Input Validation**: Zod schemas for all user inputs
- **XSS Prevention**: DOMPurify sanitization
- **SQL Injection**: Parameterized queries
- **Rate Limiting**: IP-based rate limiting on API routes
- **HTTPS**: Enforced on all connections (Vercel default)

For security issues, please email: security@sofincourse.com

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Firebase](https://firebase.google.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting

## ⭐ Support

If you find this project useful, please consider:
- Giving it a star ⭐
- Contributing to the codebase
- Sharing with others
- Reporting bugs

---

**Made with 💚 by SofinCourse Team**

