import { z } from "zod";

/**
 * Frontmatter schemas. Every field is required unless marked optional:
 * a missing or malformed field throws during `next build` with the file path.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");
const image = z.string().regex(/^(\/|https:\/\/)/, "image must be a /public path or https URL");

/** The five domains of action ("Ce que nous faisons"). Projects reference them. */
export const domains = [
  "inclusion-numerique",
  "ia-apprentissage",
  "education-competences",
  "projets-europeens",
  "impact-social",
] as const;
export const domainSchema = z.enum(domains);
export type Domain = z.infer<typeof domainSchema>;

export const audiences = ["jeunes", "professionnels", "organisations"] as const;
export const audienceSchema = z.enum(audiences);

export const actionSchema = z.object({
  title: z.string().min(1),
  slug: domainSchema,
  order: z.number().int(),
  /** Icon key from src/components/ui/icons.tsx */
  icon: z.string().min(1),
  summary: z.string().min(1),
  image,
  audiences: z.array(audienceSchema).min(1),
  methods: z.array(z.string().min(1)).min(1),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug,
  summary: z.string().min(1),
  /** EU programme and action, e.g. "Erasmus+ KA152-YOU". */
  programme: z.string().min(1),
  status: z.enum(["en-preparation", "en-cours", "termine"]),
  period: z.object({ start: isoDate, end: isoDate.optional() }).optional(),
  featured: z.boolean().default(false),
  domains: z.array(domainSchema).min(1),
  /** UN Sustainable Development Goals addressed (1–17). */
  sdgs: z.array(z.number().int().min(1).max(17)).min(1),
  /** Partners can be empty while the consortium is being built. */
  partners: z.array(z.object({ name: z.string().min(1), country: z.string().length(2), url: z.url().optional() })),
  outcomes: z.array(z.string().min(1)).min(1),
  cover: image,
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  slug,
  order: z.number().int(),
  role: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  photo: image.optional(),
  linkedin: z.url().optional(),
});

export const pageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  updatedAt: isoDate,
});

export type ActionMeta = z.infer<typeof actionSchema>;
export type ProjectMeta = z.infer<typeof projectSchema>;
export type TeamMemberMeta = z.infer<typeof teamMemberSchema>;
