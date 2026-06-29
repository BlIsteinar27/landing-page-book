'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { motionTokens } from '@/config/motion-tokens';

interface SocialLinkCardProps {
  nombre: string;
  handle: string;
  url: string;
  icon: ReactNode;
  index?: number;
}

export default function SocialLinkCard({ nombre, handle, url, icon, index = 0 }: SocialLinkCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: motionTokens.translate.cardHover }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
      
      {/* Card */}
      <div className="relative flex items-center gap-4 px-8 py-5 rounded-xl bg-surface-2 border border-border-subtle group-hover:border-accent/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base">
        {/* Icon container con efecto cósmico */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md group-hover:bg-accent/30 transition-colors" />
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 group-hover:border-accent/40 transition-all">
            <span className="text-accent group-hover:scale-110 transition-transform">
              {icon}
            </span>
          </div>
        </div>
        
        {/* Text */}
        <div className="text-left">
          <p className="font-semibold text-ink-primary group-hover:text-accent transition-colors">{nombre}</p>
          <p className="text-sm text-ink-tertiary font-mono">{handle}</p>
        </div>
        
        {/* Arrow indicator */}
        <svg className="w-4 h-4 text-ink-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.a>
  );
}
