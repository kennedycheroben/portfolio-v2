import React from "react";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "outline" | "success" | "warning";
  mono?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  mono = true,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border select-none transition-colors";

  const variantStyles = {
    default:
      "bg-surface text-secondary border-subtle",
    brand:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    outline:
      "bg-transparent text-secondary border-subtle hover:border-emerald-500/40",
    success:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  }[variant];

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles,
        mono ? "font-mono" : "font-body",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
