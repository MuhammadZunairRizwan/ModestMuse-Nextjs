import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { OurStory } from "@/components/our-story"
import { CustomerTestimonials } from "@/components/customer-testimonials"
import { StatsSection } from "@/components/stats-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <OurStory />
      <CustomerTestimonials />
      <StatsSection />
      <Footer />
    </div>
  )
}
