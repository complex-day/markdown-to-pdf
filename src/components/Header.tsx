"use client";

import React from "react";
import { FileText, Sun, Moon, Sparkles, BookOpen, Layers } from "lucide-react";
import { ExportPreset } from "@/lib/types";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activePreset?: ExportPreset;
  onSelectPreset?: (preset: ExportPreset) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  activePreset,
  onSelectPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Markdown to PDF
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                V2 PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              Professional High-Fidelity Markdown Publishing Engine
            </p>
          </div>
        </div>

        {/* Quick Presets & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onSelectPreset && (
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onSelectPreset("github")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  activePreset === "github"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="GitHub Light theme + A4 + TOC + Page Numbers"
              >
                GitHub Preset
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset("documentation")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  activePreset === "documentation"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Clean Docs theme + TOC + Headers + Page Numbers"
              >
                Docs Preset
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset("print")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  activePreset === "print"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Monochrome Print Optimized style"
              >
                Print Preset
              </button>
            </div>
          )}

          {/* Dark Mode UI Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title={isDarkMode ? "Switch to Light UI" : "Switch to Dark UI"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
