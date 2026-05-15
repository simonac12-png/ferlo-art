import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center">
        <a href="#" className="mb-4">
          <img
            src="/ferlo-icon.png"
            alt="FerLo Icon"
            className="h-10 opacity-80 hover:opacity-100 transition-opacity dark:brightness-110"
          />
        </a>

        <p className="text-lg font-semibold text-foreground mb-8">Where art meets AI</p>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-muted-foreground font-medium">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
          <a href="#" className="hover:text-primary transition-colors">Instagram</a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          © 2025 FerLo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
