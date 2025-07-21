import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState<'en' | 'ru'>(() =>
    i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'
  )

  // синхронизируем internal state при внешних изменениях языка
  useEffect(() => {
    setLang(i18n.resolvedLanguage === 'ru' ? 'ru' : 'en')
  }, [i18n.resolvedLanguage])

  const toggle = () => {
    const next = lang === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(next)
    setLang(next)
  }

  return (
    <div
      onClick={toggle}
      className="relative w-[70px] h-[30px] bg-neutral-15 rounded-full cursor-pointer"
    >
      {/* Ползунок */}
      <span
        className={`
          absolute top-0 left-0 w-1/2 h-full bg-neutral-8 rounded-full
          transform transition-transform duration-300 ease-in-out
          ${lang === 'en' ? 'translate-x-full' : ''}
        `}
      />

      {/* Метки */}
      <div className="relative z-10 grid grid-cols-2 h-full text-xs font-semibold text-white">
        <div className="flex items-center justify-center">EN</div>
        <div className="flex items-center justify-center">RU</div>
      </div>
    </div>
  )
}
