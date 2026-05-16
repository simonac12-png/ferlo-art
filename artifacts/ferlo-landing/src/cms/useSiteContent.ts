import { useQuery } from "@tanstack/react-query";
import {
  SECTION_KEYS,
  defaultContent,
  sectionSchemas,
  type ComingNextContent,
  type FooterContent,
  type HeroContent,
  type HowItWorksContent,
  type MissionContent,
  type NavbarContent,
  type SectionKey,
  type ShowcaseContent,
  type StoryExamplesContent,
  type WaitlistContent,
} from "@workspace/api-zod";

export type SiteContent = {
  navbar: NavbarContent;
  hero: HeroContent;
  how_it_works: HowItWorksContent;
  showcase: ShowcaseContent;
  story_examples: StoryExamplesContent;
  mission: MissionContent;
  coming_next: ComingNextContent;
  waitlist: WaitlistContent;
  footer: FooterContent;
};

type ApiResponse = { sections: Record<string, unknown> };

async function fetchContent(): Promise<Record<string, unknown>> {
  const res = await fetch("/api/content", {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`content failed: ${res.status}`);
  const data = (await res.json()) as ApiResponse;
  return data.sections || {};
}

export function resolveContent(
  remote: Record<string, unknown> | undefined,
): SiteContent {
  const out: Record<SectionKey, unknown> = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) {
    const schema = sectionSchemas[key];
    const candidate = remote?.[key];
    const parsed = schema.safeParse(candidate);
    out[key] = parsed.success ? parsed.data : defaultContent[key];
  }
  return out as SiteContent;
}

export function useSiteContent(): SiteContent {
  const query = useQuery({
    queryKey: ["site-content"],
    queryFn: fetchContent,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return resolveContent(query.data);
}
