import Banner from '../components/Banner'
import Header from '../components/Header'
import Hero from '../components/Hero'
import heroImg from '../assets/forAll/hero.png'
import Features from '../components/Features'
import PopularThings from '../components/PopularThings'
import FeaturedTrips from '../components/FeaturedTrips'
import TestimonialsSection from '../components/TestimonialsSection'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

export default function Home() {


  return (
    <>
     <Banner variant='promo' reopenDelayMs={120000}/>
     <Header />
     <Hero backgroundImage={heroImg}/>
     <Banner variant='empty' rotateDeg={180}/>
     <Features />
     <PopularThings />
     <FeaturedTrips />
     <TestimonialsSection />
     <CallToAction />
     <Footer />
    </>

  )
}
