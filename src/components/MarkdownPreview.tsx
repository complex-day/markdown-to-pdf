"use client";

import React, { useEffect, useState } from "react";
import { compileFullDocumentHtml } from "@/lib/markdown";
import { getThemeCss } from "@/lib/styles";
import {
  ThemeType,
  CoverPageConfig,
  TocConfig,
  WatermarkConfig,
  MarkdownDocument,
} from "@/lib/types";
import { Eye, FileCode2, AlertCircle, Sparkles, Layers } from "lucide-react";

interface MarkdownPreviewProps {
  documents: MarkdownDocument[];
  theme: ThemeType;
  coverPage: CoverPageConfig;
  toc: TocConfig;
  watermark: WatermarkConfig;
  assets?: Record<string, string>;
  insertPageBreaks?: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  documents,
  theme,
  coverPage,
  toc,
  watermark,
  assets,
  insertPageBreaks = true,
}) => {
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!documents || documents.length === 0) {
      setRenderedHtml("");
      setCompileError(null);
      return;
    }

    setIsCompiling(true);
    setCompileError(null);

    // Compile using the unified pipeline with cover page, TOC, and image resolution
    compileFullDocumentHtml({
      documents,
      coverPage,
      toc,
      theme,
      assets,
      insertPageBreaks,
    })
      .then((html) => {
        if (!isCancelled) {
          setRenderedHtml(html);
          setIsCompiling(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Preview compilation error:", err);
          setCompileError("Failed to parse and render Markdown content.");
          setIsCompiling(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [documents, theme, coverPage, toc, assets, insertPageBreaks]);

  if (!documents || documents.length === 0) {
    return (
      <div className="w-full h-80 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/60 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
          <FileCode2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No Markdown loaded</p>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Upload a <code className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">.md</code> or <code className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">.zip</code> above or click &ldquo;Load Multi-Doc Sample&rdquo; to preview.
        </p>
      </div>
    );
  }

  // Theme-specific CSS styling for preview frame
  const themeCss = getThemeCss(theme);

  return (
    <div className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
      {/* Preview Header / Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            • Theme: <strong className="capitalize text-slate-600 dark:text-slate-300">{theme.replace("-", " ")}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {documents.length > 1 && (
            <span className="text-[11px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
              <Layers className="w-3 h-3" />
              <span>{documents.length} Files Merged</span>
            </span>
          )}

          {isCompiling && (
            <div className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Rendering...</span>
            </div>
          )}
        </div>
      </div>

      {/* Rendered HTML Container with Live Theme Styles */}
      <div className="relative p-6 sm:p-10 overflow-x-auto max-h-[750px] overflow-y-auto custom-scrollbar transition-colors">
        {/* Scoped Theme Stylesheet */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />

        {/* Live Watermark Overlay in Preview */}
        {watermark.enabled && watermark.text.trim() && (
          <div
            className={`watermark-overlay watermark-${watermark.placement || "diagonal"} pointer-events-none select-none`}
            style={{
              color: theme === "github-dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
            }}
          >
            {watermark.text}
          </div>
        )}

        {compileError ? (
          <div className="flex items-center space-x-2 text-rose-600 text-sm p-4 bg-rose-50 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{compileError}</span>
          </div>
        ) : (
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>
    </div>
  );
};
