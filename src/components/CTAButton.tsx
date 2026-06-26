'use client';

import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { LINKS } from '@/config/links';

interface CTAButtonProps {
  variant: 'amazon' | 'whatsapp' | 'primary';
  className?: string;
  text?: string;
}

const sharedMotion = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
};

export default function CTAButton({ variant, className = '', text }: CTAButtonProps) {
  if (variant === 'primary') {
    return (
      <motion.a
        href={LINKS.amazon}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedMotion}
        className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
      >
        <ShoppingBag className="w-4 h-4" />
        {text || 'Comprar en Amazon'}
      </motion.a>
    );
  }

  if (variant === 'amazon') {
    return (
      <motion.a
        href={LINKS.amazon}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedMotion}
        className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
      >
        <ShoppingBag className="w-4 h-4" />
        Comprar en Amazon
      </motion.a>
    );
  }

  return (
    <motion.a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      {...sharedMotion}
      className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-medium text-sm rounded-2xl bg-surface-2 text-ink-primary border border-border-emphasis hover:bg-surface-3 transition-colors ${className}`}
    >
      <MessageCircle className="w-4 h-4 text-[#25D366]" />
      Comprar por WhatsApp
    </motion.a>
  );
}
