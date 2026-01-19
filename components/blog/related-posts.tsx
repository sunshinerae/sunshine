'use client';

import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { BlogCard } from '@/components/cards/blog-card';
import type { BlogPostMeta } from '@/lib/blog';

interface RelatedPostsProps {
  posts: BlogPostMeta[];
}

/**
 * Related posts section for the bottom of blog post pages
 * Displays up to 3 related posts based on category
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-white border-t border-sunshine-brown/10">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <FadeInView>
          <div className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-purple mb-3">
              Keep reading
            </p>
            <h2 className="font-headline text-[clamp(1.5rem,3vw,2rem)] uppercase leading-[0.95] tracking-tight text-sunshine-brown">
              You might also enjoy
            </h2>
          </div>
        </FadeInView>

        {/* Related posts grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
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
      </div>
    </section>
  );
}
