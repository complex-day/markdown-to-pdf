import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import {
  MarkdownDocument,
  CoverPageConfig,
  TocConfig,
  TocItem,
  ThemeType,
} from "./types";

/**
 * Generates URL-safe and unique slug for heading anchors
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts Table of Contents items (H1-H6) from raw Markdown text
 */
export function extractTocItems(markdown: string, maxDepth: number = 3): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const slugCounts: Record<string, number> = {};

  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    if (level > maxDepth) continue;

    const rawText = match[2].trim();
    // Strip markdown formatting like **bold**, *italic*, `code`, [link](url)
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`]/g, "")
      .trim();

    let baseSlug = slugify(cleanText) || `heading-${items.length + 1}`;
    if (slugCounts[baseSlug]) {
      slugCounts[baseSlug]++;
      baseSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
    } else {
      slugCounts[baseSlug] = 1;
    }

    items.push({
      id: baseSlug,
      text: cleanText,
      level,
    });
  }

  return items;
}

/**
 * Generates HTML for Table of Contents
 */
export function renderTocHtml(tocItems: TocItem[]): string {
  if (!tocItems || tocItems.length === 0) return "";

  const itemsHtml = tocItems
    .map((item) => {
      return `    <li class="toc-item toc-level-${item.level}"><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`;
    })
    .join("\n");

  return `
<nav class="toc-container" aria-label="Table of Contents">
  <h2 class="toc-title">Table of Contents</h2>
  <ul class="toc-list">
${itemsHtml}
  </ul>
</nav>
`;
}

/**
 * Generates HTML for Cover Page
 */
export function renderCoverPageHtml(config: CoverPageConfig, theme: ThemeType): string {
  if (!config || !config.enabled || !config.title?.trim()) {
    return "";
  }

  const title = escapeHtml(config.title);
  const subtitle = config.subtitle ? `<div class="cover-page-subtitle">${escapeHtml(config.subtitle)}</div>` : "";
  const author = config.author ? `<div class="cover-page-author">${escapeHtml(config.author)}</div>` : "";
  const org = config.organization ? `<div>${escapeHtml(config.organization)}</div>` : "";
  const date = config.date ? `<div>${escapeHtml(config.date)}</div>` : "";

  return `
<section class="cover-page-wrapper">
  <div class="cover-page-container">
    <div class="cover-page-title">${title}</div>
    ${subtitle}
    <div class="cover-page-divider"></div>
    <div class="cover-page-meta">
      ${author}
      ${org}
      ${date}
    </div>
  </div>
</section>
`;
}

/**
 * Inlines relative image references (e.g. ![Alt](./images/diagram.png))
 * using the extracted assets data URIs map from ZIP or uploaded files.
 */
export function resolveRelativeImages(markdown: string, assets?: Record<string, string>): string {
  if (!assets || Object.keys(assets).length === 0) {
    return markdown;
  }

  // 1. Match Markdown images: ![alt](url "title")
  let updated = markdown.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (match, alt, src, title) => {
    const cleanSrc = src.trim();
    // Normalize variants (e.g., "./images/a.png", "images/a.png", "a.png")
    const resolvedUri = assets[cleanSrc] || assets[cleanSrc.replace(/^\.\//, "")] || assets[cleanSrc.split("/").pop() || ""];
    if (resolvedUri) {
      const titleAttr = title ? ` "${title}"` : "";
      return `![${alt}](${resolvedUri}${titleAttr})`;
    }
    return match;
  });

  // 2. Match HTML <img src="..."> tags
  updated = updated.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, before, src, after) => {
    const cleanSrc = src.trim();
    const resolvedUri = assets[cleanSrc] || assets[cleanSrc.replace(/^\.\//, "")] || assets[cleanSrc.split("/").pop() || ""];
    if (resolvedUri) {
      return `<img${before}src="${resolvedUri}"${after}>`;
    }
    return match;
  });

  return updated;
}

/**
 * Injects heading IDs into raw markdown headings so links from TOC work seamlessly
 */
function injectHeadingIds(markdown: string): string {
  const slugCounts: Record<string, number> = {};

  return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, headingContent) => {
    const cleanText = headingContent
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`]/g, "")
      .trim();

    let baseSlug = slugify(cleanText) || `heading`;
    if (slugCounts[baseSlug]) {
      slugCounts[baseSlug]++;
      baseSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
    } else {
      slugCounts[baseSlug] = 1;
    }

    // Convert heading into HTML with ID to guarantee exact anchor targeting
    const level = hashes.length;
    return `<h${level} id="${baseSlug}">${headingContent}</h${level}>`;
  });
}

/**
 * Compiles a single Markdown string to HTML using unified/remark/rehype
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown || !markdown.trim()) {
    return "";
  }

  // Pre-inject IDs into markdown headings
  const markdownWithAnchors = injectHeadingIds(markdown);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const file = await processor.process(markdownWithAnchors);
  return String(file);
}

/**
 * Full V2 document compiler:
 * - Cover Page
 * - Table of Contents
 * - Multi-document merging with page breaks
 * - Relative asset resolution
 */
export async function compileFullDocumentHtml({
  documents,
  coverPage,
  toc,
  theme = "github-light",
  assets,
  insertPageBreaks = true,
}: {
  documents: MarkdownDocument[];
  coverPage?: CoverPageConfig;
  toc?: TocConfig;
  theme?: ThemeType;
  assets?: Record<string, string>;
  insertPageBreaks?: boolean;
}): Promise<string> {
  if (!documents || documents.length === 0) {
    return "";
  }

  const sortedDocs = [...documents].sort((a, b) => (a.order || 0) - (b.order || 0));

  // 1. Extract unified TOC across all documents if enabled
  let tocHtml = "";
  if (toc?.enabled) {
    const combinedMarkdown = sortedDocs.map((d) => d.content).join("\n\n");
    const tocItems = extractTocItems(combinedMarkdown, toc.maxDepth || 3);
    tocHtml = renderTocHtml(tocItems);
  }

  // 2. Render Cover Page if enabled
  let coverPageHtml = "";
  if (coverPage?.enabled) {
    coverPageHtml = renderCoverPageHtml(coverPage, theme);
  }

  // 3. Process individual documents
  const docHtmls: string[] = [];
  for (let i = 0; i < sortedDocs.length; i++) {
    const doc = sortedDocs[i];
    // Resolve relative image assets
    const resolvedMarkdown = resolveRelativeImages(doc.content, assets);
    const html = await renderMarkdownToHtml(resolvedMarkdown);

    // If multiple documents, optionally add file section badges
    const sectionHeader = sortedDocs.length > 1
      ? `<div class="doc-section-header"><span class="doc-section-badge">${escapeHtml(doc.filename)}</span></div>`
      : "";

    docHtmls.push(`${sectionHeader}\n${html}`);
  }

  // Combine with page break dividers between documents
  const pageBreakDivider = insertPageBreaks ? '\n<div class="pdf-page-break"></div>\n' : '\n<hr class="doc-divider" />\n';
  const combinedBodyHtml = docHtmls.join(pageBreakDivider);

  return [coverPageHtml, tocHtml, combinedBodyHtml].filter(Boolean).join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
