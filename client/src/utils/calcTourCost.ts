export interface PricingParams {
  checkIn: string       // ISO-строка даты заезда
  checkOut: string      // ISO-строка даты выезда
  guests: number        // кол-во гостей
  avgFlightOneWay: number    // средняя цена билета в одну сторону за 1 гостя
  nightlyRate: number        // средняя цена за ночь проживания
  airportShuttle: number      // фиксированный трансфер аэропорт–отель
  avgRidePrice: number        // средняя цена местного такси/транспорта за поездку
  ridesPerNight: number       // среднее число поездок в день
  avgMealPrice: number        // средняя цена одного приёма пищи
  mealsPerDay: number         // сколько приёмов пищи в день (обычно 3)
  excursionsCost: number      // стоимость всех экскурсий на одного гостя
  insuranceCost: number       // страховка на одного гостя
  visaCost: number            // виза на одного гостя
  markupPct: number           // ваша маржа, например 0.15 = 15%
  seasonFactor: number        // сезонный коэффициент, например 1.2 в высокий сезон
  groupDiscountPct: number    // скидка за группу, например 0.10 = 10%
  discountThreshold: number   // порог гостей для скидки
  currencyRiskPct: number     // валютный риск, например 0.02 = 2%
}

/**
 * Считает количество полных ночей между checkIn и checkOut.
 */
export function diffInDays(checkIn: string, checkOut: string): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const inDate  = new Date(checkIn)
  const outDate = new Date(checkOut)
  return Math.ceil((outDate.getTime() - inDate.getTime()) / msPerDay)
}

/**
 * Основная функция расчёта экономической стоимости тура для группы гостей.
 */
export function calcTourCost(params: PricingParams): number {
  const {
    checkIn, checkOut, guests,
    avgFlightOneWay, nightlyRate,
    airportShuttle, avgRidePrice, ridesPerNight,
    avgMealPrice, mealsPerDay,
    excursionsCost, insuranceCost, visaCost,
    markupPct, seasonFactor,
    groupDiscountPct, discountThreshold,
    currencyRiskPct,
  } = params

  const nights = diffInDays(checkIn, checkOut)

  // 1) Полёт туда-обратно
  const flightCost = avgFlightOneWay * 2 * guests

  // 2) Проживание
  const hotelCost = nightlyRate * nights * guests

  // 3) Трансфер + местный транспорт
  const transportCost = airportShuttle * guests
    + avgRidePrice * ridesPerNight * nights * guests

  // 4) Питание
  const mealCost = avgMealPrice * mealsPerDay * nights * guests

  // 5) Экскурсии/страховки/визы
  const extraCost = (excursionsCost + insuranceCost + visaCost) * guests

  // Собираем базовую сумму
  let total = flightCost + hotelCost + transportCost + mealCost + extraCost

  // 6) Маржа
  total *= 1 + markupPct

  // 7) Сезонный фактор
  total *= seasonFactor

  // 8) Групповая скидка
  if (guests >= discountThreshold) {
    total *= 1 - groupDiscountPct
  }

  // 9) Валютный риск
  total *= 1 + currencyRiskPct

  return total
}
