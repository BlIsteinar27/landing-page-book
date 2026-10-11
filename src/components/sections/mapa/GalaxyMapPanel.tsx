"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import GalaxyPaths from "./GalaxyPaths";

export default function GalaxyMapPanel({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  // El mapa se descubre en la segunda mitad del capítulo oscuro
  const clipPath = useTransform(
    progress,
    [0.45, 0.75],
    ["inset(0% 50% 0% 50% round 16px)", "inset(0% 0% 0% 0% round 16px)"],
  );
  const opacity = useTransform(progress, [0.45, 0.6], [0, 1]);
  const scale = useTransform(progress, [0.45, 1], [0.92, 1]);

  return (
    <motion.div
      style={{ clipPath, opacity, scale }}
      className="absolute inset-x-4 bottom-24 top-auto md:inset-x-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[38vw] md:max-w-xl aspect-[3986/2631] z-20 rounded-2xl border border-border-default overflow-hidden bg-surface-1/40 backdrop-blur-sm"
    >
      <Image
        src="/landing-book-victoria/mapa-galaxias.webp"
        alt="Mapa de galaxias del universo de Los Dos Reinos"
        fill
        className="object-cover"
        sizes="(min-width: 768px) 38vw, 92vw"
      />
      <GalaxyPaths progress={progress} />
    </motion.div>
  );
}
