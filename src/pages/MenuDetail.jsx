// src/pages/MenuDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const menuItems = [
  {
    id: 1,
    name: 'Alem Signature Burger',
    desc: 'Juicy 100% beef patty with cheddar & special sauce',
    fullDesc: 'Our signature burger features a 100% beef patty, melted cheddar cheese, crispy lettuce, ripe tomatoes, and our special house sauce, all served on a toasted brioche bun. Served with a side of seasoned fries.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    category: 'Main Course',
    calories: 850,
  },
  {
    id: 2,
    name: 'Creamy Alfredo Pasta',
    desc: 'Rich & creamy white sauce with grilled chicken',
    fullDesc: 'Fettuccine pasta tossed in a rich, creamy Alfredo sauce with grilled chicken breast, topped with fresh parsley and Parmesan cheese. Served with garlic bread.',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1645112411344-6c8fd0c7bd6e?w=800',
    category: 'Main Course',
    calories: 720,
  },
  {
    id: 3,
    name: 'Choco Lava Cake',
    desc: 'Warm chocolate lava with vanilla ice cream',
    fullDesc: 'Decadent warm chocolate cake with a molten core, served with vanilla bean ice cream and a drizzle of chocolate sauce.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
    category: 'Dessert',
    calories: 480,
  },
  {
    id: 4,
    name: 'Iced Caramel Latte',
    desc: 'Smooth espresso with caramel & cold milk',
    fullDesc: 'A refreshing blend of espresso, cold milk, and rich caramel syrup, served over ice and topped with whipped cream and caramel drizzle.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    category: 'Beverage',
    calories: 250,
  },
];

const MenuDetail = () => {
  const { id } = useParams();
  const item = menuItems.find(i => i.id === parseInt(id));

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center text-white">Item not found</div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link to="/#menu" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6">
          <FiArrowLeft /> Back to Menu
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover md:rounded-l-3xl" />
            <div className="p-8">
              <h1 className="text-4xl font-playfair font-bold text-gold mb-2">{item.name}</h1>
              <p className="text-gray-300 text-sm mb-4">{item.category} • {item.calories} cal</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{item.fullDesc}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gold">${item.price}</span>
                <button className="bg-gold text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuDetail;