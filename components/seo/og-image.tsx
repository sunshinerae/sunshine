import { ImageResponse } from 'next/og';

/**
 * Brand colors for OG images
 */
const COLORS = {
  purple: '#6E054D',
  orange: '#D4510B',
  yellow: '#FFC619',
  blue: '#95D7E6',
  white: '#FCF6F2',
  brown: '#240D01',
};

/**
 * OG Image dimensions (standard for social sharing)
 */
export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export interface OgImageProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'blog' | 'event-golden' | 'event-lunar';
}

/**
 * Generate a branded Open Graph image
 *
 * Usage in route handlers (app/opengraph-image.tsx or app/[slug]/opengraph-image.tsx):
 *
 * ```tsx
 * import { generateOgImage, OG_IMAGE_SIZE } from '@/components/seo/og-image';
 *
 * export const size = OG_IMAGE_SIZE;
 * export const contentType = 'image/png';
 *
 * export default async function Image() {
 *   return generateOgImage({ title: 'Page Title' });
 * }
 * ```
 */
export function generateOgImage({
  title,
  subtitle,
  variant = 'default',
}: OgImageProps): ImageResponse {
  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'event-golden':
        return {
          background: COLORS.yellow,
          text: COLORS.brown,
          accent: COLORS.orange,
          tagline: COLORS.purple,
        };
      case 'event-lunar':
        return {
          background: COLORS.purple,
          text: COLORS.white,
          accent: COLORS.blue,
          tagline: COLORS.yellow,
        };
      case 'blog':
        return {
          background: COLORS.white,
          text: COLORS.brown,
          accent: COLORS.purple,
          tagline: COLORS.orange,
        };
      default:
        return {
          background: COLORS.purple,
          text: COLORS.white,
          accent: COLORS.yellow,
          tagline: COLORS.yellow,
        };
    }
  };

  const colors = getColors();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: variant === 'event-golden'
              ? 'radial-gradient(ellipse at 80% 20%, rgba(212, 81, 11, 0.15) 0%, transparent 50%)'
              : variant === 'event-lunar'
              ? 'radial-gradient(ellipse at 20% 80%, rgba(149, 215, 230, 0.2) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at 80% 20%, rgba(255, 198, 25, 0.15) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Top tagline */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: colors.tagline,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            The Sunshine Effect
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            flex: 1,
            gap: '24px',
            maxWidth: '1000px',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 40 ? '56px' : '72px',
              fontWeight: 700,
              color: colors.text,
              lineHeight: 1.1,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: '28px',
                color: colors.accent,
                margin: 0,
                fontWeight: 500,
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: colors.tagline,
              fontStyle: 'italic',
            }}
          >
            Glow from the heart
          </span>
        </div>

        {/* Decorative corner elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderTop: `3px solid ${colors.accent}`,
            borderRight: `3px solid ${colors.accent}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderBottom: `3px solid ${colors.accent}`,
            borderLeft: `3px solid ${colors.accent}`,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
    }
  );
}

/**
 * Default OG image generator for the homepage
 */
export function generateDefaultOgImage(): ImageResponse {
  return generateOgImage({
    title: 'The Sunshine Effect',
    subtitle: 'Helping women move from burnout to alignment',
    variant: 'default',
  });
}

/**
 * Blog post OG image generator
 */
export function generateBlogOgImage(title: string, category?: string): ImageResponse {
  return generateOgImage({
    title,
    subtitle: category,
    variant: 'blog',
  });
}

/**
 * Golden Hour event OG image generator
 */
export function generateGoldenHourOgImage(title: string, date?: string): ImageResponse {
  return generateOgImage({
    title,
    subtitle: date ? `Golden Hour • ${date}` : 'Golden Hour Event',
    variant: 'event-golden',
  });
}

/**
 * Lunar Room event OG image generator
 */
export function generateLunarRoomOgImage(title: string, date?: string): ImageResponse {
  return generateOgImage({
    title,
    subtitle: date ? `Lunar Room • ${date}` : 'Lunar Room Event',
    variant: 'event-lunar',
  });
}
