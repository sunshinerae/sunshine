import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';

export const metadata = {
  title: 'Events | The Sunshine Effect',
  description: 'Golden Hour and Lunar Room experiences that invite you to connect, exhale, and move in community.',
  alternates: { canonical: '/events' },
};

const gallery = [
  { src: '/festival-crowd.png', alt: 'Sun-drenched women celebrating together' },
  { src: '/dj-equipment.png', alt: 'Warm, electric event lighting' },
  { src: '/la-skyline.png', alt: 'Evening skyline backdrop' },
  { src: '/planning-notebook.png', alt: 'Quiet journaling moment' },
];

export default function EventsPage() {
  return (
    <div className="bg-sunshine-white">
      <section className="px-6 py-16 bg-sunshine-purple text-sunshine-white">
        <div className="max-w-5xl mx-auto space-y-5 text-center">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue">
            Community in motion
          </p>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-tight">
              Rooms that feel like sunlight or moonlight.
            </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            Why the room matters: women leave feeling seen, resourced, and ready to move. High energy connection or slow introspection—pick what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#golden-hour">
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Golden Hour
              </Button>
            </Link>
            <Link href="#lunar-room">
              <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                Lunar Room
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="golden-hour" className="px-6 py-16 bg-sunshine-orange text-sunshine-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <BrandCard className="p-8" variant="orange">
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
                <p>See upcoming dates</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button className="bg-sunshine-blue text-sunshine-brown hover:bg-sunshine-yellow">RSVP</Button>
              <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                Join the waitlist
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
          </Card>
        </div>
      </section>

      <section id="lunar-room" className="px-6 py-16 bg-sunshine-yellow text-sunshine-brown">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <BrandCard className="p-8" variant="white">
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
                <p>Join the waitlist</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange">RSVP</Button>
              <Button variant="outline" className="border-sunshine-purple text-sunshine-purple hover:bg-sunshine-purple hover:text-sunshine-white">
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
          </Card>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Event Gallery</p>
            <h3 className="font-subhead text-4xl uppercase text-sunshine-purple">See the energy</h3>
            <p className="text-lg text-sunshine-brown leading-relaxed max-w-3xl mx-auto">
              A glimpse of both energies: sun-drenched connection and moon-lit restoration.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <BrandCard key={item.src} className="p-0 overflow-hidden" variant="white">
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
