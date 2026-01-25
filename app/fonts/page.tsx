'use client';

import { useState } from 'react';

// Curated list of elegant, editorial fonts from Google Fonts
// Organized by style: Didone/High-Contrast, Modern Serif, Display, Elegant Sans
const fontOptions = [
  // Didone / High-Contrast Serifs (Most "groovy + sexy")
  { name: 'Playfair Display', style: 'Didone', url: 'Playfair+Display:wght@700' },
  { name: 'Bodoni Moda', style: 'Didone', url: 'Bodoni+Moda:wght@700' },
  { name: 'Cormorant Garamond', style: 'Didone', url: 'Cormorant+Garamond:wght@700' },
  { name: 'DM Serif Display', style: 'Didone', url: 'DM+Serif+Display' },
  { name: 'Libre Baskerville', style: 'Didone', url: 'Libre+Baskerville:wght@700' },
  { name: 'Spectral', style: 'Didone', url: 'Spectral:wght@700' },
  { name: 'Crimson Pro', style: 'Didone', url: 'Crimson+Pro:wght@700' },
  { name: 'Lora', style: 'Didone', url: 'Lora:wght@700' },

  // Modern/Editorial Serifs
  { name: 'Fraunces', style: 'Modern Serif', url: 'Fraunces:wght@700' },
  { name: 'EB Garamond', style: 'Modern Serif', url: 'EB+Garamond:wght@700' },
  { name: 'Merriweather', style: 'Modern Serif', url: 'Merriweather:wght@700' },
  { name: 'Source Serif 4', style: 'Modern Serif', url: 'Source+Serif+4:wght@700' },
  { name: 'Bitter', style: 'Modern Serif', url: 'Bitter:wght@700' },
  { name: 'Vollkorn', style: 'Modern Serif', url: 'Vollkorn:wght@700' },
  { name: 'Newsreader', style: 'Modern Serif', url: 'Newsreader:wght@700' },
  { name: 'Petrona', style: 'Modern Serif', url: 'Petrona:wght@700' },

  // Display/Stylized
  { name: 'Yeseva One', style: 'Display', url: 'Yeseva+One' },
  { name: 'Abril Fatface', style: 'Display', url: 'Abril+Fatface' },
  { name: 'Rozha One', style: 'Display', url: 'Rozha+One' },
  { name: 'Cinzel', style: 'Display', url: 'Cinzel:wght@700' },
  { name: 'Cardo', style: 'Display', url: 'Cardo:wght@700' },
  { name: 'Antic Didone', style: 'Display', url: 'Antic+Didone' },
  { name: 'Oranienbaum', style: 'Display', url: 'Oranienbaum' },
  { name: 'Prata', style: 'Display', url: 'Prata' },

  // Elegant Sans (for comparison)
  { name: 'Outfit', style: 'Sans', url: 'Outfit:wght@700' },
  { name: 'Sora', style: 'Sans', url: 'Sora:wght@700' },
  { name: 'Space Grotesk', style: 'Sans', url: 'Space+Grotesk:wght@700' },
  { name: 'Plus Jakarta Sans', style: 'Sans', url: 'Plus+Jakarta+Sans:wght@700' },
  { name: 'Urbanist', style: 'Sans', url: 'Urbanist:wght@700' },
  { name: 'Lexend', style: 'Sans', url: 'Lexend:wght@700' },

  // More Didone/High-Contrast options
  { name: 'Noto Serif Display', style: 'Didone', url: 'Noto+Serif+Display:wght@700' },
  { name: 'Sorts Mill Goudy', style: 'Didone', url: 'Sorts+Mill+Goudy' },
  { name: 'Old Standard TT', style: 'Didone', url: 'Old+Standard+TT:wght@700' },
  { name: 'Mate', style: 'Didone', url: 'Mate' },
  { name: 'Lusitana', style: 'Didone', url: 'Lusitana:wght@700' },
  { name: 'Gilda Display', style: 'Display', url: 'Gilda+Display' },
  { name: 'Vidaloka', style: 'Display', url: 'Vidaloka' },
  { name: 'Playfair Display SC', style: 'Didone', url: 'Playfair+Display+SC:wght@700' },

  // More elegant options
  { name: 'Cormorant', style: 'Modern Serif', url: 'Cormorant:wght@700' },
  { name: 'Cormorant Infant', style: 'Modern Serif', url: 'Cormorant+Infant:wght@700' },
  { name: 'Cormorant SC', style: 'Modern Serif', url: 'Cormorant+SC:wght@700' },
  { name: 'Cormorant Unicase', style: 'Display', url: 'Cormorant+Unicase:wght@700' },
  { name: 'Josefin Slab', style: 'Modern Serif', url: 'Josefin+Slab:wght@700' },
  { name: 'Marcellus', style: 'Display', url: 'Marcellus' },
  { name: 'Marcellus SC', style: 'Display', url: 'Marcellus+SC' },
  { name: 'Coustard', style: 'Display', url: 'Coustard:wght@900' },
  { name: 'Rufina', style: 'Modern Serif', url: 'Rufina:wght@700' },
  { name: 'Radley', style: 'Modern Serif', url: 'Radley' },
];

const sampleText = 'STOP PLAYING SMALL';
const subText = 'Your next chapter starts here.';

export default function FontPreviewPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  const filteredFonts = filter === 'all'
    ? fontOptions
    : fontOptions.filter(f => f.style === filter);

  // Generate Google Fonts URL for all fonts
  const fontsUrl = `https://fonts.googleapis.com/css2?${fontOptions.map(f => `family=${f.url}`).join('&')}&display=swap`;

  return (
    <main className="min-h-screen bg-sun-cream py-12 px-4">
      {/* Load all Google Fonts */}
      <link rel="stylesheet" href={fontsUrl} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl uppercase tracking-tight text-sun-plum mb-4">
            Font Preview
          </h1>
          <p className="font-body text-sun-cocoa mb-8">
            Click any font to see it larger. Pick your favorite for the headlines.
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['all', 'Didone', 'Modern Serif', 'Display', 'Sans'].map(style => (
              <button
                key={style}
                onClick={() => setFilter(style)}
                className={`px-4 py-2 rounded-full font-body text-sm transition-colors ${
                  filter === style
                    ? 'bg-sun-plum text-white'
                    : 'bg-sun-sand text-sun-cocoa hover:bg-sun-gold'
                }`}
              >
                {style === 'all' ? 'All Fonts' : style}
                {style !== 'all' && ` (${fontOptions.filter(f => f.style === style).length})`}
              </button>
            ))}
          </div>

          <p className="font-body text-sm text-sun-cocoa/60">
            Showing {filteredFonts.length} fonts • Didone/High-Contrast styles are most &quot;groovy + sexy&quot;
          </p>
        </div>

        {/* Selected font preview */}
        {selectedFont && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFont(null)}>
            <div className="bg-sun-cream rounded-3xl p-12 max-w-4xl w-full text-center" onClick={e => e.stopPropagation()}>
              <p className="font-body text-sm text-sun-plum mb-4 uppercase tracking-widest">{selectedFont}</p>
              <h2
                style={{ fontFamily: `'${selectedFont}', serif` }}
                className="text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.85] tracking-tight text-sun-cocoa mb-6"
              >
                {sampleText}
              </h2>
              <p
                style={{ fontFamily: `'${selectedFont}', serif` }}
                className="text-3xl text-sun-plum mb-8"
              >
                {subText}
              </p>
              <button
                onClick={() => setSelectedFont(null)}
                className="bg-sun-plum text-white px-8 py-3 rounded-full font-body hover:bg-sun-gold hover:text-sun-cocoa transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Font grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFonts.map((font) => (
            <button
              key={font.name}
              onClick={() => setSelectedFont(font.name)}
              className="bg-sun-paper rounded-2xl p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border border-sun-sand/50"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-body text-xs text-sun-plum uppercase tracking-widest">
                  {font.name}
                </span>
                <span className="font-body text-xs text-sun-cocoa/50 bg-sun-sand px-2 py-0.5 rounded">
                  {font.style}
                </span>
              </div>
              <h3
                style={{ fontFamily: `'${font.name}', serif` }}
                className="text-3xl uppercase leading-[0.9] tracking-tight text-sun-cocoa mb-2"
              >
                {sampleText}
              </h3>
              <p
                style={{ fontFamily: `'${font.name}', serif` }}
                className="text-lg text-sun-plum"
              >
                {subText}
              </p>
            </button>
          ))}
        </div>

        {/* Recommendation */}
        <div className="mt-16 bg-sun-plum rounded-3xl p-8 text-center text-white">
          <h2 className="font-headline text-2xl uppercase tracking-tight mb-4">
            Top Recommendations
          </h2>
          <p className="font-body text-white/80 mb-6">
            For the &quot;confident and magnetic&quot; vibe you want:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Playfair Display', 'Bodoni Moda', 'Cormorant Garamond', 'Abril Fatface', 'DM Serif Display'].map(name => (
              <button
                key={name}
                onClick={() => setSelectedFont(name)}
                className="bg-sun-gold text-sun-cocoa px-4 py-2 rounded-full font-body text-sm hover:bg-white transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
