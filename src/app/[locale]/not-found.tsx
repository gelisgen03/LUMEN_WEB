import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
      <div className="md:col-span-7">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-accent-text">404</p>
        <h1 className="mt-3 text-step-5 font-semibold">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("text")}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t("back")}</Link>
        </Button>
      </div>
      <div className="hidden h-64 overflow-hidden rounded-[8px] md:col-span-4 md:col-start-9 md:block">
        <GeometricPattern seed="404" cols={4} rows={4} sparse={0.5} />
      </div>
    </Container>
  );
}
