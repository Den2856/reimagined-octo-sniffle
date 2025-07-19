import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import Stars from "../../public/assets/stars.png"

type Item = {
  title: string
  count: number
  imageUrl: string
}

const items: Item[] = [
  {
    title: "City Tours",
    count: 150,
    imageUrl: new URL(
      "../../public/assets/popularThings/city-tours.jpg",
      import.meta.url
    ).href,
  },
  {
    title: "Cultural Towers",
    count: 50,
    imageUrl: new URL(
      "../../public/assets/popularThings/cultural-towers.jpg",
      import.meta.url
    ).href,
  },
  {
    title: "Day Cruises",
    count: 100,
    imageUrl: new URL(
      "../../public/assets/popularThings/day-cruises.jpg",
      import.meta.url
    ).href,
  },
  {
    title: "Bus Tours",
    count: 200,
    imageUrl: new URL(
      "../../public/assets/popularThings/bus-tours.jpg",
      import.meta.url
    ).href,
    
  },
  {
    title: "Beach Tours",
    count: 80,
    imageUrl: new URL(
      "../../public/assets/popularThings/beach-tours.jpg",
      import.meta.url
    ).href,
  },
  {
    title: "Food Tours",
    count: 300,
    imageUrl: new URL(
      "../../public/assets/popularThings/food-tours.jpg",
      import.meta.url
    ).href,
  },
]

const MotionLink = motion.create(Link)

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PopularThings() {
  return (
    <section className="w-full py-12 bg-neutral-8">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="block max-sm:hidden text-4xl flex-col font-bold text-white space-x-2">
            <img className="flex-start" src={Stars} alt="stars" />
            <span>Popular things to do</span>
          </h2>
          <Link
            to="/tours"
            className="px-4 py-2 border border-neutral-20 rounded-lg text-white hover:bg-neutral-15 transition"
          >
            See all
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          variants={containerVariants}
        >
          {items.map((item) => (
            <MotionLink
              key={item.title}
              className="relative cursor-default block h-64 rounded-lg overflow-hidden group"
              variants={itemVariants}
            >
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />

              <div className="relative z-10 flex flex-col h-full justify-between p-4">
                <h3 className="text-[39px] leading-9 font-semibold text-white">
                  {item.title.split(" ").map((word, idx) => (
                    <span key={idx} className="block text-center">
                      {word}
                    </span>
                  ))}
                </h3>
                <span className="flex flex-col items-center justify-center text-center leading-7 text-[29px] text-white">
                  {item.count}+
                  <br />
                  Tours
                </span>
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
