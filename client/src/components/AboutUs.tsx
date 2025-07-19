import { FiMapPin, FiHeadphones, FiShield, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const features = [
  { Icon: FiMapPin, key: 'handcraftedTours' },
  { Icon: FiHeadphones, key: 'support' },
  { Icon: FiShield, key: 'bestPrice' },
  { Icon: FiGlobe, key: 'globalCoverage' },
];

export default function AboutUsPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="bg-neutral-8 text-white">
        {/* Hero */}
        <section
          className="relative h-80 sm:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/forAll/about-hero.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              {t('aboutTripsy')}
            </h1>
            <p className="max-w-xl sm:max-w-2xl text-gray-100 text-base sm:text-lg lg:text-xl">
              {t('heroDescription')}
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-screen-md mx-auto text-center">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              {t('ourMission')}
            </h2>
            <p className="text-gray-100 leading-relaxed text-sm sm:text-base lg:text-lg">
              {t('learnMore')}
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="bg-neutral-15 py-12 sm:py-16">
          <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map(({ Icon, key }, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 bg-neutral-10 rounded-lg shadow-lg transform hover:scale-105 transition"
              >
                <Icon className="w-8 sm:w-12 h-8 sm:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
                  {t(`page.features.${key}.title`)}
                </h3>
                <p className="text-gray-100 text-sm sm:text-base">
                  {t(`page.features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <section className="bg-primary py-8 sm:py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('callToAction')}
            </h2>
            <Link
              to="/"
              className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary font-semibold rounded-full hover:bg-gray-200 transition text-sm sm:text-base"
            >
              {t('browseTrips')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}