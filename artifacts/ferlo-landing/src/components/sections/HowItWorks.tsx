import React from 'react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload a creation",
      description: "Take a photo of a drawing, clay figure, nature build, or any handmade project.",
      color: "bg-primary/20 text-primary"
    },
    {
      number: "02",
      title: "FerLo brings it to life",
      description: "AI transforms the creation into a beautiful character while preserving the child's original shapes and imperfections. We honor every handmade detail.",
      color: "bg-secondary/20 text-secondary"
    },
    {
      number: "03",
      title: "Receive a personalized story",
      description: "The character stars in a gentle story that sparks imagination and helps children understand AI in an age-appropriate way.",
      color: "bg-accent/20 text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How it works</h2>
          <p className="text-xl text-muted-foreground">From a physical craft to a magical story in three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10"></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-6 ${step.color} border-8 border-white shadow-sm`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}