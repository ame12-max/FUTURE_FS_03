const db = require('../config/db');

const ChatController = {
  // Get or create conversation for a user (ensures one conversation per user)
  getOrCreateConversation: async (userId) => {
    // Check if conversation already exists for this user
    const [existing] = await db.query(
      'SELECT id, user_id, user_name, user_email FROM chat_conversations WHERE user_id = ?',
      [userId]
    );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    // Create new conversation
    const [user] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    if (!user.length) {
      throw new Error('User not found');
    }
    
    const [result] = await db.query(
      'INSERT INTO chat_conversations (user_id, user_name, user_email, last_message, last_message_time) VALUES (?, ?, ?, ?, NOW())',
      [user[0].id, user[0].name, user[0].email, '']
    );
    
    const [newConv] = await db.query('SELECT * FROM chat_conversations WHERE id = ?', [result.insertId]);
    return newConv[0];
  },
  
  // Save a new message
  saveMessage: async (senderId, senderName, senderRole, message, conversationId = null, recipientId = null) => {
    console.log('saveMessage called:', { senderId, senderName, senderRole, message, conversationId, recipientId });
    
    try {
      let convId = conversationId;
      let userId = recipientId || senderId;
      
      // If no conversation ID, get or create one for this user
      if (!convId) {
        const conversation = await ChatController.getOrCreateConversation(userId);
        convId = conversation.id;
        console.log('Using conversation:', convId);
      }
      
      // Update last message in conversation
      await db.query(
        'UPDATE chat_conversations SET last_message = ?, last_message_time = NOW() WHERE id = ?',
        [message, convId]
      );
      
      const isRead = (senderRole === 'admin' || senderRole === 'manager');
      
      const [msgResult] = await db.query(
        'INSERT INTO chat_messages (conversation_id, sender_id, sender_name, sender_role, message, is_read) VALUES (?, ?, ?, ?, ?, ?)',
        [convId, senderId, senderName, senderRole, message, isRead]
      );
      
      console.log('Message saved with ID:', msgResult.insertId);
      
      // Get the user_id for this conversation
      const [conv] = await db.query('SELECT user_id FROM chat_conversations WHERE id = ?', [convId]);
      
      return {
        id: msgResult.insertId,
        conversation_id: convId,
        sender_id: senderId,
        sender_name: senderName,
        sender_role: senderRole,
        message: message,
        created_at: new Date(),
        user_id: conv[0]?.user_id
      };
    } catch (err) {
      console.error('saveMessage error:', err);
      return null;
    }
  },
  
  // Get all conversations for admin
  getAdminConversations: async () => {
    try {
      const [rows] = await db.query(`
        SELECT c.*, 
          (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id AND is_read = FALSE AND sender_role = 'user') as unread_count,
          (SELECT message FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_text,
          (SELECT created_at FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
        FROM chat_conversations c 
        ORDER BY last_message_time DESC
      `);
      return rows;
    } catch (err) {
      console.error('Get conversations error:', err);
      return [];
    }
  },
  
  // Get conversation history
  getConversationHistory: async (conversationId) => {
    try {
      const [rows] = await db.query(`
        SELECT m.*, u.name as user_name 
        FROM chat_messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
      `, [conversationId]);
      return rows;
    } catch (err) {
      console.error('Get history error:', err);
      return [];
    }
  },

  // Get conversation for a specific user (customer)
getUserConversation: async (userId) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id AND is_read = FALSE AND sender_role != 'user') as unread_count
      FROM chat_conversations c 
      WHERE c.user_id = ?
      ORDER BY c.last_message_time DESC
      LIMIT 1
    `, [userId]);
    return rows[0] || null;
  } catch (err) {
    console.error('Get user conversation error:', err);
    return null;
  }
},
  
  // Mark messages as read
  markAsRead: async (conversationId) => {
    try {
      await db.query(
        'UPDATE chat_messages SET is_read = TRUE WHERE conversation_id = ? AND sender_role = ?',
        [conversationId, 'user']
      );
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }
};

module.exports = ChatController;