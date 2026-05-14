// src/components/Chat/AdminChat.jsx
import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const AdminChat = () => {
  const { conversations, activeConversation, loadConversation, messages, sendMessage, messagesEndRef, isConnected } = useChat();
  const [input, setInput] = useState('');
  
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      loadConversation(conversations[0]);
    }
  }, [conversations]);
  
  const handleSend = () => {
    if (input.trim() && activeConversation) {
      sendMessage(input, activeConversation.id);
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
      <div className="border-b border-white/10 max-h-40 overflow-y-auto">
        <div className="p-2">
          <h4 className="text-gold text-sm font-semibold mb-2 px-2">Conversations</h4>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm px-2">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv)}
                className={`w-full text-left p-2 rounded-lg transition mb-1 ${activeConversation?.id === conv.id ? 'bg-gold/20 text-gold' : 'hover:bg-white/10 text-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{conv.user_name}</span>
                  {conv.unread_count > 0 && <span className="bg-gold text-black text-xs px-1.5 py-0.5 rounded-full">{conv.unread_count}</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{conv.last_message || 'No messages'}</p>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!activeConversation ? (
          <div className="text-center text-gray-400 py-8">Select a conversation to start chatting</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No messages yet</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender_role === 'admin' || msg.sender_role === 'manager' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender_role === 'admin' || msg.sender_role === 'manager' ? 'bg-gold text-black rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                <p className="text-xs opacity-70 mb-1">{msg.sender_name}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-50 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {activeConversation && (
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
            <button onClick={handleSend} className="bg-gold text-black px-4 py-2 rounded-full font-semibold hover:bg-gold-light transition">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
