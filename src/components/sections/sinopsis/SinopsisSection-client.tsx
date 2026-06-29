'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/ui/CTAButton';
import { useRegisterCTA } from '@/hooks/useRegisterCTA';

export default function SinopsisSectionClient() {
  const ref = useRegisterCTA('sinopsis-cta');
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-4xl font-display font-black text-ink-primary">
        Los Dos Reinos
      </h2>
      
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Fantasía Oscura
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Romance
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Política
        </span>
      </div>
      
      <p className="text-ink-secondary leading-relaxed">
        En el Reino Central, las gemelas Laila y Liora personifican el equilibrio entre la luz y la oscuridad. Sin embargo, su destino se fractura cuando Kenan, su creador, destierra a Laila al reino Oscuro bajo la tutela del dios de la muerte, Seth Godness. Forjada en el dolor y la crueldad, Laila deberá aprender a reinar en un mundo que la rechaza.
      </p>
      
      <p className="text-ink-secondary leading-relaxed">
        Más de quinientos años después, el implacable dios Cosmo Godness busca una consorte para perpetuar el linaje divino y someter el universo. Su mirada recae sobre Aryana, una veterinaria cuya fuerza lo cautiva. Atrapada en un pacto divino para salvar a su familia de un nido de intrigas celestiales, Aryana deberá sobrevivir a la dinastía más peligrosa del cosmos. Los Godness.
      </p>
      
      <p className="text-ink-secondary leading-relaxed italic">
        Los dos reinos es una historia épica de traición, dolor y redención, donde la línea entre la luz y la oscuridad desaparece, y el amor y la venganza dictan el destino de la creación.
      </p>
      
      <p className="text-sm text-ink-tertiary">
        📅 Lanzamiento: Octubre 2026
      </p>
      
      <div ref={ref} className="flex flex-col sm:flex-row gap-3 pt-4">
        <CTAButton variant="whatsapp" text="Reserva Los Dos Reinos" />
        {/* Amazon comentado hasta tener el enlace oficial del producto */}
        {/* <CTAButton variant="primary" text="Comprar en Amazon" /> */}
      </div>
    </motion.div>
  );
}
