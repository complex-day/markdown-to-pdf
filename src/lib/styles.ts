import {
  ThemeType,
  PageFormat,
  PageOrientation,
  MarginPreset,
  MarginsConfig,
  WatermarkConfig,
  CoverPageConfig,
} from './types';

// Preset margin pixel/mm mappings
export const MARGIN_VALUES: Record<MarginPreset, MarginsConfig> = {
  narrow: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
  normal: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  wide: { top: '30mm', right: '30mm', bottom: '30mm', left: '30mm' },
  custom: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
};

/**
 * Returns theme-specific CSS rules for preview and PDF rendering
 */
export function getThemeCss(theme: ThemeType): string {
  switch (theme) {
    case 'github-dark':
      return `
/* GitHub Dark Theme */
body {
  background-color: #0d1117 !important;
  color: #e6edf3 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
}

.markdown-body {
  background-color: #0d1117 !important;
  color: #e6edf3 !important;
  font-size: 15px;
  line-height: 1.65;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: #f0f6fc !important;
  font-weight: 600;
  border-bottom: 1px solid #21262d;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body h1 { font-size: 2em; border-bottom: 1px solid #30363d; }
.markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid #30363d; }

.markdown-body a {
  color: #58a6ff !important;
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body code:not(pre code) {
  background-color: rgba(110, 118, 129, 0.4) !important;
  color: #e6edf3 !important;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 85%;
}

.markdown-body pre {
  background-color: #161b22 !important;
  border: 1px solid #30363d !important;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  line-height: 1.45;
}

.markdown-body pre code {
  background-color: transparent !important;
  color: #e6edf3 !important;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
}

.markdown-body blockquote {
  border-left: 4px solid #388bfd !important;
  background-color: rgba(56, 139, 253, 0.1) !important;
  color: #8b949e !important;
  padding: 8px 16px;
  margin: 16px 0;
  border-radius: 0 6px 6px 0;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  border: 1px solid #30363d !important;
  padding: 8px 14px;
}

.markdown-body table th {
  background-color: #161b22 !important;
  color: #f0f6fc !important;
  font-weight: 600;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #161b22 !important;
}

.markdown-body hr {
  border: 0;
  height: 1px;
  background-color: #30363d !important;
  margin: 24px 0;
}

/* Syntax Highlighting for Dark */
.hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #ff7b72; font-weight: 600; }
.hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-addition { color: #a5d6ff; }
.hljs-comment, .hljs-quote, .hljs-deletion, .hljs-meta { color: #8b949e; font-style: italic; }
.hljs-number, .hljs-regexp, .hljs-link { color: #79c0ff; }
.hljs-variable, .hljs-params { color: #ffa657; }
.hljs-function { color: #d2a8ff; }
`;

    case 'docs-style':
      return `
/* Modern Documentation Style */
body {
  background-color: #ffffff !important;
  color: #1e293b !important;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif !important;
}

.markdown-body {
  background-color: #ffffff !important;
  color: #1e293b !important;
  font-size: 15px;
  line-height: 1.7;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: #0f172a !important;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 28px;
  margin-bottom: 14px;
}

.markdown-body h1 {
  font-size: 2.2em;
  color: #1e1b4b !important;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.markdown-body h2 {
  font-size: 1.6em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
}

.markdown-body a {
  color: #4f46e5 !important;
  text-decoration: none;
  font-weight: 500;
}
.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body code:not(pre code) {
  background-color: #f1f5f9 !important;
  color: #4338ca !important;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 6px;
  font-family: "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 88%;
}

.markdown-body pre {
  background-color: #0f172a !important;
  color: #f8fafc !important;
  border-radius: 10px;
  padding: 18px;
  overflow: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.markdown-body pre code {
  background-color: transparent !important;
  color: #f8fafc !important;
  font-family: "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 13.5px;
}

.markdown-body blockquote {
  border-left: 4px solid #6366f1 !important;
  background: linear-gradient(to right, #f5f3ff, #faf5ff) !important;
  color: #475569 !important;
  padding: 12px 18px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  font-style: normal;
}

.markdown-body table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 20px 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.markdown-body table th,
.markdown-body table td {
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.markdown-body table th {
  background-color: #f8fafc !important;
  color: #334155 !important;
  font-weight: 600;
  text-align: left;
}

.markdown-body table tr:last-child td {
  border-bottom: none;
}

.markdown-body table tr:nth-child(even) td {
  background-color: #fbfcfd;
}

.markdown-body hr {
  border: 0;
  height: 1px;
  background: linear-gradient(to right, #e2e8f0, #cbd5e1, #e2e8f0);
  margin: 32px 0;
}

/* Syntax Highlighting for Docs Style */
.hljs-keyword, .hljs-selector-tag { color: #f43f5e; font-weight: 600; }
.hljs-string, .hljs-addition { color: #34d399; }
.hljs-comment, .hljs-quote { color: #94a3b8; font-style: italic; }
.hljs-number, .hljs-literal { color: #38bdf8; }
.hljs-title, .hljs-section, .hljs-function { color: #a78bfa; }
.hljs-variable, .hljs-params { color: #fb923c; }
.hljs-type, .hljs-class { color: #fbbf24; }
`;

    case 'clean-print':
      return `
/* Clean Print Style (Monochrome & High Contrast Optimized) */
body {
  background-color: #ffffff !important;
  color: #111111 !important;
  font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
}

.markdown-body {
  background-color: #ffffff !important;
  color: #111111 !important;
  font-size: 14.5px;
  line-height: 1.8;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: #000000 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 12px;
}

.markdown-body h1 {
  font-size: 2.1em;
  border-bottom: 1.5px solid #000000;
  padding-bottom: 6px;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #333333;
  padding-bottom: 4px;
}

.markdown-body a {
  color: #000000 !important;
  text-decoration: underline;
}

.markdown-body code:not(pre code) {
  background-color: #f4f4f4 !important;
  color: #000000 !important;
  border: 1px solid #dcdcdc;
  padding: 1px 4px;
  border-radius: 3px;
  font-family: "Courier New", Courier, monospace;
  font-size: 85%;
}

.markdown-body pre {
  background-color: #f8f8f8 !important;
  border: 1px solid #cccccc !important;
  border-left: 3px solid #000000 !important;
  border-radius: 0;
  padding: 14px;
  margin: 16px 0;
}

.markdown-body pre code {
  background-color: transparent !important;
  color: #000000 !important;
  font-family: "Courier New", Courier, monospace;
  font-size: 13px;
}

.markdown-body blockquote {
  border-left: 3px solid #000000 !important;
  background-color: transparent !important;
  color: #333333 !important;
  padding: 4px 16px;
  margin: 16px 0;
  font-style: italic;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  border: 1px solid #666666 !important;
  padding: 6px 12px;
}

.markdown-body table th {
  background-color: #eeeeee !important;
  color: #000000 !important;
  font-weight: bold;
}

.markdown-body hr {
  border: 0;
  height: 1px;
  background-color: #000000 !important;
  margin: 24px 0;
}

/* Syntax Highlighting for Clean Print (High Contrast Monochrome) */
.hljs-keyword, .hljs-selector-tag { font-weight: bold; color: #000000; }
.hljs-string, .hljs-addition { color: #222222; font-style: italic; }
.hljs-comment, .hljs-quote { color: #555555; font-style: italic; }
.hljs-number, .hljs-literal { color: #111111; }
.hljs-title, .hljs-section { font-weight: bold; color: #000000; }
`;

    case 'github-light':
    default:
      return `
/* GitHub Light Theme */
body {
  background-color: #ffffff !important;
  color: #24292f !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
}

.markdown-body {
  background-color: #ffffff !important;
  color: #24292f !important;
  font-size: 14.5px;
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: #24292f !important;
  font-weight: 600;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body h1 { font-size: 2em; }
.markdown-body h2 { font-size: 1.5em; }

.markdown-body a {
  color: #0969da !important;
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body code:not(pre code) {
  background-color: rgba(175, 184, 193, 0.2) !important;
  color: #24292f !important;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 85%;
}

.markdown-body pre {
  background-color: #f6f8fa !important;
  border: 1px solid #d0d7de !important;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
  line-height: 1.45;
}

.markdown-body pre code {
  background-color: transparent !important;
  color: #24292f !important;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
}

.markdown-body blockquote {
  border-left: 4px solid #d0d7de !important;
  color: #57606a !important;
  padding: 0 1em;
  margin: 16px 0;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  border: 1px solid #d0d7de !important;
  padding: 6px 13px;
}

.markdown-body table th {
  background-color: #f6f8fa !important;
  font-weight: 600;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa !important;
}

.markdown-body hr {
  border: 0;
  height: 1px;
  background-color: #d0d7de !important;
  margin: 24px 0;
}

/* Syntax Highlighting for GitHub Light */
.hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #cf222e; font-weight: 600; }
.hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-addition { color: #0a3069; }
.hljs-comment, .hljs-quote, .hljs-deletion, .hljs-meta { color: #6e7781; font-style: italic; }
.hljs-number, .hljs-regexp, .hljs-link { color: #0550ae; }
.hljs-variable, .hljs-params { color: #953800; }
.hljs-function { color: #8250df; }
`;
  }
}

/**
 * Universal print rules for clean pagination, avoiding breaking code blocks and tables across pages
 */
export function getPrintPaginationCss(
  format: PageFormat,
  orientation: PageOrientation,
  margins: MarginsConfig
): string {
  return `
@page {
  size: ${format} ${orientation};
  margin-top: ${margins.top};
  margin-right: ${margins.right};
  margin-bottom: ${margins.bottom};
  margin-left: ${margins.left};
}

@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .markdown-body {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Prevent awkward page breaks inside atomic markdown blocks */
  pre,
  pre code,
  .hljs,
  blockquote,
  table,
  tr,
  img,
  figure,
  svg,
  .toc-container {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Avoid orphan headings at bottom of pages */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    break-after: avoid !important;
    page-break-after: avoid !important;
  }

  /* Dedicated page break divider */
  .pdf-page-break {
    break-before: page !important;
    page-break-before: always !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    display: block !important;
  }

  /* Cover page page break */
  .cover-page-wrapper {
    break-after: page !important;
    page-break-after: always !important;
    min-height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/* Base styles */
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

.markdown-body {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

/* Watermark styles */
.watermark-overlay {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.watermark-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
}

.watermark-diagonal {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-35deg);
  font-size: 72px;
  white-space: nowrap;
}

.watermark-footer {
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
}

/* Cover page styling */
.cover-page-container {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.cover-page-title {
  font-size: 38px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.cover-page-subtitle {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.85;
  margin-bottom: 40px;
  max-width: 80%;
  line-height: 1.5;
}

.cover-page-divider {
  width: 100px;
  height: 4px;
  background-color: currentColor;
  opacity: 0.3;
  margin: 30px auto;
  border-radius: 2px;
}

.cover-page-meta {
  margin-top: 40px;
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.8;
}

.cover-page-author {
  font-weight: 600;
  font-size: 16px;
}

/* Table of Contents Styling */
.toc-container {
  background: rgba(125, 125, 125, 0.05);
  border: 1px solid rgba(125, 125, 125, 0.2);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 24px 0 36px 0;
}

.toc-title {
  font-size: 18px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(125, 125, 125, 0.2);
  padding-bottom: 8px;
}

.toc-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.toc-item {
  margin: 6px 0;
  line-height: 1.4;
}

.toc-level-1 { font-weight: 600; font-size: 15px; margin-top: 10px; }
.toc-level-2 { padding-left: 18px; font-size: 14px; }
.toc-level-3 { padding-left: 36px; font-size: 13.5px; opacity: 0.9; }
.toc-level-4 { padding-left: 54px; font-size: 13px; opacity: 0.8; }
.toc-level-5 { padding-left: 72px; font-size: 12.5px; opacity: 0.75; }
.toc-level-6 { padding-left: 90px; font-size: 12px; opacity: 0.7; }

.toc-item a {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.toc-item a:hover {
  text-decoration: underline;
}

/* Merged Document Header */
.doc-section-header {
  margin-top: 32px;
  margin-bottom: 16px;
}

.doc-section-badge {
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(125, 125, 125, 0.15);
  margin-bottom: 8px;
}
`;
}

/**
 * Builds standalone HTML document with complete theme and print styles
 */
export function buildHtmlDocument({
  bodyHtml,
  theme,
  format = 'A4',
  orientation = 'portrait',
  marginPreset = 'normal',
  customMargins,
  watermark,
  metadata,
}: {
  bodyHtml: string;
  theme: ThemeType;
  format?: PageFormat;
  orientation?: PageOrientation;
  marginPreset?: MarginPreset;
  customMargins?: MarginsConfig;
  watermark?: WatermarkConfig;
  metadata?: { title?: string; author?: string; subject?: string; keywords?: string };
}): string {
  const margins = marginPreset === 'custom' && customMargins
    ? customMargins
    : MARGIN_VALUES[marginPreset] || MARGIN_VALUES.normal;

  const themeCss = getThemeCss(theme);
  const printCss = getPrintPaginationCss(format, orientation, margins);

  // Watermark HTML if enabled
  let watermarkHtml = '';
  if (watermark && watermark.enabled && watermark.text.trim()) {
    const placementClass = `watermark-${watermark.placement || 'diagonal'}`;
    const opacityVal = watermark.opacity ?? 0.18;
    const color = theme === 'github-dark' ? `rgba(255, 255, 255, ${opacityVal})` : `rgba(0, 0, 0, ${opacityVal})`;
    watermarkHtml = `<div class="watermark-overlay ${placementClass}" style="color: ${color};">${escapeHtml(watermark.text)}</div>`;
  }

  const docTitle = metadata?.title || 'Markdown Document';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(docTitle)}</title>
  ${metadata?.author ? `<meta name="author" content="${escapeHtml(metadata.author)}">` : ''}
  ${metadata?.subject ? `<meta name="description" content="${escapeHtml(metadata.subject)}">` : ''}
  ${metadata?.keywords ? `<meta name="keywords" content="${escapeHtml(metadata.keywords)}">` : ''}
  <style>
${themeCss}
${printCss}
  </style>
</head>
<body>
  ${watermarkHtml}
  <article class="markdown-body">
${bodyHtml}
  </article>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
