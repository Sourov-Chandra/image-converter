import React from 'react';
import { ArrowLeftRight, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand */}
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <img
              src="/logo.png"
              alt="ImageShift Logo"
              className="w-6 h-6 rounded-lg object-contain"
            />
            <span>ImageShift Converter</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">· Fast & Private</span>
          </div>

          <div className="text-slate-400 dark:text-slate-500">
            Built for instant anonymous conversions with zero accounts or tracking.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Sourov-Chandra/image-converter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Courtesy & Social credit */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            Courtesy of <strong className="font-semibold text-slate-800 dark:text-slate-200">Sourov Chandra Barmon</strong>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500">Connect:</span>
            <a
              href="https://www.facebook.com/sourov.chandra.barmon.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60 font-semibold transition-all hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
