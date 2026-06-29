import Image from 'next/image';
import PersonajesSectionClient from './PersonajesSection-client';

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 overflow-hidden bg-surface-base">
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(114, 74, 165, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        <PersonajesSectionClient />
      </div>
    </section>
  );
}
