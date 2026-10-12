import { ArrowDown } from "lucide-react";
import HeroCTAs from "./HeroCTAs";
import HeroBookMockup from "./HeroBookMockup";

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_80%,var(--accent-glow)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left">
            <div className="hero-enter inline-flex items-center gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-border-emphasis bg-accent-dim text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Ya disponible
              </span>
            </div>

            <h1 className="hero-enter hero-enter-2 text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-tighter font-black font-display text-ink-primary">
              Victoria <span className="block text-accent mt-1">Querales</span>
            </h1>

            <h2 className="hero-enter hero-enter-3 text-2xl sm:text-3xl leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-ink-primary">
              Autora de fantasía oscura, política y romántica
            </h2>

            <div className="hero-enter hero-enter-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">11+</span> años
                escribiendo
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">7</span> libros en la
                saga
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                Miles de lecturas en{" "}
                <span className="font-semibold text-ink-primary">Wattpad</span>
              </span>
            </div>

            <div className="hero-enter hero-enter-5 flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 max-w-xl mx-auto lg:mx-0 shadow-lg shadow-accent/5">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase text-accent mb-2 font-semibold">
                    Primer libro
                  </p>
                  <h3 className="text-2xl font-black text-ink-primary mb-2 font-display">
                    Los Dos Reinos
                  </h3>
                  <p className="text-sm italic text-ink-secondary leading-relaxed">
                    "Donde amar es un acto político capaz de cambiar por
                    completo el universo"
                  </p>
                </div>
              </div>
            </div>

            <HeroCTAs />
          </div>
          <HeroBookMockup />
        </div>

        <div className="hero-enter hero-enter-7 mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary">
            <span>Explora el universo</span>
            <div className="hero-arrow-bounce">
              <ArrowDown
                className="w-4 h-4"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
