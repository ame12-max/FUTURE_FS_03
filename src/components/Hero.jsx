// src/components/Hero.jsx
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaCoffee,
  FaLeaf,
  FaHome,
} from "react-icons/fa";
import HeroImage from "../assets/hero.png";

const Hero = () => {
  const features = [
    { icon: FaCoffee, title: "Premium Coffee" },
    { icon: FaLeaf, title: "Fresh Ingredients" },
    { icon: FaHome, title: "Cozy Ambience" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent pt-20 mb-20"
      id="home">
      
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HeroImage}
          className="w-full h-full object-cover scale-110"
          alt=""
        />
        <div className="absolute inset-0 " />
      </div>

      {/* Gradient Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-yellow-500/20 blur-[140px] rounded-full"></div>

      {/* Open Badge */}
      <div className="absolute flex-col top-24 sm:top-32 right-8 right-8 z-20  backdrop-blur-xl border border-white/20 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-sm text-white font-bold">
          Open Now
        </span>
        </div>
        <span className="text-xs text-gray-300 font-mono font-semibold">
             07:00 AM – 11:00 PM
        </span>
      </div>

      {/* Social Sidebar */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
        {[FaFacebook, FaInstagram, FaTwitter, FaWhatsapp].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="bg-white/10 backdrop-blur-lg p-3 rounded-full border border-white/20 hover:scale-110 hover:bg-yellow-500 hover:text-black transition"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      {/* Content */}
<div className="relative z-10 container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* LEFT - GLASS CARD CONTENT (mobile optimised) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 text-yellow-400 text-xs sm:text-sm mb-2 sm:mb-3">
            <FaCoffee className="text-sm sm:text-base" />
            <span className="tracking-widest uppercase">Welcome to</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Alem Cafe
          </h1>

          <p className="text-gray-300 mt-3 sm:mt-5 text-sm sm:text-base md:text-lg">
            Experience rich flavors, premium coffee, and a cozy atmosphere crafted for unforgettable moments.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:scale-105 transition text-sm sm:text-base">
              Explore Menu
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 border border-yellow-500 text-yellow-400 rounded-full hover:bg-yellow-500/10 transition text-sm sm:text-base">
              Book a Table
            </button>
          </div>

          <div className="flex gap-6 mt-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <f.icon className="text-yellow-400" />
                {f.title}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT - FLOATING IMAGE (NOT BOXED FEEL) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:flex justify-center"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
              alt="coffee"
              className="rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] w-[450px] h-[500px] object-cover"
            />

            {/* Floating Card */}
            <div className="absolute -bottom-2 left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">
  <div className="flex items-center gap-2 mb-1">
    <span className="text-yellow-400 text-lg">★</span>
    <span className="text-white font-semibold text-sm">4.9 Rating</span>
  </div>
  <p className="text-gray-300 text-xs">5K+ Happy Customers</p>
</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;