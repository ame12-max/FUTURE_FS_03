import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../Cart/CartDrawer";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = ["Home", "Menu", "About", "Gallery", "Contact"];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl py-3 border-b border-white/10" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-playfair font-bold text-gold tracking-wide"
          >
            Alem Cafe
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase() === "home" ? "home" : link.toLowerCase()}`}
                className="text-white hover:text-gold transition font-medium"
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-gold transition"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-white hover:text-gold">
                  <FiUser /> {user.name.split(" ")[0]}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg hidden group-hover:block border border-white/10">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-white hover:text-gold"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-white hover:text-gold"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-white hover:text-gold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gold transition"
              >
                Login
              </Link>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl py-6 border-t border-white/10"
          >
            <div className="flex flex-col items-center gap-5">
              {links.map((link) => {
                const sectionId = link.toLowerCase() === "home" ? "home" : link.toLowerCase();
                if (isHomePage) {
                  return (
                    <a
                      key={link}
                      href={`#${sectionId}`}
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gold text-lg"
                    >
                      {link}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={link}
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gold text-lg"
                    >
                      {link}
                    </Link>
                  );
                }
              })}
              <button
                onClick={() => {
                  setCartOpen(true);
                  setIsOpen(false);
                }}
                className="text-white hover:text-gold text-lg"
              >
                Cart ({itemCount > 9 ? '9+' : itemCount})
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gold text-lg"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gold text-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-white hover:text-gold text-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gold text-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;