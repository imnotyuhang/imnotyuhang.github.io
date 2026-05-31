import { getCollection, type CollectionEntry } from "astro:content";

import categories from "../../content/site/categories.json";

export type SiteEntry = CollectionEntry<"entries">;

export type Category = {
  slug: string;
  title: string;
  summary: string;
  children?: Category[];
};

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
  return `/entries/${entry.data.slug}/`;
}

export async function getAllPublishedEntries() {
  const entries = await getCollection("entries", ({ data }) => data.status === "published");

  return entries.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return entryDate(b).getTime() - entryDate(a).getTime();
  });
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

export function childCategorySlugs(slug: string) {
  const category = getCategory(slug);
  if (!category) return [];
  return flattenCategories(category.children ?? []).map((item) => item.slug);
}

export function categoryEntryCount(category: Category, entries: SiteEntry[]) {
  const slugs = [category.slug, ...flattenCategories(category.children ?? []).map((item) => item.slug)];
  return entries.filter((entry) => slugs.includes(entry.data.category)).length;
}

export function categoryHref(category: Category | string) {
  const slug = typeof category === "string" ? category : category.slug;
  return `/categories/${slug}/`;
}
