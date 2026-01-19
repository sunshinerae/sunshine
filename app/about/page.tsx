import { Metadata } from 'next';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';

export const metadata: Metadata = PAGE_METADATA.about;

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

      {/* Values Grid Section - to be implemented */}
      <section className="py-16 px-4 bg-sunshine-yellow">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-subhead text-2xl md:text-3xl text-sunshine-brown font-bold text-center mb-12 uppercase">
            Our Values
          </h2>
          <p className="font-body text-lg text-sunshine-brown text-center">
            Values grid coming soon.
          </p>
        </div>
      </section>
    </main>
  );
}
