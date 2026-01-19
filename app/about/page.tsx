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

      {/* Story Section - to be implemented */}
      <section className="py-16 px-4 bg-sunshine-white">
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-lg text-sunshine-brown text-center">
            Story content coming soon.
          </p>
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
