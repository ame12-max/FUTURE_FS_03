import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
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
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = ["Home", "Menu", "About", "Gallery", "Contact"];

  const handleNavClick = (link, e) => {
    if (link === "Home") {
      if (isHomePage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else {
      const sectionId = link.toLowerCase();
      if (isHomePage) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(`/#${sectionId}`);
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl py-3 border-b border-white/10 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-playfair font-bold text-gold tracking-wide hover:scale-105 transition-transform duration-300"
          >
            Alem Cafe
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link}
                onClick={(e) => handleNavClick(link, e)}
                className="text-white hover:text-gold transition font-medium relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-gold transition p-2 rounded-full hover:bg-white/10"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-white hover:text-gold transition px-3 py-2 rounded-full hover:bg-white/10">
                  <FiUser size={18} />
                  <span>{user.name.split(" ")[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl rounded-xl overflow-hidden hidden group-hover:block border border-white/10 shadow-xl">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition"
                  >
                    <FiUser size={16} />
                    My Orders
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition"
                  >
                    <FiHeart size={16} />
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition"
                    >
                      <FiUser size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gold transition px-4 py-2 rounded-full hover:bg-white/10"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl p-2 rounded-lg hover:bg-white/10 transition"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl py-6 border-t border-white/10 shadow-xl"
          >
            <div className="flex flex-col items-center gap-5">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  className="text-white hover:text-gold text-lg py-2 transition"
                >
                  {link}
                </button>
              ))}
              <button
                onClick={() => {
                  setCartOpen(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-white hover:text-gold text-lg py-2 transition"
              >
                <FiShoppingCart size={18} />
                Cart ({itemCount > 9 ? "9+" : itemCount})
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gold text-lg py-2 transition"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gold text-lg py-2 transition"
                  >
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gold text-lg py-2 transition"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 text-lg py-2 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gold text-lg py-2 transition"
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