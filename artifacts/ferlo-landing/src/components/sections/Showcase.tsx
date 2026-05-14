import React from 'react';
import { motion } from 'framer-motion';

export function Showcase() {
  const showcases = [
    {
      caption: "Luna's clay rabbit became a brave forest guardian",
      color: "from-green-100 to-emerald-50"
    },
    {
      caption: "Sam's cardboard spaceship became a real explorer",
      color: "from-blue-100 to-sky-50"
    },
    {
      caption: "Maya's watercolor monster became a friendly giant",
      color: "from-orange-100 to-amber-50"
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
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-border mb-6 overflow-hidden">
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${showcase.color} flex flex-col items-center justify-center relative overflow-hidden mb-4`}>
                  {/* TODO: Replace placeholder with real before image */}
                  <div className="w-24 h-24 border-2 border-dashed border-black/10 rounded-xl flex items-center justify-center bg-white/30 backdrop-blur-sm z-10">
                    <span className="text-sm font-medium text-black/40 text-center px-2">Original</span>
                  </div>
                </div>
                
                <div className="flex justify-center -mt-8 mb-2 relative z-20">
                  <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-border text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center relative overflow-hidden`}>
                  {/* TODO: Replace placeholder with real after image */}
                  <div className="w-32 h-32 border border-primary/20 rounded-xl flex items-center justify-center bg-white/60 backdrop-blur-md z-10 shadow-lg">
                    <span className="text-sm font-medium text-primary text-center px-2">Character</span>
                  </div>
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