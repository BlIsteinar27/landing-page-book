import HeroSection from '@/components/HeroSection';
import SinopsisSection from '@/components/SinopsisSection';
import SobreAutoraSection from '@/components/SobreAutoraSection';
import TestimoniosSection from '@/components/TestimoniosSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SinopsisSection />
      <SobreAutoraSection />
      <TestimoniosSection />
      <Footer />
      <StickyCTA />
    </>
  );
}
