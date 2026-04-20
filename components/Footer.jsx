// src/components/Footer.jsx
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-cafe-darkbrown text-cafe-beige pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-cormorant font-bold text-cafe-gold mb-2">Alem Café</h3>
            <p className="text-sm">Where tradition meets elegance.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#home" className="text-sm hover:text-cafe-gold transition">Home</a></li>
              <li><a href="#menu" className="text-sm hover:text-cafe-gold transition">Menu</a></li>
              <li><a href="#about" className="text-sm hover:text-cafe-gold transition">About</a></li>
              <li><a href="#contact" className="text-sm hover:text-cafe-gold transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-cafe-gold transition"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-cafe-gold transition"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-cafe-gold transition"><FaTwitter size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Newsletter</h4>
            <div className="flex max-w-xs mx-auto md:mx-0">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-l-lg text-gray-800 text-sm" />
              <button className="bg-cafe-gold text-cafe-darkbrown px-3 rounded-r-lg hover:bg-cafe-brown transition"><FaEnvelope /></button>
            </div>
            <p className="text-xs mt-2">Get updates on events & offers</p>
          </div>
        </div>
        <div className="border-t border-cafe-brown/30 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Alem Café – All rights reserved. Designed with ❤️ for Future Interns.
        </div>
      </div>
    </footer>
  );
};
export default Footer;