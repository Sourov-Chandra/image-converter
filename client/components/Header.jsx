'use client';

import React from 'react';
import { ArrowLeftRight, Github, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.jsx';

export function Header() {
  return (
    <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ImageShift Logo"
            className="w-9 h-9 rounded-xl object-contain shadow-sm shadow-indigo-200 dark:shadow-none"
          />
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              ImageShift
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                Free
              </span>
            </span>
          </div>
        </div>

        {/* Right utility navigation */}
        <div className="flex items-center gap-3 sm:gap-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Anonymous & Private
          </span>

          {/* Theme Converter / Mode Toggle */}
          <ThemeToggle />

          <a
            href="https://github.com/Sourov-Chandra/image-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-semibold">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
