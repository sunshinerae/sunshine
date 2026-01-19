import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { EventCard } from '@/components/cards/event-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { getGoldenHourEvents } from '@/lib/events';

export const metadata: Metadata = PAGE_METADATA.events;

const gallery = [
  { src: '/festival-crowd.png', alt: 'Sun-drenched women celebrating together' },
  { src: '/dj-equipment.png', alt: 'Warm, electric event lighting' },
  { src: '/la-skyline.png', alt: 'Evening skyline backdrop' },
  { src: '/planning-notebook.png', alt: 'Quiet journaling moment' },
];

export default function EventsPage() {
  if (!isFeatureEnabled('events')) {
    notFound();
  }
  return (
    <div className="bg-sunshine-white">
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-purple text-sunshine-white overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-5 text-center">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-blue">
              Community in motion
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
              Rooms that feel like sunlight or moonlight.
            </h1>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
              Why the room matters: women leave feeling seen, resourced, and ready to move. High energy connection or slow introspection—pick what you need.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="#golden-hour" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                  Golden Hour
                </Button>
              </Link>
              <Link href="#lunar-room" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                  Lunar Room
                </Button>
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Golden Hour Zone - Warm background with sun imagery and event cards */}
      <section id="golden-hour" className="px-4 sm:px-6 py-16 md:py-24 bg-sunshine-orange text-sunshine-white overflow-hidden relative">
        {/* Sun imagery placeholder - decorative gradient overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large sun circle - top right */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sunshine-yellow/20 blur-3xl" />
          {/* Smaller sun accent - bottom left */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-sunshine-yellow/15 blur-2xl" />
          {/* Subtle rays effect */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sunshine-yellow/10 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <FadeInView>
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-yellow mb-3">
                Golden Hour
              </p>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-tight mb-4">
                High energy, heart-led networking
              </h2>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="font-body text-lg leading-relaxed max-w-2xl mx-auto text-sunshine-white/90">
                Sunshine leads motivational coaching, storytelling, and gentle networking. Leave with clarity, community, and at least two new women you actually want in your life.
              </p>
            </FadeInView>
          </div>

          {/* Sun imagery placeholder card */}
          <FadeInView delay={0.3} className="mb-12">
            <BrandCard className="p-0 overflow-hidden max-w-4xl mx-auto" variant="white">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-sunshine-yellow via-sunshine-orange to-sunshine-purple/40">
                <Image
                  src="/festival-crowd.png"
                  alt="Women celebrating at a Golden Hour event - sun-drenched connection and joy"
                  fill
                  className="object-cover mix-blend-overlay opacity-80"
                />
                {/* Sun overlay graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-sunshine-yellow/30 blur-xl" />
                  <div className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full bg-sunshine-yellow/50 blur-md" />
                </div>
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-sunshine-brown/60 to-transparent">
                  <p className="font-subhead text-sm md:text-base text-sunshine-white">
                    Electric, playful, connective — this is networking that doesn&apos;t feel like networking.
                  </p>
                </div>
              </div>
            </BrandCard>
          </FadeInView>

          {/* Event Cards from JSON */}
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

          {/* View all CTA */}
          <FadeInView delay={0.5} className="mt-10 text-center">
            <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue font-subhead">
              See All Golden Hour Dates
            </Button>
          </FadeInView>
        </div>
      </section>

      <section id="lunar-room" className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-yellow text-sunshine-brown overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <BrandCard className="p-6 md:p-8 overflow-hidden max-w-full" variant="white">
            <p className="font-subhead uppercase tracking-[0.14em] text-xs text-sunshine-purple">Lunar Room</p>
            <h2 className="font-headline text-4xl uppercase mt-2 text-sunshine-purple">Slow, introspective, sound + stillness</h2>
            <p className="font-body mt-4 text-lg leading-relaxed">
              Co-facilitated with healers and creative leaders. Expect yoga, sound, meditation, and space to hear your own desires.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="font-semibold">Session length</p>
                <p>75–90 minutes</p>
              </div>
              <div>
                <p className="font-semibold">Next date</p>
                <p>Feb 2 · Austin · Candle-lit</p>
              </div>
              <div>
                <p className="font-semibold">Tickets</p>
                <p>$55 · 18 spots · 9 left</p>
              </div>
              <div>
                <p className="font-semibold">Refund policy</p>
                <p>Full refund up to 72 hours</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button variant="glow-purple" className="w-full sm:w-auto">Reserve Feb 2 spot</Button>
              <Button variant="outline" className="w-full sm:w-auto border-sunshine-purple text-sunshine-purple hover:bg-sunshine-purple hover:text-sunshine-white">
                Join the waitlist
              </Button>
            </div>
          </BrandCard>
          <BrandCard className="p-0 overflow-hidden" variant="white">
            <Image
              src="/planning-notebook.png"
              alt="Candle-lit journaling setup"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </BrandCard>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Event Gallery</p>
            <h3 className="font-headline text-4xl uppercase text-sunshine-purple">See the energy</h3>
            <p className="text-lg text-sunshine-brown leading-relaxed max-w-3xl mx-auto">
              A glimpse of both energies: sun-drenched connection and moon-lit restoration.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item, idx) => (
              <BrandCard
                key={item.src}
                className={`p-0 overflow-hidden max-w-full ${idx % 2 === 0 ? 'md:rotate-1' : 'md:-rotate-1'} hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300`}
                variant="white"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </BrandCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
