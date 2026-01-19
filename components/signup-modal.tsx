'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        onClose();
        router.push('/thank-you');
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
      {/* Modal */}
      <div className="relative w-full max-w-[1200px] max-h-[90vh] overflow-y-auto rounded-3xl overflow-hidden shadow-2xl bg-sun-cream">
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-sun-paper hover:bg-sun-sand transition-colors z-20 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-7 h-7 text-sun-cocoa" />
        </button>

        <div className="grid md:grid-cols-[1.2fr,1fr] gap-0">
          {/* Left side - Hero Image */}
          <div className="relative h-[400px] md:h-auto md:min-h-[700px] bg-sun-sand/30">
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
          <div className="relative p-8 md:p-12 bg-sun-cream flex flex-col justify-center">
            {/* Headline */}
            <div className="mb-8">
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-sun-cocoa mb-4 font-bold leading-tight">
                Stay<br />Connected<br />To The Fire
              </h2>
              <p className="font-body text-base md:text-lg text-sun-cocoa leading-relaxed max-w-md">
                Enter your info to receive rituals, reflections, and invitations that keep you close to your own light.
              </p>
              <p className="font-body text-sm md:text-base text-sun-plum mt-3 font-semibold">
                Get your first ritual in 24 hours
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-sun-coral/20 border-2 border-sun-coral rounded-xl">
                <p className="text-sun-cocoa font-body text-sm font-medium">{error}</p>
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
                className="w-full px-6 py-4 rounded-xl bg-sun-paper border border-sun-sand focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:outline-none transition-all placeholder:text-sun-cocoa/50 font-body text-sun-cocoa text-lg"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-sun-paper border border-sun-sand focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:outline-none transition-all placeholder:text-sun-cocoa/50 font-body text-sun-cocoa text-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-xl bg-sun-paper border border-sun-sand focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:outline-none transition-all placeholder:text-sun-cocoa/50 font-body text-sun-cocoa text-lg"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-sun-paper border border-sun-sand focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:outline-none transition-all placeholder:text-sun-cocoa/50 font-body text-sun-cocoa text-lg"
              />

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sun-plum text-white font-body font-semibold py-5 px-8 rounded-[14px] hover:bg-sun-plum/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'I Want In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
