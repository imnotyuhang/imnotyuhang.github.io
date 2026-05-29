import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseEntry = {
  title: z.string(),
  slug: z.string(),
  type: z.enum(["project", "note", "life"]),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
  links: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).default([]),
};

const projects = defineCollection({
  loader: glob({ base: "./content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...baseEntry,
    type: z.literal("project"),
    role: z.string().optional(),
    tools: z.array(z.string()).default([]),
    problem: z.string().optional(),
    approach: z.string().optional(),
    result: z.string().optional(),
    next: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ base: "./content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...baseEntry,
    type: z.literal("note"),
  }),
});

const life = defineCollection({
  loader: glob({ base: "./content/life", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...baseEntry,
    type: z.literal("life"),
  }),
});

export const collections = { projects, notes, life };
