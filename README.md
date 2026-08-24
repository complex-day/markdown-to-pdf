# Markdown to PDF Web App (V2 PRO)

A high-fidelity Next.js web application that converts single or multi-file Markdown projects and `.zip` archives into professionally styled, publication-ready PDFs using Playwright Chromium headless rendering.

---

## What's New in V2

### 1. Theme Selection
Choose between 4 curated rendering themes with live real-time preview:
- **GitHub Light**: Authentic GitHub Markdown light mode with subtle borders and clear syntax highlights.
- **GitHub Dark**: Authentic GitHub Dark mode canvas (`#0d1117`) with rich syntax color contrast.
- **Documentation Style**: Modern docs theme (Starlight/Vitepress aesthetic) with indigo accents and clean callout cards.
- **Clean Print Style**: Minimalist monochrome layout with serif headings, clean lines, and zero heavy fills for crisp, ink-friendly paper printing.

### 2. Automatic Table of Contents (TOC)
- Scans H1–H6 headings and builds an interactive, hierarchical TOC.
- Injects anchor IDs into headings so links work seamlessly in both the browser and exported PDF.
- Configurable heading depth (H1–H2, H1–H3, H1–H6).

### 3. Executive Cover Page
- Generate a dedicated cover page before your document content with an automatic print page break.
- Configurable fields: Document Title, Subtitle, Author, Organization, and Date.

### 4. Running Headers & Footers + Dynamic Page Numbers
- Configurable running top header (Document Title, Organization, Custom Text).
- Configurable bottom footer with current generation date, custom text, and automatic dynamic page counts (`Page X of Y`).
- Flexible page number positioning: **Left**, **Center**, or **Right**.

### 5. Multi-File Document Merging
- Upload multiple `.md` files at once.
- Drag or click to reorder files in the merge queue.
- Automatic page breaks (`break-before: page`) inserted between documents.

### 6. ZIP Project Archive Support
- Upload a `project.zip` containing markdown files (`README.md`, `docs/*.md`) and local image assets (`./images/architecture.png`, `assets/diagram.jpg`).
- Automatically extracts and maps local relative image paths to inlined Data URIs so images render seamlessly in both the browser preview and the exported PDF.

### 7. Watermark Overlays
- Optional watermark support with custom text or presets (`DRAFT`, `CONFIDENTIAL`, `INTERNAL ONLY`, `PREVIEW`).
- Placements: **Center**, **Diagonal** (`rotate -35deg`), or **Footer**.

### 8. PDF Quality & Layout Controls
- Paper format: **A4** or **Letter**.
- Orientation: **Portrait** or **Landscape**.
- Margins: **Narrow** (12mm), **Normal** (20mm), **Wide** (30mm), or **Custom** (Top, Right, Bottom, Left).

### 9. 1-Click Export Presets
- **GitHub Preset**: GitHub Light Theme, A4, TOC enabled, Page numbers enabled.
- **Documentation Preset**: Clean Docs Theme, A4, TOC enabled, Running Headers, Page numbers.
- **Print Preset**: Clean Print Style, Minimalist monochrome, A4/Letter, Normal margins.

### 10. Dark Mode Application UI
- Full application dark/light mode toggle with localStorage persistence (independent of the document's selected export theme).

### 11. In-App PDF Preview Before Download
- Generates the PDF and presents it in an embedded PDF viewer modal.
- Inspect the output, test links, adjust settings, regenerate, or trigger 1-click download.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Markdown & Syntax Highlighting**: `unified`, `remark-gfm`, `remark-rehype`, `rehype-highlight`, `rehype-stringify`
- **ZIP Extraction**: Native Web Streams `DecompressionStream` & `DataView` (zero extra bundle weight)
- **PDF Engine**: Playwright (Headless Chromium)

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-pdf/
│   │   │       └── route.ts          # POST /api/generate-pdf (V2 Playwright rendering)
│   │   ├── globals.css               # Dark mode & print pagination CSS
│   │   ├── layout.tsx                # App root layout & SEO metadata
│   │   └── page.tsx                  # Single-page application UI & state orchestrator
│   ├── components/
│   │   ├── FileUploader.tsx          # Multi-file, ZIP unpacking, and reorder queue
│   │   ├── Header.tsx                # App navigation, dark mode UI toggle & presets
│   │   ├── MarkdownPreview.tsx       # Live multi-theme browser preview
│   │   ├── PdfPreviewModal.tsx       # Embedded PDF viewer modal before download
│   │   └── PdfSettingsPanel.tsx      # Tabbed customization controls for V2 options
│   └── lib/
│       ├── markdown.ts               # Unified rendering pipeline, TOC & image resolver
│       ├── pdf.ts                    # Playwright Chromium PDF generation engine
│       ├── styles.ts                 # 4 Theme stylesheets, watermarks & print rules
│       ├── types.ts                  # TypeScript definitions for V2 models
│       └── zip.ts                    # Standalone ZIP archive extractor
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher
- **npm** / **yarn** / **pnpm**

---

### Installation & Launch

1. Install dependencies:
```bash
npm install
```

2. Install Playwright Chromium browser binaries:
```bash
npx playwright install chromium
```

3. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Specification

### `POST /api/generate-pdf`

#### V2 Request Body

```json
{
  "documents": [
    {
      "id": "doc-1",
      "filename": "01-overview.md",
      "content": "# Overview\n\nContent here...",
      "order": 1
    },
    {
      "id": "doc-2",
      "filename": "02-api.md",
      "content": "# API Reference\n\n```ts\nconst x = 1;\n```",
      "order": 2
    }
  ],
  "theme": "github-light",
  "coverPage": {
    "enabled": true,
    "title": "System Documentation",
    "subtitle": "Architecture & API Reference",
    "author": "Engineering Team",
    "organization": "Acme Inc.",
    "date": "October 2026"
  },
  "toc": {
    "enabled": true,
    "maxDepth": 3
  },
  "headerFooter": {
    "enabled": true,
    "headerTitle": "System Documentation",
    "headerOrg": "Acme Inc.",
    "showDate": true,
    "showPageNumbers": true,
    "pageNumberPosition": "right"
  },
  "pageFormat": "A4",
  "orientation": "portrait",
  "marginPreset": "normal",
  "watermark": {
    "enabled": false,
    "text": "CONFIDENTIAL",
    "placement": "diagonal"
  },
  "metadata": {
    "title": "System Documentation",
    "author": "Engineering Team"
  }
}
```

#### Response
- **Status**: `200 OK`
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="System_Documentation.pdf"`
- **Body**: Binary PDF stream.
