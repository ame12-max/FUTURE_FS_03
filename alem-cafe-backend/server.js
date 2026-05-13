require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const multer = require('multer');

const db = require('./config/db');


// Import routes
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Import Chat Controller
const ChatController = require('./controllers/chatController');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('Socket auth token received:', token ? 'Yes' : 'No');
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Fetch full user data from database to get name
    db.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id])
      .then(([rows]) => {
        if (rows.length === 0) {
          return next(new Error('User not found'));
        }
        const user = rows[0];
        socket.userId = user.id;
        socket.userRole = user.role;
        socket.userName = user.name;  // ✅ Set the user's name
        console.log('Socket authenticated:', socket.userId, socket.userRole, socket.userName);
        next();
      })
      .catch(err => {
        console.error('DB error during socket auth:', err);
        next(new Error('Authentication failed'));
      });
  } catch (err) {
    console.error('JWT verification error:', err.message);
    next(new Error('Invalid token'));
  }
});
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.userId, socket.userRole, socket.userName);
  
  // Join rooms
  if (socket.userRole === 'admin' || socket.userRole === 'manager') {
    socket.join('admin-room');
    console.log('Admin joined admin-room');
    ChatController.getAdminConversations().then(conversations => {
      socket.emit('conversations-list', conversations);
    });
  }
  
  socket.join(`user-${socket.userId}`);
  console.log(`User ${socket.userId} joined room user-${socket.userId}`);
  
socket.on('get-conversations', async () => {
  console.log('get-conversations requested by:', socket.userId, socket.userRole);
  if (socket.userRole === 'admin' || socket.userRole === 'manager') {
    const conversations = await ChatController.getAdminConversations();
    socket.emit('conversations-list', conversations);
  } else {
    // For customers, get their specific conversation
    const conversation = await ChatController.getUserConversation(socket.userId);
    if (conversation) {
      socket.emit('conversations-list', [conversation]);
    } else {
      socket.emit('conversations-list', []);
    }
  }
});
  
  socket.on('send-message', async (data) => {
    const { message, conversationId, recipientId } = data;
    console.log('🔵 send-message received:', { message, conversationId, recipientId, senderId: socket.userId, senderRole: socket.userRole });
    
    const result = await ChatController.saveMessage(
      socket.userId, 
      socket.userName, 
      socket.userRole, 
      message, 
      conversationId, 
      recipientId
    );
    
    console.log('Save message result:', result);
    
    if (result) {
      if (socket.userRole === 'user') {
        // Customer sending to admin - broadcast to all admins
        console.log('Customer sending to admin room');
        io.to('admin-room').emit('new-message', result);
        io.to(`user-${socket.userId}`).emit('message-received', result);
        
        // Update conversations list for admins
        const conversations = await ChatController.getAdminConversations();
        io.to('admin-room').emit('conversations-list', conversations);
      } else {
        // Admin/Manager sending to customer
        const targetRoom = `user-${result.user_id}`;
        console.log('Admin sending to customer room:', targetRoom);
        io.to(targetRoom).emit('new-message', result);
        socket.emit('message-received', result);
        
        // Update conversations list for admins
        const conversations = await ChatController.getAdminConversations();
        io.to('admin-room').emit('conversations-list', conversations);
      }
    }
  });
  
  socket.on('get-history', async (conversationId) => {
    console.log('get-history for conversation:', conversationId);
    const messages = await ChatController.getConversationHistory(conversationId);
    socket.emit('history-data', messages);
  });
  
  socket.on('mark-read', async (conversationId) => {
    console.log('mark-read for conversation:', conversationId);
    await ChatController.markAsRead(conversationId);
    if (socket.userRole === 'admin' || socket.userRole === 'manager') {
      const conversations = await ChatController.getAdminConversations();
      io.to('admin-room').emit('conversations-list', conversations);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

// Test route
app.get('/test', (req, res) => res.json({ message: 'Server is running' }));

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', upload.single('image'), adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));