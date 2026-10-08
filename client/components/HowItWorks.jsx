import React from 'react';
import { UploadCloud, Sliders, Download } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: UploadCloud,
    title: 'Drop your files',
    desc: 'Select or drag & drop one or multiple images up to 15 MB each.'
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Choose formats & options',
    desc: 'Select PNG, JPG, WebP, AVIF, or adjust quality, dimensions, and backgrounds.'
  },
  {
    step: '03',
    icon: Download,
    title: 'Download immediately',
    desc: 'Get your converted files instantly. Single files download directly, batches in a neat ZIP.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
            Simple 3-Step Process
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-none">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-200 dark:text-slate-800">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
