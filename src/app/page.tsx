import HeroSection from '@/components/HeroSection';
import SobreLibroSection from '@/components/SinopsisSection-server';
import PersonajesSection from '@/components/PersonajesSection-server';
import InteractiveMapSection from '@/components/InteractiveMapSection-server';
import SobreAutoraSection from '@/components/SobreAutoraSection-server';
import ComunidadSection from '@/components/ComunidadSection';
import ContactoSection from '@/components/ContactoSection';
import Footer from '@/components/Footer';
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
      <SobreAutoraSection />
      <ComunidadSection />
      <ContactoSection />
      <Footer />
      <StickyCTA />
    </>
  );
}
