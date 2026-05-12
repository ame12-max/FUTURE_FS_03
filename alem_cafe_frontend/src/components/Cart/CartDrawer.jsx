import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { getImageUrl } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';


const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, total, itemCount, clearCart } = useCart();
  const { convertPrice, getSymbol } = useCurrency();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col border-l border-white/20">
        <div className="flex justify-between items-center p-4 border-b border-gold/20">
          <h2 className="text-xl font-playfair font-bold text-gold">Your Cart ({itemCount} items)</h2>
          <button onClick={onClose} className="text-white hover:text-gold transition">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="text-5xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <Link 
                to="/#menu" 
                onClick={onClose}
                className="inline-block mt-4 text-gold hover:underline"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                <img 
                  src={getImageUrl(item.image) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded" 
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-gold font-bold">{getSymbol()}{convertPrice(item.price)}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="p-1 rounded-full bg-white/10 hover:bg-gold/20 transition"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm w-8 text-center text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="p-1 rounded-full bg-white/10 hover:bg-gold/20 transition"
                    >
                      <FiPlus size={12} />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="ml-auto text-red-400 hover:text-red-300 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-4 border-t border-gold/20">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-white">Subtotal:</span>
              <span className="text-gold font-bold text-xl">{getSymbol()}{convertPrice(total)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-400">
              <span>Delivery Fee:</span>
              <span>{getSymbol()}{convertPrice(2)}</span>
            </div>
            <div className="flex justify-between mb-4 pt-2 border-t border-white/10">
              <span className="font-bold text-white">Total:</span>
              <span className="text-gold font-bold text-xl">{getSymbol()}{convertPrice(total + 2)}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={clearCart}
                className="flex-1 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                Clear Cart
              </button>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="flex-1 text-center bg-gold text-black py-2 rounded-full font-semibold hover:bg-gold-light transition"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;