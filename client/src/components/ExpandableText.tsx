import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = { text: string; maxChars?: number; className?: string }
export default function ExpandableText({ text, maxChars = 50, className = '' }: Props) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  if (text.length <= maxChars) return <span className={className}>{text}</span>

  const shortText = (() => {
    const clip = text.slice(0, maxChars)
    const idx = clip.lastIndexOf(' ')
    return idx > 0 ? clip.slice(0, idx).trimEnd() + '…' : clip.trimEnd() + '…'
  })()

  return (
    <span className={className}>
      {expanded ? text : shortText}{' '}
      <button onClick={() => setExpanded(prev => !prev)} className="text-white text-[16px] underline focus:outline-none">
        {expanded ? t('expandable.seeLess') : t('expandable.seeMore')}
      </button>
    </span>
  )
}
