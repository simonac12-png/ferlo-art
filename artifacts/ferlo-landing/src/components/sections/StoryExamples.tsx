import { motion } from 'framer-motion';
import type { StoryExamplesContent } from '@workspace/api-zod';

export function StoryExamples({ content }: { content: StoryExamplesContent }) {
  return (
    <section className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{content.heading}</h2>
          <p className="text-xl text-muted-foreground">{content.subheading}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.stories.map((story, index) => (
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
