"use client";

import { motion } from "motion/react";
import HeroTitle from "./HeroTitle";
import HeroCTAs from "./HeroCTAs";
import HeroBookMockup from "./HeroBookMockup";

const heroColumnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_80%,var(--accent-glow)_0%,transparent_70%)]"
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left"
            variants={heroColumnVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle />
            <HeroCTAs />
          </motion.div>
          <HeroBookMockup />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-tertiary">
            <span>Explora el universo</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
