import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { EventCard } from '@/components/cards/event-card';
import { ZoneDivider } from '@/components/ui/zone-divider';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { getGoldenHourEvents, getLunarRoomEvents } from '@/lib/events';

export const metadata: Metadata = PAGE_METADATA.events;

const gallery = [
  { src: '/festival-crowd.png', alt: 'Sun-drenched women celebrating together', gradient: 'from-sunshine-yellow via-sunshine-orange to-sunshine-purple/40' },
  { src: '/dj-equipment.png', alt: 'Warm, electric event lighting', gradient: 'from-sunshine-orange via-sunshine-yellow to-sunshine-blue/30' },
  { src: '/portrait-female-professional.png', alt: 'Community connection', gradient: 'from-sunshine-purple via-sunshine-blue/40 to-sunshine-yellow/30' },
  { src: '/planning-notebook.png', alt: 'Quiet journaling moment', gradient: 'from-sunshine-blue/40 via-sunshine-purple to-sunshine-orange/30' },
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

      {/* Visual Divider - Transition from Golden Hour to Lunar Room */}
      <ZoneDivider from="golden-hour" to="lunar-room" />

      {/* Lunar Room Zone - Cool/dark background with moon imagery and event cards */}
      <section id="lunar-room" className="px-4 sm:px-6 py-16 md:py-24 bg-sunshine-purple text-sunshine-white overflow-hidden relative">
        {/* Moon imagery placeholder - decorative gradient overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large moon circle - top left */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sunshine-blue/15 blur-3xl" />
          {/* Smaller moon accent - bottom right */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-sunshine-blue/10 blur-2xl" />
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-sunshine-blue/5 to-transparent" />
          {/* Stars effect - scattered small circles */}
          <div className="absolute top-20 right-1/4 w-2 h-2 rounded-full bg-sunshine-white/20" />
          <div className="absolute top-32 right-1/3 w-1 h-1 rounded-full bg-sunshine-white/30" />
          <div className="absolute top-48 left-1/4 w-1.5 h-1.5 rounded-full bg-sunshine-white/25" />
          <div className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-sunshine-white/20" />
          <div className="absolute bottom-48 right-1/5 w-2 h-2 rounded-full bg-sunshine-white/15" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <FadeInView>
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-blue mb-3">
                Lunar Room
              </p>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-tight mb-4">
                Slow, introspective, sound + stillness
              </h2>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="font-body text-lg leading-relaxed max-w-2xl mx-auto text-sunshine-white/90">
                Co-facilitated with healers and creative leaders. Expect yoga, sound, meditation, and space to hear your own desires. Leave with a quieter mind and a fuller heart.
              </p>
            </FadeInView>
          </div>

          {/* Moon imagery placeholder card */}
          <FadeInView delay={0.3} className="mb-12">
            <BrandCard className="p-0 overflow-hidden max-w-4xl mx-auto" variant="white">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-sunshine-purple via-sunshine-blue/40 to-sunshine-purple/80">
                <Image
                  src="/planning-notebook.png"
                  alt="Candle-lit meditation space - restorative stillness and gentle light"
                  fill
                  className="object-cover mix-blend-overlay opacity-70"
                />
                {/* Moon overlay graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-sunshine-blue/20 blur-xl" />
                  <div className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full bg-sunshine-white/10 blur-md" />
                  {/* Crescent moon shape hint */}
                  <div className="absolute w-20 h-20 md:w-32 md:h-32 rounded-full bg-sunshine-white/5 shadow-[inset_-8px_-8px_20px_rgba(252,246,242,0.15)]" />
                </div>
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-sunshine-purple/80 to-transparent">
                  <p className="font-subhead text-sm md:text-base text-sunshine-white">
                    Exhale, ground, restore — this is your permission to slow down.
                  </p>
                </div>
              </div>
            </BrandCard>
          </FadeInView>

          {/* Event Cards from JSON */}
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
            {getLunarRoomEvents().map((event) => (
              <StaggerItem key={event.id}>
                <EventCard
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  description={event.description}
                  type={event.type}
                  location={event.location}
                  ctaText={event.price === 'Free' ? 'RSVP Free' : `Reserve · ${event.price}`}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* View all CTA */}
          <FadeInView delay={0.5} className="mt-10 text-center">
            <Button className="bg-sunshine-blue text-sunshine-purple hover:bg-sunshine-yellow font-subhead">
              See All Lunar Room Dates
            </Button>
          </FadeInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <FadeInView>
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Event Gallery</p>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h3 className="font-headline text-4xl uppercase text-sunshine-purple">See the energy</h3>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="text-lg text-sunshine-brown leading-relaxed max-w-3xl mx-auto">
                A glimpse of both energies: sun-drenched connection and moon-lit restoration.
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
        </div>
      </section>
    </div>
  );
}
