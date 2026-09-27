import * as React from "react";
import { cn } from "@/lib/utils";

// Adapted from shadcn/ui Input / Textarea / Label; native <select> instead of Radix to keep JS small.

const field =
  "w-full rounded-xl border border-border bg-background px-3 text-base text-foreground " +
  "placeholder:text-muted hover:border-border-strong focus-visible:border-cyan " +
  "aria-[invalid=true]:border-[#b91c1c] dark:aria-[invalid=true]:border-[#fca5a5] aria-[invalid=true]:border-2 disabled:opacity-50";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, "min-h-40 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(field, "h-12 appearance-none bg-no-repeat pr-10", className)} style={{ backgroundImage: chevron, backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }} {...props}>
      {children}
    </select>
  );
}

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23525c6e' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-base font-medium", className)} {...props} />;
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-[#b91c1c] dark:text-[#fca5a5]">
      {children}
    </p>
  );
}
