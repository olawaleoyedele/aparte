'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: '🔍',
    title: 'Browse Listings',
    description: 'Explore verified rental homes with real photos and details.',
  },
  {
    icon: '📞',
    title: 'Contact Agents or Landlords',
    description: 'Reach out directly via WhatsApp or call with one click.',
  },
  {
    icon: '📅',
    title: 'Schedule a Viewing',
    description: 'Set up appointments to visit your preferred homes safely.',
  },
  {
    icon: '🏠',
    title: 'Move In',
    description: 'Enjoy a hassle-free rental experience and settle into your new home.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.15 },
  }),
};

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-20 px-4">
      {/* Heading */}
      <motion.h2
        className="text-4xl font-bold text-center mb-14 text-gray-900 font-[Oswald]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        How It{' '}
        <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          Works
        </span>
      </motion.h2>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-4 max-w-7xl mx-auto px-4">
        {steps.map(({ icon, title, description }, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-pink-400 group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={idx}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white text-3xl transition-transform group-hover:scale-110 group-hover:animate-pulse">
              {icon}
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-center text-gray-900">
              {title}
            </h3>
            <p className="text-gray-600 text-center text-sm">{description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-10 py-4 rounded font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Find a Home →
        </motion.button>
      </div>
    </section>
  );
};

export default HowItWorks;
