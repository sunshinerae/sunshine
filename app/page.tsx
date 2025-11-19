import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';

const pathway = [
  {
    title: 'Notice',
    copy: 'Name the burnout patterns, trace the anxiety, and get honest about the exhaustion you have been carrying.',
    micro: 'Alignment begins with awareness.'
  },
  {
    title: 'Nurture',
    copy: 'Layer simple rituals that restore your nervous system, build devotion to yourself, and bring you back into flow.',
    micro: 'Discipline is self love in motion.'
  },
  {
    title: 'Move',
    copy: 'Take bold, gentle action toward the life you actually want—daily rhythms, aligned work, community support.',
    micro: 'Move like it\'s already yours.'
  }
];

const offerings = [
  {
    title: '1:1 Coaching',
    tone: 'Alignment + accountability',
    variant: 'purple' as const,
    accent: 'bg-sunshine-yellow text-sunshine-brown',
    copy: 'Personal coaching for women ready to rebuild confidence, clarify goals, and finally act from a resourced place.',
    bullets: [
      'Single clarity session or 3-month journey',
      'Release perfectionism and rebuild self trust',
      'Rituals for focus, rest, and momentum',
    ],
    cta: { label: 'Work With Sunshine', href: '/contact' }
  },
  {
    title: 'Retreats',
    tone: 'Immersive + restorative',
    variant: 'orange' as const,
    accent: 'bg-sunshine-blue text-sunshine-brown',
    copy: 'Weekend and long-form retreats to release old identities, remember who you are, and connect with women walking the same path.',
    bullets: [
      'Somatic movement + breathwork',
      'Intention circles and creative visioning',
      'Guest coaches and trauma-informed space',
    ],
    cta: { label: 'Join the Waitlist', href: '/events' }
  },
  {
    title: 'Events',
    tone: 'Community in motion',
    variant: 'yellow' as const,
    accent: 'bg-sunshine-purple text-sunshine-white',
    copy: 'Golden Hour (electric, heart-led networking) and Lunar Room (slow, introspective, sound + stillness).',
    bullets: [
      'Clear next dates and RSVP links',
      'Big-hearted, creative women',
      'Low-pressure, high-safety rooms',
    ],
    cta: { label: 'Explore Events', href: '/events' }
  },
];

const testimonials = [
  {
    quote: 'I finally feel grounded and clear instead of spinning. Sunshine saw me when I could not see myself.',
    name: 'Alex M.',
    role: 'Coaching client',
  },
  {
    quote: 'Golden Hour reminded me I am not behind—I am becoming. The room was electric and safe.',
    name: 'Jamila R.',
    role: 'Event guest',
  },
  {
    quote: 'The retreat was a reset. I left resourced, rested, and with a plan that feels like me.',
    name: 'Priya L.',
    role: 'Retreat guest',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-0">
      <section
        id="home"
        className="relative overflow-hidden bg-sunshine-purple text-sunshine-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-96 h-96 bg-sunshine-yellow rounded-full" />
          <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-sunshine-blue rounded-full" />
          <div className="absolute top-0 right-0 w-64 h-full bg-sunshine-orange/20 skew-x-12" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-28 relative">
          <div className="max-w-3xl">
            <p className="font-subhead uppercase tracking-[0.2em] text-xs mb-6">Glow from the heart</p>
            <h1 className="font-headline text-[clamp(2.8rem,7vw,4.8rem)] leading-[0.95] mb-6 uppercase">
              Radiance is yours.
            </h1>
            <p className="font-body text-lg md:text-xl leading-relaxed max-w-2xl">
              The Sunshine Effect helps women move from burnout to alignment through simple rituals, soulful community, and intentional action. You are allowed to want more ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/contact">
                <Button size="lg" className="bg-sunshine-blue text-sunshine-brown hover:bg-sunshine-yellow">
                  Glow from the heart
                </Button>
              </Link>
              <Link href="/events" className="flex items-center">
                <Button size="lg" variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                  Explore events
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm md:text-base max-w-xl leading-relaxed">
              Spiritual depth blended with practical structure. Real power does not have to push or prove.
            </p>
          </div>
        </div>
      </section>

      <section id="alignment" className="py-16 px-6 bg-sunshine-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-5">
            <p className="font-subhead uppercase tracking-[0.16em] text-sunshine-orange text-sm">
              From burnout to alignment
            </p>
            <h2 className="font-headline text-4xl md:text-5xl leading-tight text-sunshine-purple uppercase">
              Pockets of peace. Momentum that sticks.
            </h2>
            <p className="font-body text-lg leading-relaxed">
              Life feels busy and dull until you remember you are allowed to design your days. We start with small rituals that steady your nervous system and rebuild your confidence.
            </p>
            <p className="font-body text-lg leading-relaxed">
              Maybe there is another way. You are not behind—you are becoming. Together we clear the noise, choose aligned actions, and move like it&apos;s already yours.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-sunshine-yellow" aria-hidden />
            <BrandCard variant="white" className="p-8">
              <p className="font-subhead uppercase tracking-[0.12em] text-xs text-sunshine-brown mb-4">
                You are allowed to want more ease
              </p>
              <p className="font-body text-lg leading-relaxed">
                “I can no longer betray myself to keep the peace. I want clarity, devotion, and community that holds me gently while I grow.”
              </p>
              <div className="mt-6 text-sm font-body text-sunshine-brown">
                Sunshine clients, 2025
              </div>
            </BrandCard>
          </div>
        </div>
      </section>

      <section id="pathway" className="py-16 px-6 bg-sunshine-yellow text-sunshine-brown">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col gap-3">
            <p className="font-subhead uppercase tracking-[0.16em] text-sm">A simple pathway</p>
            <h2 className="font-headline text-4xl md:text-5xl leading-tight uppercase text-sunshine-purple">
              Clarity, groundedness, forward motion.
            </h2>
            <p className="font-body text-lg max-w-3xl">
              Six stages of awareness, three grounded actions. Gentle, practical, and designed for women who are ready to trust themselves again.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pathway.map((step) => (
              <BrandCard key={step.title} variant="white" className="p-8">
                <div className="font-subhead uppercase tracking-[0.12em] text-xs text-sunshine-orange mb-3">
                  {step.micro}
                </div>
                <h3 className="font-headline text-2xl uppercase text-sunshine-purple mb-4">{step.title}</h3>
                <p className="font-body text-sunshine-brown leading-relaxed">{step.copy}</p>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section id="offerings" className="py-18 md:py-20 px-6 bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
            <p className="font-subhead uppercase tracking-[0.16em] text-sm text-sunshine-orange">
              Offerings
            </p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase text-sunshine-purple">
              Choose the way you want to glow.
            </h2>
            <p className="font-body text-lg leading-relaxed text-sunshine-brown">
              Coaching, retreats, and events designed for smart, capable women who crave clarity, community, and momentum.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offering) => (
              <BrandCard
                key={offering.title}
                variant={offering.variant}
                className="flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <p className="font-subhead uppercase tracking-[0.12em] text-xs">
                    {offering.tone}
                  </p>
                  <h3 className="font-headline text-3xl uppercase leading-tight">{offering.title}</h3>
                </div>
                <p className="font-body text-base leading-relaxed">{offering.copy}</p>
                <ul className="space-y-3">
                  {offering.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-body">
                      <span className={`inline-flex mt-1 h-2.5 w-2.5 rounded-full ${offering.accent}`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={offering.cta.href} className="mt-auto">
                  <Button
                    className={`${offering.accent} w-full justify-center`}
                  >
                    {offering.cta.label}
                  </Button>
                </Link>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-sunshine-purple text-sunshine-white" id="events">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 space-y-4">
            <p className="font-subhead uppercase tracking-[0.16em] text-xs text-sunshine-blue">
              Community in motion
            </p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase leading-tight">
              Golden Hour & Lunar Room
            </h2>
            <p className="text-lg leading-relaxed">
              Two rooms, two energies. High-energy heart-led networking that feels like sunlight, and a slow, candle-lit sanctuary for exhale and sound.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/events">
                <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                  See upcoming dates
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="border-sunshine-white text-sunshine-white hover:bg-sunshine-white hover:text-sunshine-purple">
                  Join the community
                </Button>
              </Link>
            </div>
            <p className="text-sm leading-relaxed">
              Real power does not have to push or prove. Step into a room that holds you.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <BrandCard className="p-6" variant="orange">
              <p className="font-subhead uppercase tracking-[0.12em] text-xs">Golden Hour</p>
              <h3 className="font-headline text-2xl uppercase mt-2">High energy, heart-led networking</h3>
              <p className="mt-4 text-sm leading-relaxed">Storytelling, mindset coaching, and connective conversation for women ready to be seen.</p>
            </BrandCard>
            <BrandCard className="p-6" variant="yellow">
              <p className="font-subhead uppercase tracking-[0.12em] text-xs">Lunar Room</p>
              <h3 className="font-headline text-2xl uppercase mt-2 text-sunshine-purple">Slow, introspective, sound + stillness</h3>
              <p className="mt-4 text-sm leading-relaxed">Yoga, meditation, and soft space to hear your own desires. Co-facilitated with healers and creative leaders.</p>
            </BrandCard>
            <BrandCard className="col-span-2 p-6" variant="white">
              <p className="font-subhead uppercase tracking-[0.12em] text-xs text-sunshine-orange">Why this matters</p>
              <h3 className="font-headline text-2xl uppercase mt-2 text-sunshine-purple">Community that closes the gap</h3>
              <p className="mt-3 leading-relaxed text-sm">
                Life feels busy and dull until you are with women who mirror your brilliance back to you. Every room is designed to be safe, uplifting, and actionable.
              </p>
            </BrandCard>
          </div>
        </div>
      </section>

      <section id="community" className="py-16 px-6 bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <p className="font-subhead uppercase tracking-[0.16em] text-sm text-sunshine-orange">Testimonials</p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase text-sunshine-purple">Feeling seen changes everything.</h2>
            <p className="font-body text-lg text-sunshine-brown leading-relaxed">
              Stories from women who chose alignment over burnout.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <BrandCard key={t.name} variant="white" className="p-7">
                <p className="font-body text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-6 text-sm font-semibold text-sunshine-purple font-body">
                  {t.name}
                </div>
                <div className="text-xs font-subhead uppercase tracking-[0.12em] text-sunshine-brown">
                  {t.role}
                </div>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-sunshine-orange text-sunshine-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-4">
            <p className="font-subhead uppercase tracking-[0.16em] text-sm text-sunshine-blue">
              Glow Notes
            </p>
            <h2 className="font-headline text-4xl md:text-5xl uppercase leading-tight">Join the list</h2>
            <p className="font-body text-lg leading-relaxed">
              Consistent Bulletin emails + gentle SMS check-ins (1–2x weekly). Ritual reminders, aligned event invites, and loving accountability so momentum never feels lonely.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  aria-label="Email for Consistent Bulletin"
                  placeholder="you@example.com"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-white text-sunshine-brown border-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">SMS (optional)</label>
                <input
                  aria-label="SMS for gentle check-ins"
                  placeholder="(555) 123-4567"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-white text-sunshine-brown border-0"
                />
              </div>
            </div>
            <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue w-full sm:w-auto">
              Join the Consistent Bulletin
            </Button>
            <p className="font-body text-sm">
              Warm, uplifting notes only. Frequency: 1–2x week. Reply STOP anytime.
            </p>
          </div>
          <BrandCard className="p-8" variant="white">
            <p className="font-headline text-2xl uppercase text-sunshine-purple leading-tight mb-2">
              Real power does not have to push or prove.
            </p>
            <p className="font-body leading-relaxed">
              You deserve to feel resourced, grounded, and proud of your progress. Let&apos;s build the habits, community, and courage that carry you forward.
            </p>
          </BrandCard>
        </div>
      </section>
    </div>
  );
}
