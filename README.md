# AI Agent Configuration - Virtual Lab ITB

This folder contains configuration files to help AI agents (Cursor, GitHub Copilot, etc.) understand your codebase better.

---

## 📁 Files in This Folder

### `/.cursorrules`
**Purpose:** Main configuration file for Cursor IDE and AI agents  
**Contains:**
- Complete project overview
- Tech stack details
- Code conventions
- File structure
- Authentication system
- Database schema
- Common patterns
- Security considerations
- Development status

**When to read:** Always - this is the primary context file

---

### `/context.md`
**Purpose:** Quick reference context for AI agents  
**Contains:**
- Immediate project context
- Current state (what works, what needs setup)
- Files you'll work with most
- Critical rules
- Common tasks & solutions
- Quick decision tree

**When to read:** When you need quick context or are starting a new task

---

### `/patterns.md`
**Purpose:** Code patterns and best practices  
**Contains:**
- Component structure patterns
- Animation patterns
- Styling patterns
- Data fetching patterns (Supabase)
- Form patterns
- Navigation patterns
- Error handling patterns
- Common anti-patterns to avoid

**When to read:** When implementing new features or components

---

## 🎯 How AI Agents Should Use These Files

### For Cursor IDE
1. **Automatic:** Cursor will read `.cursorrules` automatically
2. **Reference:** Use `context.md` and `patterns.md` for specific tasks
3. **Update:** If you make major changes, update these files

### For GitHub Copilot
1. **Manual:** Open these files when starting work
2. **Context:** Keep them open in tabs for better suggestions
3. **Reference:** Use `@.ai/patterns.md` for code patterns

### For Other AI Agents
1. **Read `.cursorrules` first** for complete understanding
2. **Use `context.md`** for quick decisions
3. **Reference `patterns.md`** when writing code

---

## 📋 What These Files Don't Replace

These files provide AI context, but you should still:
- ✅ Read `/TLDR.md` for human-readable overview
- ✅ Follow `/guidelines/*.md` for step-by-step setup
- ✅ Check `/COMPONENT-AUDIT.md` for code quality info
- ✅ Review `/SECURITY-GUIDE.md` before production
- ✅ Reference project documentation in `/docs/`

---

## 🔄 When to Update These Files

Update `.cursorrules` and related files when:
- ✅ Adding new major features
- ✅ Changing tech stack
- ✅ Modifying architecture
- ✅ Adding new patterns
- ✅ Changing conventions
- ✅ Completing backend setup (Supabase)

**Don't update for:**
- ❌ Minor bug fixes
- ❌ Content changes
- ❌ Styling tweaks
- ❌ Adding individual challenges

---

## 📊 File Relationship

```
.cursorrules
├── Complete project context (read first)
│
.ai/context.md
├── Quick reference for common tasks
│
.ai/patterns.md
├── Code examples and best practices
│
Project Docs (for humans)
├── /TLDR.md - Quick overview
├── /README.md - Full documentation
├── /guidelines/ - Setup instructions
├── /COMPONENT-AUDIT.md - Code quality
└── /SECURITY-GUIDE.md - Security info
```

---

## 🎓 Best Practices

### For AI Agents
1. **Always read `.cursorrules` first** - It's your source of truth
2. **Check `context.md`** when unsure about current state
3. **Reference `patterns.md`** when writing new code
4. **Respect the rules** - Don't violate code conventions
5. **Maintain quality** - This codebase has 0% unused code

### For Developers
1. **Keep files updated** - AI context should match reality
2. **Be specific** - More context = better AI suggestions
3. **Document patterns** - Add new patterns to `patterns.md`
4. **Review AI output** - AI should follow these rules
5. **Update after major changes** - Keep context fresh

---

## 🚀 Quick Start for AI Agents

**New to this project?**

1. **Read:** `/.cursorrules` (5 minutes)
2. **Skim:** `.ai/context.md` (2 minutes)
3. **Reference:** `.ai/patterns.md` (as needed)
4. **Start coding!**

**Working on specific task?**

1. **Check:** `.ai/context.md` → "Common Tasks" section
2. **Find pattern:** `.ai/patterns.md` → Relevant pattern
3. **Follow convention:** Use existing code as reference
4. **Test:** Ensure responsive design works

---

## 📞 Questions?

**AI agents should:**
- Check these files first before asking questions
- Reference specific sections when uncertain
- Suggest updates if information is outdated
- Ask for clarification only when truly ambiguous

**Developers should:**
- Keep these files in sync with codebase
- Update when making architectural changes
- Add new patterns as they emerge
- Remove outdated information

---

## ✅ Checklist for AI-Assisted Development

Before suggesting code changes, AI agents should verify:
- [ ] Follows component structure pattern
- [ ] Uses correct imports (no unused imports)
- [ ] Respects typography rules (no font classes)
- [ ] Uses ImageWithFallback for images
- [ ] Includes proper TypeScript types
- [ ] Follows animation patterns (Motion)
- [ ] Maintains responsive design
- [ ] Passes authContext when needed
- [ ] Uses existing UI components
- [ ] Follows naming conventions

---

## 🎯 Goals of AI Configuration

1. **Consistency:** All AI-generated code follows same patterns
2. **Quality:** Maintain A+ code quality (0% unused code)
3. **Efficiency:** Reduce back-and-forth with context questions
4. **Accuracy:** AI understands project state and limitations
5. **Safety:** AI respects security and best practices

---

**Last Updated:** November 5, 2025  
**Project Version:** 1.0 (Frontend Complete)  
**AI Context Version:** 1.0

---

**Remember:** These files help AI understand your project. Keep them updated and specific! 🤖✨
