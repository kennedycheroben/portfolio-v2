# DESIGN.md — Design System & Experience Specification

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Aesthetic Anchor:** "Futuristic Interactive" — Engineering Precision Meets Editorial Visual Craft  
**Status:** PHASE 2 PLANNING SPECIFICATION (Pre-Implementation)  

---

## 1. Visual Direction & Aesthetic Philosophy

### 1.1 The Creative Premise
The visual identity represents the rare intersection of a **Visual Design Specialist** and a **Full-Stack Developer**. It rejects generic, monochromatic developer portfolios as well as superficial, over-animated web3/crypto templates.

- **Primary Visual Tone:** Dark-first, deep obsidian canvas with crisp architectural structure, restrained glassmorphism, and cosmic kinetic accents (emerald & cyan).
- **Asset Grounding:** Directly calibrated against the audited visual assets:
  - `hero_section.jpeg` features Kennedy in a dark green velvet hoodie with 3D typography and vibrant programming language emblems (Python green/yellow, C++ blue, C# purple, JS amber). The dark canvas seamlessly absorbs this photography.
  - `about_section.jpeg` and `contact_section.jpeg` introduce crisp, editorial white surface planes. The design system uses these light surface planes intentionally as high-contrast structural focal points (e.g. framing the glassmorphic contact form card).

---

## 2. Color Palette & Token Architecture

All colors are defined via CSS custom properties mapped to semantic tokens for dark and light modes. Every text-to-background pairing is strictly calibrated to exceed **WCAG 2.1 AA** contrast requirements (minimum 4.5:1 for body copy; minimum 3:1 for large display text and UI controls).

### 2.1 Semantic Color Tokens

```css
:root {
  /* =========================================================================
     DARK THEME (DEFAULT / BASELINE)
     ========================================================================= */
  --bg-canvas: #090d10;              /* Deep obsidian slate */
  --bg-surface: #10161b;             /* Elevated card background */
  --bg-surface-elevated: #161f26;    /* Secondary elevation / hover */
  --bg-glass: rgba(16, 22, 27, 0.75);/* Frosted glass overlay */
  --border-subtle: rgba(255, 255, 255, 0.08); /* Architectural hairline border */
  --border-focus: rgba(46, 204, 142, 0.6);   /* Accessible active focus ring */

  --text-primary: #f0f6fc;           /* Crisp high-contrast heading text (14.2:1) */
  --text-secondary: #94a3b8;         /* Subheading and descriptive body (6.8:1) */
  --text-muted: #64748b;             /* Metadata, timestamps, captions (4.6:1) */

  /* Brand Accents */
  --accent-emerald: #10b981;         /* Primary brand accent (terminal emerald) */
  --accent-emerald-glow: rgba(16, 185, 129, 0.25);
  --accent-cyan: #06b6d4;            /* Secondary system accent (cyber cyan) */
  --accent-cyan-glow: rgba(6, 182, 212, 0.20);
  --accent-amber: #f59e0b;           /* Warning / Attention indicator */
  --accent-rose: #f43f5e;            /* Error / Alert indicator */

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
  --glow-hero: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
}

[data-theme="light"] {
  /* =========================================================================
     LIGHT THEME (ACCESSIBLE INVERSION)
     ========================================================================= */
  --bg-canvas: #f8fafc;              /* Crisp clean porcelain */
  --bg-surface: #ffffff;             /* Crisp white surface cards */
  --bg-surface-elevated: #f1f5f9;    /* Elevated surface */
  --bg-glass: rgba(255, 255, 255, 0.85); /* Frosted light overlay */
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-focus: rgba(5, 150, 105, 0.8);

  --text-primary: #0f172a;           /* Deep obsidian ink (15.5:1) */
  --text-secondary: #334155;         /* Charcoal body text (8.5:1) */
  --text-muted: #64748b;             /* Supporting slate (4.8:1) */

  /* Brand Accents (Darkened for contrast on light background) */
  --accent-emerald: #059669;         /* Dark emerald (4.8:1 on #ffffff) */
  --accent-emerald-glow: rgba(5, 150, 105, 0.18);
  --accent-cyan: #0891b2;            /* Deep cyan (5.2:1 on #ffffff) */
  --accent-cyan-glow: rgba(8, 145, 178, 0.15);
  --accent-amber: #d97706;
  --accent-rose: #e11d48;

  --gradient-brand: linear-gradient(135deg, #059669 0%, #0891b2 100%);
  --gradient-glass: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 100%);
  --glow-hero: radial-gradient(circle at 50% 30%, rgba(5, 150, 105, 0.08) 0%, transparent 70%);
}
```

---

## 3. Typography Scale & Hierarchy

### 3.1 Font Families & Loading Strategy
- **Display & Headings:** `Syne` (Weights 600, 700, 800) or `Space Grotesk` (Weights 600, 700). Self-hosted WOFF2 via `@fontsource` with `font-display: swap` to prevent FOIT (Flash of Invisible Text).
- **Body & UI:** `Plus Jakarta Sans` (Weights 400, 500, 600) or `Inter`. Highly legible geometric grotesque with generous x-height and clear punctuation.
- **Monospace & Code:** `JetBrains Mono` (Weights 400, 500). Used strictly for tech stacks, architectural badges, line numbers, and metric counters.

### 3.2 Responsive Type Scale Tokens

| Token | Desktop Size / Line-Height | Mobile Size / Line-Height | Weight | Semantic Element |
|---|---|---|---|---|
| `--font-display` | `3.75rem (60px) / 1.05` | `2.5rem (40px) / 1.15` | `800` | Hero Title (`h1`) |
| `--font-h1` | `2.75rem (44px) / 1.15` | `2.0rem (32px) / 1.2` | `700` | Page Titles (`h1`) |
| `--font-h2` | `2.0rem (32px) / 1.25` | `1.5rem (24px) / 1.3` | `600` | Section Headings (`h2`) |
| `--font-h3` | `1.375rem (22px) / 1.35` | `1.25rem (20px) / 1.4` | `600` | Project Card Titles (`h3`) |
| `--font-body-lead` | `1.25rem (20px) / 1.6` | `1.125rem (18px) / 1.55`| `400` | Intro Paragraphs (`p.lead`) |
| `--font-body` | `1.0rem (16px) / 1.65` | `0.9375rem (15px) / 1.6` | `400` | General Body Text (`p`, `li`) |
| `--font-caption` | `0.875rem (14px) / 1.5` | `0.8125rem (13px) / 1.5` | `500` | Metadata, Badges, Labels |
| `--font-mono` | `0.8125rem (13px) / 1.4` | `0.75rem (12px) / 1.4` | `500` | Tech Pills, Code Badges |

---

## 4. Layout Grid, Spacing & Breakpoints

- **Max Layout Widths:**
  - Content Shell: `1240px` (with `clamp(1rem, 5vw, 2.5rem)` responsive inline padding).
  - Editorial Reading Shell (Case Studies, About story): `760px`.
  - Full-Width Hero Container: `1440px`.
- **Spacing Scale:** Standard 4px baseline (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`).
- **Breakpoints:**
  - `sm`: `640px` (Handset landscape & large smartphones)
  - `md`: `768px` (Tablets portrait)
  - `lg`: `1024px` (Laptops & tablets landscape)
  - `xl`: `1280px` (Desktop workstations)
  - `2xl`: `1536px` (Ultra-wide displays)
- **Radii Tokens:**
  - `--radius-sm`: `6px` (Badges, tags)
  - `--radius-md`: `12px` (Buttons, inputs, inner containers)
  - `--radius-lg`: `20px` (Cards, dialogs, glass panels)
  - `--radius-pill`: `9999px` (Filter pills, status tags)

---

## 5. Core Component Design Specifications

### 5.1 Site Header & Navigation
- **Desktop:** Sticky floating glass bar with subtle blur (`backdrop-blur-md`), hairline bottom border, brand monogram logo on left, route links in center, theme toggle and "Start a Project" pill CTA on right.
- **Mobile:** Fixed header with brand mark, theme toggle, and animated hamburger button that triggers an accessible slide-over drawer (`aria-expanded`, focus-trapped) with staggered link entrances.

### 5.2 Hero Section Composition
- **Desktop:** Split composition:
  - Left column: Eyebrow badge ("Visual Design Specialist · Full-Stack Developer"), large display title, concise value proposition, primary action ("Explore Work") + secondary action ("Direct Contact").
  - Right column: Custom portrait integration with `hero_section.jpeg` housed inside an asymmetric geometric frame with a subtle emerald-cyan perimeter glow.
- **Mobile:** Centered column: Eyebrow badge, compact display title, full-width vertical portrait card utilizing `hero_section_phone.jpeg`, followed by touch-friendly action buttons.

### 5.3 Project Cards & Work Gallery
- **Card Anatomy:**
  1. Interactive Preview Media (16:10 aspect ratio) with subtle hover scale (`scale(1.03)`).
  2. Category & Verification Badge (e.g. `[Full-Stack SaaS · React 19 / Supabase]`).
  3. Project Title (`h3`) with external link indicator icon (`ArrowUpRight`).
  4. Concise 2-line problem/solution summary.
  5. Technology pills tag list (`JetBrains Mono`).
  6. Direct actions: "Deep Case Study" link and "Live Demo" button.
- **Hover / Focus State:** Card perimeter transitions from `--border-subtle` to a soft gradient stroke (`--gradient-brand`) with a 4px upward translation (`translateY(-4px)`).

### 5.4 Glassmorphic Contact Form Panel
- **Framing Anchor:** Uses `contact_section.jpeg` (where Kennedy leans over a white card pointing down) as the visual header/backdrop.
- **Form Card Structure:** The lower region transitions into a glass panel (`--bg-glass` with `backdrop-blur-lg`) featuring:
  - Floating label inputs (Name, Email, Project Category, Message).
  - Built-in character counters (`minlength="20"`, `maxlength="3000"`).
  - Invisible Turnstile bot challenge.
  - Honeypot trap field (`hidden` from screen readers and pointer devices).
  - Glowing Submit Button with loading spinner, success checkmark morph, and error state recovery.

### 5.5 Case Study Template Composition
- **Hero:** Project title, tagline, metadata bar (Client/Context, Role, Year, Verified Stack, Live URL).
- **Executive Summary:** The business/user problem solved.
- **Architecture & System Design:** Text diagrams, technical decisions, code highlights.
- **Visual & UI Craft:** High-resolution screenshots, interactive component previews, typography & token specs.
- **Verified Outcomes:** Quantitative metrics if verified, or qualitative technical deliverables.
- **Navigation Footer:** "Previous Project" / "Next Project" reciprocal links.

---

## 6. Motion System & Micro-Interactions

### 6.1 Purposeful Motion Principles
- Every animation must reinforce spatial orientation, provide immediate tactile feedback, or establish visual hierarchy.
- Zero perpetual CPU-draining loops or unconstrained blur filters.

### 6.2 Motion Tokens & Curves

```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* Smooth entrance */
  --ease-in-out-smooth: cubic-bezier(0.4, 0, 0.2, 1); /* Layout & theme morph */
  --duration-fast: 150ms;                             /* Button hover, click feedback */
  --duration-normal: 250ms;                           /* Card hover, menu drawer */
  --duration-slow: 450ms;                             /* Page transitions, section reveals */
}
```

### 6.3 Behavior Specifications
- **Page Transitions:** Staggered opacity and subtle Y-axis translation (`y: [12, 0]`, duration `300ms`, `--ease-out-expo`).
- **Scroll Reveals:** Triggered via `IntersectionObserver` with `viewport: { once: true, margin: "-10% 0px" }`. Content fades up smoothly upon entering view.
- **Theme Switcher:** Rotates sun/moon icon 180 degrees with smooth SVG path morphing while CSS token variables transition over `200ms`.
- **Reduced-Motion Support (`prefers-reduced-motion`):**
  - All positional translations (`y`, `x`, `scale`, `tilt`) are automatically set to `0`.
  - Transitions collapse to simple instantaneous opacity fades (`150ms`) or direct cuts.
  - Zero loss of functionality for keyboard or motor-impaired users.
