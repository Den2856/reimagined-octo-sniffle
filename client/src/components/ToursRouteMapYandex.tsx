import { useCart } from '../context/CartContext'

export default function StaticYandexCartMap() {
  const { items } = useCart()
  const toursCount = items.length

  // Показываем заглушку, когда туров меньше двух
  if (toursCount < 2) {
    return (
      <div className="w-full max-w-[800px] mx-auto my-6 px-6 py-10 text-center bg-neutral-15 border-2 border-dashed border-gray-300 rounded-lg text-white">
        <p className="text-lg leading-relaxed">
          In your cart now {toursCount}{' '}
          {toursCount === 1 ? 'tour' : 'tours'}.
          <br />
          To see the route on the map, add at least one more tour.
        </p>
      </div>
    )
  }

  // Формируем массив пар [lat, lon] — из каждой поездки берём её первую точку
  const coords = items
    .map(item => {
      const raw = item.coords
      if (
        Array.isArray(raw) &&
        raw.length > 0 &&
        Array.isArray(raw[0]) &&
        raw[0].length === 2 &&
        typeof raw[0][0] === 'number'
      ) {
        return raw[0] as unknown as [number, number]
      }
      // если вдруг coords уже [lat, lon]
      if (
        Array.isArray(raw) &&
        raw.length === 2 &&
        typeof raw[0] === 'number'
      ) {
        return raw as [number, number]
      }
      return null
    })
    .filter((c): c is [number, number] => c !== null)

  console.log('coords для маркеров:', coords) // теперь length === items.length

  const markerPreset = 'pm2rdm'
  const pt = coords
    .map(([lat, lon]) => `${lon},${lat},${markerPreset}`)
    .join('~')

  // центрим карту на среднем значении
  const avgLat = coords.reduce((s, [lat]) => s + lat, 0) / coords.length
  const avgLon = coords.reduce((s, [, lon]) => s + lon, 0) / coords.length
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
