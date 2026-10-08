'use client';

import React from 'react';
import { ArrowLeftRight, Github, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              ImageShift
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                Free
              </span>
            </span>
          </div>
        </div>

        {/* Right utility navigation */}
        <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Anonymous & Private
          </span>
          <a
            href="https://github.com/Sourov-Chandra/image-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
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
