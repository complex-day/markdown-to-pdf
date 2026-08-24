import { NextRequest, NextResponse } from "next/server";
import { compileFullDocumentHtml, renderMarkdownToHtml } from "@/lib/markdown";
import { buildHtmlDocument, MARGIN_VALUES } from "@/lib/styles";
import { generatePdfFromHtml } from "@/lib/pdf";
import { PdfGenerationRequest, MarkdownDocument } from "@/lib/types";

const MAX_TOTAL_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB total limit for multi-file + assets

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    // Support both V2 structured request and V1 legacy { markdown, filename }
    let documents: MarkdownDocument[] = [];
    if (Array.isArray(body.documents) && body.documents.length > 0) {
      documents = body.documents;
    } else if (typeof body.markdown === "string" && body.markdown.trim()) {
      documents = [
        {
          id: "doc-1",
          filename: typeof body.filename === "string" ? body.filename : "document.md",
          content: body.markdown,
          order: 1,
        },
      ];
    } else {
      return NextResponse.json(
        { error: "Please provide valid Markdown content or documents array." },
        { status: 400 }
      );
    }

    // Filter valid docs
    documents = documents.filter((d) => d.content && d.content.trim());
    if (documents.length === 0) {
      return NextResponse.json(
        { error: "Markdown content cannot be empty." },
        { status: 400 }
      );
    }

    // Size check across all markdown contents
    const totalMarkdownBytes = documents.reduce(
      (acc, doc) => acc + Buffer.byteLength(doc.content, "utf8"),
      0
    );
    if (totalMarkdownBytes > MAX_TOTAL_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Content size exceeds the 20 MB limit (${(totalMarkdownBytes / (1024 * 1024)).toFixed(2)} MB).`,
        },
        { status: 413 }
      );
    }

    const theme = body.theme || "github-light";
    const coverPage = body.coverPage;
    const toc = body.toc;
    const headerFooter = body.headerFooter;
    const pageFormat = body.pageFormat || "A4";
    const orientation = body.orientation || "portrait";
    const marginPreset = body.marginPreset || "normal";
    const customMargins = body.customMargins;
    const watermark = body.watermark;
    const metadata = body.metadata || {};
    const assets = body.assets || {};
    const insertPageBreaks = body.insertPageBreaks !== false;

    // 1. Compile full HTML body using shared unified pipeline
    const bodyHtml = await compileFullDocumentHtml({
      documents,
      coverPage,
      toc,
      theme,
      assets,
      insertPageBreaks,
    });

    // 2. Wrap HTML with Theme, Watermark, and Print Layout Stylesheet
    const fullHtml = buildHtmlDocument({
      bodyHtml,
      theme,
      format: pageFormat,
      orientation,
      marginPreset,
      customMargins,
      watermark,
      metadata,
    });

    // 3. Resolve Margins Config for Playwright
    const effectiveMargins =
      marginPreset === "custom" && customMargins
        ? customMargins
        : MARGIN_VALUES[marginPreset] || MARGIN_VALUES.normal;

    // 4. Render HTML in Playwright Chromium & generate PDF Buffer
    const pdfBuffer = await generatePdfFromHtml({
      html: fullHtml,
      format: pageFormat,
      orientation,
      margins: effectiveMargins,
      headerFooter,
      metadata,
    });

    // 5. Determine clean PDF filename
    let pdfFilename = "document.pdf";
    if (metadata.title && metadata.title.trim()) {
      pdfFilename = `${metadata.title.trim().replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
    } else if (coverPage?.enabled && coverPage.title?.trim()) {
      pdfFilename = `${coverPage.title.trim().replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
    } else if (documents.length === 1 && documents[0].filename) {
      const baseName = documents[0].filename.replace(/\.(md|markdown|txt)$/i, "");
      pdfFilename = `${baseName.replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
    } else if (documents.length > 1) {
      pdfFilename = "merged_documentation.pdf";
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(pdfFilename)}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("PDF Generation API Error:", error);
    return NextResponse.json(
      {
        error: error?.message || "An unexpected error occurred during PDF generation.",
      },
      { status: 500 }
    );
  }
}
