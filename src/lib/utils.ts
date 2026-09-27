import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const localeTag = (locale: string) => (locale === "fr" ? "fr-FR" : "en-GB");

export function formatDate(value: string, locale: string, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) {
  // Date-only strings are parsed as UTC; pin the timezone so the day never shifts.
  const date = value.length === 10 ? new Date(`${value}T12:00:00Z`) : new Date(value);
  return new Intl.DateTimeFormat(localeTag(locale), { timeZone: "Europe/Paris", ...opts }).format(date);
}

export function formatBytes(bytes: number, locale: string) {
  const units = ["o", "Ko", "Mo", "Go"];
  const unitsEn = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  const num = new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: i === 0 ? 0 : 1 }).format(n);
  return `${num} ${(locale === "fr" ? units : unitsEn)[i]}`;
}

/** Small deterministic hash, used to seed generated patterns. */
export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
