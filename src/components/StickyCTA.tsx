'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { LINKS } from '@/config/links';

export default function StickyCTA() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const ctaBlocks = document.querySelectorAll('[data-cta-block]');
    if (ctaBlocks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ocultar sticky si CUALQUIERA de los bloques CTA está visible
        const anyVisible = entries.some(entry => entry.isIntersecting);
        setShowSticky(!anyVisible);
      },
      { 
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    ctaBlocks.forEach(block => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:hidden"
          style={{
            background: 'linear-gradient(to top, var(--surface-base) 70%, transparent)',
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            {/* Botón Amazon - COMENTADO temporalmente hasta tener el link real */}
            {/* <motion.a
              href={LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center gap-2 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              style={{ boxShadow: '0 0 30px var(--accent-glow)' }}
            >
              <ShoppingBag className="w-4 h-4" />
              Amazon
            </motion.a> */}
            
            {/* Placeholder para mantener el grid mientras Amazon está comentado */}
            <div className="flex items-center justify-center py-4 rounded-2xl bg-surface-2 border border-border-subtle opacity-50">
              <ShoppingBag className="w-4 h-4 text-ink-tertiary" />
              <span className="ml-2 text-xs text-ink-tertiary">Próximamente</span>
            </div>

            {/* Botón WhatsApp - ACTIVO */}
            <motion.a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center gap-2 py-4 font-semibold text-sm rounded-2xl bg-[#25D366] text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              <MessageCircle className="w-4 h-4" />
              Reservar ahora
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
