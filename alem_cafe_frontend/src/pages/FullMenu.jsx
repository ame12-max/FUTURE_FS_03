import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowLeft, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { menuAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const FullMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { convertPrice, getSymbol } = useCurrency();
  const { t, language } = useLanguage();

  // Get unique categories from menu items
  const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  
  // Dietary options with translations
  const dietaryOptions = [
    { value: 'all', labelEn: 'All', labelAm: 'ሁሉም' },
    { value: 'Vegetarian', labelEn: 'Vegetarian', labelAm: 'ቬጀቴሪያን' },
    { value: 'Vegan', labelEn: 'Vegan', labelAm: 'ቪጋን' },
    { value: 'Gluten-Free', labelEn: 'Gluten-Free', labelAm: 'ግሉተን አልባ' },
    { value: 'Contains gluten', labelEn: 'Contains Gluten', labelAm: 'ግሉተን ይዟል' },
    { value: 'Contains dairy', labelEn: 'Contains Dairy', labelAm: 'ወተት ይዟል' },
    { value: 'Contains eggs', labelEn: 'Contains Eggs', labelAm: 'እንቁላል ይዟል' },
    { value: 'Contains nuts', labelEn: 'Contains Nuts', labelAm: 'ለውዝ ይዟል' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('likedMenuItems');
    if (saved) setLikedItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll();
        const availableItems = res.data.filter(item => item.is_available === 1);
        setMenuItems(availableItems);
        setFilteredItems(availableItems);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load menu:', err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Apply filters whenever search term, category, or dietary filter changes
  useEffect(() => {
    let results = [...menuItems];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    if (selectedDietary !== 'all') {
      results = results.filter(item => {
        const tags = item.dietary_tags?.toLowerCase() || '';
        return tags.includes(selectedDietary.toLowerCase());
      });
    }
    
    setFilteredItems(results);
  }, [searchTerm, selectedCategory, selectedDietary, menuItems]);

  const toggleLike = (id) => {
    const updated = { ...likedItems, [id]: !likedItems[id] };
    setLikedItems(updated);
    localStorage.setItem('likedMenuItems', JSON.stringify(updated));
  };

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: getImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    };
    
    addToCart(cartItem, 1);
    
    if (user) {
      toast.success(`${item.name} ${t('menu.addedToCart')}`);
    } else {
      toast.success(`${item.name} ${t('menu.addedToCartGuest')}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDietary('all');
  };

  const getDietaryLabel = (value) => {
    const option = dietaryOptions.find(opt => opt.value === value);
    if (!option) return value;
    return language === 'am' ? option.labelAm : option.labelEn;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link to="/#menu" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6">
          <FiArrowLeft /> {t('fullMenu.backToMenu')}
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gold">{t('fullMenu.title')}</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            {t('fullMenu.subtitle')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በስም፣ በምድብ ወይም በመግለጫ ይፈልጉ...' : 'Search by name, category, or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-4 mb-8">
          {/* Category Filter */}
          <div>
            <h3 className="text-gold text-sm font-semibold mb-2">
              {language === 'am' ? 'ምድብ' : 'Category'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  selectedCategory === 'all'
                    ? 'bg-gold text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {language === 'am' ? 'ሁሉም' : 'All'}
              </button>
              {categories.filter(c => c !== 'all').map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${
                    selectedCategory === category
                      ? 'bg-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Filter */}
          <div>
            <h3 className="text-gold text-sm font-semibold mb-2">
              {language === 'am' ? 'የአመጋገብ ምርጫ' : 'Dietary Preferences'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDietary(option.value)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${
                    selectedDietary === option.value
                      ? 'bg-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {language === 'am' ? option.labelAm : option.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCategory !== 'all' || selectedDietary !== 'all') && (
            <div className="text-right">
              <button
                onClick={clearFilters}
                className="text-sm text-gold hover:text-yellow-400 transition"
              >
                {language === 'am' ? 'ሁሉንም አጽዳ' : 'Clear all filters'}
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-right mb-4">
          <p className="text-gray-400 text-sm">
            {language === 'am' 
              ? `${filteredItems.length} ከ ${menuItems.length} ምግቦች ታይተዋል`
              : `Showing ${filteredItems.length} of ${menuItems.length} items`}
          </p>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {language === 'am' 
                ? 'ከምርጫዎት ጋር የሚዛመድ ምግብ አልተገኘም።'
                : 'No items found matching your criteria.'}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-gold hover:text-yellow-400 transition"
            >
              {language === 'am' ? 'ሁሉንም አጽዳ' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition duration-300 group"
              >
                <Link to={`/menu/${item.id}`} className="block">
                  <img 
                    src={getImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'} 
                    alt={item.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        {item.category && (
                          <p className="text-xs text-gold mt-1">{item.category}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className="text-gold hover:text-red-500 transition"
                      >
                        {likedItems[item.id] ? (
                          <FiHeart className="fill-red-500 text-red-500" size={20} />
                        ) : (
                          <FiHeart size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                    
                    {/* Dietary badges */}
                    {item.dietary_tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.dietary_tags.split(',').slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-gold font-bold text-xl">{getSymbol()}{convertPrice(item.price)}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="bg-gold text-black p-2 rounded-full hover:bg-gold-light transition"
                        aria-label={t('menu.addToCart')}
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullMenu;