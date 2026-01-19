import { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const DEFAULT_OG_IMAGE_ALT = 'The Sunshine Effect - Glow from the heart';

/**
 * Generate consistent page metadata with OG and Twitter tags
 * Uses the site config for base values and allows page-specific overrides
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  noIndex = false,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: 'en_US',
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Generate metadata for blog posts with article-specific OG tags
 */
export function generateBlogMetadata({
  title,
  description,
  slug,
  image,
  imageAlt,
  publishedTime,
  modifiedTime,
  author = 'The Sunshine Effect',
  category,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  imageAlt?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  return generatePageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    image,
    imageAlt: imageAlt || title,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    section: category,
    tags,
    keywords: tags,
  });
}

/**
 * Generate metadata for event pages
 */
export function generateEventMetadata({
  title,
  description,
  slug,
  eventType,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  eventType: 'golden-hour' | 'lunar-room';
  image?: string;
}): Metadata {
  const typeLabel = eventType === 'golden-hour' ? 'Golden Hour' : 'Lunar Room';

  return generatePageMetadata({
    title: `${title} | ${typeLabel} Event`,
    description,
    path: `/events/${slug}`,
    image,
    imageAlt: `${title} - ${typeLabel} Event by The Sunshine Effect`,
    keywords: [
      'women events',
      'wellness events',
      eventType === 'golden-hour' ? 'networking event' : 'restorative event',
      'community gathering',
      typeLabel.toLowerCase(),
    ],
  });
}

/**
 * Common page metadata presets for consistency
 */
export const PAGE_METADATA = {
  home: generatePageMetadata({
    title: 'The Sunshine Effect',
    description: 'Helping women move from burnout to alignment through simple rituals, community, and radiant experiences. Glow from the heart.',
    path: '/',
    keywords: [
      'women wellness coach',
      'burnout recovery',
      'alignment coach',
      'life coach for women',
    ],
  }),

  about: generatePageMetadata({
    title: 'About',
    description: 'Discover the heart behind The Sunshine Effect. A warm, grounded space helping women move from burnout to alignment with simple rituals and connection.',
    path: '/about',
    keywords: [
      'about sunshine effect',
      'women wellness',
      'burnout to alignment',
    ],
  }),

  offerings: generatePageMetadata({
    title: 'Offerings',
    description: 'Explore 1:1 coaching, retreats, and transformative events designed to help you find clarity, connection, and radiance.',
    path: '/offerings',
    keywords: [
      '1:1 coaching',
      'women retreats',
      'wellness coaching',
      'life coaching',
    ],
  }),

  events: generatePageMetadata({
    title: 'Events',
    description: 'Join Golden Hour networking events or Lunar Room restorative gatherings. Leave lighter, clearer, and connected.',
    path: '/events',
    keywords: [
      'women events',
      'golden hour events',
      'lunar room events',
      'wellness gatherings',
    ],
  }),

  community: generatePageMetadata({
    title: 'Community',
    description: 'Connect with like-minded women on the journey from burnout to alignment. Join our community of radiant souls.',
    path: '/community',
    keywords: [
      'women community',
      'wellness community',
      'supportive sisterhood',
    ],
  }),

  blog: generatePageMetadata({
    title: 'Blog',
    description: 'Insights on wellness, self-development, and business strategy. Resources to help you glow from the heart.',
    path: '/blog',
    keywords: [
      'wellness blog',
      'self-development',
      'women empowerment',
      'mindfulness',
    ],
  }),

  contact: generatePageMetadata({
    title: 'Contact',
    description: 'Get in touch with The Sunshine Effect. Join the newsletter, sign up for SMS updates, or send us a message.',
    path: '/contact',
    keywords: [
      'contact',
      'newsletter signup',
      'get in touch',
    ],
  }),

  thankYou: generatePageMetadata({
    title: 'Thank You',
    description: 'Welcome to The Sunshine Effect community. Your first ritual arrives soon.',
    path: '/thank-you',
    noIndex: true,
  }),
} as const;
