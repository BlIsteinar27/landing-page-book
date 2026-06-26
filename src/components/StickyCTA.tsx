'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { LINKS } from '@/config/links';

export default function StickyCTA() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const update = (entries: IntersectionObserverEntry[]) => {
      setShowSticky(entries.every((e) => !e.isIntersecting));
    };

    const observer = new IntersectionObserver(update, { threshold: 0 });

    const targets = document.querySelectorAll('[data-cta-block]');
    targets.forEach((el) => observer.observe(el));

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
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:hidden"
          style={{
            background: 'linear-gradient(to top, var(--surface-base) 70%, transparent)',
          }}
        >
          <motion.a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center justify-center gap-2.5 w-full py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            style={{ boxShadow: '0 0 30px var(--accent-glow)' }}
          >
            <ShoppingBag className="w-4 h-4" />
            Consigue tu libro ahora
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
