/**
 * Re-mounted on every navigation (unlike layout.tsx), so each page gets a short,
 * soft fade-in. Header and footer stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
