import Image from 'next/image';
import SagaSectionClient from './SagaSection-client';

const libros = [
  { titulo: 'Los Dos Reinos', estado: 'Octubre 2026', actual: true },
  { titulo: 'Libro 2', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 3', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 4', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 5', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 6', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 7', estado: 'Próximamente', actual: false },
];

export default function SagaSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-1">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      
      <div className="relative max-w-6xl mx-auto">
        <SagaSectionClient libros={libros} />
      </div>
    </section>
  );
}
