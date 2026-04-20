import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'menu', 'testimonials', 'events', 'gallery', 'contact'];
      const scrollPos = window.scrollY + 100;
      for (let section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActive(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Menu', 'Testimonials', 'Events', 'Gallery', 'Contact'];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cafe-cream/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-cormorant font-bold text-cafe-gold tracking-wide">Alem Café</motion.h1>
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className={`transition duration-300 font-medium ${active === link.toLowerCase() ? 'text-cafe-gold border-b-2 border-cafe-gold' : 'text-cafe-darkbrown hover:text-cafe-gold'}`}>
              {link}
            </a>
          ))}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl text-cafe-darkbrown">{isOpen ? <FiX /> : <FiMenu />}</button>
      </div>
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden absolute top-full left-0 w-full bg-cafe-cream/95 backdrop-blur-md shadow-lg py-4">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-cafe-darkbrown hover:text-cafe-gold">{link}</a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
export default Navbar;