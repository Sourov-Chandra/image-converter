export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      }
    ],
    sitemap: 'https://picnito.vercel.app/sitemap.xml',
    host: 'https://picnito.vercel.app'
  };
}
