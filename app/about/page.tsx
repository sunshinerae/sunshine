import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';

export const metadata = {
  title: 'About | The Sunshine Effect',
  description: 'Meet Sunshine, a loving catalyst guiding women from burnout to alignment through rituals, retreats, and community.',
  alternates: { canonical: '/about' },
};

const timeline = [
  { title: 'Burnout to wake-up', detail: 'Corporate pace, anxious nights, and the realization: I cannot keep betraying myself to belong.', year: '2016' },
  { title: 'Rituals + regulation', detail: 'Breathwork, somatic practice, journaling, and boundaries that brought my nervous system back into flow.', year: '2018' },
  { title: 'Community in motion', detail: 'Living-room circles that grew into Golden Hour and Lunar Room—rooms where women felt resourced and seen.', year: '2021' },
  { title: 'Guiding others', detail: 'Full-time coaching, retreats, and events for women ready to move like it is already theirs, with support that holds them steady.', year: 'Today' },
];

const values = [
  { title: 'Community', description: 'We move together. Safety and belonging are the soil for growth.' },
  { title: 'Devotion', description: 'Discipline is self love in motion. Small rituals, every day.' },
  { title: 'Courage', description: 'Gentle, bold steps toward the life you actually want.' },
  { title: 'Alignment', description: 'Choices that match your values, not old expectations.' },
  { title: 'Compassion', description: 'Softness with yourself. Healing without shame.' },
  { title: 'Leadership', description: 'Lead from embodied confidence—no pushing or proving.' },
];

export default function AboutPage() {
  return (
    <div className="bg-sunshine-white">
      <section className="relative overflow-hidden bg-sunshine-orange text-sunshine-white px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="space-y-4">
            <p className="font-subhead uppercase tracking-[0.16em] text-sm text-sunshine-blue">
              Who is Sunshine
            </p>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.4rem)] uppercase leading-tight">
              Catalyst for women ready to create a life centered on purpose.
            </h1>
            <p className="font-body text-lg leading-relaxed">
              I blend wellness, mindset, and grounded business strategy to help women clear trauma noise, hear their own desires, and take aligned action. Inner peace becomes the foundation for everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/contact">
                <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-yellow hover:text-sunshine-brown">
                  Work With Sunshine
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                  Explore events
                </Button>
              </Link>
            </div>
            <p className="font-body text-sm max-w-xl leading-relaxed">
              You are allowed to want more ease. Real power does not have to push or prove.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-sunshine-yellow" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden border-4 border-sunshine-white">
              <Image
                src="/portrait-female-professional.png"
                alt="Sunshine portrait"
                width={640}
                height={760}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-6 text-lg leading-relaxed text-sunshine-brown font-body">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">
            How I hold space
          </p>
          <p>
            Burnout is not a personal failure; it is a nervous system asking for safety. Together we create pockets of peace and clarity so you can lead with devotion instead of dread.
          </p>
          <p>
            I encourage first imperfect steps: one aligned conversation, one nourishing ritual, one brave ask. We pair spiritual depth with practical structure so your momentum sticks.
          </p>
          <p>
            My work is woman-forward, trauma-aware, and rooted in community. You will feel seen, safe, uplifted, and fully capable of leading your own aligned life.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-yellow text-sunshine-brown">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-purple">Chapters</p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase text-sunshine-purple leading-tight">
              From burnout to alignment.
            </h2>
            <p className="font-body text-lg leading-relaxed max-w-3xl">
              A real journey, not an overnight success story. Each chapter is honest, embodied, and portable for your own life.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {timeline.map((item) => (
              <BrandCard key={item.title} variant="white" className="p-6">
                <div className="text-xs font-subhead uppercase tracking-[0.12em] text-sunshine-orange mb-2">
                  {item.year}
                </div>
                <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-3">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.detail}</p>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Values</p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase text-sunshine-purple">Rooted & resourced</h2>
            <p className="font-body text-lg text-sunshine-brown leading-relaxed max-w-3xl mx-auto">
              The values that shape every coaching session, retreat, and community room.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <BrandCard key={value.title} variant="white" className="p-6">
                <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">{value.title}</h3>
                <p className="font-body text-sm leading-relaxed text-sunshine-brown">{value.description}</p>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20 bg-sunshine-purple text-sunshine-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h3 className="font-headline text-4xl md:text-5xl uppercase">Let&apos;s walk together.</h3>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            If you are ready to feel clear, grounded, and in motion, I am here to hold space and offer structure. Start with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Book a clarity call
              </Button>
            </Link>
            <Link href="/offerings">
              <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                Explore offerings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
