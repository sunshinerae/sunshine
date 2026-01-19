'use client';

const cities = [
  'Austin', 'Berlin', 'SXSW', 'Brooklyn', 'Nashville', 'London',
  'Portland', 'Montreal', 'Los Angeles', 'Chicago', 'Toronto', 'Seattle'
];

export function ProofBar() {
  return (
    <section className="border-y border-sun-sand bg-sun-sand/30 py-4 overflow-hidden">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {cities.concat(cities).map((city, idx) => (
          <span
            key={idx}
            className="text-sm font-medium text-sun-cocoa/60 uppercase tracking-wider px-4"
          >
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}
