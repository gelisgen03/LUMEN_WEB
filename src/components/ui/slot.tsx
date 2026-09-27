import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal replacement for @radix-ui/react-slot: merges props and className
 * into its single child. Keeps `asChild` without shipping Radix to the client.
 */
export function Slot({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement<{ className?: string }>(children)) return null;
  return React.cloneElement(children, {
    ...props,
    ...children.props,
    className: cn(className, children.props.className),
  });
}
