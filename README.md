# Format Tools

A lightweight web app for viewing and converting structured data — JSON, YAML, and CSV.

**Live demo:** https://wujiayi101.github.io/format-tools/

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

Pushes to `main` automatically deploy to GitHub Pages via the included workflow.
