"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface-base">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-display font-black text-accent mb-4">
          No pudimos cargar la página
        </h1>
        <p className="text-ink-secondary mb-8">
          Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-[opacity,scale] duration-150 ease-out enabled:active:scale-[0.96] shadow-[0_0_24px_var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
