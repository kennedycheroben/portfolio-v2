import React, { type ReactNode } from "react";

interface SectionLabelProps {
  n: string;
  children: ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ n, children, className = "" }) => {
  return (
    <p className={`flex items-center gap-3 label-mono ${className}`}>
      <span className="text-emerald-400 font-bold">{n}</span>
      <span className="h-px w-8 bg-subtle" />
      <span className="tracking-widest">{children}</span>
    </p>
  );
};
