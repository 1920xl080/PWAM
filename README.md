# Virtual Lab: Computational Thinking ITB

<div align="center">

![Virtual Lab ITB](https://img.shields.io/badge/ITB-Virtual_Lab-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**Interactive learning platform for ITB students to master computational thinking through hands-on challenges**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](./docs/INDEX.md) • [🏗️ Architecture](./docs/reference/ARCHITECTURE.md) • [❓ FAQ](./docs/actual-documentation/FAQ.md)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Project Status](#-project-status)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

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

Virtual Lab ITB provides an immersive, hands-on learning experience where students can:
- Practice computational thinking through interactive challenges
- Receive instant feedback on their solutions
- Track their progress and achievements
- Access course materials and exercises
- Collaborate within their classes

---

## ✨ Key Features

### 🎓 Interactive Learning
- **10+ Coding Challenges** - Diverse exercises covering fundamental computational thinking concepts
- **Real-time Feedback** - Instant evaluation with detailed explanations
- **Difficulty Levels** - Challenges ranging from Easy to Hard
- **Exercise Details** - Comprehensive problem descriptions and examples

### 📊 Progress Tracking
- **Personal Dashboard** - Track completed challenges, scores, and achievements
- **Score History** - View past performance and improvement over time
- **Achievement System** - Unlock badges and milestones as you progress

### 🔐 Secure Authentication
- **Google OAuth Integration** - Seamless login with Google accounts
- **ITB Email Restriction** - Access limited to `@std.stei.itb.ac.id` email domain
- **Role-based Access** - Support for both students and lecturers

### 🏫 Class Management
- **Faculty Browsing** - Explore different faculties and departments
- **Class Enrollment** - Join classes and access course-specific content
- **Organized Learning** - Structured curriculum and exercise organization

### 📱 Modern User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Polished UI with Framer Motion animations
- **Modern UI Components** - Built with shadcn/ui and Tailwind CSS
- **Accessibility** - Designed with accessibility best practices

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **shadcn/ui** - High-quality component library
- **Lucide React** - Icon library

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, API)
- **Google OAuth** - Authentication provider
- **Row Level Security (RLS)** - Database security policies

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

---

## 📁 Project Structure

```
PWAM/
├── components/          # React UI components
│   ├── HomePage.tsx    # Landing page
│   ├── ChallengePage.tsx # Challenge listing
│   ├── ExerciseDetailPage.tsx # Individual exercise view
│   ├── DashboardPage.tsx # User dashboard
│   ├── AuthPage.tsx    # Authentication page
│   ├── Navigation.tsx  # Navigation component
│   └── ui/             # Reusable UI components
├── data/               # Mock data (for development)
│   └── mockData.ts
├── lib/                # Utility libraries
│   └── supabase.ts    # Supabase client configuration
├── styles/             # Global styles
│   └── globals.css
├── assets/             # Static assets
│   └── ITB_logo.svg
├── docs/               # Comprehensive documentation
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── package.json        # Dependencies and scripts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (for backend setup)
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PWAM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Backend Setup

⚠️ **Important**: The frontend is complete, but the backend needs to be configured before production use.

For detailed backend setup instructions, see:
- [TLDR.md](./TLDR.md) - Quick overview
- [Backend Setup Guide](./docs/reference/BACKEND-SETUP-STATUS.md) - Detailed instructions
- [Security Guide](./docs/reference/SECURITY-GUIDE.md) - Security configuration

**Quick Setup Checklist:**
1. Create Supabase project
2. Set up database schema
3. Enable Row Level Security (RLS)
4. Configure Google OAuth
5. Add email validation
6. Test security measures

---

## 📊 Project Status

### ✅ Completed
- [x] Frontend UI/UX (100%)
- [x] Component architecture
- [x] Routing and navigation
- [x] Responsive design
- [x] Animation system
- [x] Mock data integration
- [x] TypeScript type definitions

### ⚠️ In Progress / Needs Setup
- [ ] Supabase backend configuration
- [ ] Database schema implementation
- [ ] Row Level Security policies
- [ ] Google OAuth integration
- [ ] Production deployment
- [ ] Security hardening

### 📝 Documentation
- [x] Project documentation
- [x] Architecture diagrams
- [x] Setup guides
- [x] Security guidelines
- [x] API documentation templates

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[TLDR.md](./TLDR.md)** - 5-minute quick start guide
- **[Documentation Index](./docs/INDEX.md)** - Complete documentation hub
- **[Architecture](./docs/reference/ARCHITECTURE.md)** - System architecture
- **[Getting Started](./docs/actual-documentation/GETTING-STARTED.md)** - Detailed setup guide
- **[FAQ](./docs/actual-documentation/FAQ.md)** - Frequently asked questions
- **[Security Guide](./docs/reference/SECURITY-GUIDE.md)** - Security best practices

---

## 🎓 For ITB Students & Instructors

This platform is designed specifically for the ITB Computational Thinking course. Key features:

- **Restricted Access** - Only ITB students with `@std.stei.itb.ac.id` emails can access
- **Course Integration** - Supports class enrollment and faculty organization
- **Progress Tracking** - Instructors can monitor student progress
- **Scalable** - Built to handle multiple classes and hundreds of students

---

## 🤝 Contributing

This is an educational project for ITB. If you're contributing:

1. Follow the existing code style and patterns
2. Ensure TypeScript types are properly defined
3. Maintain responsive design principles
4. Test on multiple devices
5. Update documentation as needed

---

## 📄 License

This project is developed for educational purposes at Institut Teknologi Bandung (ITB).

---

## 🙏 Acknowledgments

- **Institut Teknologi Bandung (ITB)** - For providing the educational context
- **Supabase** - For the excellent backend infrastructure
- **shadcn/ui** - For the beautiful component library
- **React Community** - For the amazing ecosystem

---

## 📞 Support

For questions or issues:
1. Check the [FAQ](./docs/actual-documentation/FAQ.md)
2. Review the [Documentation Index](./docs/INDEX.md)
3. Consult the [Troubleshooting Guide](./docs/maintenance/CLEANUP-GUIDE.md)

---

<div align="center">

**Built with ❤️ for ITB Students**

[🚀 Get Started](./TLDR.md) • [📖 Read Docs](./docs/INDEX.md) • [🏗️ View Architecture](./docs/reference/ARCHITECTURE.md)

</div>
