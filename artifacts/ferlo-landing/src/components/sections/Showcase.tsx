import React from 'react';
import { motion } from 'framer-motion';

export function Showcase() {
  const showcases = [
    {
      caption: "Luna's clay rabbit became a brave forest guardian",
      beforeGradient: "from-emerald-100/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/20",
      afterGradient: "from-primary/10 to-secondary/10",
      beforeImage: "/showcase-luna-original.jpg",
      afterImage: "/showcase-luna-character.png"
    },
    {
      caption: "Sam's cardboard spaceship became a real explorer",
      beforeGradient: "from-sky-100/80 to-blue-50/80 dark:from-sky-900/30 dark:to-blue-900/20",
      afterGradient: "from-secondary/10 to-primary/10",
      beforeImage: "/showcase-sam-original.jpg",
      afterImage: "/showcase-sam-character.png"
    },
    {
      caption: "Ferdi's watercolor monster became a friendly giant",
      beforeGradient: "from-amber-100/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/20",
      afterGradient: "from-accent/10 to-primary/10",
      beforeImage: "/showcase-ferdi-original.jpg",
      afterImage: "/showcase-ferdi-character.png"
    }
  ];

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
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-3xl p-4 shadow-sm border border-border mb-6 overflow-hidden">
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${showcase.beforeGradient} flex items-center justify-center relative overflow-hidden mb-4`}>
                  <img src={showcase.beforeImage} alt="Original artwork" className="w-full h-full object-cover" />
                </div>

                <div className="flex justify-center -mt-8 mb-2 relative z-20">
                  <div className="w-10 h-10 bg-card rounded-full shadow-md flex items-center justify-center border border-border text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${showcase.afterGradient} flex items-center justify-center relative overflow-hidden`}>
                  <img src={showcase.afterImage} alt="FerLo character" className="w-full h-full object-cover" />
                </div>
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
