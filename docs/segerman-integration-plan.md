# Segerman Design Experience Integration Plan

**Project:** `portfolio2.0` (`/home/cheroben/Projects/portfolio2.0`)  
**Target Visual & Motion Reference:** [https://segerman.dev/](https://segerman.dev/)  
**Identity:** Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer  
**Branch:** `feature/segerman-design-experience`

---

## 1. Audit of the Existing Portfolio Base

### 1.1 Architecture & Stack
- **Framework:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
- **Routing:** React Router v7 with dual-mode hydration (`src/entry.client.tsx`, `src/entry.server.tsx`).
- **Static Site Generation (SSG):** Node.js prerender script (`scripts/prerender.js`) pre-compiles all public routes into static HTML files in `dist/` with zero hydration discrepancies.
- **Data Layer:** Supabase-backed CMS with server-side mock fallback (`src/lib/server/db.ts`), client context provider (`src/lib/projects/PublicProjectsContext.tsx`), and deterministic sorting and filtering (`src/lib/projects/selectors.ts`).
- **Admin Enclave:** Protected administrative dashboard at `/admin` (`AdminLayout`, `AdminLogin`, `AdminDashboard`, `ProjectEditor`) with Supabase auth and local session fallback.
- **Inquiry & Contact System:** Backend validation via Zod schemas and API handler in `src/lib/server/apiRouter.ts`.
- **Legal & Compliance:** Privacy Policy (`/privacy`), Terms of Service (`/terms`), Visitor Guide & FAQ (`/guide`).
- **Test Suite:** 54 Vitest unit, accessibility, hydration parity, SEO metadata, prerendering, and security tests running cleanly.

### 1.2 Areas Requiring Visual & Architectural Evolution
1. **Generic Design Patterns:** The current homepage uses standard card grids, pill badges, and green-glowing tech cards common to AI-generated developer portfolios. It needs to transition to Segerman's clean, high-craft editorial aesthetic.
2. **Typography Scale:** Needs Segerman's fluid root font scaling (`0.5787037037vw` desktop scale) with dominant uppercase display headings (`font-size: 10.4rem` hero, `12rem` case studies, `22rem` info).
3. **Viewport Choreography:** Implement the desktop viewport stage where content is anchored with architectural precision (`var(--col)`, `var(--unit)`), featuring an interactive project index with live preview switching.
4. **Motion Discipline:** Replace generic CSS animations with centralized, hardware-accelerated easing curves (`power3.inOut`, `power2.out`), page entry choreography, email-copied feedback, and strict `prefers-reduced-motion` compliance.

---

## 2. Component & File Modification Matrix

| Component / Layer | Current State | Segerman Integration Target | Key Files to Modify |
| :--- | :--- | :--- | :--- |
| **Design Tokens** | Standard slate/emerald tokens with generic gradients in `tokens.css`. | Segerman-measured tokens: `--c-black: #00031F`, `--c-white: #ffffff`, `--col: 11.8rem`, `--unit: 2.4rem`, `--ar: 1.736/1`, fluid REM scaling, and cinematic cubic-bezier motion curves. | `src/styles/tokens.css`, `src/styles/index.css` |
| **Header & Nav** | Floating blur navbar with badge and standard links. | Architectural top-anchored header (`top: var(--unit); left: var(--unit)`), uppercase logo mark, comma-delimited navigation ("Work, About, Guide, Contact"), email copy interaction, and circular mode toggle. | `src/components/layout/Header.tsx` |
| **Footer** | 4-column tech footer with links and social icons. | Segerman minimal definition list (`<dl class="meta">`) anchored at `bottom: var(--unit); left: var(--unit)` with Contact, Availability, Location, and bottom-right copyright. | `src/components/layout/Footer.tsx` |
| **Home Hero & Showcase** | Stacked hero with avatar photo veil and card grid below. | Viewport-pinned theatrical stage with giant display title (`Creative Developer` / `Visual Design Specialist`), statement text, interactive right-side `"Index"` column, and central synchronized preview canvas driven by Supabase projects. | `src/pages/Home.tsx` |
| **Work Index & Showcase** | Card grid with category filter buttons. | Editorial project directory with dual-mode presentation (staggered editorial showcase + right-side quick index) and full keyboard accessibility. | `src/pages/Work.tsx` |
| **Case Study Detail** | Standard hero banner, 2-column info and content sections. | Segerman `/work/[slug]` layout: giant centered headline (`12rem`), metadata column (Year, Role, Visit with arrow), 1.736:1 media gallery, and anchored bottom-right `"Next Project"` preview thumbnail. | `src/pages/CaseStudy.tsx` |
| **About / Info Page** | Split grid with narrative bio and skill badges. | Segerman `/info` layout: massive display title (`22rem`), offset text lines, portrait media card (`54.8rem`), broad editorial paragraphs, and structured `Tools` and `Awards` definitions. | `src/pages/About.tsx` |
| **Contact Experience** | Standalone form page with contact inputs. | Direct copy-to-clipboard button with visual tooltip and aria-live status, paired with an accessible full inquiry form and mailto fallback. | `src/pages/Contact.tsx`, `src/components/layout/Header.tsx` |
| **Motion & Transitions** | Ad-hoc CSS keyframes in `index.css`. | Centralized motion engine (`useReducedMotion`, smooth page transitions, preloader sequence, hardware-accelerated transforms). | `src/hooks/useReducedMotion.ts`, `src/styles/tokens.css`, `src/components/layout/Layout.tsx` |

---

## 3. Strict Non-Negotiable Requirements Checklist

- [x] **Supabase CMS Project Source:** Projects loaded dynamically via `usePublishedProjects()`. No hardcoding of project records.
- [x] **Admin Dashboard Preserved:** Private `/admin` route with authentication and project management intact.
- [x] **Zero Hydration Mismatch:** Server and client markup match 100% on all prerendered static routes.
- [x] **Contact Backend Validation:** Preserves Zod validation and API endpoint in `src/lib/server/apiRouter.ts`.
- [x] **No AI-Generated Clichés:** No neon gradients, floating orbs, glass pills, or generic AI styling.
- [x] **Accessibility (WCAG AA):** Full keyboard navigation, visible focus indicators, screen reader labels, semantic HTML, and `prefers-reduced-motion` compliance.

---

## 4. Phased Execution Roadmap

1. **Phase 3: Design System Foundation**
   - Update `tokens.css` and `index.css` with Segerman color palette (`#00031F` / `#ffffff`), fluid typography root scaling, layout grid units (`--col`, `--unit`, `--ar`), and motion timing curves.
2. **Phase 4.1: Navigation, Header & Footer**
   - Rebuild `Header.tsx` with Segerman layout, email copy-to-clipboard action, and circular theme toggle.
   - Rebuild `Footer.tsx` with `<dl class="meta">` definition lists and copyright positioning.
3. **Phase 4.2: Home Page Redesign**
   - Rebuild `Home.tsx` to feature the theatrical layout: massive headline, mission statement, central project media preview, and right-column `"Index"` with project titles from Supabase.
4. **Phase 4.3: Work & Case Study Experiences**
   - Redesign `Work.tsx` and `CaseStudy.tsx` mirroring the observed `/work/estrela` structure.
5. **Phase 4.4: About Page Redesign**
   - Redesign `About.tsx` mirroring the observed `/info` structure with massive headline, offset lines, and tools/awards definitions.
6. **Phase 4.5: Contact & Polish**
   - Polish `Contact.tsx`, `Resume.tsx`, and `Guide.tsx` ensuring consistent typography and layout.
7. **Phase 5: Verification & Testing**
   - Run typecheck, lint, vitest (54 tests), build, static prerendering, and verify zero regressions.
