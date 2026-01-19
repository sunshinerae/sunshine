import { Metadata } from 'next';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';

export const metadata: Metadata = PAGE_METADATA.about;

const values = [
  {
    name: 'Community',
    icon: '🤝',
    description:
      'We believe in the power of women gathering together. Real connection happens when we show up authentically and hold space for one another.',
  },
  {
    name: 'Devotion',
    icon: '🔥',
    description:
      'Devotion to yourself is the foundation of everything. We commit to practices that nurture our whole selves — body, mind, and spirit.',
  },
  {
    name: 'Courage',
    icon: '✨',
    description:
      'Growth lives on the other side of fear. We take imperfect action, trusting that the path reveals itself one brave step at a time.',
  },
  {
    name: 'Alignment',
    icon: '🌿',
    description:
      'When your inner world matches your outer world, everything flows. We choose integrity over approval and peace over proving.',
  },
  {
    name: 'Compassion',
    icon: '💛',
    description:
      'We lead with kindness — for ourselves first, then for others. Healing happens in spaces where we feel truly seen and accepted.',
  },
  {
    name: 'Leadership',
    icon: '👑',
    description:
      'Every woman is a leader. We model what we wish to see, inspire through our presence, and lift others as we rise.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-sunshine-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 bg-sunshine-purple">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Portrait placeholder */}
            <FadeInView direction="left" className="order-2 md:order-1">
              <div className="aspect-[3/4] bg-sunshine-yellow/20 rounded-2xl flex items-center justify-center mx-auto max-w-sm">
                <span className="font-body text-sunshine-white/60 text-sm">
                  Portrait coming soon
                </span>
              </div>
            </FadeInView>

            {/* Text content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <FadeInView delay={0.1}>
                <p className="font-subhead text-sunshine-yellow text-lg md:text-xl mb-4">
                  Meet Your Guide
                </p>
              </FadeInView>

              <FadeInView delay={0.2}>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl uppercase text-sunshine-white font-bold mb-6 leading-tight">
                  Sunshine
                </h1>
              </FadeInView>

              <FadeInView delay={0.3}>
                <p className="font-body text-xl md:text-2xl text-sunshine-white/90 leading-relaxed">
                  A catalyst for women who are ready to create a life centered on purpose,
                  peace, and aligned action.
                </p>
              </FadeInView>

              <FadeInView delay={0.4}>
                <p className="font-body text-lg text-sunshine-blue mt-6 italic">
                  "Real power doesn't have to push or prove."
                </p>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 px-4 bg-sunshine-white">
        <div className="max-w-3xl mx-auto">
          <FadeInView>
            <h2 className="font-subhead text-2xl md:text-3xl text-sunshine-purple font-bold text-center mb-12 uppercase">
              The Journey
            </h2>
          </FadeInView>

          {/* Story Block 1 */}
          <FadeInView delay={0.1} className="mb-12">
            <div className="text-center md:text-left">
              <p className="font-body text-lg md:text-xl text-sunshine-brown leading-relaxed mb-6">
                There was a time when I lived in a constant state of hustle — pushing harder,
                proving more, and wondering why success never felt like enough. The burnout was
                real, but the deeper ache was the disconnect from myself and the life I actually
                wanted.
              </p>
              <p className="font-body text-lg md:text-xl text-sunshine-brown leading-relaxed">
                I thought I needed to do more. What I actually needed was to come home to myself.
              </p>
            </div>
          </FadeInView>

          {/* Story Block 2 */}
          <FadeInView delay={0.2} className="mb-12">
            <div className="bg-sunshine-purple/5 rounded-2xl p-8 md:p-10">
              <p className="font-body text-lg md:text-xl text-sunshine-brown leading-relaxed mb-6">
                Through a blend of wellness practices, mindset work, and business strategy, I
                began to rebuild. Not from a place of force, but from a foundation of inner peace
                and self-trust. I learned that discipline is self-love in motion — and that real
                power doesn't have to push or prove.
              </p>
              <p className="font-body text-lg md:text-xl text-sunshine-brown leading-relaxed">
                Now I guide other women through the same transformation: from scattered and burned
                out, to lighter, clearer, and deeply connected to their purpose.
              </p>
            </div>
          </FadeInView>

          {/* Story Block 3 */}
          <FadeInView delay={0.3}>
            <div className="text-center">
              <p className="font-body text-lg md:text-xl text-sunshine-brown leading-relaxed mb-8">
                The Sunshine Effect isn't just a brand — it's an invitation to glow from the heart.
                To create a life (and business) that feels aligned, embodied, and alive. To move
                like it's already yours.
              </p>
              <p className="font-subhead text-xl md:text-2xl text-sunshine-purple font-bold italic">
                "You're allowed to want more ease."
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Values Grid Section */}
      <section className="py-20 md:py-28 px-4 bg-sunshine-yellow">
        <div className="max-w-5xl mx-auto">
          <FadeInView>
            <h2 className="font-subhead text-2xl md:text-3xl text-sunshine-brown font-bold text-center mb-4 uppercase">
              What We Stand For
            </h2>
          </FadeInView>

          <FadeInView delay={0.1}>
            <p className="font-body text-lg md:text-xl text-sunshine-brown text-center max-w-2xl mx-auto mb-16">
              These values guide everything we do — from our events to our coaching
              to the way we show up for one another.
            </p>
          </FadeInView>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            staggerDelay={0.1}
          >
            {values.map((value) => (
              <StaggerItem key={value.name}>
                <div className="bg-sunshine-white rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Icon placeholder */}
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-sunshine-purple/10 rounded-full flex items-center justify-center mb-5">
                    <span className="text-2xl md:text-3xl" aria-hidden="true">
                      {value.icon}
                    </span>
                  </div>

                  {/* Value name */}
                  <h3 className="font-headline text-xl md:text-2xl text-sunshine-purple font-bold uppercase mb-3">
                    {value.name}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-sunshine-brown leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </main>
  );
}
