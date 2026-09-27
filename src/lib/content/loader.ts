import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import type { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export type Entry<T> = T & {
  /** Raw MDX body (without frontmatter). */
  body: string;
  /** Locale the entry was actually read from (falls back to the default locale). */
  sourceLocale: Locale;
};

function readDir(collection: string, locale: Locale): string[] {
  const dir = path.join(CONTENT_DIR, collection, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function parseFile<S extends z.ZodType>(file: string, schema: S): { data: z.infer<S>; body: string } {
  const raw = fs.readFileSync(file, "utf8");
  // gray-matter parses unquoted YAML dates into Date objects; keep them as strings.
  const { data, content } = matter(raw, { language: "yaml" });
  const normalized = JSON.parse(
    JSON.stringify(data, (_k, v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v)),
  );
  const result = schema.safeParse(normalized);
  const rel = path.relative(process.cwd(), file);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`Invalid frontmatter in ${rel}\n${issues}`);
  }
  const parsed = result.data as z.infer<S> & { slug?: string };
  const fileSlug = path.basename(file, ".mdx");
  if (parsed.slug !== undefined && parsed.slug !== fileSlug) {
    throw new Error(`Slug mismatch in ${rel}: frontmatter "${parsed.slug}" vs file name "${fileSlug}"`);
  }
  return { data: parsed, body: content };
}

/**
 * Loads a collection for a locale. Entries missing in the requested locale
 * fall back to the default locale (FR), so a partial EN translation never breaks the site.
 */
export function createCollection<S extends z.ZodType>(collection: string, schema: S) {
  const load = cache((locale: Locale): Entry<z.infer<S>>[] => {
    const files = new Map<string, { file: string; locale: Locale }>();
    for (const f of readDir(collection, routing.defaultLocale)) {
      files.set(f, { file: path.join(CONTENT_DIR, collection, routing.defaultLocale, f), locale: routing.defaultLocale });
    }
    if (locale !== routing.defaultLocale) {
      for (const f of readDir(collection, locale)) {
        files.set(f, { file: path.join(CONTENT_DIR, collection, locale, f), locale });
      }
    }
    return [...files.values()].map(({ file, locale: sourceLocale }) => {
      const { data, body } = parseFile(file, schema);
      return { ...(data as object), body, sourceLocale } as Entry<z.infer<S>>;
    });
  });

  return {
    all: load,
    get: (locale: Locale, slug: string) => load(locale).find((e) => (e as { slug?: string }).slug === slug),
  };
}


/** Reads a standalone page (legal notice, privacy) for a locale, falling back to FR. */
export function readPage<S extends z.ZodType>(name: string, locale: Locale, schema: S) {
  const localized = path.join(CONTENT_DIR, "pages", locale, `${name}.mdx`);
  const fallback = path.join(CONTENT_DIR, "pages", routing.defaultLocale, `${name}.mdx`);
  return parseFile(fs.existsSync(localized) ? localized : fallback, schema);
}
