import React from "react";
import type { Project } from "../../lib/projects/types";

interface ProjectCoverProps {
  project: Project;
  index: number;
  size?: "md" | "lg";
}

export const ProjectCover: React.FC<ProjectCoverProps> = ({ project, index, size = "md" }) => {
  if (project.coverImageUrl) {
    return (
      <img
        src={project.coverImageUrl}
        alt={project.coverImageAlt || project.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-surface p-5 blueprint md:p-7 select-none"
    >
      <div className="flex justify-between items-center label-mono z-10">
        <span className="text-secondary">{project.category}</span>
        <span className="text-muted">{project.timeline}</span>
      </div>

      <span
        className={`pointer-events-none absolute -bottom-8 -right-4 font-display font-extrabold leading-none text-white/5 transition-colors duration-500 group-hover:text-emerald-500/20 ${
          size === "lg" ? "text-[14rem] md:text-[20rem]" : "text-[9rem] md:text-[12rem]"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <ul className="relative z-10 flex max-w-[85%] flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
        {project.technologies.slice(0, 5).map((t) => (
          <li key={t} className="flex items-center gap-1">
            <span className="text-emerald-400">›</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
