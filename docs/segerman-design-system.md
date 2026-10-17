# Segerman Design System Specification

**Target Reference:** [https://segerman.dev/](https://segerman.dev/)  
**Extraction Source:** `_astro/index.CBcmH4bc.css`, inline styles, prerendered HTML markup  
**Document Purpose:** Detailed specification of the visual tokens, typography, grid geometry, and layout primitives for adaptation into `portfolio2.0`  

---

## 1. Typography System

### 1.1 Font Faces & Font Loading Strategy

The reference defines two core custom font families via `@font-face`:

```css
@font-face {
  font-family: ag;
  src: url(/fonts/AktivGroteskMedium.woff) format("woff");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: nw;
  src: url(/fonts/NewakeRegular.woff) format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- **`ag` (Aktiv Grotesk Medium):** Primary grotesque sans-serif used for body copy, navigational links, metadata labels, definition lists, buttons, and countdown counters.
- **`nw` (Newake Regular):** Monospace/display sans-serif characterized by geometric uppercase letterforms, tight kerning, and architectural punch. Used for major display headings (`Creative Developer`, `Estrela Studio`, `About`).
- **Loading Strategy:** Both fonts are preloaded in `<head>` with `<link rel="preload" as="font" type="font/woff" crossorigin fetchpriority="high">` to prevent layout shifts (CLS) and FOIT (Flash of Invisible Text).

### 1.2 Fluid Root Font Scaling & Responsive Units

Rather than fixed pixel breakpoints, Segerman employs a mathematical viewport-width (`vw`) root font scaling system:

```css
/* Base Desktop (>=1100px with fine pointer) */
html {
  font-size: 0.5787037037vw;
  line-height: 100%;
}

/* Tablet & Coarse Pointer (<1100px or touch) */
@media screen and (max-width: 1099px), screen and (max-width: 1365px) and (pointer: coarse) {
  html {
    font-size: 1vw;
  }
}

/* Mobile (<768px) */
@media screen and (max-width: 767px) {
  html {
    font-size: 2.5vw;
  }
}
```

#### Mathematical Calculation & Resolution Mapping:
- **At 1728px Viewport (Desktop Default):**  
  `1728px * 0.005787037037 = 10.0000px` -> Exactly `1rem = 10px`!  
  This makes calculation effortless: `1.6rem = 16px`, `2.4rem = 24px`, `11.8rem = 118px`.
- **At 1920px (Full HD):** `1rem = 11.11px`.
- **At 1440px (MacBook Pro):** `1rem = 8.33px`.
- **At 1024px (iPad Pro):** `1024px * 0.01 = 10.24px` -> `1rem = 10.24px`.
- **At 390px (iPhone 14/15/16):** `390px * 0.025 = 9.75px` -> `1rem = 9.75px`.

### 1.3 Typographic Scale & Hierarchy

| Role / Element | Font Family | Size (Desktop) | Size (Mobile) | Line Height | Letter Spacing | Text Transform | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display Headline** | `nw` | `10.4rem` (~104px) | `6.2rem` (~60px) | `80%` (0.8) | `-0.03em` | Normal / Title | Ultra-compact line height creates solid typographic blocks. |
| **Page / Case Study Title** | `nw` | `12.0rem` (~120px) | `5.6rem` (~55px) | `85%` (0.85) | `-0.035em` | Normal / Title | Centered or left-aligned on case studies. |
| **About Giant Title** | `nw` | `22.0rem` (~220px) | `8.0rem` (~78px) | `80%` (0.8) | `-0.04em` | Normal | Staggered offset layout on desktop. |
| **Subheadings & Statements** | `ag` | `2.4rem` (~24px) | `1.8rem` (~18px) | `125%` (1.25)| `-0.01em` | Normal | Hero intro copy: *"Building high-performance websites..."* |
| **Body Paragraphs** | `ag` | `1.7rem` (~17px) | `1.5rem` (~15px) | `120%` (1.20)| `-0.01rem` | None | Clean readability, max-width `54.4rem`. |
| **Navigation & Links** | `ag` | `1.7rem` (~17px) | `1.5rem` (~15px) | `120%` (1.20)| `-0.01rem` | None | Underline on hover with transition. |
| **Metadata Labels (`dt`)** | `ag` | `1.4rem` (~14px) | `1.3rem` (~13px) | `110%` (1.10)| `0.08em` | Uppercase | Architectural tags (`Contact`, `Year`, `Role`, `Available`). |
| **Metadata Values (`dd`)** | `ag` | `1.4rem` (~14px) | `1.3rem` (~13px) | `110%` (1.10)| `-0.01rem` | None | Technical dates, credentials, and values. |
| **Preloader Counter** | `ag` | `1.6rem` (~16px) | `1.4rem` (~14px) | `100%` | `0` | None | Tabular numerical figures (`0%` to `100%`). |

---

## 2. Visual & Layout System

### 2.1 Color Tokens & Contrast Matrix

Segerman uses an ultra-minimalist, high-contrast, dual-color foundation:

```css
:root {
  --c-black: #00031F;     /* Deep inky midnight obsidian */
  --c-white: #ffffff;     /* Pure crisp architectural white */
}
```

- **Contrast Ratio:** `#ffffff` against `#00031F` achieves a contrast ratio of **19.8:1**, vastly exceeding WCAG 2.2 Level AAA requirements (7:1).
- **Dark Mode vs. Light Mode:**
  - Segerman's native web experience is dark-first (`background: #00031F; color: #ffffff`).
  - When switched to light mode via `.toggle`, values invert: `background: #ffffff; color: #00031F`.
- **Target Portfolio Adaptation:**
  - Dark Theme: `--bg: #00031F`, `--fg: #FFFFFF`, `--muted: #8E96AB`, `--border: rgba(255, 255, 255, 0.12)`.
  - Light Theme: `--bg: #FFFFFF`, `--fg: #00031F`, `--muted: #565D6D`, `--border: rgba(0, 3, 31, 0.12)`.

### 2.2 Layout Units & Grid Geometry

Segerman rejects 12-column bootstrap frameworks in favor of a bespoke proportional grid:

```css
:root {
  --col: 11.8rem;         /* Base structural column width (118px at 1728px) */
  --unit: 2.4rem;        /* Viewport border padding and gutters (24px at 1728px) */
  --ar: 1.736 / 1;        /* Disciplined project aspect ratio (16:9.22) */
}

@media screen and (max-width: 1099px), screen and (max-width: 1365px) and (pointer: coarse) {
  :root {
    --col: 10.5rem;
    --unit: 2rem;
  }
}

@media screen and (max-width: 767px) {
  :root {
    --col: 7.4rem;
    --unit: 1.6rem;
  }
}
```

### 2.3 Aspect Ratio Discipline

All hero banners, featured work showcases, and project previews are constrained by:
$$\text{Aspect Ratio} = \frac{1.736}{1} \approx 1.736$$
- Dimensions: `width: 54.8rem; height: 31.56rem;` on desktop.
- Mobile: `width: 100%; aspect-ratio: 1.736 / 1;`
- Secondary Next-Project Teaser: `aspect-ratio: 3 / 2` (`12.2rem × 8.0rem`).

### 2.4 Surface Treatments, Borders & Shadows

- **Borders:** Thin architectural hairline borders (`1px solid var(--c-border)`). Never thick outlines or decorative colored strokes.
- **Border Radii:**
  - Overall structure: Sharp architectural corners (`border-radius: 0`).
  - Interactive pill tags / skip-links: Micro-radii (`border-radius: 0.4rem` = 4px).
  - Mode toggle: Circular (`border-radius: 50%`).
- **Shadows:** Zero box-shadows. Depth is created strictly through contrast, typography scale, whitespace, and z-index planes.

### 2.5 Component Design Patterns

#### 1. Architectural Header
- Positioned fixed at `top: var(--unit); left: var(--unit); right: var(--unit);`
- Left: Logo mark with bold text styling (`font-size: 1.7rem; font-weight: 500;`).
- Right: Comma-delimited text navigation (`Info , Contact`) and circular mode toggle.

#### 2. Synchronized Project Index (Desktop)
- Fixed right column at `top: 38vh; right: var(--unit); width: var(--col);`
- Contains `<p class="project-index-title">Index</p>` followed by project rows.
- Each row links to `/work/[slug]` and dynamically activates the corresponding preview image/video on the left stage.

#### 3. Footprint Metadata Lists (`dl.meta`)
- Structured `<dl class="meta">` with uppercase `<dt class="label">` and content `<dd class="text">`.
- Anchored at `bottom: var(--unit); left: var(--unit);`
- Provides Contact email and Availability date with zero layout clutter.

#### 4. Quick-Copy Email Interaction
- `<button class="link" data-email="...">`
- Copies email to clipboard on click.
- Reveals floating `<span class="copied">Email copied!</span>` toast.
- Announces to screen readers via `<span class="visually-hidden" role="status" aria-live="polite">`.
