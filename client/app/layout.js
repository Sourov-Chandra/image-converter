import './globals.css';

export const metadata = {
  metadataBase: new URL('https://picnito.vercel.app'),
  title: {
    default: 'Picnito - Free Online Image Converter | Convert JPG, PNG, WebP, AVIF, GIF',
    template: '%s | Picnito'
  },
  description: 'Convert JPG, PNG, WebP, AVIF, JFIF, and GIF images online for free with Picnito. Fast, 100% private, zero registration, and batch conversion supported.',
  keywords: [
    'image converter',
    'free image converter',
    'picnito',
    'online image converter',
    'convert jpg to png',
    'convert png to webp',
    'convert webp to jpg',
    'convert jfif to png',
    'avif converter',
    'batch image converter',
    'anonymous image converter',
    'privacy first image converter',
    'photo format converter'
  ],
  authors: [{ name: 'Sourov Chandra Barmon', url: 'https://www.facebook.com/sourov.chandra.barmon.dev' }],
  creator: 'Sourov Chandra Barmon',
  publisher: 'Picnito',
  applicationName: 'Picnito',
  alternates: {
    canonical: 'https://picnito.vercel.app'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://picnito.vercel.app',
    siteName: 'Picnito',
    title: 'Picnito - Free Online Image Converter',
    description: 'Convert JPG, PNG, WebP, AVIF, JFIF, and GIF online in seconds. 100% private, zero registration, fast batch conversion.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Picnito Free Online Image Converter'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Picnito - Free Online Image Converter',
    description: 'Fast, private, and free online image converter. Convert JPG, PNG, WebP, AVIF, and GIF in seconds.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest'
};

const jsonLdWebApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Picnito',
  url: 'https://picnito.vercel.app',
  description: 'Fast, private, and free online image converter. Convert JPG, PNG, WebP, AVIF, JFIF, and GIF with zero sign-up.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  creator: {
    '@type': 'Person',
    name: 'Sourov Chandra Barmon',
    url: 'https://www.facebook.com/sourov.chandra.barmon.dev'
  }
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert images online for free with Picnito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply drag and drop or upload your images into the upload box, select your desired target format (JPG, PNG, WebP, AVIF, or GIF), optionally adjust quality or resize options, and click "Convert". Your converted files will be ready for instant download.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are my uploaded files safe and private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100%. Picnito is built with a strict privacy-first architecture. We do not store your files on any permanent storage or database. All processing is carried out in temporary memory and immediately cleared after download.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I convert multiple images at once (Batch Conversion)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Picnito supports batch conversion of up to 20 files in a single request, delivered as a compressed ZIP file.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which image formats are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Picnito supports input formats including JPG, JPEG, JFIF, PNG, WebP, AVIF, and static GIF. You can convert to JPG, PNG, WebP, AVIF, and GIF.'
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />

        {/* Anti-Flicker Dark Mode Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
