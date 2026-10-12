import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import SagaSectionClient from "./SagaSection-client";
import { libros } from "@/data/libros";

export default function SagaSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <Stagger>
          <Enter className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
            <p>La Saga Completa</p>
          </Enter>

          <Enter>
            <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-6 text-ink-primary">
              Dioses Universales
            </h2>
          </Enter>

          <Enter>
            <p className="text-center text-ink-secondary max-w-2xl mx-auto mb-16">
              Una saga que cuenta el ascenso, la conquista y los vínculos
              familiares de los dioses regentes del universo. Siete libros que
              conforman una historia épica sobre poder, familia y destino.
            </p>
          </Enter>
        </Stagger>

        <SagaSectionClient libros={libros} />
      </div>
    </section>
  );
}
