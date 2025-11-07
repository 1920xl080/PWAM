# Virtual Lab: Computational Thinking ITB

<div align="center">

![Virtual Lab ITB](https://img.shields.io/badge/ITB-Virtual_Lab-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**Interactive learning platform for ITB students to master computational thinking through hands-on challenges**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](./docs/INDEX.md) • [🏗️ Architecture](./docs/reference/ARCHITECTURE.md) • [❓ FAQ](./docs/actual-documentation/FAQ.md)

</div>

---

## 🎯 About the Project

**Virtual Lab: Computational Thinking ITB** is a modern web-based educational platform designed specifically for Institut Teknologi Bandung (ITB) students to learn and practice computational thinking concepts through interactive mini-challenges and quizzes.

### The Problem

Traditional computational thinking courses often lack:
- **Interactive practice environments** - Students need hands-on experience
- **Immediate feedback mechanisms** - Learning requires instant validation
- **Engaging learning experiences** - Motivation comes from gamification
- **Progress tracking** - Students want to see their improvement over time

### Our Solution

Virtual Lab ITB provides a comprehensive learning platform that combines:
- 🎓 **Interactive Challenges** - 10+ curated challenges across multiple difficulty levels
- ⚡ **Instant Feedback** - Real-time quiz evaluation with detailed explanations
- 📊 **Progress Dashboard** - Track achievements, scores, and completion rates
- 🔐 **Secure Authentication** - Google OAuth restricted to ITB student emails
- 🏫 **Academic Integration** - Browse 12 ITB faculties and enroll in classes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Key Features

### Educational Features
- **10+ Interactive Challenges** across 5 categories
- **40+ Quiz Questions** with detailed explanations and feedback
- **Multiple Difficulty Levels** - Easy, Medium, and Hard challenges
- **Progress Tracking** - Personal dashboard with statistics and achievements
- **Real-time Score Calculation** - Immediate feedback after each quiz
- **Category-based Learning** - Organized challenges by topic

### Authentication & Security
- **Google OAuth Integration** - One-click login with Google accounts
- **Email Domain Restriction** - Only @std.stei.itb.ac.id emails allowed
- **Row Level Security (RLS)** - Database-level security for user data
- **Session Management** - Secure session handling with Supabase Auth
- **Data Privacy** - Users can only access their own progress data

### Academic Integration
- **12 ITB Faculties** - Browse all major faculties at ITB
- **Class Enrollment System** - Join courses across different departments
- **85+ Faculty Members** - Instructor showcase with profiles
- **Multi-faculty Support** - STEI, FTI, SITH, and more
- **Course Management** - Organize challenges by course and faculty

### User Experience
- **Smooth Animations** - Motion (Framer Motion) powered transitions
- **Modern UI Design** - Clean, grid-based layouts with shadcn/ui components
- **Responsive Design** - Mobile-first approach, works on all devices
- **Fast Performance** - Optimized builds with Vite
- **Accessible** - Semantic HTML and ARIA labels for screen readers

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript 5** - Type-safe development
- **Vite** - Fast build tool with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing

### UI Components
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful icon library
- **Radix UI** - Unstyled, accessible component primitives

### Backend & Infrastructure
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication (Google OAuth)
  - Row Level Security (RLS)
  - Real-time subscriptions
- **Vercel** - Hosting and deployment platform

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier is sufficient)
- **Google Cloud Console** account (for OAuth)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd PWAM

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example if available)
# Add your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id

# 4. Start development server
npm run dev
```

🎉 **That's it!** Open `http://localhost:5173` in your browser.

### Next Steps

1. 📖 **[TL;DR Guide](./TLDR.md)** - Quick 5-minute overview
2. 🗄️ **[Database Setup](./docs/reference/BACKEND-SETUP-STATUS.md)** - Configure Supabase backend
3. 🔐 **[OAuth Setup](./docs/)** - Enable Google authentication
4. 🚀 **[Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Deploy to production

---

## 📊 Project Status

### ✅ Completed

- [x] Complete frontend with all pages and components
- [x] Interactive quiz system with 40+ questions
- [x] Challenge browsing and filtering
- [x] User authentication (Google OAuth)
- [x] Student dashboard with progress tracking
- [x] Faculty browser with 12 ITB faculties
- [x] Class enrollment system
- [x] Responsive design (mobile, tablet, desktop)
- [x] Smooth animations and transitions
- [x] TypeScript type safety
- [x] Component library integration

### 🚧 Setup Required

- [ ] Supabase database configuration
- [ ] Google OAuth setup
- [ ] Row Level Security policies
- [ ] Environment variables configuration
- [ ] Production deployment

### 🔮 Future Features

- [ ] More challenges (target: 25+)
- [ ] Coding challenges with code editor
- [ ] Leaderboards and rankings
- [ ] Badges and achievements system
- [ ] Instructor dashboard
- [ ] AI-powered hints and suggestions

---

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

### Quick Links
- **[Documentation Index](./docs/INDEX.md)** - Complete documentation hub
- **[TL;DR](./TLDR.md)** - 5-minute quick start guide
- **[Architecture](./docs/reference/ARCHITECTURE.md)** - System design and architecture
- **[Security Guide](./docs/reference/SECURITY-GUIDE.md)** - Security best practices
- **[FAQ](./docs/actual-documentation/FAQ.md)** - Frequently asked questions

### Documentation Structure
```
docs/
├── actual-documentation/    # Main project documentation
│   ├── README.md            # Detailed project overview
│   ├── ARCHITECTURE.md      # System architecture
│   └── FAQ.md               # Frequently asked questions
├── reference/               # Reference documentation
│   ├── ARCHITECTURE.md      # Technical architecture
│   ├── SECURITY-GUIDE.md    # Security considerations
│   └── BACKEND-SETUP-STATUS.md  # Backend setup guide
└── INDEX.md                 # Documentation index
```

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────┐
│         Frontend (React)             │
├─────────────────────────────────────┤
│ • Quiz content (mockData.ts)        │
│ • UI Components (components/)       │
│ • State Management (Context API)    │
│ • Routing (React Router)            │
└────────────┬────────────────────────┘
             │
             │ HTTPS API Calls
             ↓
┌─────────────────────────────────────┐
│      Backend (Supabase)              │
├─────────────────────────────────────┤
│ • Authentication (Google OAuth)     │
│ • Database (PostgreSQL)             │
│ • Row Level Security (RLS)          │
│ • User progress tracking            │
│ • Session management                │
└─────────────────────────────────────┘
```

### Design Decisions

- **Static Quiz Content**: Quiz questions are stored in `data/mockData.ts` for simplicity and fast loading
- **Dynamic User Data**: User progress and submissions are stored in Supabase database
- **Component-based Architecture**: Reusable UI components using shadcn/ui
- **Type Safety**: Full TypeScript coverage for better development experience
- **Security First**: Row Level Security ensures users can only access their own data

---

## 🤝 Contributing

We welcome contributions from ITB students and faculty!

### How to Contribute

1. **Report Bugs** - Open an issue with detailed description
2. **Suggest Features** - Share your ideas for improvement
3. **Submit Pull Requests** - Follow the existing code style
4. **Improve Documentation** - Help make the docs better

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Maintain responsive design
- Test on multiple devices
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License**.

### Academic Use

This project is designed for educational purposes at ITB. Students and faculty are encouraged to:
- ✅ Use for learning and teaching
- ✅ Fork and modify for courses
- ✅ Reference in academic work
- ⚠️ Please provide attribution

---

## 📞 Support & Contact

### Get Help

- 📖 **[Documentation](./docs/INDEX.md)** - Start here for detailed guides
- ❓ **[FAQ](./docs/actual-documentation/FAQ.md)** - Common questions answered
- 🐛 **Issues** - Report bugs or request features
- 💬 **Discussions** - Ask questions and share ideas

### ITB Resources

- **STEI Website** - [stei.itb.ac.id](https://stei.itb.ac.id)
- **ITB Student Portal** - [studentportal.itb.ac.id](https://studentportal.itb.ac.id)

---

## 🙏 Acknowledgments

Special thanks to:
- **Institut Teknologi Bandung** - For providing the educational context
- **STEI Faculty** - For computational thinking curriculum guidance
- **Open Source Community** - React, Supabase, shadcn/ui, and all dependencies
- **ITB Students** - For feedback and testing

---

<div align="center">

**Made with ❤️ for ITB Students**

[⬆ Back to Top](#virtual-lab-computational-thinking-itb)

</div>
