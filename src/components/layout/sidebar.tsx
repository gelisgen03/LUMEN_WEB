"use client";

import { ArrowRight, Mail, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SidebarItem = { href: string; label: string; description: string; icon: React.ReactNode };

type Props = {
  items: SidebarItem[];
  logo: React.ReactNode;
  tagline: string;
  email: string;
  cta: { href: string; label: string };
  labels: { open: string; close: string; menu: string; main: string };
  /** Language switcher + theme toggle */
  controls: React.ReactNode;
};

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Sidebar drawer on every screen size (native <dialog>: focus trap, Escape and
 * inert background for free). Slides in from the left, items cascade in.
 */
export function Sidebar({ items, logo, tagline, email, cta, labels, controls }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  // Close when clicking the backdrop.
  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) ref.current.close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={labels.open}
        aria-haspopup="dialog"
        title={labels.menu}
        className="burger group relative grid size-11 place-items-center rounded-full"
      >
        <span aria-hidden className="flex w-7 flex-col items-end gap-[6px]">
          <span className="burger-line w-7" />
          <span className="burger-line w-5" />
          <span className="burger-line w-6" />
        </span>
      </button>

      <dialog ref={ref} className="drawer" aria-label={labels.main} onClick={onClick}>
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border p-5">
            {logo}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label={labels.close}
              className="grid size-11 place-items-center rounded-full border border-border transition-transform hover:rotate-90 hover:border-gold"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <nav aria-label={labels.main} className="flex-1 p-3">
            <ul className="space-y-1">
              {items.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="drawer-item" style={{ "--i": i } as React.CSSProperties}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-4 rounded-2xl p-3 transition-colors",
                        active ? "bg-surface" : "hover:bg-surface",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105",
                          active ? "bg-gold text-navy" : "bg-surface text-accent-text group-hover:bg-gold group-hover:text-navy",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-semibold">
                          <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          {item.label}
                        </span>
                        <span className="block truncate text-sm text-muted">{item.description}</span>
                      </span>
                      <ArrowRight aria-hidden className="size-4 shrink-0 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="drawer-item space-y-4 border-t border-border p-5" style={{ "--i": items.length } as React.CSSProperties}>
            <div className="flex items-center gap-2">{controls}</div>
            <Link
              href={cta.href}
              className="btn-shine flex h-12 items-center justify-center gap-2 rounded-full bg-gold font-semibold text-navy"
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-muted hover:text-accent-text">
              <Mail aria-hidden className="size-4" />
              {email}
            </a>
            <p className="text-sm italic text-muted">{tagline}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
