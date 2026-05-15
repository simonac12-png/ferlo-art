import React from 'react';
import { motion } from 'framer-motion';

export function StoryExamples() {
  const stories = [
    {
      title: "The Robot Who Learned to Feel",
      character: "Beepo",
      source: "a child's clay robot",
      theme: "What is AI?",
      preview: "Beepo was built with shiny metal and a very big heart. But when he met a sad little bird, he didn't know how to compute sadness. With a little help, Beepo learns that some things can't be calculated—they just have to be felt."
    },
    {
      title: "The Wobbly Tower",
      character: "Stony",
      source: "a pebble tower",
      theme: "Creativity & Problem Solving",
      preview: "Stony was the tallest tower in the garden, but the wind kept knocking him down! Instead of giving up, Stony figures out a new way to stack himself, learning that building something new sometimes means looking at the pieces differently."
    },
    {
      title: "The Rainbow Weaver",
      character: "Lumie",
      source: "a yarn craft",
      theme: "Kindness",
      preview: "Lumie loved spinning bright, colorful threads. When the town lost its colors to a gloomy storm, Lumie realized that sharing her colorful threads made the world bright again. A story about giving and the warmth of sharing."
    }
  ];

  return (
    <section className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">More than a picture</h2>
          <p className="text-xl text-muted-foreground">Every character stars in a personalized story that sparks imagination and teaches gentle lessons.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">{story.title}</h3>
                  <div className="inline-block px-3 py-1 bg-accent/10 text-accent dark:text-accent-foreground text-xs font-semibold rounded-full border border-accent/20">
                    Theme: {story.theme}
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-muted/40 rounded-2xl border border-border">
                <p className="text-sm font-medium text-foreground">
                  Starring <span className="text-primary font-bold">{story.character}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Brought to life from {story.source}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed italic relative">
                  <span className="text-3xl text-primary/30 absolute -top-2 -left-2">"</span>
                  <span className="relative z-10">{story.preview}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
