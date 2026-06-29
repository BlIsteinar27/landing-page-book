'use client';

import { motion } from 'motion/react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
        <p className="text-ink-secondary text-sm">Cargando...</p>
      </div>
    </div>
  );
}
