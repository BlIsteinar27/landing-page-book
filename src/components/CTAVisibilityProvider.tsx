"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CTAVisibilityContextValue {
  register: (id: string) => void;
  unregister: (id: string) => void;
  setVisible: (id: string, visible: boolean) => void;
  anyVisible: boolean;
}

const CTAVisibilityContext = createContext<CTAVisibilityContextValue | null>(
  null,
);

export function useCTAVisibility() {
  const ctx = useContext(CTAVisibilityContext);
  if (!ctx)
    throw new Error(
      "useCTAVisibility debe usarse dentro de CTAVisibilityProvider",
    );
  return ctx;
}

export function CTAVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  // Visible por defecto: evita que la barra sticky parpadee antes de que el observer mida
  const register = (id: string) =>
    setVisibility((prev) => ({ ...prev, [id]: true }));
  const unregister = (id: string) =>
    setVisibility((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  const setVisible = (id: string, visible: boolean) =>
    setVisibility((prev) => ({ ...prev, [id]: visible }));

  // Sin CTAs registrados todavía (SSR / primer render) se asume visible
  const states = Object.values(visibility);
  const anyVisible = states.length === 0 || states.some(Boolean);

  return (
    <CTAVisibilityContext
      value={{ register, unregister, setVisible, anyVisible }}
    >
      {children}
    </CTAVisibilityContext>
  );
}
