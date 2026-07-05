# Format Tools

A lightweight web app for viewing and converting structured data — JSON, YAML, and CSV.

**Live:**
- GitHub Pages: https://wujiayi101.github.io/format-tools/
- Cloudflare Pages: https://format-tools.pages.dev/

## Features

- **JSON Viewer** — Pretty-printed formatted view + expandable tree. Copy any field value or JSON path.
- **YAML Viewer** — Same split-pane experience for YAML documents.
- **JSON → YAML** — Paste JSON, get clean YAML output with one-click copy.
- **CSV Table** — Render CSV as a sortable table. Click cells to copy; copy entire columns from headers.

All processing runs in the browser — nothing is sent to a server.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushes to `main` run CI (lint + build) and deploy to both GitHub Pages and Cloudflare Pages.

Required GitHub **repository** secrets for Cloudflare (copy from another repo such as `hk-outdoor-index`):

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo wujiayi101/format-tools
gh secret set CLOUDFLARE_ACCOUNT_ID --repo wujiayi101/format-tools
```

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | [API token](https://dash.cloudflare.com/profile/api-tokens) with **Cloudflare Pages Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

GitHub Pages uses the built-in `GITHUB_TOKEN` via the `github-pages` environment.
