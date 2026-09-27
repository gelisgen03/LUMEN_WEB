import "server-only";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { contactReasons } from "@/lib/contact-reasons";
import { site } from "@/lib/site";
import type { ContactFormLabels } from "./contact-form";

/** Builds the (serialisable) label set for <ContactForm />, shared by /contact and /partenaires. */
export async function getContactFormLabels(locale: Locale): Promise<ContactFormLabels> {
  const f = await getTranslations({ locale, namespace: "contact.form" });
  return {
    reason: f("reason"),
    reasons: Object.fromEntries(contactReasons.map((r) => [r, f(`reasons.${r}`)])) as ContactFormLabels["reasons"],
    name: f("name"),
    email: f("email"),
    organization: f("organization"),
    message: f("message"),
    messageHint: f("messageHint"),
    consent: f("consent"),
    submit: f("submit"),
    sending: f("sending"),
    required: f("required"),
    honeypot: f("honeypot"),
    errorsSummary: [1, 2, 3, 4].map((count) => f("errorsSummary", { count })),
    errors: {
      name: f("errors.name"),
      email: f("errors.email"),
      message: f("errors.message"),
      consent: f("errors.consent"),
      rateLimited: f("errors.rateLimited"),
      server: f("errors.server", { email: site.email }),
    },
    success: f("success"),
  };
}
