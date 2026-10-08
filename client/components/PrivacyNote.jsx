import React from 'react';
import { ShieldCheck, EyeOff, Trash2 } from 'lucide-react';

export function PrivacyNote() {
  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Privacy-First Architecture
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your images belong solely to you. We respect your security and privacy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/70">
              <Trash2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">Zero permanent storage:</strong> Images are processed securely in memory and never stored in any database.
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/70">
              <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">Anonymous access:</strong> No email, login, account creation, or tracking identifiers required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
