import React from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
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
              className="mb-8 flex justify-center lg:justify-start"
            >
              <img
                src="/ferlo-logo.png"
                alt="FerLo"
                className="h-16 md:h-20 w-auto object-contain dark:brightness-110"
                data-testid="hero-logo"
              />
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Where children's <br className="hidden md:block" />
              <span className="text-primary italic">creations</span> come to life
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              FerLo transforms children's handmade art into story characters and personalized AI-powered stories that honor every handmade detail.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#waitlist"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-sm"
                data-testid="hero-join-waitlist"
              >
                Join the waitlist
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-card text-foreground border border-border rounded-full font-semibold text-lg hover:bg-muted transition-colors"
                data-testid="hero-how-it-works"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-primary/10 to-secondary/10 border border-border/50 shadow-2xl flex items-center justify-center p-3">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
              </div>

              <div className="relative z-10 w-full h-full flex items-center justify-center gap-3">
                <div className="flex-1 h-full bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                  <img src="/child-drawing.jpg" alt="Child's original drawing" className="w-full h-full object-cover" />
                </div>

                <div className="w-10 h-10 shrink-0 rounded-full bg-card shadow flex items-center justify-center text-primary z-20 border border-border">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="flex-1 h-full bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                  <img src="/ferlo-character.jpg" alt="FerLo Character" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
