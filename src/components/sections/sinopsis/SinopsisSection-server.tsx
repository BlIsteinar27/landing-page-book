import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import SinopsisCTA from "./SinopsisCTA";

export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm md:text-base tracking-[0.25em] uppercase text-accent mb-8 text-center">
          El Primer Libro
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-lg overflow-hidden outline outline-1 -outline-offset-1 outline-white/10 border-[1px_solid_var(--accent-glow)] shadow-[4px_8px_40px_rgba(0,0,0,0.8)]">
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>

          <Stagger className="flex flex-col gap-6">
            <Enter>
              <h2 className="text-4xl font-display font-black text-ink-primary">
                Los Dos Reinos
              </h2>
            </Enter>

            <Enter className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Fantasía Oscura
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Romance
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Política
              </span>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed">
                En el Reino Central, las gemelas Laila y Liora personifican el
                equilibrio entre la luz y la oscuridad. Sin embargo, su destino
                se fractura cuando Kenan, su creador, destierra a Laila al reino
                Oscuro bajo la tutela del dios de la muerte, Seth Godness.
                Forjada en el dolor y la crueldad, Laila deberá aprender a
                reinar en un mundo que la rechaza.
              </p>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed">
                Más de quinientos años después, el implacable dios Cosmo Godness
                busca una consorte para perpetuar el linaje divino y someter el
                universo. Su mirada recae sobre Aryana, una veterinaria cuya
                fuerza lo cautiva. Atrapada en un pacto divino para salvar a su
                familia de un nido de intrigas celestiales, Aryana deberá
                sobrevivir a la dinastía más peligrosa del cosmos. Los Godness.
              </p>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed italic">
                Los dos reinos es una historia épica de traición, dolor y
                redención, donde la línea entre la luz y la oscuridad
                desaparece, y el amor y la venganza dictan el destino de la
                creación.
              </p>
            </Enter>

            <Enter>
              <p className="text-sm text-ink-secondary inline-flex items-center gap-1.5">
                <BadgeCheck
                  className="w-4 h-4 text-accent"
                  strokeWidth={2}
                  nonScalingStroke
                  aria-hidden
                />
                Ya disponible
              </p>
            </Enter>

            <SinopsisCTA />
          </Stagger>
        </div>
      </div>
    </section>
  );
}
