import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { ContactPageForm } from '@/components/forms/contact-page-form';
import { FadeInView } from '@/components/motion/fade-in-view';

export const metadata: Metadata = PAGE_METADATA.contact;

export default function ContactPage() {
  if (!isFeatureEnabled('fullContact')) {
    notFound();
  }

  return (
    <main className="bg-sunshine-white">
      {/* Hero Section */}
      <section className="bg-sunshine-purple text-sunshine-white px-6 py-16 overflow-hidden">
        <FadeInView className="max-w-5xl mx-auto space-y-4">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue">Contact</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-tight">
            Safe, judgment-free connection.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl">
            Tell us what you need. We respond within 24 hours with next steps, calm guidance, and zero pressure.
          </p>
          <p className="font-body text-sm">
            You are allowed to want more ease. This space is warm, private, and blame-free.
          </p>
        </FadeInView>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <ContactPageForm />

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <BrandCard className="p-6" variant="yellow">
            <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Response time</h3>
            <p className="font-body text-sm leading-relaxed">Within 24 hours, with clear next steps and zero pushiness.</p>
          </BrandCard>
          <BrandCard className="p-6" variant="white">
            <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Safety first</h3>
            <p className="font-body text-sm leading-relaxed">Judgment-free communication. You can ask for what you need without pressure.</p>
          </BrandCard>
          <BrandCard className="p-6" variant="orange">
            <h3 className="font-headline text-xl uppercase mb-2">Gentle microcopy</h3>
            <p className="font-body text-sm leading-relaxed">We reduce decision anxiety with clear options and loving encouragement.</p>
          </BrandCard>
        </div>

        {/* Signup Options */}
        <BrandCard className="p-8" variant="white">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">SMS love notes</p>
              <h3 className="font-headline text-2xl uppercase text-sunshine-purple">1–2 gentle texts a week</h3>
              <p className="text-sm text-sunshine-brown leading-relaxed">
                Soft reminders, encouragement, and links to events or offers when relevant. Always optional, always kind.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone</label>
                <input
                  placeholder="(555) 123-4567"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-white text-sunshine-brown border-2 border-sunshine-purple placeholder:text-sunshine-brown/60"
                />
              </div>
              <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange w-full sm:w-auto">
                Join SMS list
              </Button>
              <p className="text-xs text-sunshine-brown leading-relaxed">
                Consent matters. 1–2 texts/week max. Reply STOP anytime.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Consistent Bulletin</p>
              <h3 className="font-headline text-2xl uppercase text-sunshine-purple">Weekly email love notes</h3>
              <p className="text-sm text-sunshine-brown leading-relaxed">
                Personal notes from Sunshine, curated recommendations, upcoming events, and ways to stay connected.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  placeholder="you@example.com"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-white text-sunshine-brown border-2 border-sunshine-purple placeholder:text-sunshine-brown/60"
                />
              </div>
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue w-full sm:w-auto">
                Join the Consistent Bulletin
              </Button>
              <p className="text-xs text-sunshine-brown leading-relaxed">
                Glow from the heart. Unsubscribe anytime. No spam—just devotion and clarity.
              </p>
            </div>
          </div>
        </BrandCard>
      </section>
    </main>
  );
}
