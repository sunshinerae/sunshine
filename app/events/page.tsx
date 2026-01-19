import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';

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
          <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-blue">
            Community in motion
          </p>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
              Rooms that feel like sunlight or moonlight.
            </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            Why the room matters: women leave feeling seen, resourced, and ready to move. High energy connection or slow introspection—pick what you need.
          </p>
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
        </div>
      </section>

      <section id="golden-hour" className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-orange text-sunshine-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <BrandCard className="p-6 md:p-8 overflow-hidden max-w-full" variant="orange">
            <p className="font-subhead uppercase tracking-[0.14em] text-xs text-sunshine-blue">Golden Hour</p>
            <h2 className="font-headline text-4xl uppercase mt-2">High energy, heart-led networking</h2>
            <p className="font-body mt-4 text-lg leading-relaxed">
              Sunshine leads motivational coaching, storytelling, and gentle networking. You will leave with clarity, community, and one bold next action.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="font-semibold">Session length</p>
                <p>90–120 minutes</p>
              </div>
              <div>
                <p className="font-semibold">Next date</p>
                <p>Jan 15 · Los Angeles</p>
              </div>
              <div>
                <p className="font-semibold">Tickets</p>
                <p>From $45 · 20 spots · 5 left</p>
              </div>
              <div>
                <p className="font-semibold">Refund policy</p>
                <p>Full refund up to 72 hours</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button className="w-full sm:w-auto bg-sunshine-blue text-sunshine-brown hover:bg-sunshine-yellow">Reserve Jan 15 spot</Button>
              <Button variant="glow-purple" className="w-full sm:w-auto border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                See all dates
              </Button>
            </div>
          </BrandCard>
          <BrandCard className="p-0 overflow-hidden" variant="white">
            <Image
              src="/festival-crowd.png"
              alt="Women celebrating at Golden Hour"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </BrandCard>
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
