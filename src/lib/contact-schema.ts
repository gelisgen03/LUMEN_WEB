import { z } from "zod";

import { contactReasons } from "./contact-reasons";

export { contactReasons };
export type { ContactReason, ContactField } from "./contact-reasons";

/** Shared by the route handler. Error codes map to messages → contact.form.errors.* */
export const contactSchema = z.object({
  reason: z.enum(contactReasons).catch("question"),
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  organization: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(20, "message").max(5000, "message"),
  consent: z.literal(true, "consent"),
  locale: z.enum(["fr", "en"]).catch("fr"),
});

export type ContactInput = z.infer<typeof contactSchema>;
