import fs from 'fs';
import path from 'path';
import blogData from '@/data/blog-meta.json';

// Types
export interface BlogPostMeta {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  author: string;
  published: boolean;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  featured_image: string;
  author: string;
  published: boolean;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
  frontmatter: BlogPostFrontmatter;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
}

// Constants
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Parse frontmatter from markdown content
 * Expects format:
 * ---
 * key: value
 * ---
 * content
 */
function parseFrontmatter(fileContent: string): {
  frontmatter: Record<string, string | boolean>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: fileContent };
  }

  const frontmatterBlock = match[1];
  const content = match[2];

  const frontmatter: Record<string, string | boolean> = {};

  frontmatterBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value: string | boolean = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse boolean values
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    frontmatter[key] = value;
  });

  return { frontmatter, content };
}

/**
 * Get all blog post metadata from the JSON file
 * Returns only published posts by default
 */
export function getAllPostsMeta(includeUnpublished = false): BlogPostMeta[] {
  const posts = blogData.posts as BlogPostMeta[];

  if (includeUnpublished) {
    return posts;
  }

  return posts.filter((post) => post.published);
}

/**
 * Get all blog categories
 */
export function getAllCategories(): BlogCategory[] {
  return blogData.categories as BlogCategory[];
}

/**
 * Get posts filtered by category
 */
export function getPostsByCategory(
  categorySlug: string,
  includeUnpublished = false
): BlogPostMeta[] {
  const allPosts = getAllPostsMeta(includeUnpublished);

  return allPosts.filter(
    (post) => post.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );
}

/**
 * Get a single post's metadata by slug
 */
export function getPostMeta(slug: string): BlogPostMeta | undefined {
  const posts = getAllPostsMeta(true);
  return posts.find((post) => post.slug === slug);
}

/**
 * Read and parse a blog post's markdown content
 */
export function getPostContent(slug: string): BlogPost | null {
  const meta = getPostMeta(slug);
  if (!meta) return null;

  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(fileContent);

    return {
      meta,
      content: content.trim(),
      frontmatter: frontmatter as unknown as BlogPostFrontmatter,
    };
  } catch {
    // If markdown file doesn't exist, return meta with empty content
    return {
      meta,
      content: '',
      frontmatter: {
        title: meta.title,
        slug: meta.slug,
        category: meta.category,
        date: meta.date,
        excerpt: meta.excerpt,
        featured_image: meta.image,
        author: meta.author,
        published: meta.published,
      },
    };
  }
}

/**
 * Get all blog posts with their full content
 */
export function getAllPosts(includeUnpublished = false): BlogPost[] {
  const allMeta = getAllPostsMeta(includeUnpublished);

  return allMeta
    .map((meta) => getPostContent(meta.slug))
    .filter((post): post is BlogPost => post !== null);
}

/**
 * Get related posts based on category (excluding the current post)
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 3
): BlogPostMeta[] {
  const currentPost = getPostMeta(currentSlug);
  if (!currentPost) return [];

  const sameCategoryPosts = getAllPostsMeta().filter(
    (post) =>
      post.category === currentPost.category && post.slug !== currentSlug
  );

  // If not enough posts in same category, add from other categories
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit);
  }

  const otherPosts = getAllPostsMeta().filter(
    (post) =>
      post.category !== currentPost.category && post.slug !== currentSlug
  );

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}

/**
 * Get the most recent posts
 */
export function getRecentPosts(limit = 3): BlogPostMeta[] {
  const posts = getAllPostsMeta();

  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get all unique post slugs (useful for static generation)
 */
export function getAllPostSlugs(): string[] {
  return getAllPostsMeta().map((post) => post.slug);
}

/**
 * Format a date string for display
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate estimated reading time based on word count
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
