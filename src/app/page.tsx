"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FileUploader } from "@/components/FileUploader";
import { PdfSettingsPanel } from "@/components/PdfSettingsPanel";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { PdfPreviewModal } from "@/components/PdfPreviewModal";
import {
  ThemeType,
  PageFormat,
  PageOrientation,
  MarginPreset,
  MarginsConfig,
  WatermarkConfig,
  CoverPageConfig,
  HeaderFooterConfig,
  PdfMetadata,
  TocConfig,
  ExportPreset,
  MarkdownDocument,
  PdfGenerationRequest,
} from "@/lib/types";
import {
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileDown,
  Eye,
  Sparkles,
} from "lucide-react";

export default function Home() {
  // Theme & UI Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Documents & Asset Store
  const [documents, setDocuments] = useState<MarkdownDocument[]>([]);
  const [assets, setAssets] = useState<Record<string, string>>({});

  // Publishing & Customization State
  const [theme, setTheme] = useState<ThemeType>("github-light");
  const [coverPage, setCoverPage] = useState<CoverPageConfig>({
    enabled: false,
    title: "",
    subtitle: "",
    author: "",
    organization: "",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  });
  const [toc, setToc] = useState<TocConfig>({
    enabled: true,
    maxDepth: 3,
  });
  const [headerFooter, setHeaderFooter] = useState<HeaderFooterConfig>({
    enabled: true,
    headerTitle: "",
    headerOrg: "",
    footerText: "",
    showDate: true,
    showPageNumbers: true,
    pageNumberPosition: "right",
  });
  const [pageFormat, setPageFormat] = useState<PageFormat>("A4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [marginPreset, setMarginPreset] = useState<MarginPreset>("normal");
  const [customMargins, setCustomMargins] = useState<MarginsConfig>({
    top: "20mm",
    right: "20mm",
    bottom: "20mm",
    left: "20mm",
  });
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    enabled: false,
    text: "CONFIDENTIAL",
    placement: "diagonal",
    opacity: 0.15,
  });
  const [metadata, setMetadata] = useState<PdfMetadata>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
  });
  const [insertPageBreaks, setInsertPageBreaks] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<ExportPreset>("github");

  // PDF Generation & Preview State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("document.pdf");
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Sync Dark Mode class with <html> element
  useEffect(() => {
    const savedDark = localStorage.getItem("theme_ui_dark");
    if (savedDark === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme_ui_dark", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme_ui_dark", "false");
      }
      return next;
    });
  };

  // Presets Quick Applicator
  const handleApplyPreset = (preset: ExportPreset) => {
    setActivePreset(preset);
    if (preset === "github") {
      setTheme("github-light");
      setPageFormat("A4");
      setOrientation("portrait");
      setToc({ enabled: true, maxDepth: 3 });
      setHeaderFooter((prev) => ({
        ...prev,
        enabled: true,
        showPageNumbers: true,
        pageNumberPosition: "right",
      }));
      setMarginPreset("normal");
    } else if (preset === "documentation") {
      setTheme("docs-style");
      setPageFormat("A4");
      setOrientation("portrait");
      setToc({ enabled: true, maxDepth: 4 });
      setHeaderFooter((prev) => ({
        ...prev,
        enabled: true,
        headerTitle: metadata.title || "Project Documentation",
        showPageNumbers: true,
        pageNumberPosition: "center",
      }));
      setMarginPreset("normal");
    } else if (preset === "print") {
      setTheme("clean-print");
      setPageFormat("A4");
      setOrientation("portrait");
      setToc({ enabled: false, maxDepth: 2 });
      setHeaderFooter((prev) => ({
        ...prev,
        enabled: true,
        showPageNumbers: true,
        pageNumberPosition: "right",
      }));
      setMarginPreset("normal");
    }
  };

  const handleDocumentsChange = (newDocs: MarkdownDocument[], newAssets?: Record<string, string>) => {
    setDocuments(newDocs);
    if (newAssets) {
      setAssets((prev) => ({ ...prev, ...newAssets }));
    }
    setErrorMessage(null);
    setSuccessMessage(null);

    // Auto-populate document metadata if title empty
    if (newDocs.length > 0 && !coverPage.title) {
      const firstLine = newDocs[0].content.split("\n").find((l) => l.startsWith("# "));
      if (firstLine) {
        const extractedTitle = firstLine.replace(/^#\s+/, "").trim();
        setCoverPage((c) => ({ ...c, title: extractedTitle }));
        setMetadata((m) => ({ ...m, title: extractedTitle }));
      }
    }
  };

  const handleClear = () => {
    setDocuments([]);
    setAssets({});
    setPdfBlobUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleGeneratePdf = async () => {
    if (!documents || documents.length === 0) {
      setErrorMessage("Please upload or load Markdown documents first.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: PdfGenerationRequest = {
        documents,
        theme,
        coverPage,
        toc,
        headerFooter,
        pageFormat,
        orientation,
        marginPreset,
        customMargins,
        watermark,
        metadata,
        assets,
        insertPageBreaks,
      };

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `PDF generation failed with status code ${response.status}`
        );
      }

      // Convert response stream to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Determine PDF filename
      let targetName = "document.pdf";
      if (metadata.title?.trim()) {
        targetName = `${metadata.title.trim().replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
      } else if (coverPage.enabled && coverPage.title?.trim()) {
        targetName = `${coverPage.title.trim().replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
      } else if (documents.length === 1 && documents[0].filename) {
        targetName = `${documents[0].filename.replace(/\.(md|markdown|txt)$/i, "")}.pdf`;
      } else if (documents.length > 1) {
        targetName = "merged_documentation.pdf";
      }

      setPdfBlobUrl(url);
      setPdfFilename(targetName);
      setPdfSize(blob.size);
      setIsPdfModalOpen(true);
      setSuccessMessage(`Successfully generated "${targetName}"! Opening PDF preview...`);
    } catch (err: any) {
      console.error("PDF Generation error:", err);
      setErrorMessage(err.message || "Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics across all documents
  const totalChars = documents.reduce((acc, d) => acc + d.content.length, 0);
  const totalWords = documents.reduce(
    (acc, d) => acc + d.content.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const totalLines = documents.reduce((acc, d) => acc + d.content.split("\n").length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activePreset={activePreset}
        onSelectPreset={handleApplyPreset}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Intro Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Fidelity PDF Generation Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Publish Markdown into Professional PDFs
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload single or multi-file Markdown projects &amp; ZIP archives with local images.
            Customize themes, executive cover pages, TOCs, headers, footers, and watermarks with exact 1:1 preview fidelity.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 px-4 py-3 rounded-xl flex items-start space-x-3 shadow-sm animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-semibold">Error: </span>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold text-base leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-start space-x-3 shadow-sm animate-in fade-in duration-200">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-base leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* 1. Upload Section */}
        <section aria-label="Upload Section">
          <FileUploader
            documents={documents}
            onDocumentsChange={handleDocumentsChange}
            onClear={handleClear}
            onError={(msg) => setErrorMessage(msg)}
            isLoading={isGenerating}
          />
        </section>

        {/* 2. PDF Customization & Settings Panel */}
        <section aria-label="PDF Customization Settings">
          <PdfSettingsPanel
            theme={theme}
            onThemeChange={(t) => {
              setTheme(t);
              setActivePreset("custom");
            }}
            coverPage={coverPage}
            onCoverPageChange={setCoverPage}
            toc={toc}
            onTocChange={setToc}
            headerFooter={headerFooter}
            onHeaderFooterChange={setHeaderFooter}
            pageFormat={pageFormat}
            onPageFormatChange={setPageFormat}
            orientation={orientation}
            onOrientationChange={setOrientation}
            marginPreset={marginPreset}
            onMarginPresetChange={setMarginPreset}
            customMargins={customMargins}
            onCustomMarginsChange={setCustomMargins}
            watermark={watermark}
            onWatermarkChange={setWatermark}
            metadata={metadata}
            onMetadataChange={setMetadata}
            insertPageBreaks={insertPageBreaks}
            onInsertPageBreaksChange={setInsertPageBreaks}
            activePreset={activePreset}
            onApplyPreset={handleApplyPreset}
          />
        </section>

        {/* 3. Metrics & Action Bar */}
        {documents.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{documents.length}</span>{" "}
                {documents.length === 1 ? "document" : "documents"}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalWords}</span> words
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalChars}</span> chars
              </div>
            </div>

            {/* Generate & Preview PDF CTA */}
            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isGenerating || documents.length === 0}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                isGenerating
                  ? "bg-slate-400 text-white cursor-wait"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-blue-600/20 hover:shadow-lg active:scale-95"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating High-Fidelity PDF...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Generate &amp; Preview PDF</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 4. Live Markdown & Theme Preview */}
        <section aria-label="Markdown Live Preview">
          <MarkdownPreview
            documents={documents}
            theme={theme}
            coverPage={coverPage}
            toc={toc}
            watermark={watermark}
            assets={assets}
            insertPageBreaks={insertPageBreaks}
          />
        </section>

        {/* Bottom CTA Button */}
        {documents.length > 0 && totalChars > 400 && (
          <div className="flex justify-end pt-2 pb-6">
            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                isGenerating
                  ? "bg-slate-400 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Generate PDF Document</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Embedded PDF Viewer Modal Before Final Download */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfBlobUrl={pdfBlobUrl}
        pdfFilename={pdfFilename}
        pdfSize={pdfSize}
        onDownload={handleDirectDownload}
        onRegenerate={handleGeneratePdf}
        onEditSettings={() => setIsPdfModalOpen(false)}
        isRegenerating={isGenerating}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            Markdown to PDF V2 PRO &bull; High-Fidelity Multi-Theme Markdown Publishing Engine
          </p>
          <p className="text-slate-400 dark:text-slate-500">
            Playwright Chromium &bull; Zero CDN Dependencies &bull; Exact Margins &bull; Cover Pages &bull; Automatic TOCs
          </p>
        </div>
      </footer>
    </div>
  );
}
