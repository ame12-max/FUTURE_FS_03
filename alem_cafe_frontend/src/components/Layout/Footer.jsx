// src/components/Footer.jsx
import { FaInstagram, FaFacebook, FaTwitter, FaMugHot } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-sm text-gray-400 py-10 border-t border-gold/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FaMugHot className="text-2xl text-gold" />
              <span className="text-lg font-bold text-gold font-playfair">Alem Cafe</span>
            </div>
            <p className="text-sm mt-1">Good coffee. Good food. Good vibes.</p>
          </div>
          {/* Social Icons */}
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-gold transition duration-300">
              <FaInstagram size={22} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gold transition duration-300">
              <FaFacebook size={22} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gold transition duration-300">
              <FaTwitter size={22} />
            </a>
          </div>
          {/* Policy Links */}
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-gold transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition">Terms & Conditions</a>
          </div>
        </div>
        <div className="text-center text-xs mt-8 pt-4 border-t border-gold/20">
          © {new Date().getFullYear()} Alem Cafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;