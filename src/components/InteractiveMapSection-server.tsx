import InteractiveMapSectionClient from './InteractiveMapSection-client';

const libros = [
  { titulo: 'Los Dos Reinos', estado: 'Octubre 2026', actual: true },
  { titulo: 'Libro 2', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 3', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 4', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 5', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 6', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 7', estado: 'Próximamente', actual: false },
];

export default function InteractiveMapSection() {
  return (
    <section id="mapa-interactivo" className="relative">
      {/* Título de la sección - visible antes del scroll de reinos */}
      <div className="relative z-50 bg-surface-base py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4">
            El Cono Cósmico
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-black text-accent mb-6">
            Explora el Universo
          </h2>
          <p className="text-base md:text-lg text-ink-secondary max-w-2xl mx-auto">
            Descubre los tres reinos donde se desarrolla la saga. Desliza para explorar cada nivel del universo.
          </p>
        </div>
      </div>
      
      <InteractiveMapSectionClient libros={libros} />
    </section>
  );
}
