import HeroSection from '@/components/HeroSection';
import SobreLibroSection from '@/components/SinopsisSection';
import PersonajesSection from '@/components/PersonajesSection';
import SagaSection from '@/components/SagaSection';
import SobreAutoraSection from '@/components/SobreAutoraSection';
import ComunidadSection from '@/components/ComunidadSection';
import ContactoSection from '@/components/ContactoSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SobreLibroSection />
      <PersonajesSection />
      <SagaSection />
      <SobreAutoraSection />
      <ComunidadSection />
      <ContactoSection />
      <Footer />
      <StickyCTA />
    </>
  );
}
