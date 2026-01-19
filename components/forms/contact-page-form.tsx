'use client';

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

export function ContactPageForm() {
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
      <BrandCard className="max-w-2xl mx-auto p-12 text-center" variant="white">
        <div className="w-16 h-16 rounded-full bg-sunshine-yellow flex items-center justify-center mx-auto mb-6 text-sunshine-brown animate-bounce">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="font-headline text-4xl uppercase mb-4 text-sunshine-purple">
          Thank you for reaching out.
        </h2>
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
    );
  }

  return (
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
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-sunshine-white border-t-transparent rounded-full animate-spin" aria-hidden />
                  Sending...
                </span>
              ) : (
                'Send message'
              )}
            </Button>
            <p className="text-sm text-sunshine-brown max-w-md">
              Expect a reply in 24 hours. Your words stay confidential and are read by Sunshine only.
            </p>
          </div>
        </form>
      </Form>
    </BrandCard>
  );
}
