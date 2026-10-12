"use client";

import { ReactNode, useId } from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronRight, MessageCircle, ShoppingBag, X } from "lucide-react";
import Portal from "@/components/Portal";
import { useDialog } from "@/hooks/useDialog";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { LINKS } from "@/config/links";
import { motionTokens } from "@/config/motion-tokens";

function CanalOption({
  href,
  icon,
  titulo,
  detalle,
  accentHover,
}: {
  href: string;
  icon: ReactNode;
  titulo: string;
  detalle: string;
  accentHover: string;
}) {
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: motionTokens.scale.tap }}
      transition={motionTokens.press}
      className={`group flex items-center gap-4 px-5 py-4 rounded-xl bg-surface-2 border border-border-subtle ${accentHover} transition-colors`}
    >
      {icon}
      <span className="flex-1 text-left">
        <span className="block font-semibold text-ink-primary">{titulo}</span>
        <span className="block text-sm text-ink-secondary">{detalle}</span>
      </span>
      <ChevronRight
        className="w-4 h-4 text-ink-tertiary group-hover:text-accent group-hover:translate-x-1 transition-[color,translate]"
        strokeWidth={2}
        nonScalingStroke
        aria-hidden
      />
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </m.a>
  );
}

export default function CompraDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const ref = useDialog<HTMLDivElement>(open, onClose);
  useLockBodyScroll(open);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.fast }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden
            />
            <m.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={motionTokens.spring}
              className="relative w-full max-w-md rounded-2xl bg-surface-1 border border-border-default p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar selector de compra"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-2 transition-colors"
              >
                <X
                  className="w-4 h-4"
                  strokeWidth={2}
                  nonScalingStroke
                  aria-hidden
                />
              </button>

              <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">
                Comprar
              </p>
              <h2
                id={titleId}
                className="text-2xl font-display font-black text-ink-primary mb-2"
              >
                ¿Desde dónde lo compras?
              </h2>
              <p className="text-sm text-ink-secondary mb-6">
                Los Dos Reinos llega por dos canales según tu país.
              </p>

              <div className="flex flex-col gap-3">
                <CanalOption
                  href={LINKS.whatsapp}
                  titulo="Estoy en Venezuela"
                  detalle="Haz tu pedido por WhatsApp · coordinas pago y entrega con la autora"
                  accentHover="hover:border-whatsapp/60"
                  icon={
                    <span className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-whatsapp/15 border border-whatsapp/30">
                      <MessageCircle
                        className="w-5 h-5 text-whatsapp"
                        strokeWidth={2}
                        nonScalingStroke
                        aria-hidden
                      />
                    </span>
                  }
                />
                <CanalOption
                  href={LINKS.amazon}
                  titulo="Estoy fuera de Venezuela"
                  detalle="Cómpralo en Amazon · tapa blanda o Kindle"
                  accentHover="hover:border-accent/50"
                  icon={
                    <span className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-accent/10 border border-accent/30">
                      <ShoppingBag
                        className="w-5 h-5 text-accent"
                        strokeWidth={2}
                        nonScalingStroke
                        aria-hidden
                      />
                    </span>
                  }
                />
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
