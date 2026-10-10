'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I convert images online for free with Picnito?',
    a: 'Simply drag and drop or upload your images into the upload box, select your desired target format (JPG, PNG, WebP, AVIF, or GIF), optionally adjust quality or resize options, and click "Convert". Your converted files will be ready for instant download.'
  },
  {
    q: 'Are my uploaded files safe and private?',
    a: 'Yes, 100%. Picnito is built with a strict privacy-first architecture. We do not store your files on any permanent storage or database. All processing is carried out in temporary memory and immediately cleared after download. Furthermore, all camera EXIF metadata is stripped by default to protect your privacy.'
  },
  {
    q: 'Can I convert multiple images at once (Batch Conversion)?',
    a: 'Yes! Picnito supports batch conversion of up to 20 files (or 100 MB total) in a single request. Once converted, your files are packaged into a neat, compressed ZIP file for easy one-click downloading.'
  },
  {
    q: 'Which image formats are supported?',
    a: 'Picnito supports input formats including JPG, JPEG, JFIF, PNG, WebP, AVIF, and static GIF. You can convert to JPG, PNG, WebP, AVIF, and GIF.'
  },
  {
    q: 'How does Picnito handle transparent backgrounds?',
    a: 'When converting between formats that support alpha transparency (such as PNG to WebP or AVIF), transparency is fully preserved. When converting a transparent image to JPEG (which does not support alpha), Picnito smoothly flattens the transparency against a clean background (defaults to white, or your custom chosen color).'
  },
  {
    q: 'Do I need to create an account, register, or pay?',
    a: 'No. Picnito is completely free, anonymous, and requires no registration, login, email address, or credit card.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about Picnito online image conversion.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 flex items-center justify-between gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
