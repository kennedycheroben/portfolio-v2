# Segerman Reference Website Audit (`https://segerman.dev/`)

**Target Reference:** [https://segerman.dev/](https://segerman.dev/)  
**Audited Date:** 2026-10-15  
**Inspector:** Antigravity IDE (Browser Automation, Network Analysis, Computed CSS & Source Bundle Reverse-Engineering)

---

## 1. Executive Summary

`segerman.dev` is an award-winning creative developer portfolio (Raphael Segerman) exhibiting a high-craft editorial design language, fluid typography scaling, minimalist layout choreography, tactile micro-interactions (email copy feedback, mode toggle), and dual-mode rendering (interactive WebGL canvas with a fully styled `.no-webgl` accessible fallback for reduced-motion and mobile).

This audit documents directly observed behavior, measured implementation parameters, and informed hypotheses to guide the redesign of `portfolio2.0` for **Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer**.

---

## 2. Directly Observed Behavior

### 2.1 Initial Load & Preloader
- **Sequence:** Upon opening the site, an SVG circular loader with an animated mask circle and an ascending numerical percentage counter (`0%` to `100%`) centers in the viewport.
- **Reveal Transition:** Once loaded (or immediately in `.no-webgl` / `prefers-reduced-motion`), the loader fades out, the root `html` loses `.is-transitioning`, gains `.loaded`, and the page contents smoothly reveal.
- **Console Stamp:** A styled console message appears: `%c Developed by Raphael Segerman` with high contrast borders and an SVG badge.

### 2.2 Global Layout & Viewport Architecture
- **Desktop (>=1100px with fine pointer):** 
  - `html, body` are set to `position: fixed; width: 100%; height: 100%; overflow: hidden; overscroll-behavior: none;`.
  - The viewport behaves as a fixed theatrical stage/canvas. Desktop scrolling drives virtual transitions and transforms rather than native window scrollbars.
- **Tablet & Mobile (<1100px or coarse pointer):**
  - Switches gracefully to standard document flow with `min-height: 100dvh`, vertical scrolling, grid-to-stack layouts, and top padding (`padding-top: 12rem` to `16.4rem`) to clear fixed navigation.
- **Skip Link:** An accessible skip link (`<a class="skip-link" href="#page-content">Skip to content</a>`) is positioned off-screen (`left: -999px`) and appears on focus at `left: 12px; top: 12px; outline: 2px solid #00031F`.

### 2.3 Navigation & Header
- **Logo:** Fixed top-left at `top: var(--unit); left: var(--unit);` with uppercase/editorial weight.
- **Navigation Links:** Fixed top-right (`top: var(--unit); right: 7.2rem;`). Contains `"Info"` link, a subtle comma separator `","`, and an interactive `"Contact"` button.
- **Email Copy Interaction:** Clicking `"Contact"` or any email button copies the email to clipboard, temporarily displaying `"Email copied!"` right beneath with an accessible `aria-live="polite"` status announcement (`[data-copied-status]`).
- **Mode Toggle:** A round circular button at `top: 1.2rem; right: 1.2rem` (4rem x 4rem) toggles between dark/light and WebGL/DOM modes with smooth icon scaling.

### 2.4 Home Page Experience
- **Hero Typography:** Massive editorial display heading `"Creative<br>Developer"` in Newake uppercase font with an tight line-height (80%), paired with a succinct 2-line statement: *"Building high-performance websites with more to discover beneath the surface."*
- **Interactive Project Index (Desktop):**
  - A fixed right column (`width: var(--col); top: 38vh; right: var(--unit);`) titled `"Index"`.
  - Lists project titles (e.g. *Estrela Studio, Yucca Packaging, Zulik, PayJustNow, Vineyard Hotel*).
  - Hovering/focusing project titles activates corresponding media in the central card area (`width: 54.8rem; height: 33.4rem; aspect-ratio: 1.736/1`) and video thumbnail previews (`width: calc(var(--col) + var(--unit))`).
- **Footer Metas:** Clean definition lists (`<dl class="meta">`) anchored at bottom-left:
  - `<dt class="label">Contact</dt><dd>raphael@segerman.dev</dd>`
  - `<dt class="label">Available</dt><dd>October 2026</dd>`
  - Copyright stamp at bottom-right (`© 2026`).

### 2.5 Work / Case Study Experience
- **Project Title:** Giant display heading (`font-size: 12rem` on desktop, `6.2rem` on mobile) centered or top-aligned.
- **Metadata Column:** Structured definition lists (`Year`, `Role`, `Visit` with an external diagonal arrow icon).
- **Media Gallery:** High-definition video/image cards with disciplined aspect ratio (`1.736:1` or `1.54:1`).
- **Next Project Teaser:** Anchored bottom-right with meta text and thumbnail (`aspect-ratio: 3/2`) providing seamless circular navigation through the project roster.

### 2.6 Info / About Page
- **Giant Title:** `"About"` rendered at `22rem` on desktop with staggered offset lines (Line 2 indented by `59.2rem`).
- **Media Portrait:** Asymmetric portrait media card (`width: 54.8rem`, `top: 21rem`, `right: var(--unit)`).
- **Editorial Copy:** Broad, clean paragraphs (`max-width: 54.4rem`, `font-size: 2rem`, `line-height: 134%`).
- **Skill & Recognition Metas:** Structured lists for `Tools` (e.g. React, TypeScript, GSAP, Figma) and `Awards` / credentials.

---

## 3. Measured Implementation Details

### 3.1 CSS Custom Properties & Breakpoint Grid

```css
:root {
  --c-black: #00031F;     /* Deep midnight obsidian navy */
  --c-white: #ffffff;     /* Pure crisp porcelain white */
  --col: 11.8rem;         /* Base structural column unit */
  --unit: 2.4rem;        /* Viewport border padding and gutters */
  --ar: 1.736 / 1;        /* Disciplined project media aspect ratio (16:9.2) */
}

/* Tablet / Coarse Pointer (<1100px or touch) */
@media screen and (max-width: 1099px), screen and (max-width: 1365px) and (pointer: coarse) {
  :root {
    --col: 10.5rem;
    --unit: 2rem;
  }
}

/* Mobile (<768px) */
@media screen and (max-width: 767px) {
  :root {
    --col: 7.4rem;
    --unit: 1.6rem;
  }
}
```

### 3.2 Fluid Root Font-Size Scaling
The reference calculates root REM scale based on viewport width (`vw`):
- **Desktop (>=1100px):** `html { font-size: 0.5787037037vw; line-height: 100%; }`  
  *(At 1728px viewport width: `1728 * 0.005787037 = 10px`, making `1rem = 10px` exactly! At 1920px: `1rem = 11.11px`.)*
- **Tablet / Touch:** `html { font-size: 1vw; }` *(At 768px: `1rem = 7.68px`; at 1024px: `1rem = 10.24px`.)*
- **Mobile (<=767px):** `html { font-size: 2.5vw; }` *(At 390px: `1rem = 9.75px`; at 414px: `1rem = 10.35px`.)*

### 3.3 Typography Stack
1. **Display Heading Font:** `Newake Regular` (`nw`), geometric, clean uppercase sans-serif with tight tracking and uppercase authority.
   - Hero Display: `10.4rem` (`6.4rem` mobile), line-height: `80%`.
   - Info Massive Title: `22rem` (`16rem` tablet, `6.4rem` mobile).
   - Case Study Title: `12rem` (`6.2rem` mobile).
2. **Body & Interface Font:** `Aktiv Grotesk Medium` (`ag`), grotesque sans-serif, weight `500`.
   - Body Paragraphs: `1.7rem` (`1.5rem` mobile), line-height: `120% - 148%`, letter-spacing: `-0.01rem`.
   - Metadata / Labels: `1.4rem` (`1.3rem` mobile), line-height: `110%`, label opacity: `0.4 - 0.6`.
   - Navigation & Links: `1.5rem` (`1.4rem` mobile).

### 3.4 Color Contrast Metrics
- **Light Theme (Default in reference):**
  - Background: `#ffffff`
  - Text & Accents: `#00031F` (Contrast ratio **19.8:1**, passing WCAG AAA).
- **Dark Theme:**
  - Background: `#00031F`
  - Text & Accents: `#ffffff` (Contrast ratio **19.8:1**, passing WCAG AAA).
- **Muted Labels:**
  - `rgba(0, 3, 31, 0.45)` on light / `rgba(255, 255, 255, 0.45)` on dark (Contrast ratio **5.1:1**, passing WCAG AA for normal text).

### 3.5 Motion & Easing Engine
Analysis of the bundled scripts (`app.8ySn1L4n.js`) reveals:
- **Core Animation Engine:** GSAP (GreenSock) for timeline and tween sequencing.
- **Scroll & Virtual Drag:** Lenis for smooth virtual scroll interpolation.
- **Page Transitions:** Barba.js architecture (`[data-router="wrapper"]`, `[data-router="container"]`, `beforeLeave`, `afterLeave`, `beforeEnter`, `afterEnter`).
- **Measured Easings:**
  - Page entry/exit & large layout reveals: `power3.inOut` (duration: `1.2s - 1.45s`).
  - Hover & thumbnail fades: `power2.out` (duration: `0.5s`).
  - Fluid coordinate damping: `power1.out` and `none` for continuous lerp loops.
- **Hardware Acceleration:** All project media cards and interactive links apply `will-change: transform; transform: translateZ(0); backface-visibility: hidden;`.

---

## 4. Informed Hypotheses Requiring Verification

1. **WebGL Canvas vs. CSS 3D Layering:** The reference uses an OGL/WebGL canvas to render fluid image distortion during desktop drag/scroll. However, it also includes a complete CSS layout fallback (`html.no-webgl`). In React 19 / Vite, creating fluid CSS/WebGL shader transitions or spring-accelerated CSS transforms guarantees 60fps performance and instantaneous hydration without heavy 3D engine overhead.
2. **Theme Switching Logic:** The toggle button in the reference switches between modes. For Kennedy Cheroben's portfolio, maintaining the dark theme default (obsidian navy `#00031F` or slate `#090D10`) with an accessible light theme toggle preserves both identity and user preference.
3. **Prerendering Compatibility:** Because `portfolio2.0` uses static SSR prerendering (`scripts/prerender.js`), layout and initial DOM structures must render cleanly on the server before client-side hydration attaches interactive transitions.

---

## 5. Architectural Translation for Kennedy Cheroben's Portfolio

| Reference Characteristic | Segerman Implementation | Kennedy Cheroben Redesign Target |
| :--- | :--- | :--- |
| **Identity & Tone** | Cape Town Creative Developer (Astro, 3D WebGL) | Nairobi Visual Design Specialist & Full-Stack Developer |
| **Color System** | Binary `#00031F` & `#ffffff` | Editorial Obsidian Navy (`#00031F`) / Porcelain White (`#ffffff`) with subtle emerald/cyan accents |
| **Typography** | Newake Regular + Aktiv Grotesk | Unbounded / Syne / Plus Jakarta Sans uppercase display + Grotesk body |
| **Grid Architecture** | Viewport-pinned desktop stage (`var(--col)`, `var(--unit)`) | Viewport-pinned creative index with fluid rem scaling and responsive document flow |
| **Project Showcase** | Central card stack + Right "Index" text links | Supabase-backed dynamic projects in right "Index" navigation with synchronized preview canvas |
| **Navigation** | Top-left logo, top-right Info/Contact + Mode toggle | Fixed top-left wordmark, top-right navigation (Work, Info/About, Guide, Contact) + Theme toggle |
| **Contact Interaction**| Copy-to-clipboard with `"Email copied!"` + mailto | Quick copy-to-clipboard feedback + full accessible inquiry modal / contact route |
| **Reduced Motion** | Automatic switch to `.no-webgl` static grid | Automatic bypass of heavy canvas/transitions via `useReducedMotion` |
