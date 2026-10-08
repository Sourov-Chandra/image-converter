import React from 'react';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="text-center pt-10 pb-6 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        Zero signup required · Fast server-side conversion
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
        Convert images in seconds
      </h1>
      <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
        JPG, PNG, JFIF, WEBP, GIF, and AVIF. Drop your files, choose your output format, and convert instantly.
      </p>
    </section>
  );
}
