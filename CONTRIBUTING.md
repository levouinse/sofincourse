# Contributing to SofinCourse

Thank you for your interest in contributing to SofinCourse! 🎉

## How to Contribute

### 1. Fork the Repository
Click the "Fork" button at the top right of this page.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/sofincourse.git
cd sofincourse
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes
- Follow the existing code style
- Write clear commit messages
- Test your changes locally

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request
Go to the original repository and click "New Pull Request"

## Contribution Ideas

### 📚 Content Contributions
- Add new courses (markdown files in `content/courses/`)
- Improve existing lessons
- Add video links
- Translate content to other languages

### 💻 Code Contributions
- Fix bugs
- Add new features
- Improve UI/UX
- Optimize performance
- Add tests

### 🎨 Design Contributions
- Improve styling
- Create course thumbnails
- Design icons
- Enhance mobile experience

### 📖 Documentation
- Improve README
- Add code comments
- Write tutorials
- Create video guides

## Code Style Guidelines

### TypeScript/React
- Use TypeScript for all new files
- Use functional components with hooks
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling

### Naming Conventions
- Components: PascalCase (`CourseCard.tsx`)
- Files: kebab-case (`course-utils.ts`)
- Variables: camelCase (`courseData`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Adding New Courses

1. Create a new folder in `content/courses/`:
```
content/courses/your-course-name/
  meta.json
  lessons/
    01-lesson-one.md
    02-lesson-two.md
```

2. Create `meta.json`:
```json
{
  "title": "Your Course Title",
  "description": "Course description",
  "category": "coding|security|language",
  "thumbnail": "/courses/your-course.jpg",
  "order": 1
}
```

3. Create lesson markdown files:
```markdown
---
title: "Lesson Title"
order: 1
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
videoProvider: "youtube"
contentType: "mixed"
---

# Lesson Content

Your markdown content here...
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Setup Supabase (optional):
- Create project at [supabase.com](https://supabase.com)
- Run `supabase-schema.sql`
- Add credentials to `.env.local`

4. Setup Firebase (optional):
- Create project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Google Authentication
- Add credentials to `.env.local`

5. Run development server:
```bash
npm run dev
```

## Testing

Before submitting a PR:
- Test your changes locally
- Check for TypeScript errors: `npm run build`
- Ensure all pages load correctly
- Test on mobile devices

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Join our community (coming soon)

## Code of Conduct

- Be respectful and inclusive
- Help others learn
- Give constructive feedback
- Follow the project's goals

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making SofinCourse better! 💚
