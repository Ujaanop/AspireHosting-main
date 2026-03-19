'use client'
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import PanelShowcase from "./components/PanelShowcase"
import LocationsSection from "./components/LocationsSection"
import FAQSection from "./components/FAQSection"
import PricingSection from "./components/PricingSection"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { NumberTicker } from "@/components/magicui/number-ticker";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />
        <HeroSection />

        <section className="py-16 bg-gray-50 dark:bg-[#0a0b0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 orbitron-font">
              Our Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Clients</h3>
                <div className="whitespace-pre-wrap text-6xl font-medium tracking-tighter">
                  <NumberTicker 
                    value={256} 
                    startValue={100} 
                    className="inline"
                  />
                  <span className="inline">+</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Satisfied Customers</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Uptime</h3>
                <div className="whitespace-pre-wrap text-6xl font-medium tracking-tighter">
                  <NumberTicker 
                    value={99.5} 
                    decimalPlaces={1} 
                    startValue={99} 
                    className="inline"
                  />
                  <span className="inline">%</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Guaranteed Service Uptime %</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Servers</h3>
                <div className="whitespace-pre-wrap text-6xl font-medium tracking-tighter">
                  <NumberTicker 
                    value={300} 
                    startValue={100} 
                    className="inline"
                  />
                  <span className="inline">+</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Active Servers</p>
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <LocationsSection />
        <PricingSection />
        <FAQSection />
        <PanelShowcase />
        <Footer />
    </div>
  )
}
