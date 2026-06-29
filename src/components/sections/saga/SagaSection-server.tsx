import SagaSectionClient from './SagaSection-client';
import { libros } from '@/data/libros';

export default function SagaSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <SagaSectionClient libros={libros} />
      </div>
    </section>
  );
}
