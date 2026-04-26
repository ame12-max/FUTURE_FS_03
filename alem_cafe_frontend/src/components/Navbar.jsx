// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { FaInstagram, FaFacebook, FaTwitter , FaMugHot } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);
      const sections = ["home", "menu", "about", "gallery", "contact"];
      const scrollPosition = scrollY + 120;
      for (let section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPosition && el.offsetTop + el.offsetHeight > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "home" },
    { name: "Menu", href: "menu" },
    { name: "About", href: "about" },
    { name: "Gallery", href: "gallery" },
    { name: "Contact", href: "contact" }, // ✅ fixed
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out ${scrolled ? "py-3" : "py-6"}`}>
      {/* Glass Overlay Layer */}
      <div className={`absolute inset-0 transition-all duration-500 ${scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg opacity-100" : "bg-transparent backdrop-blur-0 opacity-0"}`} />

      {/* Content */}
      <div className="relative container mx-auto px-6 flex justify-between items-center">
        {/* Logo – responsive size for mobile */}
    <div className="flex items-center gap-2">
          <FaMugHot className={`text-yellow-400 transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`} />
          <span className={`font-playfair font-bold text-yellow-400 transition-all duration-500 ${scrolled ? "text-base" : "text-xl"}`}>
            Alem Cafe
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a key={link.name} href={`#${link.href}`} className="relative group text-sm font-medium">
              <span className={`transition duration-300 ${activeSection === link.href ? "text-yellow-400" : "text-white/80 group-hover:text-white"}`}>
                {link.name}
              </span>
              <span className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-400 transition-all duration-300 ${activeSection === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
            </a>
          ))}
          <a href="#reserve" className="ml-4 px-5 py-2 rounded-full bg-yellow-500 text-black text-sm font-semibold shadow-md hover:scale-105 hover:bg-yellow-400 transition-all duration-300">
            Reserve
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl z-50">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 py-8">
          <div className="flex flex-col items-center gap-6">
            {links.map((link) => (
              <a key={link.name} href={`#${link.href}`} onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-yellow-400 transition">
                {link.name}
              </a>
            ))}
            <a href="#reserve" className="mt-2 px-6 py-2 rounded-full bg-yellow-500 text-black font-semibold">Reserve a Table</a>
            <div className="flex gap-6 mt-4">
              {[FaInstagram, FaFacebook, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white hover:text-yellow-400 transition"><Icon size={20} /></a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;