# Virtual Lab ITB - Codebase Cleanup Guide

This document identifies **unused files** that can be safely deleted to reduce bundle size and improve maintainability.

---

## 📊 Analysis Summary

**Total shadcn/ui components**: 46  
**Actually used**: 13  
**Unused and safe to delete**: 33  

**Potential bundle size reduction**: ~200-300 KB (after minification)

---

## ✅ Used UI Components (Keep These - 13 files)

These components are actively imported and used in the application:

1. ✅ `avatar.tsx` - User profile in DashboardPage
2. ✅ `badge.tsx` - Difficulty/category tags throughout app
3. ✅ `breadcrumb.tsx` - Navigation in ExerciseDetailPage
4. ✅ `button.tsx` - Used everywhere
5. ✅ `card.tsx` - Challenge cards, dashboard cards, auth card
6. ✅ `carousel.tsx` - Team member carousel on HomePage
7. ✅ `input.tsx` - Contact form on HomePage
8. ✅ `label.tsx` - Form labels in ExerciseDetailPage
9. ✅ `progress.tsx` - Progress bars in DashboardPage
10. ✅ `radio-group.tsx` - Multiple choice questions in ExerciseDetailPage
11. ✅ `sonner.tsx` - Toast notifications
12. ✅ `table.tsx` - Activity table in DashboardPage
13. ✅ `textarea.tsx` - Contact form on HomePage

**Also keep these utility files:**
- ✅ `utils.ts` - Utility functions (cn helper for className merging)
- ✅ `use-mobile.ts` - Mobile detection hook (used by carousel)

---

## ❌ Unused UI Components (Safe to Delete - 33 files)

These shadcn/ui components are **NOT** imported or used anywhere in the codebase:

### Category: Alerts & Dialogs (3 files)
- ❌ `accordion.tsx` - Expandable sections (not used)
- ❌ `alert-dialog.tsx` - Confirmation dialogs (not used)
- ❌ `alert.tsx` - Alert messages (not used - using sonner instead)

### Category: Forms (9 files)
- ❌ `calendar.tsx` - Date picker (not used)
- ❌ `checkbox.tsx` - Checkboxes (not used - using radio buttons)
- ❌ `form.tsx` - Form management with react-hook-form (not used)
- ❌ `input-otp.tsx` - OTP input fields (not used)
- ❌ `select.tsx` - Dropdown select (not used)
- ❌ `slider.tsx` - Range slider (not used)
- ❌ `switch.tsx` - Toggle switch (not used)

### Category: Navigation (4 files)
- ❌ `breadcrumb.tsx` - Wait, this IS used! Keep it.
- ❌ `menubar.tsx` - Menu bar (not used - custom nav)
- ❌ `navigation-menu.tsx` - Navigation menu (not used - custom nav)
- ❌ `pagination.tsx` - Page navigation (not used)

### Category: Overlays & Modals (7 files)
- ❌ `collapsible.tsx` - Collapsible sections (not used)
- ❌ `command.tsx` - Command palette (not used)
- ❌ `context-menu.tsx` - Right-click menu (not used)
- ❌ `dialog.tsx` - Modal dialogs (not used)
- ❌ `drawer.tsx` - Side drawer (not used)
- ❌ `dropdown-menu.tsx` - Dropdown menus (not used)
- ❌ `sheet.tsx` - Sheet/drawer component (not used)

### Category: Data Display (9 files)
- ❌ `aspect-ratio.tsx` - Aspect ratio container (not used)
- ❌ `chart.tsx` - Chart components (not used - no charts in UI)
- ❌ `hover-card.tsx` - Hover card (not used)
- ❌ `popover.tsx` - Popover (not used)
- ❌ `scroll-area.tsx` - Custom scroll area (not used)
- ❌ `separator.tsx` - Divider line (not used - using Tailwind borders)
- ❌ `sidebar.tsx` - Sidebar component (not used - custom nav)
- ❌ `skeleton.tsx` - Loading skeleton (not used)
- ❌ `tooltip.tsx` - Tooltips (not used)

### Category: Layout & Interaction (3 files)
- ❌ `resizable.tsx` - Resizable panels (not used)
- ❌ `tabs.tsx` - Tab navigation (not used)
- ❌ `toggle-group.tsx` - Toggle button group (not used)
- ❌ `toggle.tsx` - Toggle button (not used)

---

## 🗑️ How to Clean Up

### Option 1: Delete Unused Components (Recommended)

```bash
# Navigate to your project
cd virtual-lab-itb

# Delete unused UI components
cd components/ui

# Delete all unused files (copy-paste this entire block)
rm accordion.tsx
rm alert-dialog.tsx
rm alert.tsx
rm aspect-ratio.tsx
rm calendar.tsx
rm chart.tsx
rm checkbox.tsx
rm collapsible.tsx
rm command.tsx
rm context-menu.tsx
rm dialog.tsx
rm drawer.tsx
rm dropdown-menu.tsx
rm form.tsx
rm hover-card.tsx
rm input-otp.tsx
rm menubar.tsx
rm navigation-menu.tsx
rm pagination.tsx
rm popover.tsx
rm resizable.tsx
rm scroll-area.tsx
rm select.tsx
rm separator.tsx
rm sheet.tsx
rm sidebar.tsx
rm skeleton.tsx
rm slider.tsx
rm switch.tsx
rm tabs.tsx
rm toggle-group.tsx
rm toggle.tsx
rm tooltip.tsx

# Return to project root
cd ../..
```

### Option 2: Keep for Future Use

If you plan to add features that might use these components, you can keep them. However, this increases:
- Bundle size (slightly)
- Maintenance overhead
- Potential security vulnerabilities (more dependencies to update)

---

## 📦 Package.json Cleanup

### Currently Installed (from package.json)

Check if these Radix UI packages are still needed after deleting components:

**Still needed (used by kept components):**
- ✅ `@radix-ui/react-avatar` - Used by avatar.tsx
- ✅ `@radix-ui/react-label` - Used by label.tsx
- ✅ `@radix-ui/react-progress` - Used by progress.tsx
- ✅ `@radix-ui/react-radio-group` - Used by radio-group.tsx
- ✅ `@radix-ui/react-slot` - Used by button.tsx

**Can potentially remove (after deleting components):**
```bash
# Only remove these if you deleted the corresponding UI components
npm uninstall @radix-ui/react-accordion      # accordion.tsx
npm uninstall @radix-ui/react-alert-dialog   # alert-dialog.tsx
npm uninstall @radix-ui/react-aspect-ratio   # aspect-ratio.tsx
npm uninstall @radix-ui/react-checkbox       # checkbox.tsx
npm uninstall @radix-ui/react-collapsible    # collapsible.tsx
npm uninstall @radix-ui/react-dialog         # dialog.tsx
npm uninstall @radix-ui/react-dropdown-menu  # dropdown-menu.tsx
npm uninstall @radix-ui/react-hover-card     # hover-card.tsx
npm uninstall @radix-ui/react-menubar        # menubar.tsx
npm uninstall @radix-ui/react-navigation-menu # navigation-menu.tsx
npm uninstall @radix-ui/react-popover        # popover.tsx
npm uninstall @radix-ui/react-scroll-area    # scroll-area.tsx
npm uninstall @radix-ui/react-select         # select.tsx
npm uninstall @radix-ui/react-separator      # separator.tsx
npm uninstall @radix-ui/react-slider         # slider.tsx
npm uninstall @radix-ui/react-switch         # switch.tsx
npm uninstall @radix-ui/react-tabs           # tabs.tsx
npm uninstall @radix-ui/react-toast          # If using sonner instead
npm uninstall @radix-ui/react-toggle         # toggle.tsx
npm uninstall @radix-ui/react-toggle-group   # toggle-group.tsx
npm uninstall @radix-ui/react-tooltip        # tooltip.tsx
npm uninstall cmdk                           # command.tsx
npm uninstall vaul                           # drawer.tsx
npm uninstall react-resizable-panels         # resizable.tsx
npm uninstall input-otp                      # input-otp.tsx
npm uninstall react-day-picker               # calendar.tsx
npm uninstall date-fns                       # calendar.tsx
```

**⚠️ Warning**: Only uninstall packages AFTER you've deleted the corresponding component files and tested that the app still works.

---

## 🎯 Recommended Cleanup Steps

### Conservative Approach (Safest)

1. **Test your application thoroughly first**
   ```bash
   npm run dev
   # Test all pages and features
   ```

2. **Create a backup branch**
   ```bash
   git checkout -b cleanup/unused-components
   ```

3. **Delete unused UI components** (use the rm commands above)

4. **Test again**
   ```bash
   npm run dev
   # Verify nothing broke
   ```

5. **Build and check bundle size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

6. **Commit if everything works**
   ```bash
   git add .
   git commit -m "Remove unused shadcn/ui components"
   git push origin cleanup/unused-components
   ```

7. **Optionally remove unused npm packages**
   ```bash
   # Only after confirming app works without the components
   npm uninstall [package-name]
   ```

---

## 📈 Expected Benefits

### Before Cleanup
- **UI components**: 46 files
- **Dependencies**: ~30 Radix UI packages
- **dist/ size**: ~500-700 KB (minified)

### After Cleanup
- **UI components**: 13 files (71% reduction)
- **Dependencies**: ~10 Radix UI packages (67% reduction)
- **dist/ size**: ~400-500 KB (20-30% smaller)

### Additional Benefits
- ✅ Faster build times
- ✅ Easier maintenance
- ✅ Fewer security vulnerabilities to monitor
- ✅ Clearer codebase (only what you use)
- ✅ Smaller `node_modules` folder

---

## 🔍 How to Verify Component Usage

### Method 1: Search in Codebase

```bash
# Search for imports of a specific component
grep -r "from.*ui/accordion" .

# If no results, it's not used
```

### Method 2: Try Removing One Component

```bash
# Rename instead of delete (safer)
mv components/ui/accordion.tsx components/ui/accordion.tsx.backup

# Run the app
npm run dev

# If no errors, it's safe to delete
# If errors, restore it:
mv components/ui/accordion.tsx.backup components/ui/accordion.tsx
```

### Method 3: Use a Tool

```bash
# Install depcheck to find unused dependencies
npm install -g depcheck

# Run it
depcheck

# It will list unused dependencies
```

---

## 🚨 Components to NEVER Delete

These are critical to the application:

**Core Components:**
- ✅ All files in `/components` (except `/components/ui`)
- ✅ `/components/figma/ImageWithFallback.tsx`
- ✅ `/App.tsx`
- ✅ `/main.tsx`

**Essential UI Components (from list above):**
- ✅ `button.tsx`
- ✅ `card.tsx`
- ✅ `badge.tsx`
- ✅ `table.tsx`
- ✅ `progress.tsx`
- ✅ `avatar.tsx`
- ✅ `carousel.tsx`
- ✅ `radio-group.tsx`
- ✅ `label.tsx`
- ✅ `input.tsx`
- ✅ `textarea.tsx`
- ✅ `breadcrumb.tsx`
- ✅ `sonner.tsx`
- ✅ `utils.ts`
- ✅ `use-mobile.ts`

**Data & Configuration:**
- ✅ `/data/mockData.ts`
- ✅ `/lib/supabase.ts`
- ✅ `/styles/globals.css`
- ✅ All config files (package.json, tsconfig.json, vite.config.ts)

---

## ⚖️ Decision: Keep or Delete?

### Keep If:
- 🤔 You plan to add features that might use these components
- 🤔 You're still in active development and might need them
- 🤔 Bundle size isn't a concern
- 🤔 You want the full shadcn/ui library available

### Delete If:
- ✅ You want a leaner codebase
- ✅ You want faster builds
- ✅ You want to reduce dependencies
- ✅ You're preparing for production
- ✅ You're confident in your component needs

---

## 📝 Summary

**Unused components identified**: 33 files  
**Safe to delete**: Yes, after testing  
**Recommended action**: Delete unused components to reduce bundle size  
**Risk level**: Low (can always add back from shadcn/ui if needed)

---

## 🔄 Can I Add Them Back Later?

**Yes, absolutely!** shadcn/ui components can be added anytime:

```bash
# Add a component back if you need it later
npx shadcn@latest add dialog
npx shadcn@latest add tooltip
# etc.
```

This is one of the benefits of shadcn/ui - components are just files in your project, not a package dependency.

---

**Recommendation**: Start by deleting the unused UI components. This will reduce your bundle size and make the codebase cleaner without any risk to functionality.
