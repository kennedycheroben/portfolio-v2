export interface Project {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  liveUrl?: string;
  repositoryScope: string;
  architectureHighlights: string[];
  evidenceSummary: string;
  detailedCaseStudy: {
    problem: string;
    architecture: string[];
    technicalDecisions: string[];
    deliverables: string[];
  };
}

export const projects: Project[] = [
  {
    slug: "benchero",
    title: "Benchero",
    category: "Full-Stack SaaS Architecture",
    tagline: "Multi-tenant sports club operations platform with row-level security and automated billing workflows.",
    summary:
      "Architected and built a multi-tenant sports management operating system using React 19, TanStack Start, Supabase (PostgreSQL 17 with Row-Level Security), Drizzle ORM, and Tailwind CSS v4.",
    role: "Full-Stack Architect & Lead Engineer",
    year: "2024–2025",
    stack: [
      "React 19",
      "TanStack Start",
      "TypeScript",
      "Supabase",
      "PostgreSQL 17",
      "Drizzle ORM",
      "Tailwind CSS v4",
    ],
    liveUrl: "https://benchero-reborn.vercel.app",
    repositoryScope:
      "Solo architect and developer of complete application repository, database schemas, and billing workflows.",
    architectureHighlights: [
      "Multi-tenant PostgreSQL schema isolation enforcing organizational boundary integrity via Row-Level Security (RLS).",
      "Type-safe data access layer implemented using Drizzle ORM with zero client-side schema exposure.",
      "Multi-currency subscription workflows supporting mobile money (KES) and digital gateway (USD) server-side verification.",
      "Modern React 19 server-render patterns using TanStack Start for optimized initial page delivery.",
    ],
    evidenceSummary:
      "Physical repository evidence: benchero-reborn package.json, drizzle/schema.ts, src/routes/api/billing, and live staging deployment.",
    detailedCaseStudy: {
      problem:
        "Sports organizations face fragmented tooling across team rosters, fixture schedules, player attendance, and dues collection. Existing solutions lack multi-tenant isolation and localized payment gateways.",
      architecture: [
        "Enforced tenant-level isolation at the database layer using PostgreSQL RLS policies keyed on authenticated user context.",
        "Built server-side API endpoints for payment intent initiation, webhook idempotency, and transaction verification.",
        "Created modern UI dashboard views leveraging Tailwind CSS v4 design tokens and responsive grid layouts.",
      ],
      technicalDecisions: [
        "Chose TanStack Start for unified full-stack routing and type-safe server functions.",
        "Selected Drizzle ORM for lightweight SQL query construction and automated schema migration management.",
        "Enforced strict server-only execution for all financial settlement and billing capture handlers.",
      ],
      deliverables: [
        "Production-ready multi-tenant relational database schema with full RLS policy coverage.",
        "Complete roster, fixture, and organizational dashboard management interfaces.",
        "Verified server-side billing endpoints handling multi-currency payment lifecycles.",
      ],
    },
  },
  {
    slug: "whatsapp-vault",
    title: "WhatsApp Vault",
    category: "Systems & Applied Cryptography",
    tagline: "Encrypted desktop archival engine in Rust featuring AES-256-GCM AEAD, Argon2id, and BIP-39 recovery phrases.",
    summary:
      "Engineered a local archival engine in Rust featuring client-side AES-256-GCM authenticated encryption, Argon2id key derivation, 24-word BIP-39 recovery phrases, and Tauri v2 desktop integration.",
    role: "Systems & Security Engineer",
    year: "2024",
    stack: [
      "Rust",
      "Tauri v2",
      "AES-256-GCM",
      "Argon2id",
      "BIP-39 Mnemonic",
      "Content-Addressed Storage",
    ],
    repositoryScope:
      "Author and engineer of the core Rust cryptographic workspace (crates/crypto, crates/engine, crates/cloud) and desktop packaging.",
    architectureHighlights: [
      "End-to-end client-side encryption using AES-256-GCM AEAD with cryptographically random initialization vectors.",
      "Key derivation implemented via Argon2id configured to resist GPU and ASIC brute-force attacks.",
      "Deterministic root key generation and wallet-standard recovery utilizing 24-word BIP-39 mnemonics.",
      "Content-Addressed Storage (CAS) engine deduplicating media attachments locally without plaintext leakage.",
    ],
    evidenceSummary:
      "Physical repository evidence: whatsapp-vault Cargo.toml, crates/crypto automated test suites, crates/engine CAS implementation.",
    detailedCaseStudy: {
      problem:
        "Archiving message histories and multimedia exports often leaves sensitive personal records in unencrypted plain text on local disks or cloud storage.",
      architecture: [
        "Engineered a multi-crate Rust workspace separating cryptographic primitives from file system indexing.",
        "Designed memory-safe zeroization of sensitive key material upon completion of encryption/decryption operations.",
        "Integrated the Tauri v2 lightweight desktop runtime communicating over typed IPC commands.",
      ],
      technicalDecisions: [
        "Enforced AEAD authenticated encryption to detect tampering or corruption before plaintext extraction.",
        "Adopted BIP-39 mnemonics to enable reliable user-held backup phrases without relying on third-party servers.",
        "Architected modular storage traits allowing extensible backend targets without modifying encryption logic.",
      ],
      deliverables: [
        "Verified cryptographic test suite passing vector checks for encryption and key derivation.",
        "Content-addressed blob storage system for deduplicated local multimedia archival.",
        "Tauri desktop user interface for encrypted archive creation and inspection.",
      ],
    },
  },
  {
    slug: "jdm-kenya",
    title: "JDM Kenya Portal",
    category: "Full-Stack Web & Community Systems",
    tagline: "Production digital portal featuring member directories, sports ministry tracking, and cryptographic password recovery.",
    summary:
      "Developed a production community portal for JDM Kenya featuring member directories, sports ministry tracking, role-based administration, and a cryptographically secure 256-bit token password recovery flow.",
    role: "Full-Stack Developer & Database Architect",
    year: "2023–2024",
    stack: [
      "PHP",
      "MySQL",
      "JavaScript",
      "Tailwind CSS",
      "Role-Based Access Control",
      "Crypto Token Security",
    ],
    liveUrl: "https://jdmkenya.com",
    repositoryScope:
      "Lead developer responsible for portal application code, database schema migrations, and secure account recovery workflows.",
    architectureHighlights: [
      "Role-based access control (RBAC) separating administrative oversight, ministry leaders, and general member access.",
      "Cryptographically secure account recovery utilizing single-use 256-bit hashed tokens with strict time-to-live expirations.",
      "Relational schema models tracking community sports tournaments, schedules, and ministry group rosters.",
      "Responsive, accessible front-end interface optimized for diverse mobile devices across Kenya.",
    ],
    evidenceSummary:
      "Physical repository evidence: JDM_kenya application codebase, database migration scripts, and verified live domain at jdmkenya.com.",
    detailedCaseStudy: {
      problem:
        "The community organization required a centralized platform to coordinate youth sports initiatives, manage ministry rosters, and securely maintain member contact data.",
      architecture: [
        "Designed normalized relational database schemas with foreign key constraints and transactional integrity.",
        "Implemented session security, CSRF protection, and SQL injection prevention across all input vectors.",
        "Built automated email verification and token-based account reset handlers.",
      ],
      technicalDecisions: [
        "Leveraged lightweight server architecture for high uptime and low hosting overhead on regional infrastructure.",
        "Employed utility-first styling to ensure fast stylesheet delivery over constrained mobile networks.",
      ],
      deliverables: [
        "Live community portal deployed at jdmkenya.com.",
        "Administrative dashboard for member records and sports ministry event scheduling.",
        "Hardened authentication and password reset subsystem.",
      ],
    },
  },
  {
    slug: "mediafusion",
    title: "MediaFusion",
    category: "API Automation & Media Syndication",
    tagline: "Cross-platform video syndication pipelines managing OAuth 2.0 token lifecycles for YouTube, TikTok, and Meta.",
    summary:
      "Implemented automated video syndication scripts in PHP and Python, managing OAuth 2.0 token refresh lifecycles and upload workflows across YouTube Data API, TikTok API, and Meta Graph API.",
    role: "Integration Engineer & Script Developer",
    year: "2023",
    stack: [
      "Python",
      "PHP",
      "OAuth 2.0",
      "YouTube Data API",
      "TikTok API",
      "Meta Graph API",
    ],
    repositoryScope:
      "Author of video upload automation scripts, OAuth callback handlers, and token persistence logic.",
    architectureHighlights: [
      "Unified OAuth 2.0 authentication handshake supporting multi-platform developer apps.",
      "Automated token refresh rotation preventing pipeline disruption during long-running batch uploads.",
      "Resumable video upload pipelines with chunked binary transport to accommodate large media files.",
    ],
    evidenceSummary:
      "Physical repository evidence: mediafusion/backend/python/uploader.py, callback_meta.php, and API client scripts.",
    detailedCaseStudy: {
      problem:
        "Distributing video content across multiple social platforms manually is repetitive and prone to credential handling mistakes and upload failures.",
      architecture: [
        "Constructed programmatic pipeline receiving video assets and dispatching uploads asynchronously.",
        "Implemented secure token store encrypting refresh tokens and handling platform-specific token expirations.",
      ],
      technicalDecisions: [
        "Separated upload scheduling into Python worker scripts to utilize official Google and Meta API client capabilities.",
        "Built web callback listeners in PHP for handling initial OAuth permission grants.",
      ],
      deliverables: [
        "Working multi-platform video upload pipeline scripts.",
        "OAuth 2.0 token management handlers for YouTube, TikTok, and Meta APIs.",
      ],
    },
  },
  {
    slug: "unify-design",
    title: "Unify Studios 3D & Brand Identity",
    category: "Creative Technology & Visual Craft",
    tagline: "Kinetic 3D product launch animation and high-craft brand identity systems.",
    summary:
      "Directed and produced 3D kinetic product launch animations and brand reveal graphics utilizing Blender, After Effects, and modern front-end design systems.",
    role: "Creative Director & 3D Motion Artist",
    year: "2023–2024",
    stack: [
      "Blender",
      "After Effects",
      "Design Systems",
      "Next.js",
      "Cinema 3D Craft",
    ],
    repositoryScope:
      "Creative direction, 3D modeling, lighting, rendering, and web portfolio showcase implementation.",
    architectureHighlights: [
      "High-fidelity 3D modeling, surface texturing, and dynamic lighting pipelines in Blender.",
      "Optimized video compression pipelines producing high-detail motion assets at low bitrates for web delivery.",
      "Harmonious typographic and visual layout design establishing brand distinction.",
    ],
    evidenceSummary:
      "Physical repository evidence: unify-studios-portfolio codebase, Product Launch Animation.mp4, unifyvideo.mp4 assets.",
    detailedCaseStudy: {
      problem:
        "Digital products frequently launch with generic flat mockups that fail to command attention in crowded competitive markets.",
      architecture: [
        "Built 3D kinetic sequences showcasing device features, materials, and lighting transitions.",
        "Composed soundtrack and motion timing for impact and rhythm.",
      ],
      technicalDecisions: [
        "Rendered in high-bitrate masters before encoding web-optimized MP4/WebM deliverables.",
        "Ensured visual motifs integrated cleanly into responsive web design layouts.",
      ],
      deliverables: [
        "Rendered high-resolution 3D product launch animation video assets.",
        "Brand design system guidelines, color palettes, and typographic scales.",
      ],
    },
  },
];
