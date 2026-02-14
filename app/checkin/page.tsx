'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { CTAButton } from '@/components/ui/cta-button';
import { EVENT_CONFIG, PAYMENT_LINKS } from '@/lib/constants';

export default function CheckinPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [joinMailingList, setJoinMailingList] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [zelleCopied, setZelleCopied] = useState(false);

  // Persist success state across page refreshes
  useEffect(() => {
    if (sessionStorage.getItem('checkin-complete')) {
      setStatus('success');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setStatus('error');
      setErrorMessage('Please fill out all fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, joinMailingList }),
      });

      if (!res.ok) {
        throw new Error('Check-in failed');
      }

      sessionStorage.setItem('checkin-complete', 'true');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const inputStyles =
    'w-full h-11 px-4 rounded-full font-body text-sm border-2 outline-none transition-all duration-200 bg-sun-paper border-sun-sand text-sun-cocoa placeholder:text-sun-cocoa/50 focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const paymentLinkStyles =
    'group flex min-h-[52px] items-center gap-4 px-6 py-4 rounded-2xl bg-sun-plum hover:bg-sun-plum/90 text-white transition-colors duration-300 w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-cocoa focus-visible:ring-offset-2';
  const successHeadlineStyles =
    'font-headline text-[clamp(2.3rem,6vw,4.2rem)] uppercase leading-[0.86] tracking-[0.02em] text-white';
  const successBodyStyles =
    'font-body text-sm md:text-base leading-relaxed';
  const cardLabelStyles =
    'font-body text-xs uppercase tracking-[0.12em] text-sun-cocoa/70 text-center';

  // ─── CONFIRMATION STATE ───
  if (status === 'success') {
    return (
      <div className="min-h-screen">
        {/* Hero confirmation */}
        <section className="bg-sun-plum text-white px-6 py-10 md:py-14 overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <ScaleIn delay={0.1} initialScale={0.5} duration={0.5} className="inline-block">
              <span className="text-6xl md:text-7xl block mb-2" role="img" aria-label="spark">
                ⟡
              </span>
            </ScaleIn>
            <FadeInView delay={0.2} duration={0.7}>
              <h1 className={successHeadlineStyles}>
                You&apos;re in.
                <br />
                Welcome to the Orbit.
              </h1>
            </FadeInView>
            <FadeInView delay={0.4} direction="none" duration={0.7}>
              <p className={`${successBodyStyles} text-white/90 max-w-lg mx-auto`}>
                This event is yours too. Your contribution supports the facilitators who held this space and is reinvested into future gatherings for this community.
              </p>
            </FadeInView>
            <FadeInView delay={0.5} duration={0.6}>
              <div className="max-w-lg mx-auto bg-sun-paper/95 text-sun-cocoa rounded-3xl p-5 md:p-7 text-left space-y-4">
                <h2 className="font-headline text-[clamp(1.3rem,4vw,1.9rem)] uppercase leading-[0.95] tracking-[0.02em] text-sun-plum text-center">
                  ⟡ Invest In Yourself ⟡
                </h2>
                <p className={cardLabelStyles}>
                  Suggested contribution tiers
                </p>
                <p className="font-body text-sm text-sun-cocoa/85 text-center">
                  $25 Grounded support • $35 Community builder • $45 Experience sponsor • $65 Elevated sponsor • $100 Legacy contribution
                </p>
                <div className="space-y-4 pt-1">
                  <a
                    href={PAYMENT_LINKS.venmo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={paymentLinkStyles}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg">
                      $
                    </span>
                    <div className="text-left">
                      <h3 className="font-headline text-base uppercase mb-0.5">
                        Venmo
                      </h3>
                      <p className="font-body text-xs text-white/80">
                        @SunshineB • Open App
                      </p>
                    </div>
                  </a>
                  <a
                    href={PAYMENT_LINKS.zelle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${paymentLinkStyles} border-2 border-sun-gold/70`}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-gold text-sun-plum font-headline text-lg">
                      Z
                    </span>
                    <div className="text-left">
                      <h3 className="font-headline text-base uppercase mb-0.5">
                        Zelle
                      </h3>
                      <p className="font-body text-xs text-white/80">
                        (909) 519-9378 • Open App
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-body text-sm font-semibold text-sun-cocoa/80">
                      Need to copy the Zelle number?
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText('9095199378');
                        setZelleCopied(true);
                        setTimeout(() => setZelleCopied(false), 1500);
                      }}
                      className="font-body text-xs px-2 py-1 rounded bg-sun-plum text-white"
                    >
                      {zelleCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.6} className="text-center">
              <p className="font-body text-sm text-white/80">
                Thank you for being here.
              </p>
            </FadeInView>
          </div>
        </section>
      </div>
    );
  }

  // ─── FORM STATE ───
  return (
    <div className="bg-sun-cream min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <FadeInView duration={0.7}>
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="The Sunshine Effect"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="font-headline text-[clamp(2rem,5vw,3rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-2">
              {EVENT_CONFIG.name}
            </h1>
            <p className="font-body text-sun-cocoa/70">
              Check in to the event
            </p>
          </div>
        </FadeInView>

        <FadeInView delay={0.2} duration={0.6}>
          <div className="bg-sun-paper/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border-2 border-sun-sky/30">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="First name"
                    autoComplete="given-name"
                    maxLength={255}
                    disabled={status === 'loading'}
                    className={inputStyles}
                    aria-describedby={status === 'error' ? 'checkin-error' : undefined}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Last name"
                    autoComplete="family-name"
                    maxLength={255}
                    disabled={status === 'loading'}
                    className={inputStyles}
                    aria-describedby={status === 'error' ? 'checkin-error' : undefined}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="checkin-email" className="sr-only">Email</label>
                <input
                  id="checkin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={255}
                  disabled={status === 'loading'}
                  className={inputStyles}
                  aria-describedby={status === 'error' ? 'checkin-error' : undefined}
                />
              </div>

              <div>
                <label htmlFor="checkin-phone" className="sr-only">Phone</label>
                <input
                  id="checkin-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={50}
                  disabled={status === 'loading'}
                  className={inputStyles}
                  aria-describedby={status === 'error' ? 'checkin-error' : undefined}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={joinMailingList}
                  onChange={(e) => setJoinMailingList(e.target.checked)}
                  disabled={status === 'loading'}
                  className="mt-1 h-4 w-4 rounded border-sun-sand text-sun-plum focus:ring-sun-plum/30 accent-sun-plum"
                />
                <span className="font-body text-xs text-sun-cocoa/70 leading-relaxed">
                  Bring me into orbit for the updates that move me forward.
                </span>
              </label>

              {status === 'error' && errorMessage && (
                <p id="checkin-error" className="text-sun-coral text-sm font-body" role="alert">
                  {errorMessage}
                </p>
              )}

              <CTAButton
                type="submit"
                variant="white"
                disabled={status === 'loading'}
                className="w-full"
              >
                {status === 'loading' ? 'Checking in...' : 'Check In'}
              </CTAButton>
            </form>
          </div>
        </FadeInView>
      </div>
    </div>
  );
}
