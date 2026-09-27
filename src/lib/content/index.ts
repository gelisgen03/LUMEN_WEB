import "server-only";
import type { Locale } from "@/i18n/routing";
import { createCollection, readPage } from "./loader";
import { actionSchema, pageSchema, projectSchema, teamMemberSchema } from "./schemas";

const actionsCollection = createCollection("actions", actionSchema);
const projectsCollection = createCollection("projects", projectSchema);
const teamCollection = createCollection("team", teamMemberSchema);

export function getActions(locale: Locale) {
  return [...actionsCollection.all(locale)].sort((a, b) => a.order - b.order);
}
export const getAction = actionsCollection.get;

export function getProjects(locale: Locale) {
  return [...projectsCollection.all(locale)].sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
}
export const getProject = projectsCollection.get;

export function getTeam(locale: Locale) {
  return [...teamCollection.all(locale)].sort((a, b) => a.order - b.order);
}

export function getPage(name: "mentions-legales" | "confidentialite", locale: Locale) {
  return readPage(name, locale, pageSchema);
}
