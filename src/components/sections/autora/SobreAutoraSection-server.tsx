import Image from "next/image";
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";

const credenciales = [
  { valor: "11+", label: "Años escribiendo" },
  { valor: "7", label: "Libros en la saga" },
  { valor: "2026", label: "Lanzamiento oficial" },
];

export default function SobreAutoraSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl bg-accent-dim" />
      <div className="relative max-w-5xl mx-auto">
        <Stagger viewport={{ once: true, margin: "-80px" }}>
          <Enter className="text-xs tracking-[0.25em] uppercase font-medium mb-14 text-center text-accent">
            <p>La autora</p>
          </Enter>
        </Stagger>

        <Stagger
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center"
          viewport={{ once: true, margin: "-60px" }}
        >
          <Enter className="md:col-span-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--accent)_0%,transparent_60%,var(--accent)_100%)] p-[2px]" />
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-border-emphasis shadow-[0_0_40px_var(--accent-glow)]">
                <Image
                  src="/landing-book-victoria/foto-escritora.jpg"
                  alt="Victoria Querales - Autora de la saga Dioses Universales"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
                />
              </div>
            </div>
          </Enter>

          <Stagger className="md:col-span-8 flex flex-col gap-6 text-center md:text-left">
            <Enter>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight font-display text-ink-primary">
                Victoria Querales
              </h2>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                Soy Licenciada en Comunicación Social con mención en Periodismo
                Audiovisual, y llevo más de una década construyendo universos
                desde la palabra. Mi relación con la escritura creativa comenzó
                en 2015, impulsada por una pregunta que siempre me acompañó:
                ¿qué hay más allá de la comprensión humana?
              </p>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                En 2019 compartí los primeros borradores de mi saga Dioses
                Universales — publicando el primer libro, Los Dos Reinos en
                Wattpad — donde una comunidad de lectores acompañó el nacimiento
                de este universo. Tras años de trabajo y dedicación, cerré la
                saga en 2024 con siete libros que conforman una historia épica
                sobre poder, familia y destino.
              </p>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                Actualmente, la saga se encuentra en proceso de edición
                profesional, y su primer volumen llegará a manos de los lectores
                en octubre de 2026. Los borradores originales de Wattpad ya no
                están disponibles, pues esta nueva etapa trae consigo una
                versión pulida y definitiva de mi universo.
              </p>
            </Enter>
            <Enter>
              <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
                "Desde niña, me inventaba historias para tranquilizar la soledad
                de mi mente inquieta. Siempre estaba en las nubes, imaginando
                cómo se creó el universo y si de verdad existen seres poderosos
                capaces de mantener el orden más allá de la comprensión humana.
                Por ese motivo, hace 11 años comencé los primeros borradores de
                lo que hoy es mi saga Dioses Universales — porque algunas
                preguntas solo encuentran respuesta cuando las conviertes en un
                mundo propio."
              </blockquote>
            </Enter>

            <Stagger className="grid grid-cols-3 gap-4 mt-2 pt-6 border-t border-border-subtle">
              {credenciales.map((c) => (
                <Enter key={c.label} className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-display text-accent">
                    {c.valor}
                  </span>
                  <span className="text-xs leading-tight text-ink-secondary">
                    {c.label}
                  </span>
                </Enter>
              ))}
            </Stagger>
          </Stagger>
        </Stagger>
      </div>
    </section>
  );
}
