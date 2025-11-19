import type { Metadata } from 'next';
import { Playfair_Display, Manrope, Poppins } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { Footer } from '@/components/footer';

const headline = Playfair_Display({
  variable: '--font-headline',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const subhead = Manrope({
  variable: '--font-subhead',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const body = Poppins({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'burnout to alignment',
    'women coaching',
    'retreats',
    'events',
    'alignment rituals',
    'community for women',
  ],
  authors: [{ name: 'The Sunshine Effect' }],
  creator: 'The Sunshine Effect',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
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
        className={`${headline.variable} ${subhead.variable} ${body.variable} font-body bg-background text-foreground antialiased`}
      >
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
