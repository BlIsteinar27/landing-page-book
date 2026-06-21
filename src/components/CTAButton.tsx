'use client';

import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { formatWhatsAppLink } from '@/utils/whatsapp';
import { AMAZON_URL } from '@/config/links';

interface CTAButtonProps {
  variant: 'amazon' | 'whatsapp';
  amazonUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  className?: string;
}

const WHATSAPP_DEFAULT_NUMBER = '584244252248';
const WHATSAPP_DEFAULT_MESSAGE = 'si lees esto es porque soy demasiado bueno programando';

export default function CTAButton({
  variant,
  amazonUrl = AMAZON_URL,
  whatsappNumber = WHATSAPP_DEFAULT_NUMBER,
  whatsappMessage = WHATSAPP_DEFAULT_MESSAGE,
  className = '',
}: CTAButtonProps) {
  const sharedMotion = {
    whileTap: { scale: 0.96 as number },
    whileHover: { scale: 1.02 as number },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  };

  if (variant === 'amazon') {
    return (
      <motion.a
        href={amazonUrl}
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
      href={formatWhatsAppLink(whatsappNumber, whatsappMessage)}
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
