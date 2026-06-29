import HeroSection from '@/components/sections/hero/HeroSection';
import SobreLibroSection from '@/components/sections/sinopsis/SinopsisSection-server';
import PersonajesSection from '@/components/sections/personajes/PersonajesSection-server';
import InteractiveMapSection from '@/components/sections/mapa/InteractiveMapSection-server';
import SagaSection from '@/components/sections/saga/SagaSection-server';
import SobreAutoraSection from '@/components/sections/autora/SobreAutoraSection-server';
// import ComunidadSection from '@/components/sections/comunidad/ComunidadSection';
import ContactoSection from '@/components/sections/contacto/ContactoSection';
import Footer from '@/components/sections/footer/Footer';
import StickyCTA from '@/components/StickyCTA';
import SchemaMarkup from '@/components/SchemaMarkup';

export const revalidate = 3600; // Revalidar cada hora

export default function Home() {
  return (
    <>
      <SchemaMarkup />
      <HeroSection />
      <SobreLibroSection />
      <PersonajesSection />
      <InteractiveMapSection />
      <SagaSection />
      <SobreAutoraSection />
      {/* <ComunidadSection /> */}
      {/* <TestimoniosSection /> */}
      <ContactoSection />
      <Footer />
      <StickyCTA />
    </>
  );
}
