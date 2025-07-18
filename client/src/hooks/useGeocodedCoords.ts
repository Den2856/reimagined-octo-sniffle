import { useEffect, useState } from 'react'

declare let ymaps: any

export function useGeocodedCoords(locations: string[]) {
  const [coords, setCoords] = useState<[number, number][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!locations.length) return
    ymaps.ready(async () => {
      try {
        const results = await Promise.all(
          locations.map(async place => {
            const res = await ymaps.geocode(place, { results: 1 })
            const first = res.geoObjects.get(0)
            const [lat, lon] = first.geometry.getCoordinates()
            return [lat, lon] as [number, number]
          })
        )
        setCoords(results)
      } catch (e: any) {
        setError(e.message || 'Geocode error')
      } finally {
        setLoading(false)
      }
    })
  }, [locations])

  return { coords, loading, error }
}
