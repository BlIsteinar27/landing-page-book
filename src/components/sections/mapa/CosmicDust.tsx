"use client";

import { motion } from "motion/react";

// Tabla fija (determinista, SSR-safe): x%, y%, tamaño, delay, duración
const DUST = [
  { x: 8, y: 20, s: 2.2, d: 0.0, t: 5.2 }, { x: 22, y: 65, s: 1.4, d: 0.8, t: 6.1 },
  { x: 35, y: 15, s: 2.8, d: 1.6, t: 4.8 }, { x: 47, y: 80, s: 1.6, d: 0.4, t: 6.8 },
  { x: 58, y: 30, s: 2.0, d: 2.1, t: 5.5 }, { x: 66, y: 55, s: 1.2, d: 1.1, t: 7.0 },
  { x: 74, y: 12, s: 2.5, d: 0.6, t: 5.0 }, { x: 82, y: 70, s: 1.8, d: 1.9, t: 6.3 },
  { x: 90, y: 40, s: 1.5, d: 0.2, t: 5.8 }, { x: 15, y: 85, s: 2.4, d: 2.5, t: 4.6 },
  { x: 42, y: 45, s: 1.3, d: 1.4, t: 6.6 }, { x: 70, y: 88, s: 2.1, d: 0.9, t: 5.4 },
];

export default function CosmicDust() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {DUST.map((p, i) => (
        <motion.span
          key={`dust-${i}`}
          className="absolute rounded-full bg-accent/30 blur-[1px]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.t,
            repeat: Infinity,
            delay: p.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
