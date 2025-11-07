# Virtual Lab: Computational Thinking ITB - Documentation

<div align="center">

![Virtual Lab ITB](https://img.shields.io/badge/ITB-Virtual_Lab-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**Interactive learning platform for ITB students to master computational thinking through hands-on challenges**

[🚀 Quick Start](#-quick-start) • [📖 Full Docs](#-documentation-index) • [🏗️ Architecture](./ARCHITECTURE.md) • [❓ FAQ](./FAQ.md)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Documentation Index](#-documentation-index)
- [Technology Stack](#-technology-stack)
- [Project Status](#-project-status)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**Virtual Lab: Computational Thinking ITB** is a web-based educational platform designed specifically for Institut Teknologi Bandung (ITB) students to learn and practice computational thinking concepts through interactive mini-challenges.

### Problem Statement

Traditional computational thinking courses often lack:
- Interactive practice environments
- Immediate feedback mechanisms
- Engaging learning experiences
- Progress tracking for students

### Solution

Virtual Lab ITB provides:
- ✅ **Interactive Challenges** - 10+ coding and logic challenges
- ✅ **Instant Feedback** - Real-time quiz evaluation with explanations
- ✅ **Progress Tracking** - Personal dashboard with achievements
- ✅ **ITB Integration** - Google OAuth restricted to @std.stei.itb.ac.id
- ✅ **Class Management** - Browse faculties and enroll in classes
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

---

## ✨ Key Features

### 🎓 Educational Features
- **10 Curated Challenges** across 5 categories
- **40+ Quiz Questions** with detailed explanations
- **Multiple Difficulty Levels** (Easy, Medium, Hard)
- **Progress Dashboard** with statistics and achievements
- **Real-time Score Calculation** and feedback

### 🔐 Authentication & Security
- **Google OAuth** integration
- **Email Restriction** (@std.stei.itb.ac.id only)
- **Row Level Security** (RLS) on database
- **Session Management** with Supabase Auth

### 🏫 Academic Integration
- **Faculty Browser** - 12 ITB faculties
- **Class Enrollment** - Join courses across departments
- **Instructor Showcase** - 85 faculty members featured
- **Multi-faculty Support** - STEI, FTI, SITH, and more

### 🎨 User Experience
- **Smooth Animations** - Motion (Framer Motion) powered
- **Semantic Design** - Clean, grid-based layouts
- **Responsive UI** - Mobile-first approach
- **Dark Mode Ready** - Accessible color schemes
- **Fast Performance** - Optimized with Vite

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js (v18 or higher)
node --version

# npm or yarn
npm --version
```

### Installation (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/virtual-lab-itb.git
cd virtual-lab-itb

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_GOOGLE_CLIENT_ID=your_google_client_id
# VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id

# 5. Start development server
npm run dev
```

🎉 **That's it!** Open `http://localhost:5173` in your browser.

### Next Steps

1. 📖 **[Setup Guide](./GETTING-STARTED.md)** - Complete setup instructions
2. 🗄️ **[Database Setup](../guidelines/03-SupabaseSetup.md)** - Configure Supabase
3. 🔐 **[OAuth Setup](../guidelines/04-GoogleOAuthSetup.md)** - Enable Google login
4. 🚀 **[Deployment](./DEPLOYMENT.md)** - Deploy to production

---

## 📖 Documentation Index

### 🎯 Getting Started
- **[Getting Started Guide](./GETTING-STARTED.md)** - Complete setup walkthrough
- **[Quick Reference](./QUICK-REFERENCE.md)** - Common commands and tips
- **[TL;DR](./TLDR.md)** - One-page overview

### 🏗️ Architecture & Design
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and data flow
- **[Database Schema](./database/)** - Tables, relationships, and RLS
- **[Component Structure](./components/)** - UI component documentation
- **[Design Decisions](./DESIGN-DECISIONS.md)** - Why we chose this architecture

### 🔐 Authentication & API
- **[Authentication Guide](./api/authentication.md)** - Supabase Auth setup
- **[API Reference](./api/)** - Database queries and helpers
- **[Security Guide](./SECURITY.md)** - RLS, OAuth, and best practices

### 💻 Development
- **[Development Workflow](./DEVELOPMENT.md)** - Local dev, testing, debugging
- **[Component Guide](./COMPONENT-GUIDE.md)** - Creating and styling components
- **[State Management](./STATE-MANAGEMENT.md)** - React state patterns used
- **[Styling Guide](./STYLING.md)** - Tailwind CSS conventions

### 🚀 Deployment & Maintenance
- **[Deployment Guide](./DEPLOYMENT.md)** - Vercel, Netlify, or custom
- **[Environment Variables](./ENVIRONMENT.md)** - Configuration management
- **[Troubleshooting](../guidelines/06-Troubleshooting.md)** - Common issues and fixes

### 📚 Additional Resources
- **[FAQ](./FAQ.md)** - Frequently asked questions
- **[Code Examples](./EXAMPLES.md)** - Common patterns and snippets
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Changelog](./CHANGELOG.md)** - Version history

---

## 🛠️ Technology Stack

### Frontend
- **[React 18.3](https://react.dev/)** - UI library
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Type safety
- **[Vite 6.0](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Styling
- **[Motion](https://motion.dev/)** - Animations (Framer Motion fork)

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Lucide Icons](https://lucide.dev/)** - Icon set
- **[Recharts](https://recharts.org/)** - Data visualization
- **[React Slick](https://react-slick.neostack.com/)** - Carousels

### Backend & Infrastructure
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Authentication (Google OAuth)
  - Row Level Security
  - Real-time subscriptions
- **[Vercel](https://vercel.com/)** - Hosting (recommended)

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (optional)
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing
- **[Vite](https://vitejs.dev/)** - Fast HMR

---

## 📊 Project Status

### ✅ Completed Features

- [x] Homepage with hero section and features
- [x] Challenge browsing with 10 challenges
- [x] Interactive quiz system (40+ questions)
- [x] Multi-choice questions with explanations
- [x] Score calculation and submission
- [x] User authentication (Google OAuth)
- [x] Student dashboard with progress tracking
- [x] Faculty browser (12 faculties)
- [x] Class enrollment system
- [x] Instructor carousel (85 instructors)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Motion animations
- [x] Database schema with RLS
- [x] Supabase integration
- [x] TypeScript type safety
- [x] Component library (shadcn/ui)

### 🚧 In Progress

- [ ] Deployment to production
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1)

### 🔮 Future Roadmap

**v1.1 - Enhanced Features**
- [ ] More challenges (target: 25+)
- [ ] Coding challenges with code editor
- [ ] Leaderboards
- [ ] Badges and achievements system
- [ ] Social features (sharing, comments)

**v1.2 - Instructor Features**
- [ ] Instructor dashboard
- [ ] Create custom challenges
- [ ] Student analytics
- [ ] Assignment management

**v2.0 - Advanced Platform**
- [ ] Live coding sessions
- [ ] Peer code review
- [ ] AI-powered hints
- [ ] Mobile app (React Native)

---

## 🏗️ Architecture Highlights

### MVP Architecture (Current)

```
┌─────────────────────────────────────┐
│         Frontend (React)             │
├─────────────────────────────────────┤
│ • Quiz content (mockData.ts)        │
│ • UI Components                     │
│ • State management                  │
└────────────┬────────────────────────┘
             │
             │ API Calls
             ↓
┌─────────────────────────────────────┐
│      Backend (Supabase)              │
├─────────────────────────────────────┤
│ • Authentication (Google OAuth)     │
│ • Database (PostgreSQL)             │
│ • Row Level Security (RLS)          │
│ • User progress tracking            │
└─────────────────────────────────────┘
```

**Design Decision:** Quiz content is stored in `mockData.ts` (frontend) for simplicity and speed. Database only tracks user progress. See [Architecture](./ARCHITECTURE.md) for details.

---

## 🤝 Contributing

We welcome contributions from ITB students and faculty!

### How to Contribute

1. **Report Bugs** - [Open an issue](https://github.com/your-username/virtual-lab-itb/issues)
2. **Suggest Features** - [Start a discussion](https://github.com/your-username/virtual-lab-itb/discussions)
3. **Submit PRs** - See [Contributing Guide](./CONTRIBUTING.md)
4. **Improve Docs** - Fix typos, add examples, clarify instructions

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/virtual-lab-itb.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git commit -m "Add: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

See [Development Workflow](./DEVELOPMENT.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

### Academic Use

This project is designed for educational purposes at ITB. Students and faculty are encouraged to:
- ✅ Use for learning and teaching
- ✅ Fork and modify for courses
- ✅ Reference in academic work
- ⚠️ Please provide attribution

---

## 📞 Support & Contact

### Get Help

- 📖 **[Documentation](./README.md)** - Start here
- ❓ **[FAQ](./FAQ.md)** - Common questions
- 🐛 **[Issues](https://github.com/your-username/virtual-lab-itb/issues)** - Report bugs
- 💬 **[Discussions](https://github.com/your-username/virtual-lab-itb/discussions)** - Ask questions

### Maintainers

- **Project Lead** - Your Name (@your-github)
- **Contributors** - [See all contributors](https://github.com/your-username/virtual-lab-itb/graphs/contributors)

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

## 🔗 Quick Links

### Documentation
- [Getting Started](./GETTING-STARTED.md)
- [Architecture](./ARCHITECTURE.md)
- [API Reference](./api/)
- [FAQ](./FAQ.md)

### External Resources
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project
- [GitHub Repository](https://github.com/your-username/virtual-lab-itb)
- [Live Demo](https://virtual-lab-itb.vercel.app)
- [Report Issue](https://github.com/your-username/virtual-lab-itb/issues)

---

<div align="center">

**Made with ❤️ for ITB Students**

[⬆ Back to Top](#virtual-lab-computational-thinking-itb---documentation)

</div>
