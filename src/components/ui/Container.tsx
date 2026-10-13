import React from "react";
import clsx from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "editorial" | "wide";
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  size = "default",
  className,
  children,
  ...props
}) => {
  const maxWidthClass = {
    default: "max-w-[1240px]",
    editorial: "max-w-[760px]",
    wide: "max-w-[1440px]",
  }[size];

  return (
    <div
      className={clsx(
        "w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
