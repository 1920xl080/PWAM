# Documentation Quick Reference

## 🚀 I need to... (Quick Navigation)

### Set Up the Project
→ `/guidelines/01-InitialSetup.md` (10 min)

### Understand the Code
→ `/docs/CODE-DOCUMENTATION.md` (main reference)

### Learn About Components
→ `/docs/components/README.md` (all components)

### Set Up Backend (Supabase)
→ `/guidelines/03-SupabaseSetup.md` (4 hours) ⚠️ Critical

### Set Up Authentication
→ `/docs/api/authentication.md` (complete guide)

### Deploy to Production
→ `/guidelines/05-DeploymentGuide.md` (20 min)

### Fix a Problem
→ `/guidelines/06-Troubleshooting.md` (common issues)

### Customize the App
→ `/guidelines/CustomizationGuide.md` (styling, content)

### Check Security
→ `/docs/reference/SECURITY-GUIDE.md` ⚠️ Before production

### Configure AI Tools
→ `/.cursorrules` + `/.ai/` folder

---

## 📁 Documentation Files Cheat Sheet

| Need... | File | Time |
|---------|------|------|
| Quick overview | `/TLDR.md` | 5 min |
| Full project info | `/README.md` | 15 min |
| Code reference | `/docs/CODE-DOCUMENTATION.md` | 30 min |
| Component details | `/docs/components/README.md` | 30 min |
| API info | `/docs/api/README.md` | 15 min |
| Database schema | `/docs/database/README.md` | 20 min |
| All docs index | `/docs/INDEX.md` | 10 min |

---

## 🎯 By Role

### I'm a Frontend Developer
1. `/docs/CODE-DOCUMENTATION.md`
2. `/docs/components/README.md`
3. `/.ai/patterns.md`

### I'm a Backend Developer
1. `/guidelines/03-SupabaseSetup.md`
2. `/docs/database/README.md`
3. `/docs/api/authentication.md`

### I'm DevOps/Deployment
1. `/guidelines/05-DeploymentGuide.md`
2. `/docs/reference/SECURITY-GUIDE.md`
3. `/guidelines/06-Troubleshooting.md`

### I'm a Designer
1. `/TLDR.md`
2. `/docs/components/README.md`
3. `/guidelines/CustomizationGuide.md`

### I'm a Project Manager
1. `/TLDR.md`
2. `/docs/reference/ARCHITECTURE.md`
3. `/docs/reference/BACKEND-SETUP-STATUS.md`

---

## 💻 Code Examples

### Authentication Check
```typescript
// See: /docs/CODE-DOCUMENTATION.md
const { user } = authContext;
if (!user) navigate('/auth');
```

### Fetch Data (Supabase)
```typescript
// See: /docs/api/README.md
const { data } = await supabase
  .from('challenges')
  .select('*');
```

### Component Pattern
```typescript
// See: /docs/components/README.md
export function Page({ authContext }: Props) {
  return <div>...</div>;
}
```

---

## 🔧 Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
```

### Supabase (after setup)
```bash
supabase login       # Login
supabase init        # Initialize
supabase db push     # Push schema
```

### Deployment
```bash
npm run build        # Build for production
git push origin main # Auto-deploy (Vercel)
```

---

## 🗺️ File Locations

### Components
- Pages: `/components/*.tsx`
- UI: `/components/ui/*.tsx`

### Documentation
- Main: `/docs/CODE-DOCUMENTATION.md`
- API: `/docs/api/*.md`
- Database: `/docs/database/README.md`

### Configuration
- Supabase: `/lib/supabase.ts`
- Styles: `/styles/globals.css`
- Routes: `/App.tsx`

### Data
- Mock Data: `/data/mockData.ts` ⚠️ Delete after Supabase
- Types: Defined in components

---

## ⚠️ Critical Info

### Before Production
1. ✅ Set up Supabase
2. ✅ Enable RLS policies
3. ✅ Server-side email validation
4. ✅ Google OAuth configured
5. ✅ Environment variables set
6. ✅ Security guide reviewed

### Security Issues
- Email validation: Frontend only (fix!)
- No RLS: Database open (fix!)
- Mock data: Not production ready (fix!)

**See:** `/docs/reference/SECURITY-GUIDE.md`

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Frontend | ✅ Complete (100%) |
| Components | ✅ Complete (7 pages) |
| UI Library | ✅ Clean (13 used) |
| Documentation | ✅ Complete (80%) |
| Backend | ⚠️ Needs setup |
| Database | ⚠️ Template ready |
| API | ⚠️ Template ready |
| Deployment | ⚠️ Manual needed |

---

## 🎓 Learning Path

### Week 1: Frontend
- Day 1: Setup & run locally
- Day 2-3: Learn components
- Day 4-5: Experiment & customize

### Week 2: Backend
- Day 1-3: Supabase setup
- Day 4: API integration
- Day 5: Testing

### Week 3: Production
- Day 1: Security
- Day 2: Optimization
- Day 3-4: Deployment
- Day 5: Monitoring

---

## 📞 Need Help?

**General Questions:**
→ Check `/docs/INDEX.md`

**Code Questions:**
→ Check `/docs/CODE-DOCUMENTATION.md`

**Setup Issues:**
→ Check `/guidelines/06-Troubleshooting.md`

**Backend Questions:**
→ Check `/docs/api/README.md`

**Still Stuck:**
→ Open GitHub issue

---

**Last Updated:** November 5, 2025  
**Quick Reference Version:** 1.0
