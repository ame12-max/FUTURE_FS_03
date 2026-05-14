// src/components/Chat/ChatWidget.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ChatProvider, useChat } from '../../context/ChatContext';
import CustomerChat from './CustomerChat';
import AdminChat from './AdminChat';

const ChatContent = () => {
  const { isConnected, connectionError } = useChat();
  const { user } = useAuth();
  
  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
        <p className="text-sm">Connection error</p>
        <p className="text-xs mt-1">{connectionError}</p>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-3"></div>
          <p className="text-sm">Connecting...</p>
        </div>
      </div>
    );
  }
  
  return user?.role === 'admin' || user?.role === 'manager' ? <AdminChat /> : <CustomerChat />;
};

// Component to get unread count from context
const ChatButtonWithBadge = ({ onClick, isOpen }) => {
  const { unreadCount } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const showBadge = unreadCount > 0 && !isOpen;
  
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
      className="bg-gold text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all relative"
    >
      <FiMessageCircle size={isMobile ? 20 : 24} />
      {showBadge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </motion.button>
  );
};

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;
  
  return (
    <>
      <ChatProvider>
        <ChatButtonWithBadge onClick={() => setIsOpen(true)} isOpen={isOpen} />
      </ChatProvider>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-black/95 backdrop-blur-xl rounded-2xl border border-gold/30 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-gold/20 bg-gold/10">
              <h3 className="text-gold font-playfair font-bold">Alem Cafe Support</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ChatProvider>
                <ChatContent />
              </ChatProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
