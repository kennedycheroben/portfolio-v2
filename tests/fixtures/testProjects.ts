import type { Project } from "../../src/lib/projects/types";

/**
 * Test fixture only. Never imported into production application bundles.
 */
export const TEST_FIXTURE_PROJECTS: Project[] = [
  {
    id: "test-benchero-uuid",
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
    coverImageUrl: null,
    gallery: [],
    featured: true,
    sortOrder: 0,
    status: "published",
    liveUrl: "https://benchero-reborn.vercel.app",
    repositoryUrl: null,
    seoTitle: "Benchero — Architectural Case Study",
    seoDescription:
      "Multi-tenant sports club operations platform with row-level security and automated billing workflows.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "test-vault-uuid",
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
      "BIP-39",
      "SQLite",
      "React",
      "TypeScript",
    ],
    projectType: "Native Desktop Security Application",
    role: "Systems & Security Engineer",
    timeline: "2024",
    problem:
      "Users lack sovereign, verifiable tools to create encrypted local backups of chat archives without leaking sensitive metadata to cloud providers.",
    objectives:
      "Build a high-performance local archival engine with verifiable end-to-end encryption and deterministic key derivation.",
    approach:
      "Implement AEAD encryption using ring/chacha20poly1305 and AES-256-GCM in Rust. Store encrypted blobs locally with content-addressed chunk deduplication.",
    implementation:
      "Built with a modular Rust workspace, Tauri v2 desktop IPC, SQLite local catalog, and a streamlined desktop UI.",
    outcomes:
      "Verified local encryption and decryption round-trip benchmarks with zero cloud telemetry.",
    coverImagePath: null,
    coverImageAlt: null,
    coverImageUrl: null,
    gallery: [],
    featured: true,
    sortOrder: 1,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "WhatsApp Vault — Encrypted Archival Engine",
    seoDescription:
      "Local-first encrypted messaging backup engine built with Rust, AES-256-GCM, and Tauri v2.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "test-jdm-uuid",
    slug: "jdm-kenya",
    title: "JDM Kenya Portal",
    category: "Full-Stack Web Application",
    summary:
      "Architected an automotive community hub and verified vehicle registry for Japanese Domestic Market enthusiasts in East Africa.",
    description:
      "Complete design system, responsive UI, search architecture, and authentication workflows.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Node.js"],
    projectType: "Community Portal & Marketplace",
    role: "Lead Full-Stack Engineer & Designer",
    timeline: "2024",
    problem:
      "Car enthusiast communities lack structured, verifiable platforms for technical build logs, verified specs, and community meetups.",
    objectives:
      "Design an authentic, high-speed digital registry and forum optimized for mobile browsing across East Africa.",
    approach:
      "Develop custom dark UI components with automotive typography, rapid search filtering, and lightweight asset loading.",
    implementation:
      "Responsive React application with optimized asset pipelines, image lazy-loading, and client-side filtering.",
    outcomes:
      "Responsive portal serving active automotive community members with sub-100ms client search interactions.",
    coverImagePath: null,
    coverImageAlt: null,
    coverImageUrl: null,
    gallery: [],
    featured: true,
    sortOrder: 2,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "JDM Kenya — Automotive Portal",
    seoDescription:
      "Automotive community platform and vehicle registry for Japanese Domestic Market enthusiasts in East Africa.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "test-mediafusion-uuid",
    slug: "mediafusion",
    title: "MediaFusion",
    category: "Full-Stack Streaming Interface",
    summary:
      "High-craft streaming media catalog interface and digital asset manager with kinetic UI animations and low-latency navigation.",
    description:
      "Interface architecture, video player customization, and responsive grid layouts.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    projectType: "Digital Media Interface",
    role: "Frontend Architect",
    timeline: "2023–2024",
    problem:
      "Media browsers frequently suffer from layout shifts, slow catalog rendering, and cumbersome category navigation.",
    objectives:
      "Deliver a seamless 60fps catalog browsing experience with instant search and responsive card grids.",
    approach:
      "Combine optimistic UI updates with hardware-accelerated CSS animations and responsive image breakpoints.",
    implementation:
      "Designed with fluid grid breakpoints, keyboard shortcut navigation, and dark cinematic theme tokens.",
    outcomes:
      "High-performance media frontend with zero cumulative layout shift and smooth transitions.",
    coverImagePath: null,
    coverImageAlt: null,
    coverImageUrl: null,
    gallery: [],
    featured: false,
    sortOrder: 3,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "MediaFusion — Streaming Interface",
    seoDescription:
      "High-craft streaming media catalog interface and digital asset manager.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "test-unify-uuid",
    slug: "unify-studios",
    title: "Unify Studios 3D & Brand Identity",
    category: "Visual Craft & Motion Systems",
    summary:
      "Creative direction, 3D motion design, and high-fidelity brand design system created for digital product studio initiatives.",
    description:
      "Visual identity guidelines, 3D asset pipeline in Blender, typography scale, and color science.",
    technologies: ["Blender 3D", "Figma", "Design Systems", "Color Theory", "Motion Graphics"],
    projectType: "Brand Identity & 3D Visual System",
    role: "Visual Design Lead",
    timeline: "2024",
    problem:
      "Digital agencies and creative studios struggle to communicate technical expertise without generic corporate branding.",
    objectives:
      "Create a distinct, futuristic brand language featuring obsidian dark surfaces, neon accent hues, and 3D kinetic renders.",
    approach:
      "Develop custom Blender lighting rigs and materials paired with mathematically calibrated typography tokens.",
    implementation:
      "Full brand book, UI token hierarchy, and 3D promotional animations.",
    outcomes:
      "Unified design system deployed across web platforms and marketing surfaces.",
    coverImagePath: null,
    coverImageAlt: null,
    coverImageUrl: null,
    gallery: [],
    featured: false,
    sortOrder: 4,
    status: "published",
    liveUrl: null,
    repositoryUrl: null,
    seoTitle: "Unify Studios — Visual Design & Motion",
    seoDescription:
      "Brand identity and 3D visual motion system for digital product studio initiatives.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
];
