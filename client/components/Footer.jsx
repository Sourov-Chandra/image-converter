import React from 'react';
import { ArrowLeftRight, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </div>
          <span>ImageShift Converter</span>
          <span className="text-slate-400 font-normal">· Fast & Private</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          Built for instant anonymous conversions with zero accounts.
        </div>

        <div>
          <a
            href="https://github.com/Sourov-Chandra/image-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}
