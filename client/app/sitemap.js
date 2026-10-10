export default function sitemap() {
  const baseUrl = 'https://picnito.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    }
  ];
}
