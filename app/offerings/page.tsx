import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';

export const metadata = {
  title: 'Offerings | The Sunshine Effect',
  description: 'Coaching, retreats, and events that guide women from burnout to alignment with clarity, devotion, and community.',
  alternates: { canonical: '/offerings' },
};

const focusAreas = [
  'Rebuild confidence and self trust',
  'Clarify goals and aligned action',
  'Release perfectionism and self-doubt',
  'Create daily rhythms that feel good',
  'Accountability and gentle support',
];

const retreatElements = [
  'Intention setting circles',
  'Somatic movement and breathwork',
  'Journaling and creative visioning',
  'Guest coaches + trauma-informed facilitators',
  'Skill-building workshops',
  'Brand collaborations + sponsored goodies',
];

const future = [
  { title: 'Online courses', copy: 'Self-paced mini journeys to build rituals and aligned habits.' },
  { title: 'Cohorts + challenges', copy: 'Seasonal containers for momentum, community, and live coaching.' },
  { title: 'Journals + tools', copy: 'Daily planners, ritual cards, and grounded prompts for clarity.' },
];

export default function OfferingsPage() {
  return (
    <div className="bg-sunshine-white">
      <section className="bg-sunshine-purple text-sunshine-white px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue">Offerings</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.5rem)] uppercase leading-tight">
            Services that honor your energy and your ambition.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            Multiple entry points based on your readiness—private coaching, restorative retreats, and community events that meet you where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Work With Sunshine
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                Explore events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">1:1 Coaching</p>
            <h2 className="font-headline text-4xl uppercase text-sunshine-purple">Come home to yourself.</h2>
            <p className="font-body text-lg text-sunshine-brown leading-relaxed max-w-3xl">
              Single session or 3-month journey. Together we clear the fog, rebuild confidence, and practice rituals that keep you resourced.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <BrandCard className="p-7" variant="purple">
              <h3 className="font-headline text-2xl uppercase mb-3">Single clarity session</h3>
              <p className="font-body leading-relaxed text-sm">
                A focused 75 minutes to name what is draining you, choose a next step, and leave with a simple ritual you can start today.
              </p>
            </BrandCard>
            <BrandCard className="p-7" variant="orange">
              <h3 className="font-headline text-2xl uppercase mb-3">3-month journey</h3>
              <p className="font-body leading-relaxed text-sm">
                Bi-weekly calls, voice note check-ins, and co-created rituals. We track progress, celebrate momentum, and recalibrate together.
              </p>
            </BrandCard>
            <BrandCard className="p-7" variant="white">
              <h3 className="font-headline text-2xl uppercase text-sunshine-purple mb-3">What it helps with</h3>
              <ul className="space-y-2 text-sm leading-relaxed font-body">
                {focusAreas.map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sunshine-yellow mt-2" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </BrandCard>
          </div>
          <Link href="/contact">
            <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
              Apply for coaching
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-yellow text-sunshine-brown">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-purple">Retreats</p>
            <h2 className="font-headline text-4xl uppercase text-sunshine-purple">Release, remember, reconnect.</h2>
            <p className="font-body text-lg leading-relaxed max-w-3xl">
              Weekend and longer immersive experiences to shed old identities, remember who you are, and gather tools with women who want the same.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <BrandCard className="p-7" variant="orange">
              <p className="font-subhead uppercase tracking-[0.14em] text-xs text-sunshine-blue">Energy</p>
              <h3 className="font-headline text-2xl uppercase mt-2">Immersive + restorative</h3>
              <p className="font-body leading-relaxed mt-3 text-sm">
                Release old narratives, reset your nervous system, and leave with practice you can carry home.
              </p>
            </BrandCard>
            <BrandCard className="p-7" variant="white">
              <h4 className="font-subhead uppercase tracking-[0.14em] text-xs text-sunshine-purple">Elements</h4>
              <ul className="grid sm:grid-cols-2 gap-3 mt-3 text-sm leading-relaxed font-body">
                {retreatElements.map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sunshine-orange mt-2" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </BrandCard>
          </div>
          <Link href="/events">
            <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-yellow hover:text-sunshine-brown">
              Join the retreat waitlist
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Events hub</p>
            <h2 className="font-headline text-4xl uppercase text-sunshine-purple">Community in motion</h2>
            <p className="font-body text-lg leading-relaxed max-w-3xl text-sunshine-brown">
              Golden Hour (high-energy, heart-led networking) and Lunar Room (slow, introspective sound + stillness). Two energies, one community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <BrandCard className="p-7" variant="orange">
              <h3 className="font-headline text-2xl uppercase mb-2">Golden Hour</h3>
              <p className="text-sm leading-relaxed">Electric, connective, and playful. Storytelling, mindset coaching, and a clear next step to keep moving.</p>
              <Button className="mt-5 bg-sunshine-blue text-sunshine-brown hover:bg-sunshine-yellow">
                See upcoming dates
              </Button>
            </BrandCard>
            <BrandCard className="p-7" variant="purple">
              <h3 className="font-headline text-2xl uppercase mb-2">Lunar Room</h3>
              <p className="text-sm leading-relaxed">Slow, grounded, candle-lit. Yoga, sound, meditation, and gentle community processing.</p>
              <Button className="mt-5 bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Join the waitlist
              </Button>
            </BrandCard>
          </div>
          <Link href="/events">
            <Button variant="outline" className="border-sunshine-purple text-sunshine-purple hover:bg-sunshine-purple hover:text-sunshine-white">
              Explore all events
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-yellow text-sunshine-brown">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-purple">Future offerings</p>
            <h2 className="font-headline text-4xl uppercase text-sunshine-purple">Planting seeds</h2>
            <p className="font-body text-lg leading-relaxed max-w-3xl">
              We are building more ways to stay in momentum. No overpromising—just honest excitement for what is next.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {future.map((item) => (
              <BrandCard key={item.title} variant="white" className="p-6">
                <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.copy}</p>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
