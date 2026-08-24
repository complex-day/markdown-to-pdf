import { chromium, Browser } from "playwright";
import {
  PageFormat,
  PageOrientation,
  MarginsConfig,
  HeaderFooterConfig,
  PdfMetadata,
} from "./types";

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }
  browserInstance = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=medium",
    ],
  });
  return browserInstance;
}

export interface GeneratePdfOptions {
  html: string;
  format?: PageFormat;
  orientation?: PageOrientation;
  margins?: MarginsConfig;
  headerFooter?: HeaderFooterConfig;
  metadata?: PdfMetadata;
}

/**
 * Builds Playwright Chromium header template
 */
function buildHeaderTemplate(config?: HeaderFooterConfig): string {
  if (!config || !config.enabled) return "<span></span>";

  const headerLeft = config.headerTitle ? escapeHtml(config.headerTitle) : "";
  const headerRight = config.headerOrg ? escapeHtml(config.headerOrg) : (config.headerCustom ? escapeHtml(config.headerCustom) : "");

  if (!headerLeft && !headerRight) return "<span></span>";

  return `
    <div style="font-size: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #888888; width: 100%; display: flex; justify-content: space-between; padding: 0 20px; box-sizing: border-box;">
      <span>${headerLeft}</span>
      <span>${headerRight}</span>
    </div>
  `;
}

/**
 * Builds Playwright Chromium footer template with dynamic page numbering
 */
function buildFooterTemplate(config?: HeaderFooterConfig): string {
  if (!config || !config.enabled) return "<span></span>";

  const showDate = config.showDate;
  const showPageNumbers = config.showPageNumbers;
  const footerCustom = config.footerText ? escapeHtml(config.footerText) : "";
  const pos = config.pageNumberPosition || "right";

  let justify = "space-between";
  if (pos === "center") justify = "space-between";

  const dateSpan = showDate ? `<span class="date" style="font-size: 8px;"></span>` : `<span>${footerCustom}</span>`;
  const pageNumSpan = showPageNumbers
    ? `<span style="font-size: 8px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>`
    : `<span></span>`;

  let leftContent = dateSpan;
  let centerContent = pos === "center" ? pageNumSpan : `<span>${footerCustom}</span>`;
  let rightContent = pos === "right" ? pageNumSpan : (pos === "left" ? dateSpan : `<span></span>`);
  if (pos === "left") {
    leftContent = pageNumSpan;
    rightContent = dateSpan;
  }

  return `
    <div style="font-size: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #888888; width: 100%; display: flex; justify-content: ${justify}; align-items: center; padding: 0 20px; box-sizing: border-box;">
      <div>${leftContent}</div>
      <div>${centerContent}</div>
      <div>${rightContent}</div>
    </div>
  `;
}

/**
 * Renders HTML in Playwright Chromium and captures a professional PDF with exact formatting,
 * custom margins, headers/footers, fonts, and full asset verification.
 */
export async function generatePdfFromHtml({
  html,
  format = "A4",
  orientation = "portrait",
  margins = { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
  headerFooter,
  metadata,
}: GeneratePdfOptions): Promise<Buffer> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    // 1. Set HTML content and wait for network idle
    await page.setContent(html, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // 2. Wait for web fonts to load
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    // 3. Explicitly verify all <img> tags have completed loading (or timed out/errored safely)
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            const timeout = setTimeout(() => resolve(), 5000); // 5s fallback per image
            img.addEventListener("load", () => {
              clearTimeout(timeout);
              resolve();
            });
            img.addEventListener("error", () => {
              clearTimeout(timeout);
              resolve();
            });
          });
        })
      );
    });

    // Small stabilization tick for layout settling
    await page.waitForTimeout(150);

    const isLandscape = orientation === "landscape";
    const hasHeaderFooter = headerFooter?.enabled ?? false;

    // 4. Generate PDF with Playwright options
    const pdfBuffer = await page.pdf({
      format: format,
      landscape: isLandscape,
      printBackground: true,
      displayHeaderFooter: hasHeaderFooter,
      headerTemplate: hasHeaderFooter ? buildHeaderTemplate(headerFooter) : "<span></span>",
      footerTemplate: hasHeaderFooter ? buildFooterTemplate(headerFooter) : "<span></span>",
      margin: {
        top: margins.top,
        right: margins.right,
        bottom: margins.bottom,
        left: margins.left,
      },
      preferCSSPageSize: false,
    });

    return pdfBuffer;
  } finally {
    await context.close();
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
