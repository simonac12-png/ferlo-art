import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import type { HeroContent } from '@workspace/api-zod';

function Doodle({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className={`absolute pointer-events-none select-none ${className}`}>
      {children}
    </div>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Soft color washes behind the whole hero */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[34rem] h-[34rem] rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
      </div>

      {/* Hand-drawn doodles floating around the hero */}
      <Doodle className="hidden md:block top-32 left-[6%] text-accent/60 animate-float">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.5l2.4 6.2 6.6.4-5.1 4.2 1.7 6.4L12 16l-5.6 3.7 1.7-6.4-5.1-4.2 6.6-.4L12 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </Doodle>
      <Doodle className="hidden lg:block top-[60%] left-[3%] text-secondary/60 animate-float-delayed">
        <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
          <path d="M2 14 C8 4, 14 4, 20 12 S 32 18, 38 8 S 48 4, 50 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </Doodle>
      <Doodle className="hidden md:block top-24 right-[8%] text-primary/50 animate-float-delayed">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 20s-7-4.5-9-9c-1.2-2.8.6-6 3.8-6C9 5 11 6.7 12 8.4 13 6.7 15 5 17.2 5c3.2 0 5 3.2 3.8 6-2 4.5-9 9-9 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </Doodle>
      <Doodle className="hidden lg:block bottom-24 right-[4%] text-accent/50 animate-float">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Doodle>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <img
                src={content.logo.url}
                alt={content.logo.alt}
                width={content.logo.width}
                height={content.logo.height}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-16 md:h-20 w-auto object-contain dark:brightness-110"
                data-testid="hero-logo"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-sm font-bold text-foreground/85 backdrop-blur-sm"
                data-testid="hero-badge"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <Sparkles className="w-4 h-4 text-accent" />
                {content.badge}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              {content.headlineLine1} <br className="hidden md:block" />
              <span className="relative inline-block text-primary italic">
                {content.headlineHighlight}
                <svg
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1.5 w-full h-3.5 text-accent/80"
                  viewBox="0 0 200 14"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 10 C 40 3, 75 13, 115 7 S 175 9, 196 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {content.headlineLine2}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content.subheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href={content.primaryCta.href}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                data-testid="hero-join-waitlist"
              >
                {content.primaryCta.label}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={content.secondaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-card text-foreground border border-border rounded-full font-semibold text-lg hover:bg-muted hover:-translate-y-0.5 transition-all duration-300"
                data-testid="hero-how-it-works"
              >
                {content.secondaryCta.label}
              </a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground flex items-center gap-1.5 justify-center lg:justify-start">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary/30" />
              {content.ctaNote}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="relative rounded-3xl overflow-visible bg-gradient-to-tr from-primary/10 to-secondary/10 border border-border/50 shadow-2xl p-4 sm:p-6">
              <div className="absolute inset-0 rounded-3xl overflow-hidden" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
              </div>

              <div className="relative z-10 w-full flex items-center gap-2 sm:gap-3">
                {/* Before: the child's original artwork, framed like a polaroid */}
                <div className="flex-1 -rotate-2 animate-float">
                  <div className="relative bg-card rounded-2xl shadow-lg border border-border p-2 pb-3">
                    <div
                      aria-hidden="true"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-accent/40 rounded-sm rotate-[-4deg] backdrop-blur-[1px]"
                    />
                    <div className="aspect-[3/4] bg-muted/30 rounded-xl overflow-hidden">
                      <img
                        src={content.leftImage.url}
                        alt={content.leftImage.alt}
                        width={content.leftImage.width}
                        height={content.leftImage.height}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-center font-hand text-lg sm:text-xl leading-none text-muted-foreground">
                      {content.beforeLabel}
                    </p>
                  </div>
                </div>

                <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground z-20 animate-pulse-soft">
                  <Sparkles className="w-5 h-5" />
                </div>

                {/* After: the FerLo story character */}
                <div className="flex-1 rotate-2 animate-float-delayed">
                  <div className="relative bg-card rounded-2xl shadow-lg border border-border p-2 pb-3">
                    <div
                      aria-hidden="true"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-secondary/40 rounded-sm rotate-[3deg] backdrop-blur-[1px]"
                    />
                    <div className="aspect-[3/4] bg-muted/30 rounded-xl overflow-hidden">
                      <img
                        src={content.rightImage.url}
                        alt={content.rightImage.alt}
                        width={content.rightImage.width}
                        height={content.rightImage.height}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-center font-hand text-lg sm:text-xl leading-none text-primary">
                      {content.afterLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
