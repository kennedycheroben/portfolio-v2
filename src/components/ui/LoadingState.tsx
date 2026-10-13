import React from "react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading content...",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-12 flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-mono text-muted tracking-wide animate-pulse">
        {message}
      </p>
      <span className="sr-only">{message}</span>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-subtle animate-pulse space-y-4">
      <div className="w-full h-48 bg-surface-elevated rounded-xl"></div>
      <div className="w-1/3 h-4 bg-surface-elevated rounded"></div>
      <div className="w-3/4 h-6 bg-surface-elevated rounded"></div>
      <div className="w-full h-12 bg-surface-elevated rounded"></div>
      <div className="flex gap-2 pt-2">
        <div className="w-16 h-6 bg-surface-elevated rounded-full"></div>
        <div className="w-20 h-6 bg-surface-elevated rounded-full"></div>
      </div>
    </div>
  );
};
