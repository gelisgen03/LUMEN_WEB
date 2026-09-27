/** Kept free of dependencies: imported by the client form. */
export const contactReasons = ["partnership", "project", "volunteer", "training", "question"] as const;
export type ContactReason = (typeof contactReasons)[number];
export type ContactField = "name" | "email" | "message" | "consent";
