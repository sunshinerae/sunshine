import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { CheckCircle2 } from 'lucide-react';
import { BrandCard } from '@/components/brand-card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  topic: z.string().min(1, 'Please choose an option.'),
  message: z.string().min(10, 'Share a little more so we can respond with care.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      topic: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        form.reset();
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-sunshine-white">
        <BrandCard className="max-w-2xl mx-auto p-12 text-center" variant="white">
          <div className="w-16 h-16 rounded-full bg-sunshine-yellow flex items-center justify-center mx-auto mb-6 text-sunshine-brown">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-4xl uppercase mb-4 text-sunshine-purple">
            Thank you for reaching out.
          </h1>
          <p className="font-body text-lg mb-8 leading-relaxed text-sunshine-brown">
            You&apos;ll hear from Sunshine within 24 hours. In the meantime, explore events or join the Consistent Bulletin to stay in the flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-sunshine-purple text-sunshine-purple hover:bg-sunshine-purple hover:text-sunshine-white"
              onClick={() => setIsSubmitted(false)}
            >
              Send another note
            </Button>
            <Button
              onClick={() => window.location.href = '/events'}
              className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange"
            >
              Explore events
            </Button>
          </div>
        </BrandCard>
      </main>
    );
  }

  return (
    <main className="bg-sunshine-white">
      <section className="bg-sunshine-purple text-sunshine-white px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue">Contact</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-tight">
            Safe, judgment-free connection.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl">
            Tell us what you need. We respond within 24 hours with next steps, calm guidance, and zero pressure.
          </p>
          <p className="font-body text-sm">
            You are allowed to want more ease. This space is warm, private, and blame-free.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <BrandCard className="p-8 md:p-12" variant="white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="coaching">1:1 Coaching</SelectItem>
                        <SelectItem value="retreats">Retreats</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="community">Community / Bulletin</SelectItem>
                        <SelectItem value="other">Something else</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share a few lines</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me what feels heavy, where you want clarity, and the momentum you're craving."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange px-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </Button>
                <p className="text-sm text-sunshine-brown max-w-md">
                  Expect a reply in 24 hours. Your words stay confidential and are read by Sunshine only.
                </p>
              </div>
            </form>
          </Form>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <BrandCard className="p-6" variant="yellow">
            <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Response time</h3>
            <p className="font-body text-sm leading-relaxed">Within 24 hours, with clear next steps and zero pushiness.</p>
          </BrandCard>
          <BrandCard className="p-6" variant="white">
            <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Safety first</h3>
            <p className="font-body text-sm leading-relaxed">Judgment-free communication. You can ask for what you need without pressure.</p>
          </BrandCard>
          <BrandCard className="p-6" variant="orange">
            <h3 className="font-headline text-xl uppercase mb-2">Gentle microcopy</h3>
            <p className="font-body text-sm leading-relaxed">We reduce decision anxiety with clear options and loving encouragement.</p>
          </BrandCard>
        </div>

        <BrandCard className="p-8" variant="white">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">SMS love notes</p>
              <h3 className="font-headline text-2xl uppercase text-sunshine-purple">1–2 gentle texts a week</h3>
              <p className="text-sm text-sunshine-brown leading-relaxed">
                Soft reminders, encouragement, and links to events or offers when relevant. Always optional, always kind.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone</label>
                <input
                  placeholder="(555) 123-4567"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-yellow text-sunshine-brown border-0"
                />
              </div>
              <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange w-full sm:w-auto">
                Join SMS list
              </Button>
              <p className="text-xs text-sunshine-brown leading-relaxed">
                Consent matters. 1–2 texts/week max. Reply STOP anytime.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-orange">Consistent Bulletin</p>
              <h3 className="font-headline text-2xl uppercase text-sunshine-purple">Weekly email love notes</h3>
              <p className="text-sm text-sunshine-brown leading-relaxed">
                Personal notes from Sunshine, curated recommendations, upcoming events, and ways to stay connected.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  placeholder="you@example.com"
                  className="w-full rounded-full px-4 py-3 bg-sunshine-yellow text-sunshine-brown border-0"
                />
              </div>
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue w-full sm:w-auto">
                Join the Consistent Bulletin
              </Button>
              <p className="text-xs text-sunshine-brown leading-relaxed">
                Glow from the heart. Unsubscribe anytime. No spam—just devotion and clarity.
              </p>
            </div>
          </div>
        </BrandCard>
      </section>
    </main>
  );
}
