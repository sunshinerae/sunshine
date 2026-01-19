import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { isFeatureEnabled } from '@/lib/features';
import {
  getPostContent,
  getPostMeta,
  getAllPostSlugs,
  formatPostDate,
  getReadingTime,
} from '@/lib/blog';
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
    return 'bg-sunshine-yellow text-sunshine-brown';
  }
  if (
    normalizedCategory.includes('self-development') ||
    normalizedCategory.includes('development')
  ) {
    return 'bg-sunshine-purple text-sunshine-white';
  }
  if (
    normalizedCategory.includes('business') ||
    normalizedCategory.includes('strategy')
  ) {
    return 'bg-sunshine-orange text-sunshine-white';
  }
  return 'bg-sunshine-purple text-sunshine-white';
}

// Simple markdown to JSX renderer
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;
  let inList = false;
  let listItems: string[] = [];

  const processInlineMarkdown = (text: string): React.ReactNode => {
    // Process bold, italic, and links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let partIndex = 0;

    // Process links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processTextStyles(remaining.slice(lastIndex, match.index), partIndex++));
      }
      parts.push(
        <Link
          key={`link-${partIndex++}`}
          href={match[2]}
          className="text-sunshine-purple hover:text-sunshine-orange underline underline-offset-2 transition-colors"
        >
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
      parts.push(processTextStyles(remaining.slice(lastIndex), partIndex++));
    }

    return parts.length > 0 ? parts : processTextStyles(text, 0);
  };

  const processTextStyles = (text: string, key: number): React.ReactNode => {
    // Process bold (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    // Process italic (*text*)
    const italicRegex = /\*([^*]+)\*/g;

    let result = text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let elementIndex = 0;

    // First handle bold
    let boldMatch;
    const boldMatches: { index: number; length: number; content: string }[] = [];
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      boldMatches.push({
        index: boldMatch.index,
        length: boldMatch[0].length,
        content: boldMatch[1],
      });
    }

    if (boldMatches.length > 0) {
      boldMatches.forEach((match, i) => {
        if (match.index > lastIndex) {
          const segment = text.slice(lastIndex, match.index);
          // Check for italic in this segment
          if (segment.includes('*')) {
            elements.push(
              <span key={`${key}-${elementIndex++}`}>
                {segment.replace(italicRegex, '<em>$1</em>').split(/<em>|<\/em>/).map((part, idx) =>
                  idx % 2 === 1 ? <em key={idx}>{part}</em> : part
                )}
              </span>
            );
          } else {
            elements.push(segment);
          }
        }
        elements.push(<strong key={`${key}-bold-${elementIndex++}`}>{match.content}</strong>);
        lastIndex = match.index + match.length;
      });

      if (lastIndex < text.length) {
        const remaining = text.slice(lastIndex);
        if (remaining.includes('*')) {
          const parts = remaining.split(italicRegex);
          parts.forEach((part, idx) => {
            if (idx % 2 === 1) {
              elements.push(<em key={`${key}-em-${elementIndex++}`}>{part}</em>);
            } else if (part) {
              elements.push(part);
            }
          });
        } else {
          elements.push(remaining);
        }
      }

      return <span key={key}>{elements}</span>;
    }

    // If no bold, check for italic only
    if (text.includes('*')) {
      const parts: React.ReactNode[] = [];
      let tempLastIndex = 0;
      let italicMatch;
      italicRegex.lastIndex = 0;

      while ((italicMatch = italicRegex.exec(text)) !== null) {
        if (italicMatch.index > tempLastIndex) {
          parts.push(text.slice(tempLastIndex, italicMatch.index));
        }
        parts.push(<em key={`${key}-em-${elementIndex++}`}>{italicMatch[1]}</em>);
        tempLastIndex = italicMatch.index + italicMatch[0].length;
      }

      if (tempLastIndex < text.length) {
        parts.push(text.slice(tempLastIndex));
      }

      return parts.length > 0 ? <span key={key}>{parts}</span> : text;
    }

    return text;
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${currentIndex++}`}
          className="space-y-2 mb-6 pl-6 list-disc marker:text-sunshine-purple"
        >
          {listItems.map((item, i) => (
            <li key={i} className="font-body text-lg leading-relaxed text-sunshine-brown/90">
              {processInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but flush list if we were in one
    if (!trimmedLine) {
      if (inList) flushList();
      continue;
    }

    // Headers
    if (trimmedLine.startsWith('# ')) {
      if (inList) flushList();
      elements.push(
        <h1
          key={currentIndex++}
          className="font-headline text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] tracking-tight text-sunshine-brown mb-6 mt-10 first:mt-0"
        >
          {trimmedLine.slice(2)}
        </h1>
      );
      continue;
    }

    if (trimmedLine.startsWith('## ')) {
      if (inList) flushList();
      elements.push(
        <h2
          key={currentIndex++}
          className="font-subhead text-2xl font-bold text-sunshine-brown mb-4 mt-10"
        >
          {trimmedLine.slice(3)}
        </h2>
      );
      continue;
    }

    if (trimmedLine.startsWith('### ')) {
      if (inList) flushList();
      elements.push(
        <h3
          key={currentIndex++}
          className="font-subhead text-xl font-bold text-sunshine-brown mb-3 mt-8"
        >
          {trimmedLine.slice(4)}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      if (inList) flushList();
      elements.push(
        <blockquote
          key={currentIndex++}
          className="border-l-4 border-sunshine-purple pl-6 py-2 my-8 bg-sunshine-purple/5 rounded-r-lg"
        >
          <p className="font-body text-lg italic text-sunshine-brown/90 leading-relaxed">
            {processInlineMarkdown(trimmedLine.slice(2))}
          </p>
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmedLine === '---') {
      if (inList) flushList();
      elements.push(
        <hr key={currentIndex++} className="my-10 border-t border-sunshine-brown/20" />
      );
      continue;
    }

    // List items
    if (trimmedLine.startsWith('- ')) {
      inList = true;
      listItems.push(trimmedLine.slice(2));
      continue;
    }

    // Regular paragraph
    if (inList) flushList();
    elements.push(
      <p
        key={currentIndex++}
        className="font-body text-lg leading-relaxed text-sunshine-brown/90 mb-6"
      >
        {processInlineMarkdown(trimmedLine)}
      </p>
    );
  }

  // Flush any remaining list
  if (inList) flushList();

  return elements;
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
    <div className="bg-sunshine-white min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 md:py-20 bg-sunshine-purple text-sunshine-white overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          {/* Back link */}
          <FadeInView>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-subhead text-sm font-semibold text-sunshine-blue hover:text-sunshine-yellow transition-colors"
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
            <div className="flex items-center justify-center gap-4 text-sunshine-white/80 font-body text-sm">
              <span>{formatPostDate(meta.date)}</span>
              <span className="w-1 h-1 rounded-full bg-sunshine-white/60" />
              <span>{readingTime} min read</span>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Featured Image Placeholder */}
      <section className="relative -mt-8 px-4 sm:px-6">
        <FadeInView delay={0.4}>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sunshine-yellow/40 via-sunshine-orange/30 to-sunshine-purple/40 shadow-xl">
              {meta.image ? (
                <img
                  src={meta.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-sunshine-purple/30"
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
          <div className="max-w-3xl mx-auto prose-sunshine">
            {content ? (
              renderMarkdown(content)
            ) : (
              <p className="font-body text-lg leading-relaxed text-sunshine-brown/90 text-center italic">
                Content coming soon. Check back later for the full article.
              </p>
            )}
          </div>
        </FadeInView>
      </article>

      {/* Author & Share Section */}
      <section className="px-4 sm:px-6 py-10 border-t border-sunshine-brown/10">
        <FadeInView>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Author info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sunshine-yellow via-sunshine-orange to-sunshine-purple flex items-center justify-center">
                <span className="font-headline text-lg text-sunshine-white uppercase">S</span>
              </div>
              <div>
                <p className="font-subhead text-sm font-semibold text-sunshine-brown">
                  {meta.author}
                </p>
                <p className="font-body text-sm text-sunshine-brown/60">
                  Glow from the heart.
                </p>
              </div>
            </div>

            {/* Share placeholder */}
            <div className="flex items-center gap-3">
              <span className="font-body text-sm text-sunshine-brown/60">Share:</span>
              <div className="flex gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-sunshine-purple/10 hover:bg-sunshine-purple hover:text-sunshine-white text-sunshine-purple flex items-center justify-center transition-colors"
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

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sunshine-yellow">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-purple mb-3">
              Continue the journey
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="font-headline text-[clamp(1.8rem,4vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-sunshine-brown mb-4">
              Ready to glow from the heart?
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-base leading-relaxed text-sunshine-brown/80 mb-6">
              Join the community for weekly rituals, reflections, and resources delivered straight to your inbox.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 rounded-full font-subhead text-sm font-semibold tracking-wide uppercase bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange transition-colors"
            >
              Join The List
            </Link>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
