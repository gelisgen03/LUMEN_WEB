/** Main navigation, in display order. Labels come from messages → nav.{key}. */
export const navItems = [
  { key: "home", href: "/", icon: "light" },
  { key: "association", href: "/association", icon: "compass" },
  { key: "actions", href: "/actions", icon: "target" },
  { key: "projets", href: "/projets", icon: "rocket" },
  { key: "partenaires", href: "/partenaires", icon: "partnership" },
  { key: "contact", href: "/contact", icon: "participation" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];
