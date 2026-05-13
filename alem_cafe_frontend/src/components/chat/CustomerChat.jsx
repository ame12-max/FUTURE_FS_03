import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const CustomerChat = () => {
  const { 
    messages, 
    sendMessage, 
    activeConversation, 
    conversations, 
    loadConversation, 
    messagesEndRef, 
    isConnected,
    socket 
  } = useChat();
  const [input, setInput] = useState('');
  
  // Request conversations when chat opens
  useEffect(() => {
    if (socket && isConnected) {
      console.log('📡 Requesting conversations...');
      socket.emit('get-conversations');
    }
  }, [socket, isConnected]);
  
  // Load conversation if exists and not loaded
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversation) {
      console.log('🔄 Loading conversation:', conversations[0]);
      loadConversation(conversations[0]);
    }
  }, [conversations]);
  
  const handleSend = () => {
    if (input.trim()) {
      console.log('📤 Sending message:', input);
      sendMessage(input, activeConversation?.id, null);
      setInput('');
    }
  };
  
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
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>Start a conversation with our support team</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.sender_role === 'user'
                    ? 'bg-gold text-black rounded-br-sm'
                    : 'bg-white/10 text-white rounded-bl-sm'
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {msg.sender_role === 'user' ? 'You' : 'Support'}
                </p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
          />
          <button
            onClick={handleSend}
            className="bg-gold text-black px-4 py-2 rounded-full font-semibold hover:bg-gold-light transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;