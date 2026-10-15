export interface ProfileData {
  name: string;
  title: string;
  shortBio: string;
  fullBio: string[];
  location: string;
  experienceYears: string;
  status: string;
  email: string;
  skills: {
    engineering: string[];
    design: string[];
    systems: string[];
  };
  contact: {
    city: string;
    country: string;
    messageNote: string;
  };
}

export const profile: ProfileData = {
  name: "Kennedy Cheroben",
  title: "Visual Design Specialist & Full-Stack Developer",
  shortBio:
    "Architecting high-performance digital experiences and resilient full-stack systems. Bridging technical engineering rigor with high-craft visual design.",
  fullBio: [
    "I am a Visual Design Specialist and Full-Stack Developer based in Nairobi, Kenya. My work bridges the gap between deep technical implementation and refined visual aesthetics.",
    "On the engineering side, I build modern web applications and systems software utilizing React, TypeScript, Rust, PostgreSQL, and scalable API architectures. On the design side, I craft high-fidelity design systems, 3D motion graphics, and accessible user interfaces that communicate value effortlessly.",
    "I believe great digital products require both structural integrity beneath the surface and uncompromising visual polish on top.",
  ],
  location: "Nairobi, Kenya",
  experienceYears: "2+ Years",
  status: "Available for selected engineering & visual design projects",
  email: "kennedycheroben001@gmail.com",
  skills: {
    engineering: [
      "TypeScript",
      "React 19",
      "TanStack Start",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "REST & GraphQL APIs",
      "Tailwind CSS",
    ],
    design: [
      "Design Systems",
      "UI/UX Architecture",
      "Motion Design",
      "3D Graphics & Blender",
      "Responsive Layouts",
      "WCAG Accessibility",
    ],
    systems: [
      "Rust",
      "Tauri v2",
      "Applied Cryptography (AES-GCM / Argon2id)",
      "Database Schemas & RLS",
      "Content-Addressed Storage",
    ],
  },
  contact: {
    city: "Nairobi",
    country: "Kenya",
    messageNote:
      "Direct inquiries regarding software architecture, full-stack development, or visual design collaboration can be submitted via the contact form.",
  },
};
