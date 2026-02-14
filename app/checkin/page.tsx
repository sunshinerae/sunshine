'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
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
    'group flex items-center gap-4 px-6 py-4 rounded-2xl bg-sun-plum hover:bg-sun-plum/90 transition-colors duration-300 w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-cocoa focus-visible:ring-offset-2';

  // ─── CONFIRMATION STATE ───
  if (status === 'success') {
    return (
      <div className="min-h-screen">
        {/* Hero confirmation */}
        <section className="bg-sun-plum text-white px-6 py-16 md:py-20 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <ScaleIn delay={0.1} initialScale={0.5} duration={0.5} className="inline-block">
              <span className="text-6xl md:text-7xl block mb-4" role="img" aria-label="fire">
                🔥
              </span>
            </ScaleIn>
            <FadeInView delay={0.2} duration={0.7}>
              <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
                You&apos;re in the room.
              </h1>
            </FadeInView>
            <FadeInView delay={0.4} direction="none" duration={0.7}>
              <p className="font-subhead text-lg text-sun-gold">
                {EVENT_CONFIG.name}
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Donation section */}
        <section className="bg-sun-cream px-6 py-12 md:py-16 overflow-hidden">
          <div className="max-w-md mx-auto">
            <FadeInView className="text-center mb-6">
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
                Show some love
              </p>
              <h2 className="font-headline text-[clamp(1.5rem,4vw,2.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-3">
                Leave a tip
              </h2>
              <p className="font-body text-sm leading-relaxed text-sun-cocoa/80 max-w-sm mx-auto">
                Every donation is reinvested into future sessions — supporting facilitators and covering the costs of creating safe, intentional spaces.
              </p>
            </FadeInView>

            <StaggerChildren className="flex flex-col gap-4 mb-8">
              <StaggerItem>
                <a
                  href={PAYMENT_LINKS.venmo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={paymentLinkStyles}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg group-hover:scale-110 transition-transform duration-300">
                    $
                  </span>
                  <div className="text-left">
                    <h3 className="font-headline text-base uppercase text-white mb-0.5">
                      Venmo
                    </h3>
                    <p className="font-body text-xs text-white/80">
                      @SunshineB
                    </p>
                  </div>
                </a>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={PAYMENT_LINKS.zelle}
                  className={paymentLinkStyles}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg group-hover:scale-110 transition-transform duration-300">
                    $
                  </span>
                  <div className="text-left">
                    <h3 className="font-headline text-base uppercase text-white mb-0.5">
                      Zelle
                    </h3>
                    <p className="font-body text-xs text-white/80">
                      (909) 519-9378
                    </p>
                  </div>
                </a>
              </StaggerItem>
            </StaggerChildren>

            <FadeInView delay={0.4} className="text-center">
              <p className="font-body text-sm text-sun-cocoa/60">
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
                  Also join The Sunshine Effect mailing list for events, updates, and inspo
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
