# Yuhang's Web Space

Astro-based personal web space for GitHub Pages: part project archive, part notes, part life archive, part resume entrance.

## Files

- `src/pages/` - Astro routes
- `src/components/` - reusable sidebar, cards, rails, and detail components
- `src/layouts/` - shared page shell
- `content/` - Markdown/MDX and structured resume content
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
