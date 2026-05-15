import { useState } from 'react';
import { motion } from 'framer-motion';

type Showcase = {
  caption: string;
  beforeGradient: string;
  afterGradient: string;
  beforeImage: string;
  afterImage: string;
};

// Expected assets under /public (cards gracefully fall back to "Coming soon" if a file is missing).
// Target: JPEGs ≤ 400 KB, PNGs (transparent characters) ≤ 500 KB, 1200–1400 px on the long edge.
const showcases: Showcase[] = [
  {
    caption: "Ferdi's watercolor monster became a friendly giant",
    beforeGradient: "from-amber-100/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/20",
    afterGradient: "from-accent/10 to-primary/10",
    beforeImage: "/showcase-ferdi-original.jpg",
    afterImage: "/showcase-ferdi-character.png",
  },
  {
    caption: "Leo's clay rabbit became a brave forest guardian",
    beforeGradient: "from-emerald-100/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/20",
    afterGradient: "from-primary/10 to-secondary/10",
    beforeImage: "/showcase-leo-original.jpg",
    afterImage: "/showcase-leo-character.png",
  },
  {
    caption: "Max's cardboard spaceship became a real explorer",
    beforeGradient: "from-sky-100/80 to-blue-50/80 dark:from-sky-900/30 dark:to-blue-900/20",
    afterGradient: "from-secondary/10 to-primary/10",
    beforeImage: "/showcase-max-original.jpg",
    afterImage: "/showcase-max-character.png",
  },
];

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

export function Showcase() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Honoring every detail</h2>
          <p className="text-xl text-muted-foreground">We don't fix their art. We bring their exact imagination to life.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {showcases.map((showcase, index) => (
            <motion.div
              key={showcase.beforeImage}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-3xl p-4 shadow-sm border border-border mb-6 overflow-hidden">
                <ShowcaseImage
                  src={showcase.beforeImage}
                  alt={`${showcase.caption} — original`}
                  gradient={showcase.beforeGradient}
                />

                <div className="flex justify-center -mt-8 mb-2 relative z-20">
                  <div className="w-10 h-10 bg-card rounded-full shadow-md flex items-center justify-center border border-border text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <ShowcaseImage
                  src={showcase.afterImage}
                  alt={`${showcase.caption} — FerLo character`}
                  gradient={showcase.afterGradient}
                />
              </div>
              <p className="text-center text-muted-foreground font-medium px-4">
                "{showcase.caption}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
