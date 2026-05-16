import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Showcase } from "@/components/sections/Showcase";
import { StoryExamples } from "@/components/sections/StoryExamples";
import { Mission } from "@/components/sections/Mission";
import { ComingNext } from "@/components/sections/ComingNext";
import { Waitlist } from "@/components/sections/Waitlist";
import { Footer } from "@/components/sections/Footer";
import { useSiteContent } from "@/cms/useSiteContent";

export function Home() {
  const content = useSiteContent();
  return (
    <main className="min-h-[100dvh] w-full font-sans text-foreground bg-background">
      <Navbar content={content.navbar} />
      <Hero content={content.hero} />
      <HowItWorks content={content.how_it_works} />
      <Showcase content={content.showcase} />
      <StoryExamples content={content.story_examples} />
      <Mission content={content.mission} />
      <ComingNext content={content.coming_next} />
      <Waitlist content={content.waitlist} />
      <Footer content={content.footer} />
    </main>
  );
}
