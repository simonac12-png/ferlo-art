import React from 'react';
import { motion } from 'framer-motion';

export function Mission() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-10"
          >
            <img src="/ferlo-icon.png" alt="FerLo Icon" className="h-20 w-20 opacity-80 dark:brightness-110" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-relaxed"
          >
            "FerLo brings children's handcrafted creations to life through AI-powered characters and stories. It helps children feel proud of their imagination while gently teaching them what AI is, how it works, and how it can support human creativity."
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
