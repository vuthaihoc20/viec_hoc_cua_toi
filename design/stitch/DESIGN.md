---
name: Academic Clarity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#960014'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc1d25'
  on-tertiary-container: '#ffd0cc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for personal academic task management and self-directed learning workflows. It communicates intellectual focus, calm organization, and effortless momentum. Designed for students, researchers, and lifelong learners, the interface eliminates cognitive friction by prioritizing content clarity and structural calmness.

### Design Movement: Modern Academic Minimalism
The visual language merges modern minimalism with subtle tactile surfaces:
- **Clean Air & White Space:** Generous breathing room across lists, schedules, and assignment boards prevents cognitive overload during intense study blocks.
- **Micro-tactile Layering:** Crisp pure white surfaces float delicately above an ultra-soft cool neutral canvas.
- **Intentional Chromatic Signals:** Strategic bursts of indigo drive focus, emerald marks completed milestones with positive reinforcement, and muted rose flags urgent deadlines without inducing panic.
- **Sophisticated Utility:** Functional density remains high when reviewing study metrics and task matrices, but presentation remains light, airy, and distraction-free.

## Colors

The palette establishes an uncluttered, focus-oriented environment through an indigo primary, an off-white background, and purposeful semantic accents.

### Color Roles & Application
- **Primary (`#4F46E5` - Deep Indigo):** Represents intellectual focus, depth, and intentional action. Used for primary CTAs, active navigation items, progress indicators, and key calendar highlights.
- **Secondary (`#10B981` - Emerald Green):** Denotes accomplishment, completed tasks, on-track study metrics, and positive submission confirmations.
- **Tertiary (`#EF4444` - Soft Crimson):** Highlights overdue deadlines, exam alerts, high-priority tags, and destructive actions.
- **Neutral Background (`#F8FAFC` - Slate Off-White):** A soft, eye-resting canvas that prevents glare during prolonged study sessions.
- **Surfaces (`#FFFFFF` - Pure White):** Used for cards, modal sheets, popovers, and table rows to provide crisp contrast against the `#F8FAFC` background.
- **Border / Divider Tonal Values (`#E2E8F0` / `#F1F5F9`):** Ghost-thin separators providing structure without visual clutter.
- **Text & Foreground Spectrum:**
  - Headings & Primary Text: `#0F172A` (Deep Slate, 900)
  - Secondary / Supporting Text: `#475569` (Muted Slate, 600)
  - Placeholder & Disabled Text: `#94A3B8` (Soft Gray, 400)

## Typography

The typography uses **Plus Jakarta Sans**, a modern geometric grotesque font with open apertures and balanced proportions. Its vertical metrics ensure consistent diacritic rendering for Vietnamese tone marks without clipping or vertical line-height jumping.

### Typographic Rules
- **Vietnamese Readability:** Set tight tracking (`-0.01em` to `-0.02em`) exclusively on headers (`headline-lg`, `display-lg`) while keeping body text at normal tracking to maintain clarity around accents (` dấu hỏi, ngã, nặng, huyền, sắc`).
- **Academic Hierarchy:** Task titles and course names use `title-md` and `title-sm` with semi-bold weights for rapid scanning. Secondary metadata (due dates, class codes, file attachments) is set in `body-sm` or `label-sm`.
- **Uppercase Restraint:** Uppercase styling is strictly reserved for `label-sm` (e.g., subject badges, course codes like `MATH101`, `CS204`) accompanied by `letterSpacing: 0.04em` to optimize legibility.

## Layout & Spacing

The layout adopts an 8pt modular rhythm on a fluid 12-column grid system, maintaining balance between spaciousness and academic density.

### Breakpoints & Canvas Model
- **Desktop (1200px+):** Fixed collateral navigation sidebar (260px), main fluid canvas spanning 12 columns, 32px (`margin`) page gutters, and 20px (`gutter`) column spacing.
- **Tablet (768px – 1199px):** Collapsible sidebar, 8-column layout, 24px margins, and 16px gutters. Study dashboards collapse multi-column kanban boards into swipeable horizontal sections.
- **Mobile (< 768px):** Single-column stacked workflow, bottom navigation bar, 16px (`margin-mobile`) container boundaries, and 12px (`gutter-mobile`) element gaps.

### Spacing Tokens Application
- `space-xs` (4px): Micro-gaps between tag labels and icons, nested item list indentations.
- `space-sm` (8px): Padding within compact chips, form input internal vertical padding, gap between checkboxes and task titles.
- `space-md` (16px): Internal padding for standard task cards, gaps between consecutive list rows.
- `space-lg` (24px): Card interior padding for overview widgets, vertical rhythm between major section groups.
- `space-xl` (32px): Module separation, top level dashboard widget layout splits.

## Elevation & Depth

Depth is established through soft, multi-layered ambient shadows and subtle borders, rather than heavy drop shadows. This creates a calm, paper-like feeling.

### Elevation Tiers
- **Level 0 (Flat Base):** Canvas background `#F8FAFC`. Zero shadow.
- **Level 1 (Card & Task Resting):** Pure White (`#FFFFFF`) card surfaces with a 1px solid border in `#F1F5F9` and an ambient diffuse shadow:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03);`
- **Level 2 (Interactive Hover & Dropdowns):** Subtle lift applied to active task cards, hover states, and contextual dropdowns:
  `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);`
  Border shifts slightly to `#E2E8F0`.
- **Level 3 (Modals, Study Focus Dialogs & Sheets):**
  `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);`
  Paired with a backdrop blur: `backdrop-filter: blur(6px); background: rgba(15, 23, 42, 0.3);`.

## Shapes

The design system uses a balanced rounded geometry (level `2`), striking a middle ground between friendly approachability and academic rigor.

### Corner Radii Guidelines
- **Base Components (`rounded`: 0.5rem / 8px):** Form inputs, buttons, checkboxes, tooltips, inline alerts.
- **Surface Cards (`rounded-lg`: 1rem / 16px):** Course overview cards, assignment detail panels, kanban columns, study timer containers.
- **Large Modals & Containers (`rounded-xl`: 1.5rem / 24px):** Dialog sheets, quick-create task popups, dashboard analytical summary blocks.
- **Pill Elements (`rounded-full`: 9999px):** Status badges, tag filters, user avatars, and circular progress meters.

## Components

### Buttons
- **Primary:** Solid `#4F46E5` background, `#FFFFFF` text, `title-sm` font weight. Micro-elevation hover with a subtle scale transform (`scale: 1.01`). Active states darken to `#4338CA`.
- **Secondary / Ghost:** Transparent background, `#0F172A` text, 1px border in `#E2E8F0`. Background fills to `#F1F5F9` on hover.
- **Success Action (Mark Done):** Subtle emerald surface (`#ECFDF5`), `#065F46` label, hover to solid `#10B981` with white text.

### Task Cards
- Pure `#FFFFFF` background, 1px `#F1F5F9` border, `rounded-lg`.
- Left-edge semantic indicator: A 3px inset accent bar denoting priority (Crimson for urgent, Indigo for normal, Emerald for completed).
- Content structure: Top row features the subject badge and deadline date; middle row contains task title (`title-md`) and brief notes (`body-sm`); bottom row contains task tags and milestone progress bars.

### Checkboxes & Radios
- Checkboxes: 18x18px square with `rounded` (4px). Unchecked has a 1.5px `#CBD5E1` border on `#FFFFFF`. Checked fills with `#10B981` (Emerald) showing a sharp white checkmark icon, triggering a brief strikethrough transition on the corresponding task label.

### Input Fields & Selects
- 40px default height, `#FFFFFF` background, 1px `#E2E8F0` border, `rounded` corners (8px), `body-md` text.
- Focus State: Border color transitions to `#4F46E5` with an indigo ambient ring (`box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12)`).

### Subject Chips & Status Badges
- Compact padding (`0.25rem 0.625rem`), `label-sm` typography, `rounded-full` shape.
- Color treatment uses soft pastel tint fills with high-contrast saturated text:
  - Math/Science: Tint `#EEF2FF`, Text `#3730A3`
  - Literature/Language: Tint `#FEF3C7`, Text `#92400E`
  - Completed Status: Tint `#D1FAE5`, Text `#065F46`
  - Overdue Status: Tint `#FEE2E2`, Text `#991B1B`

### Specialized Academic Components
- **Study Progress Bar:** 6px track height, `#E2E8F0` background with `rounded-full`. The active fill uses an indigo-to-emerald gradient with smooth CSS transitions as sub-tasks complete.
- **Pomodoro / Focus Timer Widget:** Minimalist circular dial with monospaced numerical readout (`JetBrains Mono` or tabular `Plus Jakarta Sans`), centered play/pause controls, and an emerald ring indicator.