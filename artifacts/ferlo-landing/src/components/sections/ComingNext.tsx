import React from 'react';
import { motion } from 'framer-motion';

export function ComingNext() {
  const items = [
    { title: "Narrated stories", description: "In the child's voice" },
    { title: "Multilingual", description: "Story generation in any language" },
    { title: "Animated shorts", description: "Cartoon videos of their characters" },
    { title: "Family library", description: "A shared shelf of all creations" }
  ];

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-xl"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Coming Next</h2>
            <p className="text-xl text-background/70 mb-8 font-light">
              We are building a magical platform that grows with your child's creativity. This is just the beginning.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <ul className="space-y-6">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-4 pb-6 border-b border-background/10 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-background/60">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}