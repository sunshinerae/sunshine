'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'launch',
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Unable to connect. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      {/* Bold Poster-Style Modal */}
      <div className="relative w-full max-w-[1200px] max-h-[90vh] overflow-y-auto rounded-3xl overflow-hidden shadow-2xl bg-sunshine-yellow">
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-sunshine-white hover:bg-sunshine-brown/20 transition-colors z-20 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-7 h-7 text-sunshine-brown" />
        </button>

        {!submitted ? (
          <div className="grid md:grid-cols-[1.2fr,1fr] gap-0">
            {/* Left side - Hero Image */}
            <div className="relative h-[400px] md:h-auto md:min-h-[700px] bg-sunshine-brown/5">
              <Image
                src="/ID_LOVE_THIS_PHOTO_ON_THE_SIGN_UP_PAGE.jpg"
                alt="Woman with flame - Stay connected to the fire"
                fill
                className="object-contain"
                priority
                quality={95}
              />
            </div>

            {/* Right side - Form */}
            <div className="relative p-8 md:p-12 bg-sunshine-yellow flex flex-col justify-center">
              {/* Bold Headline */}
              <div className="mb-8">
                <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-sunshine-brown mb-4 font-bold uppercase leading-tight">
                  Stay<br />Connected<br />To The Fire
                </h2>
                <p className="font-body text-base md:text-lg text-sunshine-brown leading-relaxed max-w-md">
                  Enter your info to receive rituals, reflections, and invitations that keep you close to your own light.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-4 bg-sunshine-orange/30 border-2 border-sunshine-orange rounded-xl">
                  <p className="text-sunshine-brown font-body text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-6 py-4 rounded-xl bg-sunshine-white border-3 border-sunshine-brown/20 focus:border-sunshine-purple focus:ring-4 focus:ring-sunshine-purple/30 focus:outline-none transition-all placeholder:text-sunshine-brown/60 font-body text-sunshine-brown text-lg shadow-md"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-sunshine-white border-3 border-sunshine-brown/20 focus:border-sunshine-purple focus:ring-4 focus:ring-sunshine-purple/30 focus:outline-none transition-all placeholder:text-sunshine-brown/60 font-body text-sunshine-brown text-lg shadow-md"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-6 py-4 rounded-xl bg-sunshine-white border-3 border-sunshine-brown/20 focus:border-sunshine-purple focus:ring-4 focus:ring-sunshine-purple/30 focus:outline-none transition-all placeholder:text-sunshine-brown/60 font-body text-sunshine-brown text-lg shadow-md"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-sunshine-white border-3 border-sunshine-brown/20 focus:border-sunshine-purple focus:ring-4 focus:ring-sunshine-purple/30 focus:outline-none transition-all placeholder:text-sunshine-brown/60 font-body text-sunshine-brown text-lg shadow-md"
                />

                {/* Bold Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sunshine-purple text-sunshine-white font-subhead font-bold py-5 px-8 rounded-full hover:bg-sunshine-brown hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-2xl tracking-wide shadow-2xl uppercase"
                  >
                    {isSubmitting ? 'Submitting...' : 'I Want In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-8 md:py-24 bg-sunshine-yellow">
            <div className="text-7xl md:text-8xl mb-6">🔥</div>
            <h3 className="font-headline text-4xl md:text-5xl text-sunshine-brown mb-4 font-bold uppercase">
              You&apos;re In
            </h3>
            <p className="font-body text-lg md:text-xl text-sunshine-brown mb-8 max-w-lg mx-auto leading-relaxed">
              You are in. Watch your inbox for your first ritual and a little extra light.
            </p>
            <button
              onClick={onClose}
              className="bg-sunshine-purple text-sunshine-white px-12 py-4 rounded-full hover:bg-sunshine-brown transition-all font-subhead font-bold uppercase text-lg shadow-xl"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
