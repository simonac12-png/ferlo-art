import { z } from "zod";

/**
 * An image reference. Public-folder paths (e.g. "/ferlo-logo.png") and
 * Vercel Blob URLs are both stored under `url`. `mediaId` is set whenever
 * the asset was uploaded through the admin's media library; it lets us
 * detect references when an admin tries to delete media.
 */
export const imageRefSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mediaId: z.string().uuid().optional(),
});
export type ImageRef = z.infer<typeof imageRefSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/* ---------- Navbar ---------- */
export const navbarSchema = z.object({
  logo: imageRefSchema,
  navLinks: z.array(linkSchema),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});
export type NavbarContent = z.infer<typeof navbarSchema>;

/* ---------- Hero ---------- */
export const heroSchema = z.object({
  logo: imageRefSchema,
  headlineLine1: z.string().min(1),
  headlineHighlight: z.string().min(1),
  headlineLine2: z.string().min(1),
  subheading: z.string().min(1),
  primaryCta: linkSchema,
  secondaryCta: linkSchema,
  leftImage: imageRefSchema,
  rightImage: imageRefSchema,
});
export type HeroContent = z.infer<typeof heroSchema>;

/* ---------- HowItWorks ---------- */
export const howItWorksSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  steps: z
    .array(
      z.object({
        number: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        accent: z.enum(["primary", "secondary", "accent"]),
      }),
    )
    .min(1),
});
export type HowItWorksContent = z.infer<typeof howItWorksSchema>;

/* ---------- Showcase ---------- */
export const showcaseSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  cards: z
    .array(
      z.object({
        caption: z.string().min(1),
        beforeImage: imageRefSchema,
        afterImage: imageRefSchema,
        beforeGradient: z.string().min(1),
        afterGradient: z.string().min(1),
      }),
    )
    .min(1),
});
export type ShowcaseContent = z.infer<typeof showcaseSchema>;

/* ---------- StoryExamples ---------- */
export const storyExamplesSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  stories: z
    .array(
      z.object({
        title: z.string().min(1),
        character: z.string().min(1),
        source: z.string().min(1),
        theme: z.string().min(1),
        preview: z.string().min(1),
      }),
    )
    .min(1),
});
export type StoryExamplesContent = z.infer<typeof storyExamplesSchema>;

/* ---------- Mission ---------- */
export const missionSchema = z.object({
  icon: imageRefSchema,
  quote: z.string().min(1),
});
export type MissionContent = z.infer<typeof missionSchema>;

/* ---------- ComingNext ---------- */
export const comingNextSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});
export type ComingNextContent = z.infer<typeof comingNextSchema>;

/* ---------- Waitlist (the surrounding copy, NOT the form fields) ---------- */
export const waitlistSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  submitLabel: z.string().min(1),
  submitPending: z.string().min(1),
  successHeading: z.string().min(1),
  successBody: z.string().min(1),
  errorBody: z.string().min(1),
});
export type WaitlistContent = z.infer<typeof waitlistSchema>;

/* ---------- Footer ---------- */
export const footerSchema = z.object({
  icon: imageRefSchema,
  tagline: z.string().min(1),
  links: z.array(linkSchema),
  copyright: z.string().min(1),
});
export type FooterContent = z.infer<typeof footerSchema>;

/* ---------- Popup (matches DB row, used in admin form) ---------- */
export const POPUP_TRIGGER_TYPES = [
  "on_load",
  "after_delay",
  "exit_intent",
  "on_click",
] as const;
export const popupTriggerSchema = z.enum(POPUP_TRIGGER_TYPES);
export type PopupTriggerType = z.infer<typeof popupTriggerSchema>;

export const popupSchema = z.object({
  name: z.string().min(1, "Internal name required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().default(""),
  image: imageRefSchema.optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  triggerType: popupTriggerSchema,
  triggerValue: z.string().optional(),
  isActive: z.boolean().default(false),
  dismissCookieDays: z.number().int().min(0).max(365).default(7),
});
export type PopupInput = z.infer<typeof popupSchema>;

/* ---------- Section registry ---------- */
export const SECTION_KEYS = [
  "navbar",
  "hero",
  "how_it_works",
  "showcase",
  "story_examples",
  "mission",
  "coming_next",
  "waitlist",
  "footer",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const sectionSchemas = {
  navbar: navbarSchema,
  hero: heroSchema,
  how_it_works: howItWorksSchema,
  showcase: showcaseSchema,
  story_examples: storyExamplesSchema,
  mission: missionSchema,
  coming_next: comingNextSchema,
  waitlist: waitlistSchema,
  footer: footerSchema,
} as const;

export const sectionLabels: Record<SectionKey, string> = {
  navbar: "Navbar",
  hero: "Hero",
  how_it_works: "How it works",
  showcase: "Showcase",
  story_examples: "Story examples",
  mission: "Mission",
  coming_next: "Coming next",
  waitlist: "Waitlist",
  footer: "Footer",
};

/* ---------- Default content (mirrors current hardcoded JSX) ---------- */
export const defaultContent: {
  navbar: NavbarContent;
  hero: HeroContent;
  how_it_works: HowItWorksContent;
  showcase: ShowcaseContent;
  story_examples: StoryExamplesContent;
  mission: MissionContent;
  coming_next: ComingNextContent;
  waitlist: WaitlistContent;
  footer: FooterContent;
} = {
  navbar: {
    logo: { url: "/ferlo-favicon.png", alt: "FerLo Logo", width: 40, height: 40 },
    navLinks: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Waitlist", href: "#waitlist" },
    ],
    ctaLabel: "Join waitlist",
    ctaHref: "#waitlist",
  },
  hero: {
    logo: {
      url: "/ferlo-logo.png",
      alt: "FerLo",
      width: 1021,
      height: 304,
    },
    headlineLine1: "Where children's",
    headlineHighlight: "creations",
    headlineLine2: "come to life",
    subheading:
      "FerLo transforms children's handmade art into story characters and personalized AI-powered stories that honor every handmade detail.",
    primaryCta: { label: "Join the waitlist", href: "#waitlist" },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
    leftImage: {
      url: "/child-drawing.jpg",
      alt: "Child's original drawing",
      width: 1200,
      height: 1600,
    },
    rightImage: {
      url: "/ferlo-character.jpg",
      alt: "FerLo Character",
      width: 1200,
      height: 1800,
    },
  },
  how_it_works: {
    heading: "How it works",
    subheading:
      "From a physical craft to a magical story in three simple steps.",
    steps: [
      {
        number: "01",
        title: "Upload a creation",
        description:
          "Take a photo of a drawing, clay figure, nature build, or any handmade project.",
        accent: "primary",
      },
      {
        number: "02",
        title: "FerLo brings it to life",
        description:
          "AI transforms the creation into a beautiful character while preserving the child's original shapes and imperfections. We honor every handmade detail.",
        accent: "secondary",
      },
      {
        number: "03",
        title: "Receive a personalized story",
        description:
          "The character stars in a gentle story that sparks imagination and helps children understand AI in an age-appropriate way.",
        accent: "accent",
      },
    ],
  },
  showcase: {
    heading: "Honoring every detail",
    subheading:
      "We don't fix their art. We bring their exact imagination to life.",
    cards: [
      {
        caption: "Ferdi's watercolor monster became a friendly giant",
        beforeImage: {
          url: "/showcase-ferdi-original.jpg",
          alt: "Ferdi original",
        },
        afterImage: {
          url: "/showcase-ferdi-character.png",
          alt: "Ferdi character",
        },
        beforeGradient:
          "from-amber-100/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/20",
        afterGradient: "from-accent/10 to-primary/10",
      },
      {
        caption: "Leo's clay rabbit became a brave forest guardian",
        beforeImage: { url: "/showcase-leo-original.jpg", alt: "Leo original" },
        afterImage: {
          url: "/showcase-leo-character.png",
          alt: "Leo character",
        },
        beforeGradient:
          "from-emerald-100/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/20",
        afterGradient: "from-primary/10 to-secondary/10",
      },
      {
        caption: "Max's cardboard spaceship became a real explorer",
        beforeImage: { url: "/showcase-max-original.jpg", alt: "Max original" },
        afterImage: {
          url: "/showcase-max-character.png",
          alt: "Max character",
        },
        beforeGradient:
          "from-sky-100/80 to-blue-50/80 dark:from-sky-900/30 dark:to-blue-900/20",
        afterGradient: "from-secondary/10 to-primary/10",
      },
    ],
  },
  story_examples: {
    heading: "More than a picture",
    subheading:
      "Every character stars in a personalized story that sparks imagination and teaches gentle lessons.",
    stories: [
      {
        title: "The Robot Who Learned to Feel",
        character: "Beepo",
        source: "a child's clay robot",
        theme: "What is AI?",
        preview:
          "Beepo was built with shiny metal and a very big heart. But when he met a sad little bird, he didn't know how to compute sadness. With a little help, Beepo learns that some things can't be calculated—they just have to be felt.",
      },
      {
        title: "The Wobbly Tower",
        character: "Stony",
        source: "a pebble tower",
        theme: "Creativity & Problem Solving",
        preview:
          "Stony was the tallest tower in the garden, but the wind kept knocking him down! Instead of giving up, Stony figures out a new way to stack himself, learning that building something new sometimes means looking at the pieces differently.",
      },
      {
        title: "The Rainbow Weaver",
        character: "Lumie",
        source: "a yarn craft",
        theme: "Kindness",
        preview:
          "Lumie loved spinning bright, colorful threads. When the town lost its colors to a gloomy storm, Lumie realized that sharing her colorful threads made the world bright again. A story about giving and the warmth of sharing.",
      },
    ],
  },
  mission: {
    icon: { url: "/ferlo-icon.png", alt: "FerLo Icon", width: 80, height: 80 },
    quote:
      "FerLo brings children's handcrafted creations to life through AI-powered characters and stories. It helps children feel proud of their imagination while gently teaching them what AI is, how it works, and how it can support human creativity.",
  },
  coming_next: {
    heading: "Coming Next",
    subheading:
      "We are building a magical platform that grows with your child's creativity. This is just the beginning.",
    items: [
      { title: "Narrated stories", description: "In the child's voice" },
      {
        title: "Multilingual",
        description: "Story generation in any language",
      },
      {
        title: "Animated shorts",
        description: "Cartoon videos of their characters",
      },
      {
        title: "Family library",
        description: "A shared shelf of all creations",
      },
    ],
  },
  waitlist: {
    heading: "Be the first to experience FerLo",
    subheading:
      "Join our pre-launch waitlist. Spaces are limited as we carefully craft our first stories.",
    submitLabel: "Join the FerLo waitlist",
    submitPending: "Joining...",
    successHeading: "Welcome to the magic",
    successBody:
      "Thank you for joining the waitlist! We'll be in touch soon when it's time to bring your child's creations to life.",
    errorBody: "Something went wrong. Please try again, or email us directly.",
  },
  footer: {
    icon: { url: "/ferlo-icon.png", alt: "FerLo Icon", width: 40, height: 40 },
    tagline: "Where art meets AI",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    copyright: "© 2025 FerLo. All rights reserved.",
  },
};

export function getDefaultContent<K extends SectionKey>(
  key: K,
): z.infer<(typeof sectionSchemas)[K]> {
  return defaultContent[key] as z.infer<(typeof sectionSchemas)[K]>;
}
