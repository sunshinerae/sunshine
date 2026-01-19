'use client';

import Link from 'next/link';
import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Markdown to JSX content renderer
 * Supports: headers (h1-h3), paragraphs, blockquotes, horizontal rules,
 * unordered lists, bold, italic, and links
 */
export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const elements = renderMarkdown(content);

  return (
    <div className={`prose-sun ${className}`}>
      {elements}
    </div>
  );
}

/**
 * Process inline markdown styles (bold, italic)
 */
function processTextStyles(text: string, key: number): React.ReactNode {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /\*([^*]+)\*/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let elementIndex = 0;

  // First handle bold
  const boldMatches: { index: number; length: number; content: string }[] = [];
  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    boldMatches.push({
      index: boldMatch.index,
      length: boldMatch[0].length,
      content: boldMatch[1],
    });
  }

  if (boldMatches.length > 0) {
    boldMatches.forEach((match) => {
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
}

/**
 * Process inline markdown including links, bold, and italic
 */
function processInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(processTextStyles(text.slice(lastIndex, match.index), partIndex++));
    }
    parts.push(
      <Link
        key={`link-${partIndex++}`}
        href={match[2]}
        className="text-sun-plum hover:text-sun-plum/80 underline underline-offset-2 transition-colors"
      >
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(processTextStyles(text.slice(lastIndex), partIndex++));
  }

  return parts.length > 0 ? parts : processTextStyles(text, 0);
}

/**
 * Main markdown to JSX renderer
 */
function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${currentIndex++}`}
          className="space-y-2 mb-6 pl-6 list-disc marker:text-sun-plum"
        >
          {listItems.map((item, i) => (
            <li key={i} className="font-body text-lg leading-relaxed text-sun-cocoa/90">
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
          className="font-headline text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] tracking-tight text-sun-cocoa mb-6 mt-10 first:mt-0"
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
          className="font-subhead text-2xl font-bold text-sun-cocoa mb-4 mt-10"
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
          className="font-subhead text-xl font-bold text-sun-cocoa mb-3 mt-8"
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
          className="border-l-4 border-sun-plum pl-6 py-2 my-8 bg-sun-plum/5 rounded-r-lg"
        >
          <p className="font-body text-lg italic text-sun-cocoa/90 leading-relaxed">
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
        <hr key={currentIndex++} className="my-10 border-t border-sun-cocoa/20" />
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
        className="font-body text-lg leading-relaxed text-sun-cocoa/90 mb-6"
      >
        {processInlineMarkdown(trimmedLine)}
      </p>
    );
  }

  // Flush any remaining list
  if (inList) flushList();

  return elements;
}

export default MarkdownContent;
