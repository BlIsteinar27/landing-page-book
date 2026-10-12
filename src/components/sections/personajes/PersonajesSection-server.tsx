import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import PersonajesSectionClient from "./PersonajesSection-client";

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(114,74,165,0.15)_0%,transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto">
        <Stagger>
          <Enter className="text-sm md:text-base tracking-[0.25em] uppercase text-accent mb-8 text-center">
            <p>Los Protagonistas</p>
          </Enter>

          <Enter>
            <h2 className="text-3xl md:text-4xl font-display font-black text-center mb-16 text-ink-primary">
              Conoce a los Personajes Principales
            </h2>
          </Enter>
        </Stagger>

        <PersonajesSectionClient />

        <Stagger className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3">
          <Enter>
            <p className="text-base text-ink-secondary leading-relaxed">
              Dioses con el poder de doblar el destino del universo. Decisiones
              que no solo mueven reinos, sino que reescriben las leyes de lo
              divino.
            </p>
          </Enter>
          <Enter>
            <p className="text-sm text-ink-secondary italic font-serif">
              Dioses Universales — Los Dos Reinos
            </p>
          </Enter>
        </Stagger>
      </div>
    </section>
  );
}
