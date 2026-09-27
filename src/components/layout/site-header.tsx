import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Container } from "./container";
import { DesktopNav } from "./desktop-nav";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { navItems } from "./nav-items";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const languages = (
    <LanguageSwitcher locale={locale} label={t("language")} names={{ fr: t("languageNames.fr"), en: t("languageNames.en") }} />
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-18 items-center gap-3 !max-w-none lg:px-10">
        <Link href="/" className="group mr-auto flex items-center rounded-md" aria-label={`LUMEN – ${t("home")}`}>
          <Logo />
        </Link>

        <DesktopNav
          label={t("mainLabel")}
          items={navItems.filter((i) => i.key !== "home" && i.key !== "partenaires").map((i) => ({ href: i.href, label: t(i.key) }))}
        />

        <div className="flex items-center gap-1.5 sm:gap-2 xl:ml-4">
          <div className="hidden sm:block">{languages}</div>
          <div className="hidden sm:block">
            <ThemeToggle label={t("darkMode")} />
          </div>
          <Sidebar
            items={navItems.map((i) => ({
              href: i.href,
              label: t(i.key),
              description: t(`descriptions.${i.key}`),
              icon: <Icon name={i.icon} className="size-5" />,
            }))}
            logo={<Logo subtitle={site.legalName} />}
            tagline={t("sidebarTagline")}
            email={site.email}
            cta={{ href: "/partenaires", label: t("partenaires") }}
            labels={{ open: t("openMenu"), close: t("closeMenu"), menu: t("menu"), main: t("mainLabel") }}
            controls={
              <>
                {languages}
                <ThemeToggle label={t("darkMode")} />
              </>
            }
          />

        </div>
      </Container>
      <div aria-hidden className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] bg-gold" />
    </header>
  );
}
