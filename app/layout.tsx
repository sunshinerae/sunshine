import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { Footer } from '@/components/footer';
import { PageTransition } from '@/components/motion/page-transition';

/**
 * Brand fonts - warm, cozy, calm
 * - Fraunces: Variable font for headlines (soft serif with personality)
 * - Inter: Clean body text (excellent readability)
 */

// Fraunces - Headlines and display text
const headline = Fraunces({
  variable: '--font-headline',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Inter - Body copy and UI text
const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'women wellness coach',
    'somatic coaching',
    'burnout recovery',
    'women life coach',
    'burnout to alignment',
    'women coaching',
    'nervous system healing',
    'alignment coach',
    'mindfulness coach',
    'life coach for women',
    'business strategy for women',
  ],
  authors: [{ name: 'The Sunshine Effect' }],
  creator: 'The Sunshine Effect',
  publisher: 'The Sunshine Effect',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Sunshine Effect - From Burnout to Alignment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headline.variable} ${body.variable} font-body bg-background text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-sun-gold focus:text-sun-cocoa focus:px-4 focus:py-2 focus:rounded-[14px]"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
