# FmtKit

A lightweight web app for viewing and converting structured data — JSON, YAML, and CSV.

**Live:** https://fmtkit.pages.dev/

## Features

- **JSON Viewer** — Pretty-printed formatted view + expandable tree. Copy any field value or JSON path.
- **YAML Viewer** — Same split-pane experience for YAML documents.
- **JSON → YAML** — Paste JSON, get clean YAML output with one-click copy.
- **YAML → JSON** — Paste YAML, get formatted JSON output with one-click copy.
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

Pushes to `main` run CI (lint + build) and deploy to Cloudflare Pages.

Required GitHub **repository** secrets:

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo wujiayi101/fmtkit
gh secret set CLOUDFLARE_ACCOUNT_ID --repo wujiayi101/fmtkit
```

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | [API token](https://dash.cloudflare.com/profile/api-tokens) with **Cloudflare Pages Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
