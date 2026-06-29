import { motion } from 'motion/react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center ${className}`}
    >
      {children}
    </motion.p>
  );
}
