import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.io with the HTTP server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.io] ${socket.id} joined user room: user:${userId}`);
      }
    });

    // Join specific repair ticket room for live diagnosis tracking
    socket.on('join:ticket', (ticketId) => {
      if (ticketId) {
        socket.join(`ticket:${ticketId.toUpperCase()}`);
        console.log(`[Socket.io] ${socket.id} joined ticket room: ticket:${ticketId.toUpperCase()}`);
      }
    });

    // Join admin operations room
    socket.on('join:admin', () => {
      socket.join('room:admin');
      console.log(`[Socket.io] ${socket.id} joined room:admin`);
    });

    // Join chat thread room
    socket.on('join:thread', (threadId) => {
      if (threadId) {
        socket.join(`thread:${threadId}`);
        console.log(`[Socket.io] ${socket.id} joined thread:${threadId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Access the active Socket.io instance
 */
export const getIO = () => {
  return io;
};

// ==========================================
// BROADCAST HELPERS
// ==========================================

/**
 * Real-time event: Repair ticket updated (status, bench notes, frozen quote)
 */
export const emitRepairUpdated = (repair) => {
  if (!io) return;
  const ticketId = repair.ticketId;
  // Broadcast to specific ticket channel, user channel, and admin console
  io.emit('repair:updated', repair);
  if (repair.ticketId) {
    io.to(`ticket:${repair.ticketId.toUpperCase()}`).emit('repair:ticketUpdated', repair);
  }
  if (repair.userId) {
    io.to(`user:${repair.userId}`).emit('repair:myTicketUpdated', repair);
  }
  console.log(`[Socket.io] Broadcast repair:updated for ${ticketId}`);
};

/**
 * Real-time event: Customer confirmed a new repair booking
 */
export const emitRepairBooked = (repair) => {
  if (!io) return;
  io.emit('repair:booked', repair);
  if (repair.userId) {
    io.to(`user:${repair.userId}`).emit('repair:myTicketBooked', repair);
  }
  console.log(`[Socket.io] Broadcast repair:booked for ${repair.ticketId}`);
};

/**
 * Real-time event: Repair invoice paid via Stripe
 */
export const emitRepairPaid = (repair) => {
  if (!io) return;
  io.emit('repair:paid', repair);
  console.log(`[Socket.io] Broadcast repair:paid for ${repair.ticketId}`);
};

/**
 * Real-time event: Product stock count updated (e.g. from Admin stock adjuster)
 */
export const emitStockUpdated = (productData) => {
  if (!io) return;
  io.emit('inventory:stockUpdated', productData);
  console.log(`[Socket.io] Broadcast inventory:stockUpdated for ${productData.name || productData._id}: stock=${productData.stock}`);
};

/**
 * Real-time event: POS checkout auto-deducted inventory units
 */
export const emitBulkStockUpdated = (deductions) => {
  if (!io) return;
  io.emit('inventory:bulkStockUpdated', deductions);
  console.log(`[Socket.io] Broadcast inventory:bulkStockUpdated for ${deductions.length} items`);
};

/**
 * Real-time event: Customer placed an online order
 */
export const emitOrderCreated = (order) => {
  if (!io) return;
  io.emit('order:created', order);
  console.log(`[Socket.io] Broadcast order:created for ${order._id}`);
};

/**
 * Real-time event: Order status updated (Dispatch, Delivered, Cancelled)
 */
export const emitOrderStatusUpdated = (order) => {
  if (!io) return;
  io.emit('order:statusUpdated', order);
  if (order.user) {
    const uid = typeof order.user === 'object' ? order.user._id : order.user;
    io.to(`user:${uid}`).emit('order:myStatusUpdated', order);
  }
  console.log(`[Socket.io] Broadcast order:statusUpdated for ${order._id}`);
};

/**
 * Real-time event: Live customer support chat message
 */
export const emitChatMessage = (message) => {
  if (!io) return;
  io.emit('chat:message', message);
  if (message.threadId) {
    io.to(`thread:${message.threadId}`).emit('chat:threadMessage', message);
  }
  console.log(`[Socket.io] Broadcast chat:message from ${message.senderName || 'Staff'}`);
};

