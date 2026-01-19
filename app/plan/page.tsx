import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Plan',
  description: 'Project implementation plan and roadmap for The Sunshine Effect website.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlanPage() {
  const planPath = path.join(process.cwd(), '..', 'PLAN.md');
  const planContent = fs.existsSync(planPath)
    ? fs.readFileSync(planPath, 'utf-8')
    : 'PLAN.md not found';

  // Parse markdown sections
  const sections = planContent.split(/^##\s+/gm).filter(Boolean);

  return (
    <div className="min-h-screen bg-sun-cream">
      {/* Header */}
      <header className="border-b border-sun-sand sticky top-0 bg-sun-cream z-50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl font-semibold tracking-tight text-sun-cocoa">Project Plan</h1>
            <Link
              href="/"
              className="text-sm text-sun-cocoa/70 hover:text-sun-plum transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <article className="prose prose-stone max-w-none">
          {sections.map((section, idx) => {
            const lines = section.split('\n');
            const title = lines[0]?.trim() || '';
            const content = lines.slice(1).join('\n').trim();

            return (
              <section key={idx} className="mb-16 scroll-mt-24" id={`section-${idx}`}>
                <h2 className="font-headline text-4xl font-semibold mb-6 text-sun-cocoa border-b border-sun-sand pb-4">
                  {title}
                </h2>
                <div className="space-y-4 text-sun-cocoa/70 leading-relaxed">
                  {content.split('\n\n').map((para, pIdx) => {
                    // Handle lists
                    if (para.startsWith('*') || para.startsWith('-')) {
                      const items = para.split('\n').filter(l => l.trim());
                      return (
                        <ul key={pIdx} className="space-y-2 ml-6">
                          {items.map((item, iIdx) => (
                            <li key={iIdx} className="text-sun-cocoa/80">
                              {item.replace(/^[\*\-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Handle bold text and regular paragraphs
                    const formatted = para
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-sun-cocoa">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code class="bg-sun-sand px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

                    return (
                      <p
                        key={pIdx}
                        className="text-sun-cocoa/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-sun-sand mt-24">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-sm text-sun-cocoa/70 text-center">
            Project Plan · Updated {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}
