import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token, loading: authLoading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user || !token) {
      console.log('No user or token, skipping socket connection');
      return;
    }

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    console.log('Connecting to Socket.IO server at:', API_URL);
    console.log('User:', user.id, user.email);

    const newSocket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully!', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
      newSocket.emit('get-conversations');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });
    
 // In ChatContext.jsx, add more logging in the conversations-list handler
newSocket.on('conversations-list', (data) => {
  console.log('📋 Received conversations:', JSON.stringify(data, null, 2));
  setConversations(data);
  const totalUnread = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  setUnreadCount(totalUnread);
  
  // Auto-load first conversation for customers
  if (user?.role === 'user' && data.length > 0 && !activeConversation) {
    console.log('🔄 Auto-loading conversation for customer:', data[0]);
    setActiveConversation(data[0]);
    console.log('📡 Requesting history for conversation:', data[0].id);
    newSocket.emit('get-history', data[0].id);
    newSocket.emit('mark-read', data[0].id);
  } else if (user?.role === 'user' && data.length === 0) {
    console.log('📭 No existing conversation for this customer');
  }
});

// Add logging for history-data
newSocket.on('history-data', (data) => {
  console.log('📜 Received history:', data.length, 'messages');
  console.log('📜 First message:', data[0]);
  setMessages(data);
  scrollToBottom();
});
    
    newSocket.on('new-message', (message) => {
      console.log('🆕 New message received:', message);
      
      // Refresh conversations list
      newSocket.emit('get-conversations');
      
      // If this message belongs to the active conversation, add it
      if (activeConversation?.id === message.conversation_id) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        scrollToBottom();
      }
      
      // Show notification for new messages
      if (message.sender_role !== user?.role) {
        toast.success(`${message.sender_name}: ${message.message.substring(0, 50)}`, { duration: 3000 });
      }
    });
    
    newSocket.on('message-received', (message) => {
      console.log('✅ Message confirmed delivered:', message);
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    });
    
    newSocket.on('history-data', (data) => {
      console.log('📜 Received history:', data.length, 'messages');
      setMessages(data);
      scrollToBottom();
    });
    
    return () => {
      console.log('Cleaning up socket connection');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, token, authLoading]); // Removed activeConversation from deps to prevent reconnections
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const sendMessage = (message, conversationId = null, recipientId = null) => {
    if (socket && message.trim() && isConnected) {
      console.log('Sending message:', { message, conversationId, recipientId });
      socket.emit('send-message', { message, conversationId, recipientId });
    } else {
      console.warn('Cannot send message - socket not connected');
      toast.error('Not connected to chat server');
    }
  };
  
  const loadConversation = (conversation) => {
    console.log('Loading conversation:', conversation);
    setActiveConversation(conversation);
    if (socket && isConnected) {
      socket.emit('get-history', conversation.id);
      socket.emit('mark-read', conversation.id);
    }
  };
  
  const startNewConversation = (userId, userName) => {
    setActiveConversation({ user_id: userId, user_name: userName, id: null });
    setMessages([]);
  };
  
  return (
    <ChatContext.Provider value={{
      socket,
      isConnected,
      connectionError,
      conversations,
      activeConversation,
      messages,
      unreadCount,
      sendMessage,
      loadConversation,
      startNewConversation,
      messagesEndRef
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};