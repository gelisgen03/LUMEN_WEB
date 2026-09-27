import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export async function LegalPage({ name, locale }: { name: "mentions-legales" | "confidentialite"; locale: Locale }) {
  const { data, body } = getPage(name, locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-step-5 font-semibold">{data.title}</h1>
        <p className="mt-3 text-sm text-muted">{t("updated", { date: formatDate(data.updatedAt, locale) })}</p>
      </div>
      <MdxContent source={body} className="mx-auto mt-10" />
    </Container>
  );
}
