import React from "react";
import { cn } from "@/lib/utils";

export const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn("input", className)} {...props} />
);
