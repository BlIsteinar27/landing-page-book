'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface-base">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-display font-black text-accent mb-4">
          Algo salió mal
        </h1>
        <p className="text-ink-secondary mb-8">
          {error.message || 'Ha ocurrido un error inesperado.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-white hover:opacity-90 transition-opacity"
          style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
