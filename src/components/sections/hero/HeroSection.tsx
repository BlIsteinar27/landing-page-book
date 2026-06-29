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
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 80%, var(--accent-glow) 0%, transparent 70%)",
        }}
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
      </div>
    </section>
  );
}
