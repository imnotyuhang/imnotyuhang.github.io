import { getCollection, type CollectionEntry } from "astro:content";

export type SiteEntry =
  | CollectionEntry<"projects">
  | CollectionEntry<"notes">
  | CollectionEntry<"life">;

export function entryDate(entry: SiteEntry) {
  return entry.data.updated ?? entry.data.date;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function entryHref(entry: SiteEntry) {
  return `/${entry.collection}/${entry.data.slug}/`;
}

export async function getAllPublishedEntries() {
  const [projects, notes, life] = await Promise.all([
    getCollection("projects", ({ data }) => data.status === "published"),
    getCollection("notes", ({ data }) => data.status === "published"),
    getCollection("life", ({ data }) => data.status === "published"),
  ]);

  return [...projects, ...notes, ...life].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return entryDate(b).getTime() - entryDate(a).getTime();
  });
}
