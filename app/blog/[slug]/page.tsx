import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { MarkdownContent } from '@/components/blog/markdown-content';
import { isFeatureEnabled } from '@/lib/features';
import {
  getPostContent,
  getPostMeta,
  getAllPostSlugs,
  formatPostDate,
  getReadingTime,
  getRelatedPosts,
} from '@/lib/blog';
import { RelatedPosts } from '@/components/blog/related-posts';
import { generatePageMetadata } from '@/lib/metadata';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMeta(slug);

  if (!meta) {
    return generatePageMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    });
  }

  return generatePageMetadata({
    title: meta.title,
    description: meta.excerpt,
    path: `/blog/${slug}`,
  });
}

// Category color mapping based on content pillars
function getCategoryStyles(cat: string) {
  const normalizedCategory = cat.toLowerCase();
  if (normalizedCategory.includes('wellness')) {
    return 'bg-sun-gold text-sun-cocoa';
  }
  if (
    normalizedCategory.includes('self-development') ||
    normalizedCategory.includes('development')
  ) {
    return 'bg-sun-plum text-white';
  }
  if (
    normalizedCategory.includes('business') ||
    normalizedCategory.includes('strategy')
  ) {
    return 'bg-sun-coral text-white';
  }
  return 'bg-sun-plum text-white';
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!isFeatureEnabled('blog')) {
    notFound();
  }

  const { slug } = await params;
  const post = getPostContent(slug);

  if (!post || !post.meta.published) {
    notFound();
  }

  const { meta, content } = post;
  const readingTime = getReadingTime(content);

  return (
    <div className="bg-sun-cream min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 md:py-20 bg-sun-plum text-white overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          {/* Back link */}
          <FadeInView>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-subhead text-sm font-semibold text-sun-gold hover:text-sun-coral transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </FadeInView>

          {/* Category tag */}
          <FadeInView delay={0.1}>
            <span
              className={`inline-flex px-4 py-1.5 rounded-full font-subhead text-xs font-semibold tracking-wide uppercase ${getCategoryStyles(meta.category)}`}
            >
              {meta.category}
            </span>
          </FadeInView>

          {/* Title */}
          <FadeInView delay={0.2}>
            <h1 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] tracking-tight">
              {meta.title}
            </h1>
          </FadeInView>

          {/* Meta info */}
          <FadeInView delay={0.3}>
            <div className="flex items-center justify-center gap-4 text-white/80 font-body text-sm">
              <span>{formatPostDate(meta.date)}</span>
              <span className="w-1 h-1 rounded-full bg-white/60" />
              <span>{readingTime} min read</span>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Featured Image Placeholder */}
      <section className="relative -mt-8 px-4 sm:px-6">
        <FadeInView delay={0.4}>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sun-gold/40 via-sun-coral/30 to-sun-plum/40 shadow-xl">
              {meta.image ? (
                <img
                  src={meta.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-sun-plum/30"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" />
                    <circle cx="32" cy="32" r="8" fill="currentColor" />
                    <path
                      d="M32 4V12M32 52V60M4 32H12M52 32H60M11.5 11.5L17.2 17.2M46.8 46.8L52.5 52.5M52.5 11.5L46.8 17.2M17.2 46.8L11.5 52.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </FadeInView>
      </section>

      {/* Article Content */}
      <article className="px-4 sm:px-6 py-12 md:py-16">
        <FadeInView delay={0.1}>
          <div className="max-w-3xl mx-auto">
            {content ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="font-body text-lg leading-relaxed text-sun-cocoa/90 text-center italic">
                This piece is still being crafted with care. Return soon for words that warm the soul.
              </p>
            )}
          </div>
        </FadeInView>
      </article>

      {/* Author & Share Section */}
      <section className="px-4 sm:px-6 py-10 border-t border-sun-sand">
        <FadeInView>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Author info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sun-gold via-sun-coral to-sun-plum flex items-center justify-center">
                <span className="font-headline text-lg text-white uppercase">S</span>
              </div>
              <div>
                <p className="font-subhead text-sm font-semibold text-sun-cocoa">
                  {meta.author}
                </p>
                <p className="font-body text-sm text-sun-cocoa/60">
                  Glow from the heart.
                </p>
              </div>
            </div>

            {/* Share placeholder */}
            <div className="flex items-center gap-3">
              <span className="font-body text-sm text-sun-cocoa/60">Share:</span>
              <div className="flex gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-sun-plum/10 hover:bg-sun-plum hover:text-white text-sun-plum flex items-center justify-center transition-colors"
                  aria-label="Share on social media"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </FadeInView>
      </section>

      {/* Related Posts Section */}
      <RelatedPosts posts={getRelatedPosts(slug)} />

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sun-gold">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              Continue the journey
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="font-headline text-[clamp(1.8rem,4vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-sun-cocoa mb-4">
              Ready to glow from the heart?
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-base leading-relaxed text-sun-cocoa/80 mb-6">
              Join the community for weekly rituals, reflections, and resources delivered straight to your inbox.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 rounded-[14px] font-subhead text-sm font-semibold tracking-wide uppercase bg-sun-plum text-white hover:bg-sun-plum/90 transition-colors"
            >
              Join The List
            </Link>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
