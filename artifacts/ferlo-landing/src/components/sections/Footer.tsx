import type { FooterContent } from "@workspace/api-zod";

export function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center">
        <a href="#" className="mb-4">
          <img
            src={content.icon.url}
            alt={content.icon.alt}
            width={content.icon.width}
            height={content.icon.height}
            loading="lazy"
            decoding="async"
            className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity dark:brightness-110"
          />
        </a>

        <p className="text-lg font-semibold text-foreground mb-8">{content.tagline}</p>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-muted-foreground font-medium">
          {content.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60">{content.copyright}</p>
      </div>
    </footer>
  );
}
