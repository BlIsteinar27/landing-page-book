import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-8 py-12 pb-32 md:pb-28 lg:pb-16 bg-surface-2 border-t border-border-subtle">
      <Stagger className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center">
        <Enter>
          <p className="font-display text-lg font-bold text-accent">
            Victoria Querales
          </p>
        </Enter>
        <Enter>
          <p className="text-sm text-ink-secondary">
            Autora de Dioses Universales
          </p>
        </Enter>
        <Enter>
          <p className="text-xs text-ink-secondary mt-4">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>
        </Enter>
      </Stagger>
    </footer>
  );
}
