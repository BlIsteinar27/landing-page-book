import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  handle?: string;
  className?: string;
}

export default function SocialLink({ 
  href, 
  icon, 
  label, 
  handle, 
  className = '' 
}: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex items-center gap-4 px-6 py-4 rounded-lg bg-surface-2 border border-border-subtle hover:border-accent transition-colors group ${className}`}
    >
      <span className="text-accent group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <div className="text-left">
        <p className="font-medium text-ink-primary">{label}</p>
        {handle && <p className="text-sm text-ink-tertiary">{handle}</p>}
      </div>
    </motion.a>
  );
}
