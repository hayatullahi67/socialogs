import { CTASection } from "@/components/cta-section";
import { DashboardPreview } from "@/components/dashboard-preview";
import { FAQSection } from "@/components/faq-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { WhatWeOfferSection } from "@/components/what-we-offer-section";

export default function Home() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        <HeroSection />
        <div className="lg:hidden">
          <DashboardPreview />
        </div>

        <section id="what-we-offer">
          <WhatWeOfferSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="how-it-works">
          <HowItWorksSection />
        </section>

        <section id="faq">
          <FAQSection />
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
