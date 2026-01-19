import { Metadata } from 'next';
import { PAGE_METADATA } from '@/lib/metadata';

export const metadata: Metadata = PAGE_METADATA.about;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-sunshine-white">
      {/* Hero Section - to be implemented */}
      <section className="py-20 px-4 bg-sunshine-purple">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline text-4xl md:text-6xl uppercase text-sunshine-white font-bold">
            About
          </h1>
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
