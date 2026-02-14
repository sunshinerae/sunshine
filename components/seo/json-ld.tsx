import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
}

interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

interface EventSchema {
  '@context': 'https://schema.org';
  '@type': 'Event';
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    '@type': 'Place' | 'VirtualLocation';
    name?: string;
    address?: string;
    url?: string;
  };
  organizer?: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  image?: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}

type Schema = OrganizationSchema | WebSiteSchema | ArticleSchema | EventSchema;

interface JsonLdProps {
  data: Schema | Schema[];
}

/**
 * Renders JSON-LD structured data script tag
 * Can accept a single schema object or an array of schemas
 */
export function JsonLd({ data }: JsonLdProps) {
  const structuredData = Array.isArray(data) ? data : [data];

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

/**
 * Pre-configured Organization schema for The Sunshine Effect
 * Use on the homepage or any page that should identify the organization
 */
export function OrganizationJsonLd() {
  const organizationSchema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      SOCIAL_LINKS.instagram,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@thesunshineeffect.com',
    },
  };

  return <JsonLd data={organizationSchema} />;
}

/**
 * Pre-configured WebSite schema for The Sunshine Effect
 * Use on the homepage to define the website entity
 */
export function WebSiteJsonLd() {
  const websiteSchema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
  };

  return <JsonLd data={websiteSchema} />;
}

/**
 * Article schema for blog posts
 */
export function ArticleJsonLd({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author = SITE_CONFIG.name,
  url,
}: {
  title: string;
  description?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  url: string;
}) {
  const articleSchema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? (image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`) : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`,
    },
  };

  return <JsonLd data={articleSchema} />;
}

/**
 * Event schema for Golden Hour and Lunar Room events
 */
export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  isVirtual = false,
}: {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    url?: string;
  };
  image?: string;
  isVirtual?: boolean;
}) {
  const eventSchema: EventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    image: image ? (image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`) : undefined,
    eventStatus: 'EventScheduled',
    eventAttendanceMode: isVirtual ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    location: isVirtual
      ? {
          '@type': 'VirtualLocation',
          url: location?.url || SITE_CONFIG.url,
        }
      : location
      ? {
          '@type': 'Place',
          name: location.name,
          address: location.address,
        }
      : undefined,
  };

  return <JsonLd data={eventSchema} />;
}
