# Yuhang's Web Space

Astro-based personal web space for GitHub Pages: part category-driven archive, part notes, part life record, part about/resume space.

## Files

- `src/pages/` - Astro routes
- `src/components/` - reusable sidebar, cards, rails, and detail components
- `src/layouts/` - shared page shell
- `content/entries/` - Markdown/MDX entries for projects, notes, and life fragments
- `content/site/` - site-level structured data such as categories
- `content/resume/` - structured about/resume content
- `public/assets/` - portrait, CV, and favicon assets
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow

## Development

Requires Node.js `>=22.12.0`.

```bash
npm install
npm run dev
npm run build
```

Content is intentionally stored in plain files so a Git-backed CMS can be added later without changing the public site architecture.
