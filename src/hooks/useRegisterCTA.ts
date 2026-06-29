"use client";

import { useEffect, useRef } from "react";
import { useCTAVisibility } from "@/components/CTAVisibilityProvider";

export function useRegisterCTA(id: string) {
  const { register, unregister, setVisible } = useCTAVisibility();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    register(id);
    return () => unregister(id);
  }, [id, register, unregister]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(id, entry.isIntersecting),
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, setVisible]);

  return ref;
}
