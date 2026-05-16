import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TextField } from "./fields/TextField";
import { ImageField } from "./fields/ImageField";
import { LinkField } from "./fields/LinkField";

import type {
  NavbarContent,
  HeroContent,
  HowItWorksContent,
  ShowcaseContent,
  StoryExamplesContent,
  MissionContent,
  ComingNextContent,
  WaitlistContent,
  FooterContent,
} from "@workspace/api-zod";

/* ===== Navbar ===== */
export function NavbarForm() {
  const { control } = useFormContext<NavbarContent>();
  const linksArr = useFieldArray({ control, name: "navLinks" });
  return (
    <div className="space-y-6">
      <ImageField<NavbarContent> name="logo" label="Logo" />
      <div className="space-y-3">
        <p className="text-sm font-semibold">Nav links</p>
        {linksArr.fields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <TextField<NavbarContent>
                name={`navLinks.${i}.label`}
                label="Label"
              />
              <TextField<NavbarContent>
                name={`navLinks.${i}.href`}
                label="Href"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => linksArr.remove(i)}
              className="mt-7"
              aria-label="Remove link"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => linksArr.append({ label: "", href: "" })}
        >
          + Add link
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField<NavbarContent> name="ctaLabel" label="CTA button label" />
        <TextField<NavbarContent> name="ctaHref" label="CTA target" />
      </div>
    </div>
  );
}

/* ===== Hero ===== */
export function HeroForm() {
  return (
    <div className="space-y-6">
      <ImageField<HeroContent> name="logo" label="Logo" />
      <div className="grid md:grid-cols-3 gap-3">
        <TextField<HeroContent> name="headlineLine1" label="Headline (line 1)" />
        <TextField<HeroContent>
          name="headlineHighlight"
          label="Highlighted word"
        />
        <TextField<HeroContent> name="headlineLine2" label="Headline (line 2)" />
      </div>
      <TextField<HeroContent>
        name="subheading"
        label="Subheading"
        multiline
      />
      <div className="grid md:grid-cols-2 gap-4">
        <LinkField<HeroContent> name="primaryCta" label="Primary CTA" />
        <LinkField<HeroContent> name="secondaryCta" label="Secondary CTA" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ImageField<HeroContent> name="leftImage" label="Left image" />
        <ImageField<HeroContent> name="rightImage" label="Right image" />
      </div>
    </div>
  );
}

/* ===== HowItWorks ===== */
export function HowItWorksForm() {
  const { control } = useFormContext<HowItWorksContent>();
  const steps = useFieldArray({ control, name: "steps" });
  return (
    <div className="space-y-6">
      <TextField<HowItWorksContent> name="heading" label="Heading" />
      <TextField<HowItWorksContent>
        name="subheading"
        label="Subheading"
        multiline
        rows={2}
      />
      <div className="space-y-4">
        <p className="text-sm font-semibold">Steps</p>
        {steps.fields.map((field, i) => (
          <div
            key={field.id}
            className="border border-border rounded-lg p-4 space-y-3 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => steps.remove(i)}
              aria-label="Remove step"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid md:grid-cols-3 gap-3">
              <TextField<HowItWorksContent>
                name={`steps.${i}.number`}
                label="Number"
              />
              <TextField<HowItWorksContent>
                name={`steps.${i}.title`}
                label="Title"
              />
              <FormField
                control={control}
                name={`steps.${i}.accent`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent color</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose accent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <TextField<HowItWorksContent>
              name={`steps.${i}.description`}
              label="Description"
              multiline
              rows={3}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            steps.append({
              number: "",
              title: "",
              description: "",
              accent: "primary",
            })
          }
        >
          + Add step
        </Button>
      </div>
    </div>
  );
}

/* ===== Showcase ===== */
export function ShowcaseForm() {
  const { control } = useFormContext<ShowcaseContent>();
  const cards = useFieldArray({ control, name: "cards" });
  return (
    <div className="space-y-6">
      <TextField<ShowcaseContent> name="heading" label="Heading" />
      <TextField<ShowcaseContent>
        name="subheading"
        label="Subheading"
        multiline
        rows={2}
      />
      <div className="space-y-4">
        <p className="text-sm font-semibold">Cards</p>
        {cards.fields.map((field, i) => (
          <div
            key={field.id}
            className="border border-border rounded-lg p-4 space-y-3 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => cards.remove(i)}
              aria-label="Remove card"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <TextField<ShowcaseContent>
              name={`cards.${i}.caption`}
              label="Caption"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <ImageField<ShowcaseContent>
                name={`cards.${i}.beforeImage`}
                label="Before image"
              />
              <ImageField<ShowcaseContent>
                name={`cards.${i}.afterImage`}
                label="After image"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <TextField<ShowcaseContent>
                name={`cards.${i}.beforeGradient`}
                label="Before gradient (Tailwind classes)"
              />
              <TextField<ShowcaseContent>
                name={`cards.${i}.afterGradient`}
                label="After gradient (Tailwind classes)"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            cards.append({
              caption: "",
              beforeImage: { url: "", alt: "" },
              afterImage: { url: "", alt: "" },
              beforeGradient: "from-amber-100/80 to-orange-50/80",
              afterGradient: "from-accent/10 to-primary/10",
            })
          }
        >
          + Add card
        </Button>
      </div>
    </div>
  );
}

/* ===== StoryExamples ===== */
export function StoryExamplesForm() {
  const { control } = useFormContext<StoryExamplesContent>();
  const stories = useFieldArray({ control, name: "stories" });
  return (
    <div className="space-y-6">
      <TextField<StoryExamplesContent> name="heading" label="Heading" />
      <TextField<StoryExamplesContent>
        name="subheading"
        label="Subheading"
        multiline
        rows={2}
      />
      <div className="space-y-4">
        <p className="text-sm font-semibold">Stories</p>
        {stories.fields.map((field, i) => (
          <div
            key={field.id}
            className="border border-border rounded-lg p-4 space-y-3 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => stories.remove(i)}
              aria-label="Remove story"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid md:grid-cols-2 gap-3">
              <TextField<StoryExamplesContent>
                name={`stories.${i}.title`}
                label="Title"
              />
              <TextField<StoryExamplesContent>
                name={`stories.${i}.character`}
                label="Character"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <TextField<StoryExamplesContent>
                name={`stories.${i}.source`}
                label="Source (what was crafted)"
              />
              <TextField<StoryExamplesContent>
                name={`stories.${i}.theme`}
                label="Theme"
              />
            </div>
            <TextField<StoryExamplesContent>
              name={`stories.${i}.preview`}
              label="Preview text"
              multiline
              rows={5}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            stories.append({
              title: "",
              character: "",
              source: "",
              theme: "",
              preview: "",
            })
          }
        >
          + Add story
        </Button>
      </div>
    </div>
  );
}

/* ===== Mission ===== */
export function MissionForm() {
  return (
    <div className="space-y-6">
      <ImageField<MissionContent> name="icon" label="Icon" />
      <TextField<MissionContent>
        name="quote"
        label="Quote"
        multiline
        rows={6}
      />
    </div>
  );
}

/* ===== ComingNext ===== */
export function ComingNextForm() {
  const { control } = useFormContext<ComingNextContent>();
  const items = useFieldArray({ control, name: "items" });
  return (
    <div className="space-y-6">
      <TextField<ComingNextContent> name="heading" label="Heading" />
      <TextField<ComingNextContent>
        name="subheading"
        label="Subheading"
        multiline
        rows={3}
      />
      <div className="space-y-3">
        <p className="text-sm font-semibold">Items</p>
        {items.fields.map((field, i) => (
          <div
            key={field.id}
            className="grid md:grid-cols-[1fr_2fr_auto] gap-3 items-start"
          >
            <TextField<ComingNextContent>
              name={`items.${i}.title`}
              label="Title"
            />
            <TextField<ComingNextContent>
              name={`items.${i}.description`}
              label="Description"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => items.remove(i)}
              className="mt-7"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => items.append({ title: "", description: "" })}
        >
          + Add item
        </Button>
      </div>
    </div>
  );
}

/* ===== Waitlist ===== */
export function WaitlistForm() {
  return (
    <div className="space-y-6">
      <TextField<WaitlistContent> name="heading" label="Heading" />
      <TextField<WaitlistContent>
        name="subheading"
        label="Subheading"
        multiline
        rows={2}
      />
      <div className="grid md:grid-cols-2 gap-3">
        <TextField<WaitlistContent>
          name="submitLabel"
          label="Submit button label"
        />
        <TextField<WaitlistContent>
          name="submitPending"
          label="Submit button (pending state)"
        />
      </div>
      <TextField<WaitlistContent>
        name="successHeading"
        label="Success heading"
      />
      <TextField<WaitlistContent>
        name="successBody"
        label="Success body"
        multiline
      />
      <TextField<WaitlistContent>
        name="errorBody"
        label="Error message"
        multiline
        rows={2}
      />
    </div>
  );
}

/* ===== Footer ===== */
export function FooterForm() {
  const { control } = useFormContext<FooterContent>();
  const links = useFieldArray({ control, name: "links" });
  return (
    <div className="space-y-6">
      <ImageField<FooterContent> name="icon" label="Icon" />
      <TextField<FooterContent> name="tagline" label="Tagline" />
      <div className="space-y-3">
        <p className="text-sm font-semibold">Links</p>
        {links.fields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <TextField<FooterContent>
                name={`links.${i}.label`}
                label="Label"
              />
              <TextField<FooterContent>
                name={`links.${i}.href`}
                label="Href"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => links.remove(i)}
              className="mt-7"
              aria-label="Remove link"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => links.append({ label: "", href: "" })}
        >
          + Add link
        </Button>
      </div>
      <TextField<FooterContent> name="copyright" label="Copyright" />
    </div>
  );
}

import type { SectionKey } from "@workspace/api-zod";
import type { ReactElement } from "react";

export const SECTION_FORMS: Record<SectionKey, () => ReactElement> = {
  navbar: NavbarForm,
  hero: HeroForm,
  how_it_works: HowItWorksForm,
  showcase: ShowcaseForm,
  story_examples: StoryExamplesForm,
  mission: MissionForm,
  coming_next: ComingNextForm,
  waitlist: WaitlistForm,
  footer: FooterForm,
};
