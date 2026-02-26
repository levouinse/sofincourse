# SofinCourse Platform 🎓

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)](https://firebase.google.com/)

Free course platform accessible via clearnet and darknet (Tor), featuring courses on languages, coding, and security.

![SofinCourse Platform](https://sofincourse.vercel.app/)

## ✨ Features

- 🌐 **Dual Access**: Clearnet with OAuth (Google/GitHub) + Darknet (Tor) read-only
- 📚 **Course Management**: Web-based admin panel for CRUD operations
- 🎥 **Hybrid Content**: Markdown files + video links (YouTube, Vimeo) + PDF support
- 🎯 **Skill Tree**: Prerequisites system with 3D visualization (coming soon)
- 📊 **Progress Tracking**: User progress saved in Supabase
- 👤 **Guest Mode**: First lesson free, login required for full access
- 📱 **Mobile Responsive**: Fully optimized for all devices
- 🔒 **Secure**: XSS prevention, SQL injection protection, rate limiting
- 🎨 **Modern UI**: GitHub dark theme with Tailwind CSS
- ⚡ **Fast**: Optimized with Next.js 14 App Router


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

The platform includes 5 courses with 7 real lessons:

1. **Introduction to Security** (2 lessons)
   - What is Cybersecurity?
   - Common Security Threats

2. **Python Basics** (2 lessons)
   - Introduction to Python
   - Variables and Data Types

3. **JavaScript Fundamentals** (1 lesson)
   - JavaScript Basics

4. **Web Security Essentials** (1 lesson)
   - Web Security Fundamentals (OWASP Top 10)

5. **Linux Basics** (1 lesson)
   - Linux Command Line Basics

## Features

- **Dual Access**: Clearnet with OAuth (Google/GitHub) + Darknet (Tor) read-only
- **Course Management**: Web-based admin panel for CRUD operations
- **Hybrid Content**: Markdown files + video links (YouTube, Vimeo) + PDF support
- **Skill Tree**: Prerequisites system with 3D visualization (coming soon)
- **Progress Tracking**: User progress saved in Supabase
- **Guest Mode**: First lesson free, login required for full access
- **Mobile Responsive**: Fully optimized for all devices
- **SEO Optimized**: Lighthouse score 100 across all metrics

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

## Development Roadmap

- [x] Task 1-7: Core platform (auth, courses, lessons)
- [x] Task 8-9: Admin panel (course/lesson management)
- [x] Task 10: Guest access with login gate
- [x] Task 11: PDF support
- [x] Task 12: Mobile responsive design
- [x] Task 13: SEO optimization (Lighthouse 100)
- [ ] Task 14: Prerequisites system
- [ ] Task 15: 3D skill tree with Three.js
- [ ] Task 16: Production Tor deployment
- [ ] Task 17: Testing & documentation

## Performance

- ✅ Lighthouse Score: 100/100 (Performance, Accessibility, Best Practices, SEO)
- ✅ Font optimization with display: swap
- ✅ Image optimization (AVIF, WebP)
- ✅ Compression enabled
- ✅ No lazy loading (skeleton loading instead)

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Frontend)
- Supabase (Backend)
- Firebase (Authentication)
- Docker + Tor (Hidden Service)

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

## 🗺️ Roadmap

See [CHANGELOG.md](./CHANGELOG.md) for version history and future plans:

- [ ] 3D Skill Tree visualization
- [ ] Prerequisites system
- [ ] User progress dashboard
- [ ] Course completion certificates
- [ ] Multi-language support
- [ ] Course search and filtering
- [ ] User comments and discussions
- [ ] Mobile apps

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

Made with 💚 by SofinCourse Team

