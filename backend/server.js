import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSocket } from './socket.js';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import repairRoutes from './routes/repairRoutes.js';
import posRoutes from './routes/posRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import ecosystemRoutes from './routes/ecosystemRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for frontend clients (Vite dev server)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true
  })
);

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Quantum Mobile & Quick Store API',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin/employees', employeeRoutes);
app.use('/api/super-admin/roles', roleRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ecosystems', ecosystemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handling Middlewares (Spring Boot ControllerAdvice equivalent)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[Quantum Mobile API Server] Running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[API Base URL]: http://localhost:${PORT}/api`);
  console.log(`[Health Check]: http://localhost:${PORT}/api/health`);
  console.log(`[WebSocket Server]: Socket.io listening on port ${PORT}`);
  console.log(`=======================================================`);
});

export { app, server, io };
export default app;
