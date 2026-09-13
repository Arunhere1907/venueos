# VenueOS Design System

## Overview
This document defines the comprehensive design system for VenueOS - a professional event operations platform requiring clarity, accessibility, and operational efficiency.

## Design Philosophy

**VenueOS is:**
- **Operational First**: Information-dense but scannable
- **Accessible by Default**: WCAG AA compliance minimum
- **Professional & Trustworthy**: Modern event platform aesthetic
- **Mobile-Responsive**: Touch-friendly, adaptive layouts

**VenueOS is NOT:**
- Generic AI dashboard aesthetics
- Over-decorated Dribbble concepts
- Gaming/cyberpunk interfaces
- Excessive glassmorphism

---

## Color System

### Brand Identity
- **Primary**: Indigo (`#4F46E5` / `indigo-600`) - Trust, navigation, CTAs
- **Secondary**: Slate - Professional neutrals
- **Accent States**:
  - Success: Emerald (`emerald-500`)
  - Warning: Amber (`amber-500`)
  - Critical: Rose (`rose-600`)
  - Info: Sky (`sky-500`)

### Semantic Usage
| Context | Color | Usage |
|---------|-------|-------|
| Navigation Active | `indigo-600` | Selected tabs, active routes |
| Success State | `emerald-600` | Confirmations, accessibility mode |
| Warning State | `amber-500` | Medium crowd, cautions |
| Critical State | `rose-600` | SOS, high crowd, emergencies |
| Information | `sky-500` | Informational messages |
| Neutral Text | `slate-700` | Body text |
| Muted Text | `slate-500` | Secondary text |

### Dark Mode
- Background: `slate-950`
- Surface: `slate-900`
- Border: `slate-800`
- Text Primary: `slate-100`
- Text Secondary: `slate-400`

---

## Typography

### Font Family
- **Primary**: Plus Jakarta Sans (modern, readable, professional)
- **Monospace**: JetBrains Mono (code, technical data)

### Type Scale
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Display | `32px` | `800` | `1.1` | Page headers |
| H1 | `24px` | `700` | `1.2` | Section titles |
| H2 | `20px` | `600` | `1.3` | Card headers |
| H3 | `16px` | `600` | `1.4` | Subsection titles |
| Body | `14px` | `400` | `1.5` | Main content |
| Body Small | `13px` | `400` | `1.4` | Metadata |
| Caption | `12px` | `500` | `1.3` | Labels, timestamps |
| Micro | `11px` | `600` | `1.2` | Badges, status pills |

### Typography Hierarchy Principles
1. **Clear Distinction**: Each level visually distinct
2. **Consistent Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
3. **Readable Body**: Minimum 14px for body text
4. **Accessible Labels**: Minimum 12px for interactive labels

---

## Spacing System

### Base Unit: 4px (0.25rem)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Tight spacing, icon gaps |
| `sm` | `8px` | Compact spacing |
| `md` | `12px` | Default spacing |
| `lg` | `16px` | Section spacing |
| `xl` | `24px` | Large gaps |
| `2xl` | `32px` | Section dividers |
| `3xl` | `48px` | Page sections |

### Component Spacing
- **Card Padding**: `p-4 sm:p-5` (16-20px)
- **Section Gap**: `space-y-6` (24px)
- **Form Field Gap**: `space-y-4` (16px)
- **Button Padding**: `px-4 py-2` (horizontal 16px, vertical 8px)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xl` | `12px` | Buttons, inputs, badges |
| `rounded-2xl` | `16px` | Cards, modals, containers |
| `rounded-3xl` | `24px` | Large cards, hero sections |
| `rounded-full` | `9999px` | Pills, avatars, status dots |

**Principle**: Consistent radius creates visual cohesion. Use `rounded-2xl` as default for cards.

---

## Shadows & Elevation

| Level | Class | Usage |
|-------|-------|-------|
| Subtle | `shadow-xs` | Cards at rest, subtle elevation |
| Default | `shadow-sm` | Buttons, interactive elements |
| Medium | `shadow-md` | Hovered cards, dropdowns |
| Large | `shadow-lg` | Modals, drawers, overlays |
| XL | `shadow-xl` | High-priority dialogs |

**Principle**: Use shadows sparingly for elevation. Not every card needs heavy shadow.

---

## Interactive States

### Button States
- **Default**: Base color
- **Hover**: Darken 100 (e.g., `indigo-600` → `indigo-700`)
- **Active**: Scale `[0.98]` for press feedback
- **Focus**: Ring `ring-2` with offset
- **Disabled**: Opacity `50%`, cursor `not-allowed`

### Focus Indicators
```css
focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
```
Always visible for keyboard navigation.

### Transitions
```css
transition-all duration-150
```
Fast, responsive transitions for interactive elements.

---

## Component Specifications

### Buttons
```tsx
// Primary CTA
<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-sm transition-all active:scale-[0.98]">

// Secondary
<button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-sm transition-all">

// Danger
<button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all">
```

### Cards
```tsx
<div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
  <!-- Card content -->
</div>
```

### Badges
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
  Success
</span>
```

### Inputs
```tsx
<input className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
```

---

## Layout Principles

### Container Widths
- **Max Width**: `max-w-7xl` (1280px)
- **Padding**: `px-4 sm:px-6 lg:px-8`
- **Responsive**: Mobile-first approach

### Grid Systems
```tsx
// 2-column responsive
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-4">Sidebar</div>
  <div className="lg:col-span-8">Main</div>
</div>

// 3-column
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards -->
</div>
```

### Spacing Hierarchy
1. **Page Level**: `py-6` (24px)
2. **Section Level**: `space-y-6` (24px)
3. **Card Level**: `p-4 sm:p-5` (16-20px)
4. **Element Level**: `gap-4` (16px)

---

## Responsive Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | `640px` | Small tablets |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Desktop |
| `xl` | `1280px` | Large desktop |

### Mobile-First Strategy
```tsx
// Base: Mobile
// sm: Tablet adjustments
// lg: Desktop layout
<div className="text-sm sm:text-base lg:text-lg">
```

---

## Accessibility Requirements

### WCAG AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Always visible `ring-2`
- **Touch Targets**: Minimum 44x44px
- **Keyboard Navigation**: All interactive elements accessible
- **ARIA Labels**: Semantic HTML + descriptive labels

### High Contrast Mode
```tsx
profile.accessibilityMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
```

---

## Animation Guidelines

### Micro-interactions
- **Duration**: `150ms` - Fast, responsive
- **Easing**: `ease-out` - Natural feel
- **Scale Press**: `active:scale-[0.98]` - Tactile feedback

### Entrance Animations
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**When to animate:**
- Modal entrances
- Toast notifications
- Drawer slides
- Status changes

**When NOT to animate:**
- Page loads (performance)
- Frequent updates (crowd data)
- Critical alerts (immediate visibility)

---

## Icon System

### Library
**Lucide React** - Consistent stroke weight, modern aesthetic

### Sizing
- Small: `w-3.5 h-3.5` (14px)
- Medium: `w-4 h-4` (16px)
- Large: `w-5 h-5` (20px)
- XL: `w-6 h-6` (24px)

### Usage
```tsx
<MapPin className="w-4 h-4 text-indigo-600" />
```

---

## Design Tokens (Tailwind v4)

### Custom Theme Extensions
```css
@theme {
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Implementation Checklist

### Component Consistency
- [ ] All buttons use `Button` component
- [ ] All cards use `Card` component
- [ ] All badges use `Badge` component
- [ ] Consistent spacing throughout
- [ ] Consistent border radius
- [ ] Consistent typography scale

### Visual Hierarchy
- [ ] Clear page titles
- [ ] Obvious primary CTAs
- [ ] Scannable section headings
- [ ] Consistent metadata styling

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Color contrast verified
- [ ] Touch targets minimum 44x44px

### Responsive
- [ ] Mobile-first approach
- [ ] Tested at 375px, 768px, 1024px, 1440px
- [ ] No horizontal overflow
- [ ] Touch-friendly spacing
- [ ] Readable text sizes

---

## Status

**Current State**: Functional but inconsistent
**Target State**: Professional, polished, cohesive

**Next Steps**:
1. Audit all components for consistency
2. Standardize spacing and typography
3. Improve visual hierarchy
4. Enhance responsive behavior
5. Polish micro-interactions

