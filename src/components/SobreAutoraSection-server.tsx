import SobreAutoraSectionClient from './SobreAutoraSection-client';

export default function SobreAutoraSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl bg-accent-dim" />
      <div className="relative max-w-5xl mx-auto">
        <SobreAutoraSectionClient />
      </div>
    </section>
  );
}
