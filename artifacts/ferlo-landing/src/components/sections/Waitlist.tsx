import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  ageRange: z.string().min(1, 'Please select an age range'),
  message: z.string().optional(),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

export function Waitlist() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      ageRange: '',
      message: '',
    },
  });

  const onSubmit = async (data: WaitlistValues) => {
    setSubmitError(null);
    try {
      const honeypot = (document.getElementById('wl-website') as HTMLInputElement | null)?.value ?? '';
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: honeypot }),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError("Something went wrong. Please try again, or email us directly.");
    }
  };

  return (
    <section id="waitlist" className="py-32 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Be the first to experience FerLo</h2>
            <p className="text-lg text-muted-foreground">Join our pre-launch waitlist. Spaces are limited as we carefully craft our first stories.</p>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Parent name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" className="bg-background/50 border-input focus:border-primary" {...field} data-testid="input-name" />
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
                              <FormLabel className="text-foreground">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="jane@example.com" className="bg-background/50 border-input focus:border-primary" {...field} data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Child age range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-input focus:border-primary" data-testid="select-age">
                                  <SelectValue placeholder="Select an age range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-3">Under 3</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="6-8">6-8 years</SelectItem>
                                <SelectItem value="9-12">9-12 years</SelectItem>
                                <SelectItem value="multiple">Multiple ages</SelectItem>
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
                            <FormLabel className="text-foreground">Tell us about your child's creations <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Do they like drawing monsters? Building with blocks?"
                                className="resize-none min-h-[100px] bg-background/50 border-input focus:border-primary"
                                {...field}
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <input
                        type="text"
                        id="wl-website"
                        name="website"
                        autoComplete="off"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="absolute -left-[9999px] w-0 h-0 opacity-0"
                      />

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all font-semibold"
                        disabled={form.formState.isSubmitting}
                        data-testid="button-submit-waitlist"
                      >
                        {form.formState.isSubmitting ? "Joining..." : "Join the FerLo waitlist"}
                      </Button>

                      {submitError && (
                        <p role="alert" className="text-sm text-destructive text-center">
                          {submitError}
                        </p>
                      )}
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Welcome to the magic</h3>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Thank you for joining the waitlist! We'll be in touch soon when it's time to bring your child's creations to life.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
