'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';

export interface BlogCardProps {
  /** Blog post title */
  title: string;
  /** Blog post excerpt */
  excerpt: string;
  /** Blog post category */
  category: string;
  /** Blog post date (ISO string or formatted string) */
  date: string;
  /** Blog post slug for linking */
  slug: string;
  /** Featured image URL */
  image?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Blog post preview card with image, title, excerpt, and category tag
 *
 * Uses White Cloud background with Deep Brown text per brand spec.
 * Includes hover lift effect with crisp 0.3s animation.
 */
export function BlogCard({
  title,
  excerpt,
  category,
  date,
  slug,
  image,
  className,
}: BlogCardProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Category color mapping based on content pillars
  const getCategoryStyles = (cat: string) => {
    const normalizedCategory = cat.toLowerCase();
    if (normalizedCategory.includes('wellness')) {
      return 'bg-sunshine-yellow text-sunshine-brown';
    }
    if (normalizedCategory.includes('self-development') || normalizedCategory.includes('development')) {
      return 'bg-sunshine-purple text-sunshine-white';
    }
    if (normalizedCategory.includes('business') || normalizedCategory.includes('strategy')) {
      return 'bg-sunshine-orange text-sunshine-white';
    }
    // Default fallback
    return 'bg-sunshine-purple text-sunshine-white';
  };

  return (
    <Link href={`/blog/${slug}`} className="block h-full">
      <motion.article
        initial={{ y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        whileHover={{
          y: -4,
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        }}
        transition={{
          duration: 0.3,
          ease: crispEase,
        }}
        className={cn(
          'rounded-2xl overflow-hidden flex flex-col h-full bg-sunshine-white',
          className
        )}
      >
        {/* Image placeholder */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-sunshine-yellow/30 via-sunshine-orange/20 to-sunshine-purple/30">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-sunshine-purple/30"
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

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-3">
          {/* Category tag and date */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={cn(
                'inline-flex px-3 py-1 rounded-full font-subhead text-xs font-semibold tracking-wide uppercase',
                getCategoryStyles(category)
              )}
            >
              {category}
            </span>
            <span className="font-body text-sm text-sunshine-brown/60">
              {formatDate(date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-headline text-lg uppercase tracking-wide text-sunshine-brown leading-tight">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-body text-sm leading-relaxed text-sunshine-brown/80 line-clamp-3">
            {excerpt}
          </p>

          {/* Read more link */}
          <div className="mt-auto pt-4">
            <span className="font-subhead text-sm font-semibold text-sunshine-purple hover:text-sunshine-orange transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
