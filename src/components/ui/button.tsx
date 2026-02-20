import React from "react";
import { cn } from "@/lib/utils";

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}) => {
  const base = "btn";
  const variantClass =
    variant === "outline" ? "btn-outline" : variant === "ghost" ? "text-ink-900 hover:bg-night-800" : "btn-primary";
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2";

  return (
    <button className={cn(base, variantClass, sizeClass, className)} {...props}>
      {children}
    </button>
  );
};
