import { getCollection, type CollectionEntry } from "astro:content";

import categories from "../../content/site/categories.json";

export type SiteEntry = CollectionEntry<"entries">;
export type EntryType = SiteEntry["data"]["type"];

export type Category = {
  slug: string;
  title: string;
  summary: string;
  children?: Category[];
};

export function entryDate(entry: SiteEntry) {
  return entry.data.date;
}

export function entryUpdatedDate(entry: SiteEntry) {
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
  return `/entries/${entry.data.slug}/`;
}

export function entryDateLabel(entry: SiteEntry) {
  return entry.data.period ?? formatDate(entryDate(entry));
}

export function sortEntriesByDate(entries: SiteEntry[]) {
  return [...entries].sort((a, b) => entryDate(b).getTime() - entryDate(a).getTime());
}

export function sortEntriesByUpdatedDate(entries: SiteEntry[]) {
  return [...entries].sort((a, b) => entryUpdatedDate(b).getTime() - entryUpdatedDate(a).getTime());
}

export async function getAllPublishedEntries() {
  const entries = await getCollection("entries", ({ data }) => data.status === "published");

  return entries.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return entryDate(b).getTime() - entryDate(a).getTime();
  });
}

export function getEntriesByType(entries: SiteEntry[], types: EntryType | EntryType[]) {
  const allowedTypes = Array.isArray(types) ? types : [types];
  return entries.filter((entry) => allowedTypes.includes(entry.data.type));
}

export function getFeaturedEntries(entries: SiteEntry[], limit?: number) {
  const featured = entries.filter((entry) => entry.data.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getRecentUpdatedEntries(entries: SiteEntry[], limit: number) {
  return sortEntriesByUpdatedDate(entries).slice(0, limit);
}

export function getCategories() {
  return categories as Category[];
}

export function flattenCategories(items: Category[] = getCategories()) {
  return items.flatMap((item) => [item, ...flattenCategories(item.children ?? [])]);
}

export function getCategory(slug: string) {
  return flattenCategories().find((category) => category.slug === slug);
}

export function getEntriesForCategory(category: Category, entries: SiteEntry[]) {
  const slugs = [category.slug, ...flattenCategories(category.children ?? []).map((item) => item.slug)];
  return entries.filter((entry) => slugs.includes(entry.data.category));
}

export function categoryEntryCount(category: Category, entries: SiteEntry[]) {
  return getEntriesForCategory(category, entries).length;
}

export function categoryHref(category: Category | string) {
  const slug = typeof category === "string" ? category : category.slug;
  return `/categories/${slug}/`;
}

export function groupEntriesByYear(entries: SiteEntry[]) {
  const grouped = new Map<string, SiteEntry[]>();

  sortEntriesByDate(entries).forEach((entry) => {
    const year = String(entryDate(entry).getFullYear());
    grouped.set(year, [...(grouped.get(year) ?? []), entry]);
  });

  return Array.from(grouped, ([year, yearEntries]) => ({ year, entries: yearEntries }));
}
