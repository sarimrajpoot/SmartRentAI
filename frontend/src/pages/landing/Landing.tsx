import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/hero/Hero";
import HeroStats from "../../components/landing/hero/HeroStats";
import SearchBar from "../../components/landing/SearchBar";
import AIFeatures from "../../components/landing/ai-features/AIFeatures";
import FeaturedCarsSection from "../../components/landing/featured-cars/FeaturedCarsSection";
import TrustedPartnersSection from "../../components/landing/trusted-partners/TrustedPartnersSection";
import HowItWorks from "../../components/landing/howitworks/HowItWorks";
import TestimonialsSection from "../../components/landing/testimonials/TestimonialsSection";
import MobileAppSection from "../../components/landing/mobile-app/MobileAppSection";
import PartnerCTASection from "../../components/landing/partner-cta/PartnerCTASection";
import FaqSection from "../../components/landing/faq/FaqSection";
import Footer from "../../components/layout/footer/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <HeroStats />
      <SearchBar />
      <FeaturedCarsSection />
      <AIFeatures />
      <HowItWorks />
      <TrustedPartnersSection />
      <TestimonialsSection />
      <MobileAppSection />
      <PartnerCTASection />
      <FaqSection />
      <Footer />
    </>
  );
}
