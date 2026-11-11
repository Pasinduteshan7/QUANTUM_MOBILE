import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import AuditLog from './models/AuditLog.js';
import ChatMessage from './models/ChatMessage.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  const admin = await User.findOne({ email: 'admin@quick.lk' });
  const owner = await User.findOne({ email: 'owner@quick.lk' });

  // Clear existing activity
  await AuditLog.deleteMany({});
  await ChatMessage.deleteMany({});

  // Seed sample audit logs
  await AuditLog.create([
    {
      user: admin?._id,
      userName: admin?.name || 'Store Manager (Admin)',
      userRole: 'admin',
      action: 'PRODUCT_STOCK_UPDATE',
      target: 'iPhone 16 Pro (Stock: 12 -> 15)',
      details: { delta: +3 },
      level: 'info',
      ip: '127.0.0.1',
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      user: admin?._id,
      userName: admin?.name || 'Store Manager (Admin)',
      userRole: 'admin',
      action: 'ORDER_STATUS_UPDATE',
      target: 'Order #ORD-9821 -> PROCESSING',
      details: { status: 'PROCESSING' },
      level: 'info',
      ip: '127.0.0.1',
      createdAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      user: owner?._id,
      userName: owner?.name || 'Platform Owner',
      userRole: 'super_admin',
      action: 'PRODUCT_PRICE_OVERRIDE',
      target: 'Apple Watch Ultra 2 (LKR 255,000 -> 245,000)',
      details: { discount: 'Promo Week' },
      level: 'warning',
      ip: '127.0.0.1',
      createdAt: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
      user: admin?._id,
      userName: admin?.name || 'Store Manager (Admin)',
      userRole: 'admin',
      action: 'PRODUCT_STOCK_UPDATE',
      target: 'Anker Prime 65W GaN (Stock: 0 -> 20)',
      details: { delta: +20 },
      level: 'success',
      ip: '127.0.0.1',
      createdAt: new Date(Date.now() - 120 * 60 * 1000)
    }
  ]);

  // Seed customer chat inquiries
  await ChatMessage.create([
    {
      conversationId: 'cust-kasun-101',
      senderName: 'Kasun Perera',
      senderEmail: 'kasun@gmail.com',
      senderRole: 'customer',
      message: 'Hi, does the iPhone 16 Pro Desert Titanium come with official Apple 1-Year TRCSL Sri Lanka warranty?',
      productContext: {
        id: 'iphone-16-pro',
        name: 'iPhone 16 Pro',
        price: 425000,
        image: '/iphone16pro.jpg'
      },
      isStaff: false,
      isRead: false,
      createdAt: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      conversationId: 'cust-niluka-202',
      senderName: 'Niluka Fernando',
      senderEmail: 'niluka.f@yahoo.com',
      senderRole: 'customer',
      message: 'Hello, how many units of the Galaxy S24 Ultra are left in Titanium Gray?',
      productContext: {
        id: 'galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        price: 389000,
        image: '/galaxy_s26_ultra.jpg'
      },
      isStaff: false,
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000)
    }
  ]);

  console.log('Successfully seeded audit logs and customer chat inquiries!');
  process.exit(0);
};

seed();
