import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DashboardPreview } from "@/components/dashboard-preview"
import { WhatWeOfferSection } from "@/components/what-we-offer-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <div className="lg:hidden">
          <DashboardPreview />
        </div>
        <WhatWeOfferSection />
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
