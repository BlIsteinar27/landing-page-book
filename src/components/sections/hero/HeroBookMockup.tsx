import Image from "next/image";

export default function HeroBookMockup() {
  return (
    <div className="lg:col-span-4 flex justify-center lg:justify-end">
      <div className="mockup-enter relative [perspective:800px]">
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl bg-accent-glow opacity-60" />

        <div className="hero-float relative w-48 sm:w-52 md:w-56 aspect-[2/3]">
          <div className="absolute left-0 top-2 bottom-2 w-5 rounded-l-sm [transform:translateX(-14px)_skewY(-0.5deg)] [transform-origin:right] bg-[linear-gradient(to_right,var(--color-purple-medium),var(--accent))]" />

          <div className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden outline outline-1 -outline-offset-1 outline-white/10 flex flex-col justify-between p-7 bg-[linear-gradient(145deg,var(--surface-base)_0%,var(--surface-2)_40%,var(--surface-base)_100%)] border-[1px_solid_var(--accent-glow)] shadow-[4px_8px_40px_rgba(0,0,0,0.8),inset_0_0_60px_var(--accent-dim)]">
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-px bg-accent" />
              <div className="w-4 h-px bg-accent opacity-50" />
            </div>

            <div className="absolute inset-0">
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                className="object-cover"
                priority
                loading="eager"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 208px, 224px"
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="w-4 h-px bg-accent opacity-50" />
              <div className="w-8 h-px bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
