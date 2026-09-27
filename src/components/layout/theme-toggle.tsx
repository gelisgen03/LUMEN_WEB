"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme-script";

export function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    // Follow system changes until the visitor makes an explicit choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {}
      document.documentElement.classList.toggle("dark", e.matches);
      setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark ?? undefined}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-foreground"
    >
      {/* Icon chosen by CSS so the server render is already correct. */}
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 text-gold dark:block" />
    </button>
  );
}
