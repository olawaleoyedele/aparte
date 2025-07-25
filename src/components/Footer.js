'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6 md:px-20">
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 max-w-7xl mx-auto">
        {/* Logo + Tagline */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <img
            src="/aparte-logo-removebg.png"
            alt="Logo"
            className="h-12 mb-4"
          />
          <p className="text-sm text-gray-400">
            Helping you find safe, verified homes without stress. Rentals that feel like home.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/listings">Listings</Link></li>
            <li><Link href="/post-listing">Post a Listing</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </motion.div>

        {/* Support */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-4">
            Get alerts about hot listings and new features.
          </p>
          <form className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full sm:w-auto px-4 py-2 rounded text-sm bg-white text-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:bg-orange-600 px-5 py-2 rounded text-white text-sm"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Social Icons */}
        <div className="flex gap-4 text-white text-lg">
          <a href="#" aria-label="WhatsApp" className="hover:text-green-400 transition">
            <FaWhatsapp />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition">
            <FaInstagram />
          </a>
          <a href="#" aria-label="X" className="hover:text-gray-300 transition">
            <FaXTwitter />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-blue-500 transition">
            <FaFacebookF />
          </a>
        </div>

        {/* Copyright */}
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          © {new Date().getFullYear()} Aparte. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
