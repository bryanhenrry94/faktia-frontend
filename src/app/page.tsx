import HeaderSection from "@/components/landing/HeaderSections";
import HeroSection from "@/components/landing/HeroSections";
import FeatureSection from "@/components/landing/FeatureSections";
import CtaSection from "@/components/landing/CtaSections";
import PricingSection from "@/components/landing/PricingSections";
import ContactSection from "@/components/landing/ContactSections";

export default function HomePage() {

  return (
    <>
      <main>
        <HeaderSection />
        <HeroSection />
        <FeatureSection />
        <CtaSection />
        <PricingSection />
        <ContactSection />
      </main>
    </>
  );
}
