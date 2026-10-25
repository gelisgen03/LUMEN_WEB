import { Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EuFlag } from "@/components/ui/eu-flag";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Container } from "./container";
import { Logo } from "./logo";
import { navItems } from "./nav-items";

const heading = "mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#b9c2d6]";
const link = "link-grow inline-block py-1 text-white/85 transition-colors hover:text-gold";

/** Always navy ("the night the light shines in"), in both themes. */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-white">
      <div aria-hidden className="hero-glow pointer-events-none absolute -right-40 -top-40 size-[34rem] opacity-40" />

      <Container className="relative">
        <div className="flex flex-col gap-5 border-b border-white/10 py-10 sm:flex-row sm:items-center" data-reveal>
          <EuFlag className="h-12 w-auto shrink-0 rounded-sm" />
          <div>
            <p className="font-display text-lg font-semibold">{t("euTitle")}</p>
            <p className="mt-1 max-w-3xl text-base text-[#b9c2d6]">{t("euText")}</p>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="group inline-flex rounded-md">
              <Logo onDark />
            </Link>
            <p className="mt-5 max-w-[40ch] text-base text-[#b9c2d6]">{t("about")}</p>
          </div>

          <nav aria-labelledby="footer-explore" className="md:col-span-3 md:col-start-7">
            <h2 id="footer-explore" className={heading}>
              {t("explore")}
            </h2>
            <ul className="space-y-1 text-base">
              {navItems.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className={link}>
                    {nav(i.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className={heading}>{t("legal")}</h2>
            <ul className="space-y-3 text-base">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-start gap-2 text-white/85 hover:text-gold">
                  <Mail aria-hidden className="mt-1 size-4 shrink-0 text-gold" />
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/85">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-gold" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </li>
              <li className="pt-2">
                <Link href="/mentions-legales" className={link}>
                  {t("legalNotice")}
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className={link}>
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <a href={site.social.linkedin} rel="noopener noreferrer" target="_blank" className="inline-flex items-center gap-2 text-white/85 hover:text-gold">
                  <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <Container className="relative flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-[#b9c2d6] sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.legal.form} · RNA {site.legal.rna}
        </p>
        <p>{t("rights")}</p>
      </Container>
    </footer>
  );
}
