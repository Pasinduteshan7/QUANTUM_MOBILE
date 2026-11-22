import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find customer Kasun Perera
    let kasun = await User.findOne({ email: 'kasun@gmail.com' });
    if (!kasun) {
      kasun = await User.create({
        name: 'Kasun Perera',
        email: 'kasun@gmail.com',
        password: 'password123',
        role: 'customer'
      });
      console.log('Created Kasun Perera customer');
    }

    // Find sample Apple product
    const applePhone = await Product.findOne({ brand: 'Apple', category: 'Phones' }) || await Product.findOne({});
    console.log('Selected Product for Seeding:', applePhone?.name, applePhone?._id);

    // Create delivered order for Kasun if not exists
    let deliveredOrder = await Order.findOne({ user: kasun._id, orderStatus: 'DELIVERED' });
    if (!deliveredOrder && applePhone) {
      deliveredOrder = await Order.create({
        user: kasun._id,
        orderItems: [
          {
            name: applePhone.name,
            quantity: 1,
            image: applePhone.mainImage || '/accessories.jpg',
            price: applePhone.price || 425000,
            product: applePhone._id
          }
        ],
        shippingAddress: {
          fullName: 'Kasun Perera',
          phone: '+94 77 987 6543',
          street: '15 Havelock Road',
          city: 'Colombo 05',
          district: 'Colombo',
          postalCode: '00500'
        },
        paymentMethod: 'Stripe',
        paymentResult: { transactionId: 'pi_verified_delivered_101', status: 'COMPLETED' },
        itemsPrice: applePhone.price || 425000,
        shippingPrice: 0,
        totalPrice: applePhone.price || 425000,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        orderStatus: 'DELIVERED',
        courierPartner: 'Domex Express',
        waybillNumber: 'DOM-992144',
        estimatedDelivery: 'Delivered to Doorstep'
      });
      console.log('Created delivered order #ORD-' + deliveredOrder._id.toString().slice(-6).toUpperCase());
    }

    // Seed Reviews in MongoDB if empty
    const reviewCount = await Review.countDocuments();
    console.log(`Current MongoDB Reviews Count: ${reviewCount}`);

    if (reviewCount === 0 && applePhone) {
      const seeded = [
        {
          reviewType: 'PRODUCT',
          user: kasun._id,
          userName: 'Kasun Mendis',
          userEmail: 'kasun.mendis@gmail.com',
          product: applePhone._id,
          productName: applePhone.name,
          order: deliveredOrder ? deliveredOrder._id : null,
          orderRef: deliveredOrder ? 'ORD-' + deliveredOrder._id.toString().slice(-6).toUpperCase() : 'ORD-882190',
          rating: 5,
          title: 'Arrived sealed and fast dispatch',
          comment: 'Arrived sealed and fast dispatch. The titanium frame feels incredibly premium. Camera system is the best I have used.',
          isVerifiedBuyer: true,
          storeReply: {
            comment: 'Thank you, Kasun! Enjoy your new flagship device! Let us know if you need any accessory recommendations.',
            repliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            repliedBy: 'Official Quantum Mobile Store Admin'
          }
        },
        {
          reviewType: 'PRODUCT',
          user: kasun._id,
          userName: 'Dilini Perera',
          userEmail: 'dilini.p@gmail.com',
          product: applePhone._id,
          productName: applePhone.name,
          order: deliveredOrder ? deliveredOrder._id : null,
          orderRef: 'ORD-774129',
          rating: 5,
          title: 'Amazing battery life and ProRes video',
          comment: 'Battery life is amazing - easily gets through a full day with heavy usage. ProRes video is incredible for content creation.',
          isVerifiedBuyer: true,
          storeReply: {
            comment: null,
            repliedAt: null,
            repliedBy: null
          }
        },
        {
          reviewType: 'PRODUCT',
          user: kasun._id,
          userName: 'Ruwan Senanayake',
          userEmail: 'ruwan.s@gmail.com',
          product: applePhone._id,
          productName: applePhone.name,
          order: deliveredOrder ? deliveredOrder._id : null,
          orderRef: 'ORD-662901',
          rating: 4,
          title: 'Great phone overall, buttery smooth display',
          comment: 'Great phone overall. The Camera Control button takes a few days to get used to, but ProMotion is buttery smooth.',
          isVerifiedBuyer: true,
          storeReply: {
            comment: 'Thanks for the review Ruwan! Tip: You can adjust the Camera Control sensitivity in iOS Settings!',
            repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            repliedBy: 'Official Quantum Mobile Store Admin'
          }
        },
        {
          reviewType: 'REPAIR',
          user: kasun._id,
          userName: 'Dr. Shenal Wickramasinghe',
          userEmail: 'shenal.w@gmail.com',
          repairTicket: 'REP-7429',
          deviceModel: 'Apple iPhone 17 Pro Max (Cracked AMOLED Display)',
          rating: 5,
          title: 'Saved my phone in 35 minutes!',
          comment: 'Walked into the Colombo 03 lab with a shattered display. The technician installed a genuine OLED panel and calibrated True Tone in under 40 minutes. 90-day warranty certificate emailed immediately.',
          isVerifiedBuyer: true,
          storeReply: {
            comment: 'Thank you Dr. Shenal! Glad our Colombo 03 lab technician could get your iPhone back in pristine condition with genuine parts.',
            repliedAt: new Date(),
            repliedBy: 'Quantum Tech Support Desk'
          }
        }
      ];

      await Review.insertMany(seeded);
      console.log('Seeded 4 initial verified reviews into MongoDB successfully!');

      // Recalculate product rating
      const pReviews = await Review.find({ product: applePhone._id });
      const avg = Math.round((pReviews.reduce((acc, r) => acc + r.rating, 0) / pReviews.length) * 10) / 10;
      await Product.findByIdAndUpdate(applePhone._id, { rating: avg, numReviews: pReviews.length });
      console.log(`Updated ${applePhone.name} rating to ${avg} (${pReviews.length} reviews)`);
    }

    await mongoose.disconnect();
    console.log('Seeding finished cleanly.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

