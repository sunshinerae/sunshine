import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { isFeatureEnabled } from '@/lib/features';
import blogMeta from '@/data/blog-meta.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  // Only add enabled feature pages
  if (isFeatureEnabled('about')) {
    routes.push({
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    });
  }

  if (isFeatureEnabled('offerings')) {
    routes.push({
      url: `${baseUrl}/offerings`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    });
  }

  if (isFeatureEnabled('events')) {
    routes.push({
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    });
  }

  if (isFeatureEnabled('community')) {
    routes.push({
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    });
  }

  if (isFeatureEnabled('fullContact')) {
    routes.push({
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    });
  }

  // Blog index page
  routes.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  });

  // Dynamic blog post pages
  const blogPages = blogMeta.posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  routes.push(...blogPages);

  // Static utility pages
  routes.push({
    url: `${baseUrl}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  });

  return routes;
}
