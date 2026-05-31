// src/components/Chat/CustomerChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomerChat = () => {
  const { messages, sendMessage, activeConversation, conversations, loadConversation, messagesEndRef, isConnected, socket } = useChat();
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('get-conversations');
    }
  }, [socket, isConnected]);
  
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversation) {
      loadConversation(conversations[0]);
    }
  }, [conversations]);
  
  // Auto-focus input on mobile - removed isOpen reference
  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isMobile]);
  
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input, activeConversation?.id, null);
      setInput('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-3"></div>
          <p className="text-sm">{t('chat.Connecting')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>{t('chat.startConversation')}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 rounded-2xl ${
                  msg.sender_role === 'user'
                    ? 'bg-gold text-black rounded-br-sm'
                    : 'bg-white/10 text-white rounded-bl-sm'
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {msg.sender_role === 'user' ? 'You' : 'Alem Cafe Admin'}
                </p>
                <p className="text-sm break-words">{msg.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className=" border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.typeMessage')}
            className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
          />
          <br/>
          <button
            onClick={handleSend}
            className="bg-gold text-black px-4 sm:px-5 py-2 rounded-full font-semibold hover:bg-gold-light transition text-sm sm:text-base whitespace-nowrap"
          >
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
