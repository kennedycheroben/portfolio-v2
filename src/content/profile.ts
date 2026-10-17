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
    "Building high-performance web applications and clean digital experiences. Bridging solid full-stack engineering with thoughtful visual design.",
  fullBio: [
    "I am a Visual Design Specialist and Full-Stack Developer based in Nairobi, Kenya. I combine clean technical implementation with thoughtful visual design.",
    "On the engineering side, I build responsive web applications using HTML, CSS, JavaScript, TypeScript, React, Next.js, PHP, Node.js, Supabase, and PostgreSQL. On the design side, I create intuitive design systems, 3D graphics in Blender, and accessible user interfaces that communicate clearly.",
    "I believe great digital products need both reliable engineering beneath the surface and polished design on top.",
  ],
  location: "Nairobi, Kenya",
  experienceYears: "2+ Years",
  status: "Available for selected engineering & visual design projects",
  email: "kennedycheroben001@gmail.com",
  skills: {
    engineering: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PHP",
      "Supabase",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
    ],
    design: [
      "Design Systems",
      "UI/UX Design",
      "Motion Design",
      "3D Graphics & Blender",
      "Responsive Layouts",
      "Web Accessibility",
    ],
    systems: [
      "Rust",
      "Tauri v2",
      "Database Design & SQL",
      "Linux & Git",
    ],
  },
  contact: {
    city: "Nairobi",
    country: "Kenya",
    messageNote:
      "Direct inquiries regarding web development, full-stack engineering, or visual design collaboration can be submitted via the contact form or email.",
  },
};
