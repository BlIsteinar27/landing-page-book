import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface-base">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display font-black text-accent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-display font-bold text-ink-primary mb-4">
          Página no encontrada
        </h2>
        <p className="text-ink-secondary mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity shadow-[0_0_24px_var(--accent-glow)]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
