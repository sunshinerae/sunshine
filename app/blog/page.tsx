import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { BlogCard } from '@/components/cards/blog-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { getAllPostsMeta, getAllCategories } from '@/lib/blog';

export const metadata: Metadata = PAGE_METADATA.blog;

export default function BlogPage() {
  if (!isFeatureEnabled('blog')) {
    notFound();
  }

  const posts = getAllPostsMeta();
  const categories = getAllCategories();

  return (
    <div className="bg-sun-cream min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 md:py-16 text-white overflow-hidden relative">
        {/* Purple dreamy clouds - slow drift animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/golden-hour-hero.png"
            alt=""
            fill
            priority
            className="object-cover object-center animate-slow-drift"
            aria-hidden="true"
          />
        </div>
        {/* Plum overlay */}
        <div className="absolute inset-0 bg-sun-plum/50" />
        <div className="max-w-5xl mx-auto space-y-5 text-center relative z-10">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-gold">
              Insights & Reflections
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
              Words that warm the soul.
            </h1>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
              Resources for your journey from burnout to alignment. Wellness practices,
              self-development insights, and business strategy that feels good.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-4 sm:px-6 py-8 bg-sun-cream border-b border-sun-sand">
        <div className="max-w-6xl mx-auto">
          <FadeInView>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                className="px-5 py-2 rounded-full font-subhead text-sm font-semibold tracking-wide uppercase bg-sun-plum text-white transition-colors"
                aria-current="true"
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  className="px-5 py-2 rounded-full font-subhead text-sm font-semibold tracking-wide uppercase bg-sun-paper text-sun-cocoa border border-sun-sand hover:bg-sun-gold hover:border-sun-gold hover:text-sun-cocoa transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Blog Post Grid */}
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sun-cream">
        <div className="max-w-6xl mx-auto">
          <h2 className="sr-only">Blog Posts</h2>
          {posts.length > 0 ? (
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.1}>
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={post.date}
                    slug={post.slug}
                    image={post.image}
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeInView>
              <div className="text-center py-16">
                <p className="font-subhead text-lg text-sun-cocoa/60">
                  Fresh words are brewing. Your next dose of radiance arrives soon.
                </p>
              </div>
            </FadeInView>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sun-gold">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              The Consistent Bulletin
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="font-headline text-[clamp(1.8rem,4vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-sun-cocoa mb-4">
              Get these words delivered.
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-base leading-relaxed text-sun-cocoa/80 mb-6">
              Weekly rituals, reflections, and resources for the woman ready to glow from the heart.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <a
              href="/contact"
              className="inline-flex px-8 py-3 rounded-[14px] font-subhead text-sm font-semibold tracking-wide uppercase bg-sun-plum text-white hover:bg-sun-plum/90 transition-colors"
            >
              Join The List
            </a>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
