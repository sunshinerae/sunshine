'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Modal card - Clean and solid */}
      <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl bg-sunshine-white border-2 border-sunshine-brown/10">
        {/* Subtle accent bar at top */}
        <div className="h-1.5 bg-gradient-to-r from-sunshine-orange via-sunshine-yellow to-sunshine-purple"></div>

        {/* Content - solid white background */}
        <div className="relative p-8 md:p-10 bg-sunshine-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-sunshine-purple/10 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-sunshine-purple" />
          </button>

          {!submitted ? (
            <>
              {/* Heading - per brandSpec.layout.signupPage.copyOptions */}
              <div className="text-center mb-8">
                <h3 className="font-subhead text-3xl md:text-4xl text-sunshine-brown mb-4 font-bold uppercase leading-tight">
                  Stay Connected<br />To The Fire
                </h3>
                <p className="font-body text-sm md:text-base text-sunshine-brown/90 max-w-sm mx-auto leading-relaxed">
                  Enter your info to receive rituals, reflections, and invitations that keep you close to your own light.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-400/50 rounded-lg text-center">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Form fields - per brandSpec.layout.signupPage.form.fields */}
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-5 py-3 rounded-lg bg-white border-2 border-sunshine-brown/30 focus:border-sunshine-purple focus:ring-2 focus:ring-sunshine-purple/20 focus:outline-none transition-all placeholder:text-sunshine-brown/50 font-body text-sunshine-brown shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg bg-white border-2 border-sunshine-brown/30 focus:border-sunshine-purple focus:ring-2 focus:ring-sunshine-purple/20 focus:outline-none transition-all placeholder:text-sunshine-brown/50 font-body text-sunshine-brown shadow-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-5 py-3 rounded-lg bg-white border-2 border-sunshine-brown/30 focus:border-sunshine-purple focus:ring-2 focus:ring-sunshine-purple/20 focus:outline-none transition-all placeholder:text-sunshine-brown/50 font-body text-sunshine-brown shadow-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg bg-white border-2 border-sunshine-brown/30 focus:border-sunshine-purple focus:ring-2 focus:ring-sunshine-purple/20 focus:outline-none transition-all placeholder:text-sunshine-brown/50 font-body text-sunshine-brown shadow-sm"
                />

                {/* Submit button - per brandSpec.layout.signupPage.form.submitButton */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sunshine-purple text-sunshine-white font-subhead font-bold py-3.5 rounded-lg hover:bg-sunshine-orange transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide shadow-md hover:shadow-lg uppercase"
                  >
                    {isSubmitting ? 'Submitting...' : 'I Want In'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-headline text-3xl text-sunshine-purple mb-3 font-bold uppercase">
                You&apos;re In
              </h3>
              {/* Success message - per brandSpec.layout.signupPage.form.successMessage */}
              <p className="font-body text-sm md:text-base text-sunshine-brown/80 mb-6 max-w-md mx-auto leading-relaxed">
                You are in. Watch your inbox for your first ritual and a little extra light.
              </p>
              <button
                onClick={onClose}
                className="bg-sunshine-purple text-sunshine-white px-8 py-3 rounded-lg hover:bg-sunshine-orange transition-all font-subhead font-bold uppercase text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
