import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { diffInDays, type PricingParams } from '../utils/calcTourCost'
import { useTranslation } from 'react-i18next'

export default function CartContent() {
  const { t } = useTranslation()
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const [openId, setOpenId] = useState<string | null>(null)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const defaults: Omit<PricingParams, 'checkIn' | 'checkOut' | 'guests' | 'nightlyRate'> = {
    avgFlightOneWay: 200, airportShuttle: 40, avgRidePrice: 15, ridesPerNight: 2,
    avgMealPrice: 30, mealsPerDay: 3, excursionsCost: 100, insuranceCost: 20,
    visaCost: 50, markupPct: 0.15, seasonFactor: 1.1, groupDiscountPct: 0.1,
    discountThreshold: 4, currencyRiskPct: 0.02,
  }

  const detailedItems = items.map(item => {
    const nights = diffInDays(item.checkIn, item.checkOut)
    const flightCost = defaults.avgFlightOneWay * 2 * item.guests
    const hotelCost = item.price * nights * item.guests
    const transportCost =
      defaults.airportShuttle * item.guests +
      defaults.avgRidePrice * defaults.ridesPerNight * nights * item.guests
    const mealCost = defaults.avgMealPrice * defaults.mealsPerDay * nights * item.guests
    const extrasCost =
      (defaults.excursionsCost + defaults.insuranceCost + defaults.visaCost) * item.guests

    let subtotal = flightCost + hotelCost + transportCost + mealCost + extrasCost
    const afterMarkup = subtotal * (1 + defaults.markupPct)
    const afterSeason = afterMarkup * defaults.seasonFactor
    const afterGroup =
      item.guests >= defaults.discountThreshold
        ? afterSeason * (1 - defaults.groupDiscountPct)
        : afterSeason
    const finalCost = afterGroup * (1 + defaults.currencyRiskPct)

    return { ...item, nights, flightCost, hotelCost, transportCost, mealCost, extrasCost, afterMarkup, afterSeason, afterGroup, finalCost }
  })

  const total = detailedItems.reduce((sum, it) => sum + it.finalCost, 0)

  return (
    <main className="mx-auto px-4 py-12 bg-neutral-8">
      <h1 className="text-4xl font-bold text-white mb-8">{t('cart.title')}</h1>

      {detailedItems.length === 0 ? (
        <div className="text-center text-gray-100 py-16">
          {t('cart.emptyMessage')}
          <div className="mt-4">
            <Link to="/" className="inline-block px-4 py-2 bg-button-primary hover:bg-button-hover text-white rounded transition">
              {t('cart.goHome')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1 space-y-4">
            {detailedItems.map(item => {
              const isOpen = openId === item.tripId
              return (
                <div key={item.tripId} className="bg-neutral-15 border border-neutral-20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.tripId)}
                    className="w-full flex items-center p-4 focus:outline-none"
                  >
                    <img src={item.imagePath} alt={item.location} className="w-24 h-24 object-cover rounded-md mr-4 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <h2 className="text-xl font-semibold text-white">{item.location}</h2>
                      <p className="text-gray-100 text-sm">
                        {item.checkIn} — {item.checkOut} ({item.nights}{' '}
                        {t(`cart.nights.${item.nights === 1 ? 'singular' : 'plural'}`)})
                      </p>
                      <p className="text-gray-100 text-sm">
                        {item.guests} {t(`cart.guests.${item.guests === 1 ? 'singular' : 'plural'}`)}
                      </p>
                    </div>
                    <div className="text-right w-32">
                      <p className="text-lg font-medium text-white">${item.finalCost.toFixed(2)}</p>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="bg-neutral-10 p-4 border-t border-neutral-20 text-gray-200">
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium text-white">{t('cart.flight')}</span> ${item.flightCost.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.hotel', { count: item.nights })}</span> ${item.hotelCost.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.transport')}</span> ${item.transportCost.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.meals')}</span> ${item.mealCost.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.extras')}</span> ${item.extrasCost.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.afterMarkup', { pct: (defaults.markupPct*100).toFixed(0) })}</span> ${item.afterMarkup.toFixed(2)}</li>
                        <li><span className="font-medium text-white">{t('cart.seasonFactor', { factor: defaults.seasonFactor })}</span> ${item.afterSeason.toFixed(2)}</li>
                        {item.guests >= defaults.discountThreshold && (
                          <li><span className="font-medium text-white">{t('cart.groupDiscount', { pct: (defaults.groupDiscountPct*100).toFixed(0) })}</span> ${(item.afterSeason*(1-defaults.groupDiscountPct)).toFixed(2)}</li>
                        )}
                        <li><span className="font-medium text-white">{t('cart.currencyRisk', { pct: (defaults.currencyRiskPct*100).toFixed(0) })}</span> ${item.finalCost.toFixed(2)}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </section>

          <aside className="sticky top-24 self-start w-full lg:w-80 bg-neutral-15 p-6 rounded-lg border border-neutral-20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-100">{t('cart.items')}</span>
                <span className="text-white">{detailedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-100">{t('cart.subtotal')}</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button onClick={clearCart} className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                {t('cart.clearCart')}
              </button>
              <button onClick={() => {}} className="w-full px-4 py-2 bg-button-primary hover:bg-button-hover text-white rounded transition">
                {t('cart.proceedToCheckout')}
              </button>
              <Link to="/tours" className="block text-center text-sm text-gray-400 hover:underline mt-2">
                {t('cart.continueShopping')}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
