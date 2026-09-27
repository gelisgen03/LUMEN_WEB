"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  label: string;
  names: Record<Locale, string>;
};

/**
 * FR | EN switch, always visible in the header (mobile included).
 * Keeps the current page: /fr/projets/x → /en/projets/x, and the query string
 * (e.g. resource filters) when JS is available.
 */
export function LanguageSwitcher({ locale, label, names }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-full border border-border p-1 text-sm font-semibold">
        {routing.locales.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                lang={l}
                aria-current={active ? "true" : undefined}
                aria-label={names[l]}
                onClick={(e) => {
                  const search = window.location.search;
                  if (!search || e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  router.push(`${pathname}${search}`, { locale: l });
                }}
                className={cn(
                  "inline-flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 uppercase transition-colors",
                  active ? "bg-navy text-white dark:bg-gold dark:text-navy" : "text-muted hover:text-foreground",
                )}
              >
                {l}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
