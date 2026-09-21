import Hero from '../components/home/Hero'
import Overview from '../components/home/Overview'
import WhyChoose from '../components/home/WhyChoose'
import ServicesPreview from '../components/home/ServicesPreview'
import Stats from '../components/home/Stats'
import Testimonials from '../components/home/Testimonials'
import FAQ from '../components/home/FAQ'
import CTABanner from '../components/ui/CTABanner'

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <WhyChoose />
      <ServicesPreview />
      <Stats />
      <CTABanner />
      <Testimonials />
      <FAQ />
      
    </>
  )
}
