import { io } from 'socket.io-client';

let socket = null;

const SOCKET_SERVER_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' ? 'http://localhost:5000' : `${window.location.protocol}//${window.location.hostname}:5000`)
  : 'http://localhost:5000';

/**
 * Get or initialize singleton Socket.io client instance
 */
export const getSocket = () => {
  if (!socket && typeof window !== 'undefined') {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Connected to Quantum Backend]:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ [Socket.io Connection Notice]:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.io Disconnected]:', reason);
    });
  }

  return socket;
};

/**
 * Join a specific repair ticket room for instant cleanroom bench push updates
 */
export const joinTicketRoom = (ticketId) => {
  const s = getSocket();
  if (s && ticketId) {
    s.emit('join:ticket', ticketId);
  }
};

/**
 * Join user-specific notification channel
 */
export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join:user', userId);
  }
};

/**
 * Join Admin operations room
 */
export const joinAdminRoom = () => {
  const s = getSocket();
  if (s) {
    s.emit('join:admin');
  }
};

/**
 * Join live chat thread room for instant customer/specialist dialogue
 */
export const joinThreadRoom = (threadId) => {
  const s = getSocket();
  if (s && threadId) {
    s.emit('join:thread', threadId);
  }
};

export default getSocket;

