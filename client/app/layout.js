import './globals.css';

export const metadata = {
  title: 'Image Converter - Fast, Free & Anonymous Image Conversion',
  description: 'Convert JPG, PNG, JFIF, WebP, AVIF, and GIF images instantly without registration or sign-in. Private, secure, and blazing fast.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
