import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import SinopsisSectionClient from './SinopsisSection-client';

export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
          El Primer Libro
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-lg overflow-hidden"
              style={{
                border: '1px solid var(--accent-glow)',
                boxShadow: '4px 8px 40px rgba(0,0,0,0.8)',
              }}
            >
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>
          
          <SinopsisSectionClient />
        </div>
      </div>
    </section>
  );
}
