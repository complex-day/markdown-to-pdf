"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  X,
  Sparkles,
  Archive,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Layers,
  FileCheck,
} from "lucide-react";
import { MarkdownDocument } from "@/lib/types";
import { unpackZipArchive } from "@/lib/zip";

interface FileUploaderProps {
  documents: MarkdownDocument[];
  onDocumentsChange: (docs: MarkdownDocument[], assets?: Record<string, string>) => void;
  onClear: () => void;
  onError: (errorMessage: string) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB max zip/file limit

const SAMPLE_MARKDOWN_1 = `# 01. Introduction & Overview

Welcome to the **Markdown to PDF V2** publishing suite! This document demonstrates **multi-file merge**, **theme styling**, **rich code highlighting**, and **asset rendering**.

---

## Key Highlights in V2

* [x] **Theme Selection**: GitHub Light, GitHub Dark, Documentation Style, and Clean Print.
* [x] **Automatic Table of Contents**: Hierarchical TOC generated from all heading tags (H1-H6).
* [x] **Executive Cover Page**: Document title, author, organization, and timestamp.
* [x] **Custom Headers, Footers & Page Numbers**: Positioned Left, Center, or Right.
* [x] **Multi-File Document Merging**: Drag to reorder, with clean page breaks between documents.
* [x] **ZIP Project Archive Support**: Automatically unpacks markdown and local images (\`./images/...\`).

> **Enterprise Quality Guarantee:**
> All stylesheets, fonts, and syntax highlighters are strictly verified with *zero unhandled network drops* or cutoffs.
`;

const SAMPLE_MARKDOWN_2 = `# 02. Architecture & Code Snippets

This second chapter showcases **VS Code-grade syntax highlighting** and formatted data tables.

---

## 1. High-Fidelity Rendering Pipeline

\`\`\`typescript
import { chromium } from "playwright";
import { compileFullDocumentHtml } from "./markdown";

export async function generateHighFidelityPdf(config: PdfConfig): Promise<Buffer> {
  // 1. Process Markdown to unified HTML
  const html = await compileFullDocumentHtml(config);

  // 2. Render in headless Chromium with print color adjustment
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // 3. Capture pristine PDF
  const pdfBuffer = await page.pdf({
    format: config.format || "A4",
    printBackground: true,
    displayHeaderFooter: config.headerFooter?.enabled,
  });

  await browser.close();
  return pdfBuffer;
}
\`\`\`

---

## 2. Capability Matrix

| Feature | Version 1 (MVP) | Version 2 (Pro) | Fidelity |
| :--- | :---: | :---: | :---: |
| **Themes** | Single Light | 4 Handcrafted Themes | 100% Matched |
| **TOC Generation** | None | Automatic H1–H6 Anchors | Interactive |
| **Multi-File Merge** | Single File Only | Multi-file & ZIP Archive | Page Break Safe |
| **Cover Page** | None | Professional Cover Page | Dedicated Sheet |
| **Watermarks** | None | Center / Diagonal / Footer | Vector Overlay |
`;

export const FileUploader: React.FC<FileUploaderProps> = ({
  documents,
  onDocumentsChange,
  onClear,
  onError,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUnzipping, setIsUnzipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    // Check if single ZIP archive
    if (files.length === 1 && files[0].name.toLowerCase().endsWith(".zip")) {
      const zipFile = files[0];
      if (zipFile.size > MAX_FILE_SIZE_BYTES) {
        onError(`ZIP archive exceeds 25 MB size limit.`);
        return;
      }

      setIsUnzipping(true);
      try {
        const buffer = await zipFile.arrayBuffer();
        const { markdownDocuments, assets } = await unpackZipArchive(buffer);

        if (markdownDocuments.length === 0) {
          onError("No Markdown (.md) files were found inside the uploaded ZIP archive.");
          return;
        }

        onDocumentsChange(markdownDocuments, assets);
      } catch (err: any) {
        console.error("ZIP Unpack error:", err);
        onError(`Failed to extract ZIP archive: ${err?.message || "Invalid zip format"}`);
      } finally {
        setIsUnzipping(false);
      }
      return;
    }

    // Process multiple or single markdown files
    const newDocs: MarkdownDocument[] = [...documents];
    let orderIndex = newDocs.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMd = /\.(md|markdown|txt)$/i.test(file.name);
      if (!isMd) continue;

      if (file.size > MAX_FILE_SIZE_BYTES) {
        onError(`File "${file.name}" exceeds the size limit.`);
        continue;
      }

      try {
        const content = await file.text();
        if (!content.trim()) continue;

        // Check if file already exists in list
        const existingIdx = newDocs.findIndex((d) => d.filename === file.name);
        if (existingIdx >= 0) {
          newDocs[existingIdx] = {
            ...newDocs[existingIdx],
            content,
            size: file.size,
          };
        } else {
          newDocs.push({
            id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            filename: file.name,
            content,
            order: ++orderIndex,
            size: file.size,
          });
        }
      } catch (err) {
        console.error(`Failed to read file ${file.name}:`, err);
      }
    }

    if (newDocs.length === 0) {
      onError("Please upload valid Markdown (.md, .markdown) or ZIP (.zip) files.");
      return;
    }

    onDocumentsChange(newDocs);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && !isUnzipping) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading || isUnzipping) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLoadSample = () => {
    const sampleDocs: MarkdownDocument[] = [
      {
        id: "sample-1",
        filename: "01-introduction.md",
        content: SAMPLE_MARKDOWN_1,
        order: 1,
        size: new Blob([SAMPLE_MARKDOWN_1]).size,
      },
      {
        id: "sample-2",
        filename: "02-architecture.md",
        content: SAMPLE_MARKDOWN_2,
        order: 2,
        size: new Blob([SAMPLE_MARKDOWN_2]).size,
      },
    ];
    onDocumentsChange(sampleDocs);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...documents];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    updated.forEach((d, idx) => (d.order = idx + 1));
    onDocumentsChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= documents.length - 1) return;
    const updated = [...documents];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updated.forEach((d, idx) => (d.order = idx + 1));
    onDocumentsChange(updated);
  };

  const handleRemoveDoc = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    updated.forEach((d, idx) => (d.order = idx + 1));
    if (updated.length === 0) {
      onClear();
    } else {
      onDocumentsChange(updated);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSize = documents.reduce((acc, doc) => acc + (doc.size || new Blob([doc.content]).size), 0);

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".md,.markdown,.txt,.zip"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading || isUnzipping}
      />

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && !isUnzipping && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-7 transition-all cursor-pointer text-center group ${
          isDragging
            ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.008] shadow-lg shadow-blue-500/10"
            : documents.length > 0
            ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/50"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/80 dark:hover:bg-slate-800 shadow-sm"
        } ${isLoading || isUnzipping ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          {isUnzipping ? (
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 animate-pulse">
              <Archive className="w-6 h-6" />
            </div>
          ) : documents.length > 0 ? (
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <FileCheck className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
          )}

          {isUnzipping ? (
            <div className="space-y-1">
              <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                Unpacking ZIP Archive & Extracting Assets...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parsing markdown documents and local image files
              </p>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                  {documents.length} {documents.length === 1 ? "Markdown Document" : "Documents Ready to Merge"}
                </span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {formatFileSize(totalSize)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click or drag to add more <code className="font-mono text-slate-700 dark:text-slate-300">.md</code> files or another <code className="font-mono text-slate-700 dark:text-slate-300">.zip</code>
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Drag &amp; drop Markdown files or project <span className="text-blue-600 dark:text-blue-400">.zip</span> archive
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports single or multiple <span className="font-mono font-medium text-slate-700 dark:text-slate-300">.md</span> files, and full <span className="font-mono font-medium text-slate-700 dark:text-slate-300">.zip</span> archives with local images
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Sample Loader */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading || isUnzipping}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Multi-Doc Sample</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUnzipping}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Files</span>
          </button>
        </div>

        {documents.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading || isUnzipping}
            className="inline-flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors py-1 px-2 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all ({documents.length})</span>
          </button>
        )}
      </div>

      {/* Multi-File Reorderable Queue List */}
      {documents.length > 1 && (
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-2 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Document Order &amp; Merge Sequence</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Files will merge with clean page breaks
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200/70 dark:border-slate-800 text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <FileCode className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {doc.filename}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    ({formatFileSize(doc.size || doc.content.length)})
                  </span>
                </div>

                {/* Reorder & Remove actions */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0 || isLoading}
                    className={`p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 ${
                      idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === documents.length - 1 || isLoading}
                    className={`p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 ${
                      idx === documents.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    disabled={isLoading}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove from merge"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
