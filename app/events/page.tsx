import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { EventCard } from '@/components/cards/event-card';
import { ViewportVideo } from '@/components/ViewportVideo';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { getGoldenHourEvents } from '@/lib/events';

export const metadata: Metadata = PAGE_METADATA.events;

const gallery = [
  { src: '/festival-crowd.png', alt: 'Women connecting at Golden Hour', gradient: 'from-sun-gold via-sun-coral to-sun-plum/40' },
  { src: '/dj-equipment.png', alt: 'Electric event energy', gradient: 'from-sun-coral via-sun-gold to-sun-ember/30' },
  { src: '/portrait-female-professional.png', alt: 'Confident community connection', gradient: 'from-sun-plum via-sun-coral/40 to-sun-gold/30' },
  { src: '/planning-notebook.png', alt: 'Intentional planning moments', gradient: 'from-sun-ember/40 via-sun-plum to-sun-coral/30' },
];

export default function EventsPage() {
  if (!isFeatureEnabled('events')) {
    notFound();
  }
  return (
    <div className="bg-artistic">
      {/* Hero */}
      <section className="px-4 sm:px-6 py-12 md:py-16 text-white overflow-hidden relative">
        {/* Purple dreamy background */}
        <Image
          src="/golden-hour-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Plum overlay */}
        <div className="absolute inset-0 bg-sun-plum/40" />
        <div className="max-w-5xl mx-auto space-y-5 text-center relative z-10">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-gold">
              Golden Hour
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
              The room where ambitious women show up.
            </h1>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
              Connect with intention. Get clarity. Leave ready to take action.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <Link href="#events" className="w-full sm:w-auto">
              <Button className="bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90">
                See Upcoming Events
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      {/* Golden Hour Zone */}
      <section id="events" className="px-4 sm:px-6 py-16 md:py-24 text-white overflow-hidden relative bg-gradient-to-br from-sun-coral via-sun-gold/80 to-sun-coral">

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <FadeInView>
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-gold mb-3">
                Los Angeles Events
              </p>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-tight mb-4">
                High energy. Real momentum.
              </h2>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="font-body text-lg leading-relaxed max-w-2xl mx-auto text-white/90">
                Coaching, storytelling, and connections that actually move the needle. Leave with clarity, momentum, and women who push you forward.
              </p>
            </FadeInView>
          </div>

          {/* Featured Image */}
          <FadeInView delay={0.3} className="mb-12">
            <BrandCard className="p-0 overflow-hidden max-w-4xl mx-auto" variant="white">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-sun-gold via-sun-coral to-sun-plum/40">
                <Image
                  src="/festival-crowd.png"
                  alt="Women at a Golden Hour event"
                  fill
                  className="object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-sun-gold/30 blur-xl" />
                  <div className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full bg-sun-gold/50 blur-md" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-sun-cocoa/60 to-transparent">
                  <p className="font-subhead text-sm md:text-base text-white">
                    Electric energy. Bold conversations. The room where women level up.
                  </p>
                </div>
              </div>
            </BrandCard>
          </FadeInView>

          {/* Event Cards */}
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
            {getGoldenHourEvents().map((event) => (
              <StaggerItem key={event.id}>
                <EventCard
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  description={event.description}
                  type={event.type}
                  location={event.location}
                  ctaText={event.price === 'Free' ? 'RSVP Free' : `RSVP · ${event.price}`}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* CTA */}
          <FadeInView delay={0.5} className="mt-10 text-center">
            <Link href="/join">
              <Button className="bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90 font-subhead">
                Get on the list for future events
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-artistic overflow-hidden border-t-2 border-sun-sky/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <FadeInView>
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sun-plum">Past Golden Hours</p>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h3 className="font-headline text-4xl uppercase text-sun-plum">The energy. The connections.</h3>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="text-lg text-sun-cocoa leading-relaxed max-w-3xl mx-auto">
                Real moments. Real momentum. You could be next.
              </p>
            </FadeInView>
          </div>
          <StaggerChildren className="grid sm:grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.1}>
            {gallery.map((item, idx) => (
              <StaggerItem key={item.src}>
                <BrandCard
                  className={`p-0 overflow-hidden max-w-full ${idx % 2 === 0 ? 'md:rotate-1' : 'md:-rotate-1'} hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300`}
                  variant="white"
                >
                  <div className={`relative w-full aspect-[5/4] bg-gradient-to-br ${item.gradient}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={400}
                      height={320}
                      className="w-full h-full object-cover mix-blend-overlay opacity-90"
                    />
                  </div>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Placeholder note for when real photos arrive */}
          <FadeInView delay={0.4} className="text-center">
            <p className="font-body text-sm text-sun-cocoa/60 italic">
              More photos coming soon from recent Golden Hour gatherings.
            </p>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
