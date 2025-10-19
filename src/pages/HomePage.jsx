import { FloralDivider } from "@/components/FloralDivider"
import { FloralDecoration } from "@/components/FloralDecoration"
import { AdditionalInfo } from "@/components/AdditionalInfo"
import { Meteors } from "@/components/ui/meteor-effect"
import { HeroSection } from "@/components/sections/HeroSection"
import { QuoteSection } from "@/components/sections/QuoteSection"
import { LocationSection } from "@/components/sections/LocationSection"
import { AccommodationSection } from "@/components/sections/AccommodationSection"
import { RSVPSection } from "@/components/sections/RSVPSection"
import { AboutUsSectionAttachment } from "@/components/sections/AboutUsSection"

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decoraciones florales */}
      <FloralDecoration position="top-right" />
      <FloralDecoration position="bottom-left" />

      {/* Meteoros en toda la página */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Meteors number={20} />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Quote Section - Color 1 (transparente) */}
      <QuoteSection />

      {/* About Us Section - Color 2 (gris) */}
      <AboutUsSectionAttachment />

      {/* Additional Info Section - Color 1 (transparente) */}
      <AdditionalInfo />

      {/* Location Section - Color 2 (gris) */}
      <LocationSection />

      {/* Accommodation Section - Color 1 (transparente) */}
      <AccommodationSection />

      {/* RSVP Section - Color 2 (gris) */}
      <RSVPSection />
    </div>
  )
}

