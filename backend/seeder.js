import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import User from './models/User.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const sampleUsers = [
  {
    name: 'Platform Owner (Super Admin)',
    email: 'owner@quick.lk',
    password: 'password123',
    role: 'super_admin',
    phone: '+94 77 000 0001',
    shippingAddress: {
      street: '100 Galle Face Terrace',
      city: 'Colombo 03',
      district: 'Colombo',
      postalCode: '00300'
    }
  },
  {
    name: 'Store Manager (Admin)',
    email: 'admin@quick.lk',
    password: 'password123',
    role: 'admin',
    phone: '+94 77 123 4567',
    shippingAddress: {
      street: '42 Galle Road',
      city: 'Colombo 03',
      district: 'Colombo',
      postalCode: '00300'
    }
  },
  {
    name: 'Kasun Perera',
    email: 'kasun@gmail.com',
    password: 'password123',
    role: 'customer',
    phone: '+94 71 987 6543',
    shippingAddress: {
      street: '15 Kandy Road',
      city: 'Kadawatha',
      district: 'Gampaha',
      postalCode: '11850'
    }
  }
];

const sampleProducts = [
  // APPLE
  {
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3294',
    tagline: 'Hello, Apple Intelligence.',
    description: '6.3-inch Super Retina XDR display with ProMotion 120Hz. Grade 5 titanium unibody, A18 Pro silicon, 48MP Fusion camera system with 5x telephoto optical zoom, and dedicated Camera Control.',
    price: 425000,
    originalPrice: 445000,
    stock: 15,
    mainImage: '/iphone16pro.jpg',
    images: ['/iphone16pro.jpg', '/iphone15.jpg'],
    finishes: [
      { name: 'Desert Titanium', hex: '#cbb7a2', image: '/iphone16pro.jpg' },
      { name: 'Natural Titanium', hex: '#9e9893', image: '/iphone16pro.jpg' },
      { name: 'White Titanium', hex: '#f0f0f2', image: '/iphone15.jpg' },
      { name: 'Black Titanium', hex: '#2f3133', image: '/iphone16pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.3-inch Super Retina XDR OLED up to 120Hz ProMotion' },
      { title: 'Camera', desc: '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto' },
      { title: 'Chip', desc: 'Apple A18 Pro 3nm with 6-core GPU and Ray Tracing' },
      { title: 'Battery', desc: 'Up to 27 hours video playback with MagSafe 25W fast charge' }
    ],
    badge: 'NEW',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 48
  },
  {
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'Watch',
    modelCode: 'A2986',
    tagline: 'Relentless. Extreme adventure ready.',
    description: '49mm aerospace-grade titanium case with raised sapphire crystal edges. 3,000 nits brightest Apple display with customizable orange Action button.',
    price: 245000,
    originalPrice: 265000,
    stock: 12,
    mainImage: '/apple_watch_ultra.jpg',
    images: ['/apple_watch_ultra.jpg'],
    finishes: [
      { name: 'Natural Titanium + Orange Ocean Band', hex: '#f97316', image: '/apple_watch_ultra.jpg' },
      { name: 'Black Titanium', hex: '#1e2022', image: '/apple_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: '49mm aerospace-grade titanium' },
      { title: 'Display', desc: '3000 nits peak sapphire crystal' },
      { title: 'Water Resistance', desc: '100m water resistant, certified dive computer to 40m' }
    ],
    badge: 'TITANIUM',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 32
  },
  {
    name: 'Apple AirPods Pro (2nd Gen) USB-C',
    brand: 'Apple',
    category: 'Audio',
    modelCode: 'MTJV3',
    tagline: 'Adaptive Audio. Now playing.',
    description: 'Apple H2 chip delivering advanced computational audio, 2x more Active Noise Cancellation, and Personalized Spatial Audio with dynamic head tracking.',
    price: 76000,
    originalPrice: 85000,
    stock: 25,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [{ name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }],
    specs: [
      { title: 'Chip', desc: 'Apple H2 acoustic processor' },
      { title: 'Noise Cancellation', desc: 'Up to 2x more ANC with Adaptive Audio' },
      { title: 'Battery', desc: 'Up to 30 hours total with MagSafe USB-C case' }
    ],
    badge: 'H2 SILICON',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 64
  },

  // SAMSUNG
  {
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-S928B',
    tagline: 'Titanium meets AI brilliance.',
    description: '6.8-inch Dynamic AMOLED 2X flat display with Gorilla Armor anti-reflective glass. Integrated low-latency S Pen and 200MP Quad Telephoto camera with ProVisual AI Engine.',
    price: 385000,
    originalPrice: 410000,
    stock: 14,
    mainImage: '/samsung_s24.jpg',
    images: ['/samsung_s24.jpg', '/zflip6.jpg'],
    finishes: [
      { name: 'Titanium Gray', hex: '#6b6e73', image: '/samsung_s24.jpg' },
      { name: 'Titanium Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.8-inch QHD+ 120Hz Dynamic AMOLED 2X' },
      { title: 'Camera', desc: '200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-wide' },
      { title: 'AI System', desc: 'Circle to Search, Live Call Translation, Generative Edit' },
      { title: 'S Pen', desc: 'Integrated 2.8ms low latency stylus built-in' }
    ],
    badge: 'GALAXY AI',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 53
  },
  {
    name: 'Galaxy Watch Ultra (47mm)',
    brand: 'Samsung',
    category: 'Watch',
    modelCode: 'SM-L705F',
    tagline: 'Defy boundaries with titanium armor.',
    description: '47mm Grade 4 titanium cushion case with dual-frequency GPS (L1+L5), emergency siren, and up to 100 hours power saving endurance.',
    price: 185000,
    originalPrice: 198000,
    stock: 10,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Titanium Gray + Marine Band', hex: '#64748b', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: 'Grade 4 Titanium with 10ATM & IP68 water resistance' },
      { title: 'Battery', desc: '590mAh with up to 100 hours power saving mode' }
    ],
    badge: '100M WATER',
    featured: true,
    trcslApproved: true,
    rating: 4.8,
    numReviews: 21
  },

  // GOOGLE PIXEL
  {
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    category: 'Phones',
    modelCode: 'G1MNW',
    tagline: 'The smartest phone in your hands.',
    description: '6.8-inch Super Actua LTPO OLED up to 120Hz with 3,000 nits peak brightness. Designed alongside Google DeepMind with 16GB RAM for on-device Gemini Live and 7 years of full OS upgrades.',
    price: 295000,
    originalPrice: 320000,
    stock: 11,
    mainImage: '/pixel9pro.jpg',
    images: ['/pixel9pro.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.8-inch Super Actua LTPO OLED, 3000 nits peak' },
      { title: 'Processor', desc: 'Google Tensor G4 + Titan M2 security + 16GB RAM' },
      { title: 'AI', desc: 'Gemini Live, Magic Editor, Pixel Studio on-device' },
      { title: 'Updates', desc: '7 years of guaranteed Android OS and security upgrades' }
    ],
    badge: 'GEMINI AI',
    featured: true,
    trcslApproved: true,
    rating: 4.8,
    numReviews: 39
  },
  {
    name: 'Google Pixel Watch 3 (45mm)',
    brand: 'Google',
    category: 'Watch',
    modelCode: 'PW3-45',
    tagline: 'Advanced fitness meets Google AI.',
    description: '45mm custom curved 3D Actua display with 2,000 nits brightness. Deep Fitbit integration with Daily Readiness and Cardio Load tracking.',
    price: 128000,
    originalPrice: 140000,
    stock: 9,
    mainImage: '/pixel_watch_3.jpg',
    images: ['/pixel_watch_3.jpg'],
    finishes: [
      { name: 'Matte Hazel + Porcelain Active Band', hex: '#e5e2dc', image: '/pixel_watch_3.jpg' }
    ],
    specs: [
      { title: 'Screen', desc: '45mm Actua Display, 2,000 nits peak' },
      { title: 'Fitbit', desc: 'Cardio Load, Target Load running coach, Daily Readiness' }
    ],
    badge: 'ACTUA DISPLAY',
    featured: true,
    trcslApproved: true,
    rating: 4.7,
    numReviews: 18
  },

  // ONEPLUS
  {
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    category: 'Phones',
    modelCode: 'CPH2581',
    tagline: 'Smooth beyond belief.',
    description: '2K 120Hz ProXDR display with 4,500 nits peak brightness and Aqua Touch wet finger recognition. 4th Gen Hasselblad camera, Snapdragon 8 Gen 3, and 100W SUPERVOOC charging (1% to 100% in 26 minutes).',
    price: 225000,
    originalPrice: 245000,
    stock: 18,
    mainImage: '/oneplus12.jpg',
    images: ['/oneplus12.jpg'],
    finishes: [
      { name: 'Flowy Emerald', hex: '#1d4838', image: '/oneplus12.jpg' },
      { name: 'Silky Black', hex: '#262829', image: '/oneplus12.jpg' }
    ],
    specs: [
      { title: 'Charging', desc: '100W wired SUPERVOOC (0-100% in 26 mins) + 50W wireless' },
      { title: 'Optics', desc: '4th Gen Hasselblad with 50MP Sony LYT-808 sensor' },
      { title: 'Cooling', desc: 'Dual Cryo-velocity VC cooling (9,140mm² area)' }
    ],
    badge: '100W FAST',
    featured: true,
    trcslApproved: true,
    rating: 4.8,
    numReviews: 29
  },

  // XIAOMI
  {
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'Phones',
    modelCode: '24030PN60G',
    tagline: 'A camera that happens to be a phone.',
    description: '1-inch Sony LYT-900 flagship image sensor with stepless f/1.63 - f/4.0 variable physical aperture. Leica Summilux quad 50MP array and 90W HyperCharge.',
    price: 365000,
    originalPrice: 389000,
    stock: 8,
    mainImage: '/xiaomi14ultra.jpg',
    images: ['/xiaomi14ultra.jpg'],
    finishes: [
      { name: 'Vegan Black Leather', hex: '#212326', image: '/xiaomi14ultra.jpg' },
      { name: 'Titanium White', hex: '#d4d7db', image: '/xiaomi14ultra.jpg' }
    ],
    specs: [
      { title: 'Optics', desc: '1-inch Sony LYT-900 sensor with stepless physical aperture' },
      { title: 'Leica Array', desc: 'Four 50MP cameras covering 12mm to 120mm focal lengths' },
      { title: 'Power', desc: '90W wired HyperCharge (0-100% in 33 mins) + 80W wireless' }
    ],
    badge: 'LEICA OPTICS',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 41
  },

  // ACCESSORIES
  {
    name: 'Apple MagSafe 25W Charger (1m)',
    brand: 'Apple',
    category: 'Chargers',
    description: 'Fast wireless magnetic charging up to 25W for iPhone 16 series with braided durable cable.',
    price: 15500,
    stock: 40,
    mainImage: '/apple_magsafe.jpg',
    images: ['/apple_magsafe.jpg'],
    badge: '25W FAST',
    featured: false,
    trcslApproved: true,
    rating: 4.8,
    numReviews: 55
  },
  {
    name: 'Anker 65W GaN Fast Charger',
    brand: 'Anker',
    category: 'Chargers',
    description: 'Compact 3-port Gallium Nitride charger powering laptops, phones and earbuds simultaneously with ActiveShield 2.0 temperature monitoring.',
    price: 16500,
    stock: 35,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    badge: 'BESTSELLER',
    featured: true,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 87
  },
  {
    name: 'Spigen Ultra Hybrid MagSafe Case',
    brand: 'Spigen',
    category: 'Cases',
    description: 'Crystal clear military-grade drop protection with integrated N52 neodymium magnetic ring for MagSafe accessories.',
    price: 7500,
    stock: 50,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    badge: 'MIL-GRADE',
    featured: false,
    trcslApproved: true,
    rating: 4.8,
    numReviews: 62
  },
  {
    name: 'Belkin UltraGlass 2 Screen Protector',
    brand: 'Belkin',
    category: 'Accessories',
    description: 'Double ion-exchange tempered glass engineered with German optics experts for maximum scratch and drop resistance.',
    price: 6500,
    stock: 60,
    mainImage: '/belkin_glass.jpg',
    images: ['/belkin_glass.jpg'],
    badge: '9H HARDNESS',
    featured: false,
    trcslApproved: true,
    rating: 4.9,
    numReviews: 73
  }
];

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Inserting sample users...');
    const createdUsers = await User.create(sampleUsers);

    console.log('[Seeder] Inserting catalog products with all colour variants...');
    let productsToInsert = sampleProducts;
    const jsonPath = path.join(__dirname, 'data', 'products.json');
    if (fs.existsSync(jsonPath)) {
      productsToInsert = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }
    const createdProducts = await Product.insertMany(productsToInsert);

    console.log('=======================================================');
    console.log(`[Seeder SUCCESS]: Seeded ${createdUsers.length} users and ${createdProducts.length} products!`);
    console.log(`[Admin Account]: admin@quick.lk / password123`);
    console.log(`[Customer Account]: kasun@gmail.com / password123`);
    console.log('=======================================================');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('[Seeder] Data completely cleared from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Destroy Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
