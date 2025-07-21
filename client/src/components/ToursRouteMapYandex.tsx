import { useCart } from '../context/CartContext'

export default function StaticYandexCartMap() {
  const { items } = useCart()
  // отбираем только валидные coords: [lat, lon]
  const coords = items
    .map(i => i.coords)
    .filter(
      (c): c is [number, number] =>
        Array.isArray(c) && c.length === 2
    )

  if (coords.length = 0){
    return
  }


  if (coords.length = 1) {
    return (
      <div className="w-full max-w-[800px] mx-auto my-6 px-6 py-10 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-600">
        <p className="text-lg leading-relaxed">
          In your cart now {coords.length}{' '}
          {coords.length === 1 ? 'tour' : 'tours'}.
          <br />
          To see the route on the map, add at least one more tour.
        </p>
      </div>
    )
  }

  const markerPreset = 'pm2rdm'

  // строим параметр pt=lon,lat,preset~...
  const pt = coords
    .map(([lat, lon]) => `${lon},${lat},${markerPreset}`)
    .join('~')

  // центр карты — средняя точка
  const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length
  const avgLon = coords.reduce((sum, [, lon]) => sum + lon, 0) / coords.length

  const ll = `${avgLon},${avgLat}`
  const size = '650,450'
  const zoom = 1
  const apikey = import.meta.env.VITE_YANDEX_STATIC_API_KEY || ''

  const src = [
    'https://static-maps.yandex.ru/1.x/',
    `?l=map`,
    `&size=${size}`,
    `&zoom=${zoom}`,
    `&ll=${ll}`,
    `&pt=${pt}`,
    apikey && `&apikey=${apikey}`,
  ]
    .filter(Boolean)
    .join('')

  return (
    <div className="w-full max-w-[800px] mx-auto my-6">
      <img
        src={src}
        alt="Карта с метками из корзины"
        className="w-full rounded-lg"
      />
    </div>
  )
}
