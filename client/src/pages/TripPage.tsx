import { useState } from 'react'
import Banner from '../components/Banner'
import Header from '../components/Header'
import TripContent from '../components/TripContent'
import Footer from '../components/Footer'
import type { BannerVariant } from '../components/Banner'

export default function SingleTripPage() {
  const [bannerVariant, setBannerVariant] =
    useState<BannerVariant>('promo')

  return (
    <>
      <Banner variant={bannerVariant} />
      <Header />
      <TripContent
        bannerVariant={bannerVariant}
        setBannerVariant={setBannerVariant}
      />
      <Footer />
    </>
  )
}
