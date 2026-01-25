import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with The Sunshine Effect. Questions about events, collaborations, or the community? Send a note.',
  keywords: ['contact', 'get in touch', 'events', 'collaborations', 'community'],
  openGraph: {
    title: 'Contact | The Sunshine Effect',
    description: 'Get in touch with The Sunshine Effect. Questions about events, collaborations, or the community? Send a note.',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact The Sunshine Effect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | The Sunshine Effect',
    description: 'Get in touch with The Sunshine Effect. Questions about events, collaborations, or the community? Send a note.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
