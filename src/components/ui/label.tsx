import React from "react";
import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-xs font-semibold text-ink-700", className)} {...props} />
);
