import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Showcase } from "@/components/sections/Showcase";
import { StoryExamples } from "@/components/sections/StoryExamples";
import { Mission } from "@/components/sections/Mission";
import { ComingNext } from "@/components/sections/ComingNext";
import { Waitlist } from "@/components/sections/Waitlist";
import { Footer } from "@/components/sections/Footer";

export function Home() {
  return (
    <main className="min-h-[100dvh] w-full font-sans text-foreground bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Showcase />
      <StoryExamples />
      <Mission />
      <ComingNext />
      <Waitlist />
      <Footer />
    </main>
  );
}
