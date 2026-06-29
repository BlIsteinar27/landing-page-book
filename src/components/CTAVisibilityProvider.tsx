"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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

  const register = useCallback(
    (id: string) => setVisibility((prev) => ({ ...prev, [id]: false })),
    [],
  );
  const unregister = useCallback(
    (id: string) =>
      setVisibility((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      }),
    [],
  );
  const setVisible = useCallback(
    (id: string, visible: boolean) =>
      setVisibility((prev) => ({ ...prev, [id]: visible })),
    [],
  );

  const anyVisible = Object.values(visibility).some(Boolean);

  return (
    <CTAVisibilityContext.Provider
      value={{ register, unregister, setVisible, anyVisible }}
    >
      {children}
    </CTAVisibilityContext.Provider>
  );
}
