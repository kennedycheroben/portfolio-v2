import type { ProjectInput } from "./schema";

/**
 * Authentic portfolio records preserved from Kennedy Cheroben's verified portfolio.
 * Available for optional 1-click import in the Admin Dashboard.
 */
export const LEGACY_PORTFOLIO_PROJECTS: ProjectInput[] = [
  {
    slug: "benchero",
    title: "Benchero",
    category: "Full-Stack SaaS Architecture",
    summary:
      "Architected and built a multi-tenant sports management operating system using React 19, TanStack Start, Supabase (PostgreSQL 17 with Row-Level Security), Drizzle ORM, and Tailwind CSS v4.",
    description:
      "Solo architect and developer of complete application repository, database schemas, and billing workflows. Built multi-tenant isolation, automated billing, and live staging deployment.",
    technologies: [
      "React 19",
      "TanStack Start",
      "TypeScript",
      "Supabase",
      "PostgreSQL 17",
      "Drizzle ORM",
      "Tailwind CSS v4",
    ],
    projectType: "Production SaaS Application",
    role: "Full-Stack Architect & Lead Engineer",
    timeline: "2024–2025",
    problem:
      "Sports organizations face fragmented tooling across team rosters, fixture schedules, player attendance, and dues collection. Existing solutions lack multi-tenant isolation and localized payment gateways.",
    objectives:
      "Architect a robust, isolated multi-tenant system with automated multi-currency billing and real-time team management.",
    approach:
      "Enforce tenant-level isolation at the database layer using PostgreSQL RLS policies keyed on authenticated user context. Build server-side API endpoints for payment intent initiation, webhook idempotency, and transaction verification.",
    implementation:
      "Implemented using TanStack Start with React 19, PostgreSQL 17 with RLS, Drizzle ORM for type-safe data access, and Tailwind CSS v4 design tokens.",
    outcomes:
      "Production-ready multi-tenant relational database schema with full RLS policy coverage. Complete roster, fixture, and organizational dashboard management interfaces.",
    coverImagePath: null,
    coverImageAlt: null,
    gallery: [],
    featured: true,
    sortOrder: 0,
    status: "published",
    liveUrl: "https://benchero-reborn.vercel.app",
    repositoryUrl: null,
    seoTitle: "Benchero — Architectural Case Study",
    seoDescription:
      "Multi-tenant sports club operations platform with row-level security and automated billing workflows.",
  },
  {
    slug: "whatsapp-vault",
    title: "WhatsApp Vault",
    category: "Systems & Applied Cryptography",
    summary:
      "Engineered a local archival engine in Rust featuring client-side AES-256-GCM authenticated encryption, Argon2id key derivation, 24-word BIP-39 recovery phrases, and Tauri v2 desktop integration.",
    description:
      "Author and engineer of the core Rust cryptographic workspace (crates/crypto, crates/engine, crates/cloud) and desktop packaging.",
    technologies: [
      "Rust",
      "Tauri v2",
      "AES-256-GCM",
      "Argon2id",
      "BIP-39 Mnemonic",
      "Content-Addressed Storage",
    ],
    projectType: "Desktop Security Application",
    role: "Systems & Security Engineer",
    timeline: "2024",
    problem:
      "Archiving message histories and multimedia exports often leaves sensitive personal records in unencrypted plain text on local disks or cloud storage.",
    objectives:
      "Provide zero-knowledge, encrypted local desktop storage for sensitive communication archives without relying on centralized third-party cloud servers.",
    approach:
      "End-to-end client-side encryption using AES-256-GCM AEAD with cryptographically random initialization vectors. Argon2id key derivation resistant to GPU/ASIC brute-force. Deterministic root key generation via 24-word BIP-39 mnemonics.",
    implementation:
      "Engineered multi-crate Rust workspace separating cryptographic primitives from file system indexing. Integrated Tauri v2 desktop runtime communicating over typed IPC.",
    outcomes:
      "Verified cryptographic test suite passing vector checks for encryption and key derivation. Content-addressed blob storage system for deduplicated local multimedia archival.",
    coverImagePath: null,
    coverImageAlt: null,
    gallery: [],
    featured: true,
    sortOrder: 1,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "WhatsApp Vault — Applied Cryptography Case Study",
    seoDescription:
      "Encrypted desktop archival engine in Rust featuring AES-256-GCM AEAD, Argon2id, and BIP-39 recovery phrases.",
  },
  {
    slug: "jdm-kenya",
    title: "JDM Kenya Portal",
    category: "Full-Stack Web & Community Systems",
    summary:
      "Developed a production community portal for JDM Kenya featuring member directories, sports ministry tracking, role-based administration, and a cryptographically secure 256-bit token password recovery flow.",
    description:
      "Lead developer responsible for portal application code, database schema migrations, and secure account recovery workflows.",
    technologies: [
      "PHP",
      "MySQL",
      "JavaScript",
      "Tailwind CSS",
      "Role-Based Access Control",
      "Crypto Token Security",
    ],
    projectType: "Web Portal & Community Platform",
    role: "Full-Stack Developer & Database Architect",
    timeline: "2023–2024",
    problem:
      "The community organization required a centralized platform to coordinate youth sports initiatives, manage ministry rosters, and securely maintain member contact data.",
    objectives:
      "Build a reliable, high-uptime digital directory with RBAC and mobile-friendly UI optimized for varying connectivity across Kenya.",
    approach:
      "Role-based access control separating administrative oversight, ministry leaders, and general member access. Single-use 256-bit hashed tokens with TTL for account recovery.",
    implementation:
      "Designed normalized relational database schemas with foreign key constraints, session security, CSRF protection, and responsive styling.",
    outcomes:
      "Live community portal deployed at jdmkenya.com with administrative dashboard and hardened authentication.",
    coverImagePath: null,
    coverImageAlt: null,
    gallery: [],
    featured: true,
    sortOrder: 2,
    status: "published",
    liveUrl: "https://jdmkenya.com",
    repositoryUrl: null,
    seoTitle: "JDM Kenya Portal — Production Web System",
    seoDescription:
      "Production digital portal featuring member directories, sports ministry tracking, and cryptographic password recovery.",
  },
  {
    slug: "mediafusion",
    title: "MediaFusion",
    category: "API Automation & Media Syndication",
    summary:
      "Implemented automated video syndication scripts in PHP and Python, managing OAuth 2.0 token refresh lifecycles and upload workflows across YouTube Data API, TikTok API, and Meta Graph API.",
    description:
      "Author of video upload automation scripts, OAuth callback handlers, and token persistence logic.",
    technologies: [
      "Python",
      "PHP",
      "OAuth 2.0",
      "YouTube Data API",
      "TikTok API",
      "Meta Graph API",
    ],
    projectType: "Automated Integration Pipeline",
    role: "Integration Engineer & Script Developer",
    timeline: "2023",
    problem:
      "Distributing video content across multiple social platforms manually is repetitive and prone to credential handling mistakes and upload failures.",
    objectives:
      "Automate cross-platform uploads with resumable chunked transfers and automatic OAuth token refresh cycles.",
    approach:
      "Unified OAuth 2.0 authentication handshake supporting multi-platform developer apps, automated token refresh rotation, and resumable chunked binary transport.",
    implementation:
      "Separated upload scheduling into Python worker scripts to utilize official Google and Meta API client capabilities, with web callback listeners in PHP.",
    outcomes:
      "Working multi-platform video upload pipeline scripts with OAuth 2.0 token management handlers.",
    coverImagePath: null,
    coverImageAlt: null,
    gallery: [],
    featured: false,
    sortOrder: 3,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "MediaFusion — API Automation Case Study",
    seoDescription:
      "Cross-platform video syndication pipelines managing OAuth 2.0 token lifecycles for YouTube, TikTok, and Meta.",
  },
  {
    slug: "unify-design",
    title: "Unify Studios 3D & Brand Identity",
    category: "Creative Technology & Visual Craft",
    summary:
      "Directed and produced 3D kinetic product launch animations and brand reveal graphics utilizing Blender, After Effects, and modern front-end design systems.",
    description:
      "Creative direction, 3D modeling, lighting, rendering, and web portfolio showcase implementation.",
    technologies: [
      "Blender",
      "After Effects",
      "Design Systems",
      "Next.js",
      "Cinema 3D Craft",
    ],
    projectType: "3D Motion & Design System",
    role: "Creative Director & 3D Motion Artist",
    timeline: "2023–2024",
    problem:
      "Digital products frequently launch with generic flat mockups that fail to command attention in crowded competitive markets.",
    objectives:
      "Craft high-craft 3D kinetic sequences and a cohesive visual identity system to communicate premium product quality.",
    approach:
      "High-fidelity 3D modeling, surface texturing, and dynamic lighting pipelines in Blender, with optimized web-friendly compression.",
    implementation:
      "Composed 3D kinetic sequences in Blender, soundtrack and motion timing in After Effects, with brand design guidelines.",
    outcomes:
      "Rendered high-resolution 3D product launch animation video assets and brand design system guidelines.",
    coverImagePath: null,
    coverImageAlt: null,
    gallery: [],
    featured: false,
    sortOrder: 4,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "Unify Studios 3D & Brand Identity Case Study",
    seoDescription:
      "Kinetic 3D product launch animation and high-craft brand identity systems.",
  },
];

import type { Project } from "./types";

export const LEGACY_MOCK_PROJECTS: Project[] = LEGACY_PORTFOLIO_PROJECTS.map((p, idx) => ({
  ...p,
  id: `legacy-${p.slug}`,
  coverImageUrl: null,
  publishedAt: "2024-01-01T00:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  sortOrder: p.sortOrder ?? idx,
}));
