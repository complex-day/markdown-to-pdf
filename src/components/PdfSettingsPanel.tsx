"use client";

import React, { useState } from "react";
import {
  Palette,
  FileSpreadsheet,
  ListOrdered,
  Heading,
  Footprints,
  Sliders,
  Stamp,
  Tag,
  ChevronDown,
  ChevronUp,
  Check,
  Layout,
  Sun,
  Moon,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  ThemeType,
  PageFormat,
  PageOrientation,
  MarginPreset,
  MarginsConfig,
  WatermarkConfig,
  WatermarkPlacement,
  CoverPageConfig,
  HeaderFooterConfig,
  PdfMetadata,
  TocConfig,
  ExportPreset,
} from "@/lib/types";

interface PdfSettingsPanelProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  coverPage: CoverPageConfig;
  onCoverPageChange: (config: CoverPageConfig) => void;
  toc: TocConfig;
  onTocChange: (config: TocConfig) => void;
  headerFooter: HeaderFooterConfig;
  onHeaderFooterChange: (config: HeaderFooterConfig) => void;
  pageFormat: PageFormat;
  onPageFormatChange: (format: PageFormat) => void;
  orientation: PageOrientation;
  onOrientationChange: (orientation: PageOrientation) => void;
  marginPreset: MarginPreset;
  onMarginPresetChange: (preset: MarginPreset) => void;
  customMargins: MarginsConfig;
  onCustomMarginsChange: (margins: MarginsConfig) => void;
  watermark: WatermarkConfig;
  onWatermarkChange: (watermark: WatermarkConfig) => void;
  metadata: PdfMetadata;
  onMetadataChange: (metadata: PdfMetadata) => void;
  insertPageBreaks: boolean;
  onInsertPageBreaksChange: (val: boolean) => void;
  activePreset: ExportPreset;
  onApplyPreset: (preset: ExportPreset) => void;
}

type TabType = "theme" | "cover" | "toc" | "headerFooter" | "layout" | "watermark" | "metadata";

export const PdfSettingsPanel: React.FC<PdfSettingsPanelProps> = ({
  theme,
  onThemeChange,
  coverPage,
  onCoverPageChange,
  toc,
  onTocChange,
  headerFooter,
  onHeaderFooterChange,
  pageFormat,
  onPageFormatChange,
  orientation,
  onOrientationChange,
  marginPreset,
  onMarginPresetChange,
  customMargins,
  onCustomMarginsChange,
  watermark,
  onWatermarkChange,
  metadata,
  onMetadataChange,
  insertPageBreaks,
  onInsertPageBreaksChange,
  activePreset,
  onApplyPreset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("theme");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const themesList: { id: ThemeType; label: string; desc: string; previewBg: string; textColor: string; icon: React.ReactNode }[] = [
    {
      id: "github-light",
      label: "GitHub Light",
      desc: "Authentic GitHub light markdown styling with clear borders",
      previewBg: "bg-white border-slate-300",
      textColor: "text-slate-900",
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "github-dark",
      label: "GitHub Dark",
      desc: "Rich dark canvas #0d1117 with soft syntax highlights",
      previewBg: "bg-[#0d1117] border-slate-700",
      textColor: "text-slate-100",
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: "docs-style",
      label: "Documentation Style",
      desc: "Modern docs layout with indigo headers and clean callouts",
      previewBg: "bg-gradient-to-br from-white to-slate-50 border-indigo-200",
      textColor: "text-indigo-950",
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: "clean-print",
      label: "Clean Print Style",
      desc: "Minimalist monochrome print layout with serif typography",
      previewBg: "bg-white border-slate-400",
      textColor: "text-black",
      icon: <Printer className="w-4 h-4 text-slate-700" />,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
      {/* Panel Header with Collapse Toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 dark:hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              PDF Customization &amp; Publishing Controls
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Theme, Cover Page, TOC, Headers, Footers, Watermarks &amp; Margins
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-300">
            Preset: <strong className="capitalize text-blue-600 dark:text-blue-400">{activePreset}</strong>
          </span>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("theme")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "theme"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cover")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "cover"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Cover Page {coverPage.enabled && "•"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("toc")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "toc"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>TOC {toc.enabled && "•"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("headerFooter")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "headerFooter"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Heading className="w-3.5 h-3.5" />
              <span>Header &amp; Footer {headerFooter.enabled && "•"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "layout"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Page Layout</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("watermark")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "watermark"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Watermark {watermark.enabled && "•"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("metadata")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "metadata"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Metadata</span>
            </button>
          </div>

          {/* TAB 1: THEME SELECTION */}
          {activeTab === "theme" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themesList.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onThemeChange(t.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/30 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {t.icon}
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {t.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COVER PAGE */}
          {activeTab === "cover" && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Enable Executive Cover Page
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Adds a dedicated cover sheet before content with automatic page break
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coverPage.enabled}
                    onChange={(e) => onCoverPageChange({ ...coverPage, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {coverPage.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      value={coverPage.title}
                      onChange={(e) => onCoverPageChange({ ...coverPage, title: e.target.value })}
                      placeholder="e.g. Project Architecture Documentation"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={coverPage.subtitle || ""}
                      onChange={(e) => onCoverPageChange({ ...coverPage, subtitle: e.target.value })}
                      placeholder="e.g. Technical Specification & Implementation Guide"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Author / Lead
                    </label>
                    <input
                      type="text"
                      value={coverPage.author || ""}
                      onChange={(e) => onCoverPageChange({ ...coverPage, author: e.target.value })}
                      placeholder="e.g. Engineering Team"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={coverPage.organization || ""}
                      onChange={(e) => onCoverPageChange({ ...coverPage, organization: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={coverPage.date || ""}
                      onChange={(e) => onCoverPageChange({ ...coverPage, date: e.target.value })}
                      placeholder="e.g. October 2026 or Current Date"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TABLE OF CONTENTS */}
          {activeTab === "toc" && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Generate Table of Contents (TOC)
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Automatically scans all H1–H6 headings and inserts clickable anchor links
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={toc.enabled}
                    onChange={(e) => onTocChange({ ...toc, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {toc.enabled && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium">
                    Heading Depth: <span className="font-bold text-blue-600">H1 to H{toc.maxDepth}</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    {[2, 3, 4, 6].map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        onClick={() => onTocChange({ ...toc, maxDepth: depth })}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          toc.maxDepth === depth
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        H1–H{depth}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HEADER & FOOTER + PAGE NUMBERS */}
          {activeTab === "headerFooter" && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Enable PDF Headers &amp; Footers
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Renders running top and bottom margins with dynamic page numbers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={headerFooter.enabled}
                    onChange={(e) => onHeaderFooterChange({ ...headerFooter, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {headerFooter.enabled && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Header Title (Left)
                      </label>
                      <input
                        type="text"
                        value={headerFooter.headerTitle || ""}
                        onChange={(e) => onHeaderFooterChange({ ...headerFooter, headerTitle: e.target.value })}
                        placeholder="e.g. Project Documentation"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Header Organization (Right)
                      </label>
                      <input
                        type="text"
                        value={headerFooter.headerOrg || ""}
                        onChange={(e) => onHeaderFooterChange({ ...headerFooter, headerOrg: e.target.value })}
                        placeholder="e.g. Engineering Dept"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Page Numbering &amp; Footer Options
                    </span>

                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={headerFooter.showPageNumbers}
                          onChange={(e) => onHeaderFooterChange({ ...headerFooter, showPageNumbers: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Show Page Numbers (Page X of Y)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={headerFooter.showDate}
                          onChange={(e) => onHeaderFooterChange({ ...headerFooter, showDate: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Print Generation Date</span>
                      </label>
                    </div>

                    {headerFooter.showPageNumbers && (
                      <div className="space-y-1 pt-1">
                        <label className="block text-slate-600 dark:text-slate-400">
                          Page Number Position:
                        </label>
                        <div className="flex items-center space-x-2">
                          {(["left", "center", "right"] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => onHeaderFooterChange({ ...headerFooter, pageNumberPosition: pos })}
                              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                                headerFooter.pageNumberPosition === pos
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAGE LAYOUT & QUALITY */}
          {activeTab === "layout" && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Format */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block font-semibold text-slate-800 dark:text-slate-200">
                    Paper Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["A4", "Letter"] as PageFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => onPageFormatChange(fmt)}
                        className={`py-2 rounded-lg font-bold transition-all ${
                          pageFormat === fmt
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block font-semibold text-slate-800 dark:text-slate-200">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["portrait", "landscape"] as PageOrientation[]).map((orient) => (
                      <button
                        key={orient}
                        type="button"
                        onClick={() => onOrientationChange(orient)}
                        className={`py-2 rounded-lg font-bold capitalize transition-all ${
                          orientation === orient
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {orient}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Margins */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-800 dark:text-slate-200">
                  Page Margins
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["narrow", "normal", "wide", "custom"] as MarginPreset[]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onMarginPresetChange(preset)}
                      className={`py-2 rounded-lg font-bold capitalize transition-all ${
                        marginPreset === preset
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {marginPreset === "custom" && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-500">Top</label>
                      <input
                        type="text"
                        value={customMargins.top}
                        onChange={(e) => onCustomMarginsChange({ ...customMargins, top: e.target.value })}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Right</label>
                      <input
                        type="text"
                        value={customMargins.right}
                        onChange={(e) => onCustomMarginsChange({ ...customMargins, right: e.target.value })}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Bottom</label>
                      <input
                        type="text"
                        value={customMargins.bottom}
                        onChange={(e) => onCustomMarginsChange({ ...customMargins, bottom: e.target.value })}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500">Left</label>
                      <input
                        type="text"
                        value={customMargins.left}
                        onChange={(e) => onCustomMarginsChange({ ...customMargins, left: e.target.value })}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Document Page Breaks */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Insert Page Breaks Between Merged Documents
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Each Markdown file begins on a clean new page
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={insertPageBreaks}
                    onChange={(e) => onInsertPageBreaksChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: WATERMARK */}
          {activeTab === "watermark" && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Enable Watermark Overlay
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Adds subtle security/draft watermarks across all pages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watermark.enabled}
                    onChange={(e) => onWatermarkChange({ ...watermark, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {watermark.enabled && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Watermark Text
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={watermark.text}
                        onChange={(e) => onWatermarkChange({ ...watermark, text: e.target.value })}
                        placeholder="e.g. CONFIDENTIAL, DRAFT"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Preset chips */}
                  <div className="flex items-center space-x-2">
                    {["DRAFT", "CONFIDENTIAL", "INTERNAL ONLY", "PREVIEW"].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => onWatermarkChange({ ...watermark, text: sample })}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  {/* Placement */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block font-semibold text-slate-800 dark:text-slate-200">
                      Watermark Placement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["diagonal", "center", "footer"] as WatermarkPlacement[]).map((placement) => (
                        <button
                          key={placement}
                          type="button"
                          onClick={() => onWatermarkChange({ ...watermark, placement })}
                          className={`py-1.5 rounded-lg capitalize font-semibold transition-all ${
                            watermark.placement === placement
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {placement}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: METADATA */}
          {activeTab === "metadata" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  PDF Title
                </label>
                <input
                  type="text"
                  value={metadata.title || ""}
                  onChange={(e) => onMetadataChange({ ...metadata, title: e.target.value })}
                  placeholder="e.g. Technical Whitepaper"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={metadata.author || ""}
                  onChange={(e) => onMetadataChange({ ...metadata, author: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={metadata.subject || ""}
                  onChange={(e) => onMetadataChange({ ...metadata, subject: e.target.value })}
                  placeholder="e.g. Architecture Guide"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={metadata.keywords || ""}
                  onChange={(e) => onMetadataChange({ ...metadata, keywords: e.target.value })}
                  placeholder="e.g. markdown, pdf, documentation"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
