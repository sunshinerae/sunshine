import { BrandCard } from '@/components/brand-card';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for The Sunshine Effect',
};

export default function PrivacyPage() {
  const lastUpdated = 'November 19, 2024';

  return (
    <div className="bg-sun-cream">
      <section className="px-4 sm:px-6 py-12 md:py-16 bg-sun-plum text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-[clamp(2.5rem,6vw,4rem)] uppercase leading-[0.9] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-body text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-20 max-w-4xl mx-auto">
        <div className="space-y-8 font-body text-sun-cocoa leading-relaxed">
          <BrandCard variant="yellow" className="p-6 md:p-8">
            <p className="font-semibold text-sun-plum mb-2">
              Your Privacy Matters
            </p>
            <p className="text-sm">
              At The Sunshine Effect, we believe in consent, transparency, and treating your data with the same care we bring to our community. This policy explains how we collect, use, and protect your information.
            </p>
          </BrandCard>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              1. Information We Collect
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Information you provide:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email address</strong> when you subscribe to our newsletter (Consistent Bulletin)</li>
                <li><strong>Phone number</strong> (optional) if you opt in to SMS updates</li>
                <li><strong>Name, email, and message</strong> when you contact us through our contact form</li>
                <li><strong>Payment information</strong> when you purchase coaching, events, or retreats (processed securely through third-party payment processors)</li>
              </ul>

              <p className="mt-4">
                <strong>Information collected automatically:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage data:</strong> Pages visited, time spent, device type, browser</li>
                <li><strong>Cookies:</strong> We use essential cookies for site functionality</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send you the <strong>Consistent Bulletin</strong> (our newsletter) with practices, event invites, and community updates</li>
              <li>Send <strong>SMS messages</strong> (1-2x per week) with gentle reminders and encouragement (only if you opted in)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Process registrations for events, retreats, and coaching sessions</li>
              <li>Improve our website and services</li>
              <li>Send important updates about your purchases or account</li>
            </ul>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              3. We Will NOT
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>❌ Sell your email or phone number</li>
              <li>❌ Share your information with third parties for their marketing purposes</li>
              <li>❌ Spam you - we respect your inbox and send only what adds value</li>
              <li>❌ Use your data in ways you haven&apos;t consented to</li>
            </ul>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              4. Third-Party Services
            </h2>
            <p>
              We use trusted third-party services to help us run The Sunshine Effect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Email provider:</strong> To send newsletters and transactional emails</li>
              <li><strong>SMS provider:</strong> To send text messages (only if you opted in)</li>
              <li><strong>Payment processors:</strong> To securely process payments (we do NOT store your credit card information)</li>
              <li><strong>Analytics:</strong> To understand how people use our site (anonymized data)</li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies and are bound by industry-standard security practices.
            </p>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              5. Your Rights & Choices
            </h2>
            <p className="mb-3">
              You are always in control of your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Unsubscribe from emails:</strong> Click the unsubscribe link at the bottom of any email</li>
              <li><strong>Stop SMS messages:</strong> Reply STOP to any text message</li>
              <li><strong>Request your data:</strong> Email us to request a copy of your information</li>
              <li><strong>Delete your data:</strong> Email us to request deletion of your information</li>
              <li><strong>Update your information:</strong> Contact us to correct or update your data</li>
            </ul>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              6. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, disclosure, or loss. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Secure SSL/TLS encryption for data transmission</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security updates and monitoring</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the internet is 100% secure. We do our best, but cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              7. Children&apos;s Privacy
            </h2>
            <p>
              Our services are intended for adults. We do not knowingly collect information from anyone under 18 years of age. If we discover we have collected information from a child, we will delete it promptly.
            </p>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We&apos;ll notify you of any significant changes by email or by posting a notice on our website.
            </p>
          </div>

          <div>
            <h2 className="font-headline text-2xl uppercase text-sun-plum mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have questions about this privacy policy or how we handle your data, please reach out:
            </p>
            <ul className="list-none space-y-2 mt-3">
              <li>📧 Email: <a href="mailto:hello@thesunshineeffect.com" className="text-sun-plum hover:text-sun-plum/80 underline">hello@thesunshineeffect.com</a></li>
              <li>🌐 Website: <Link href="/contact" className="text-sun-plum hover:text-sun-plum/80 underline">Contact Form</Link></li>
            </ul>
          </div>

          <BrandCard variant="orange" className="p-6 md:p-8 mt-8">
            <p className="font-headline text-xl uppercase text-white mb-2">
              We celebrate consent.
            </p>
            <p className="text-sm text-white">
              You deserve to know exactly how your information is used. If something in this policy is unclear or you have concerns, please reach out. We&apos;re here to support you.
            </p>
          </BrandCard>

          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-block font-subhead text-sm uppercase tracking-wide text-sun-plum hover:text-sun-plum/80 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
