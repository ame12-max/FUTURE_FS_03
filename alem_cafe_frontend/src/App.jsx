import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FavoritesProvider } from './context/FavoritesContext'; 
import { LanguageProvider } from './context/LanguageContext';
import ChatWidget from './components/chat;
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MenuDetail from './pages/MenuDetail';
import FullMenu from './pages/FullMenu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import MenuManagement from './pages/Admin/MenuManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import Favorites from './pages/Favorites';
import AccountManagement from './pages/AccountManagement';
import ReservationManagement from './pages/Admin/ReservationManagement';



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <FavoritesProvider> {/* Add this wrapper */}
              <LanguageProvider>
                <div className="relative min-h-screen overflow-x-hidden">
                  <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-black/70" />
                    <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }} />
                  </div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/order-tracking/:id" element={<OrderTracking />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/menu" element={<MenuManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/account" element={<AccountManagement />} />
                <Route path="/menu/:id" element={<MenuDetail />} />
                <Route path="/full-menu" element={<FullMenu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/admin/reservations" element={<ReservationManagement />} />
                <Route path="*" element={<Home />} />
              </Routes>
              <Footer />
              <ChatWidget />
            </div>
              </LanguageProvider>
          </FavoritesProvider>
           
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
