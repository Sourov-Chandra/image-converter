import React from 'react';
import { Header } from '../components/Header.jsx';
import { Hero } from '../components/Hero.jsx';
import { ConverterWorkspace } from '../components/ConverterWorkspace.jsx';
import { SupportedFormats } from '../components/SupportedFormats.jsx';
import { HowItWorks } from '../components/HowItWorks.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { PrivacyNote } from '../components/PrivacyNote.jsx';
import { Footer } from '../components/Footer.jsx';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 space-y-8 pb-16">
        <Hero />
        <ConverterWorkspace />
        <SupportedFormats />
        <HowItWorks />
        <FAQ />
        <PrivacyNote />
      </main>
      <Footer />
    </div>
  );
}
