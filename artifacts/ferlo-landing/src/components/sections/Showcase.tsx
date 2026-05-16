import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ShowcaseContent } from '@workspace/api-zod';

function ShowcaseImage({ src, alt, gradient }: { src: string; alt: string; gradient: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <span className="text-sm font-medium text-muted-foreground/80 px-3 py-1 rounded-full bg-background/60 backdrop-blur">
          Coming soon
        </span>
      )}
    </div>
  );
}

export function Showcase({ content }: { content: ShowcaseContent }) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{content.heading}</h2>
          <p className="text-xl text-muted-foreground">{content.subheading}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.cards.map((card, index) => (
            <motion.div
              key={`${card.beforeImage.url}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-3xl p-4 shadow-sm border border-border mb-6 overflow-hidden">
                <ShowcaseImage
                  src={card.beforeImage.url}
                  alt={card.beforeImage.alt || `${card.caption} — original`}
                  gradient={card.beforeGradient}
                />

                <div className="flex justify-center -mt-8 mb-2 relative z-20">
                  <div className="w-10 h-10 bg-card rounded-full shadow-md flex items-center justify-center border border-border text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <ShowcaseImage
                  src={card.afterImage.url}
                  alt={card.afterImage.alt || `${card.caption} — FerLo character`}
                  gradient={card.afterGradient}
                />
              </div>
              <p className="text-center text-muted-foreground font-medium px-4">
                "{card.caption}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
