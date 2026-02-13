import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Check-In',
  description: 'Check in to The Sunshine Effect event',
  robots: { index: false, follow: false },
};

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
