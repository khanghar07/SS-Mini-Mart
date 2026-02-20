import React from "react";
import { cn } from "@/lib/utils";

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn("input", className)} {...props} />
);
