import React from 'react';
import { Layers } from 'lucide-react';

const FORMATS = [
  { name: 'JPG / JPEG', desc: 'Standard compressed photographic format' },
  { name: 'PNG', desc: 'Lossless format supporting transparent backgrounds' },
  { name: 'WEBP', desc: 'High efficiency modern web image compression' },
  { name: 'AVIF', desc: 'Next-generation image codec with optimal quality' },
  { name: 'JFIF', desc: 'JPEG File Interchange Format' },
  { name: 'GIF', desc: 'Static image conversion support' }
];

export function SupportedFormats() {
  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <Layers className="w-4 h-4" />
            Compatibility Matrix
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Supported Image Formats
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Easily convert between all leading modern and legacy static image standards.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {FORMATS.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
            >
              <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 block mb-1">
                {item.name}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
