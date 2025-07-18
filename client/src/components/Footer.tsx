import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FacebookIcon from '../assets/footer/facebook.svg'
import LinkedInIcon from '../assets/footer/linkedin.svg'
import TwitterIcon from '../assets/footer/x.svg'
import YouTubeIcon from '../assets/footer/youtube.svg'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-neutral-10 text-white py-6">
      <div className="mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row md:space-x-4 items-center text-sm">
          <span className="text-lg">{t('footer.copyright', { year })}</span>
          <Link to="/terms" className="mt-2 md:mt-0 text-lg hover:text-neutral-60 transition-colors">
            {t('footer.terms')}
          </Link>
        </div>
        <ul className="flex space-x-4 mt-4 md:mt-0">
          {[
            { href:  'https://facebook.com/yourpage', aria: 'Facebook', icon: FacebookIcon },
            { href: 'https://linkedin.com/yourpage', aria: 'LinkedIn', icon: LinkedInIcon },
            { href: 'https://twitter.com/yourpage',  aria: 'Twitter',  icon: TwitterIcon  },
            { href: 'https://youtube.com/yourchannel', aria: 'YouTube',  icon: YouTubeIcon  },
          ].map(({ href, aria, icon }) => (
            <li key={aria}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={aria}
                 className="w-[52px] h-[52px] flex items-center justify-center bg-neutral-15 rounded-full hover:bg-neutral-20 transition"
              >
                <img src={icon} alt="" className="w-[52px] h-[52px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
