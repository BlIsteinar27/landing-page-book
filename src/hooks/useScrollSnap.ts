import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollSnapOptions {
  snapPoints: number;
}

export function useScrollSnap({ snapPoints }: UseScrollSnapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIndexRef = useRef(0);
  const [isInSection, setIsInSection] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observar los snap points usando viewport como root
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
            
            previousIndexRef.current = index;
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    const snapElements = container.querySelectorAll('[data-snap-point]');
    snapElements.forEach((point) => observer.observe(point));

    // Observar si la sección entera está en viewport
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInSection(entry.isIntersecting && entry.intersectionRatio > 0.3);
        });
      },
      { root: null, threshold: 0.3 }
    );
    sectionObserver.observe(container);

    return () => {
      snapElements.forEach((point) => observer.unobserve(point));
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, [snapPoints]);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const snapPoint = container.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (snapPoint) {
      snapPoint.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return { containerRef, activeIndex, scrollToIndex, isInSection };
}
