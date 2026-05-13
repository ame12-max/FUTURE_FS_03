import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiWifiOff } from 'react-icons/fi';
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
        <FiWifiOff size={40} className="mb-3 text-red-400" />
        <p className="text-sm">Connection error</p>
        <p className="text-xs mt-1">{connectionError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 text-gold text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-3"></div>
          <p className="text-sm">Connecting to chat...</p>
        </div>
      </div>
    );
  }
  
  return user?.role === 'admin' || user?.role === 'manager' ? <AdminChat /> : <CustomerChat />;
};

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;
  
  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gold text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <FiMessageCircle size={24} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-black/95 backdrop-blur-xl rounded-2xl border border-gold/30 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-gold/20 bg-gold/10">
              <h3 className="text-gold font-playfair font-bold"> Alem Cafe Chat</h3>  
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