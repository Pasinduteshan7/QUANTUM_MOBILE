import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from './models/Product.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const allProducts = [
  // =========================================================================
  // 1. APPLE ECOSYSTEM (iPhones, Watch, Audio, MagSafe & Power, Protection)
  // =========================================================================
  {
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3296',
    tagline: 'Hello, Apple Intelligence. 6.9-inch Titanium.',
    description: '6.9-inch Super Retina XDR display with ProMotion 120Hz. Grade 5 titanium unibody, A18 Pro silicon, 48MP Fusion camera with 5x telephoto optical zoom, and Camera Control.',
    price: 465000,
    originalPrice: 495000,
    stock: 20,
    mainImage: '/iphone16pro.jpg',
    images: ['/iphone16pro.jpg', '/iphone15.jpg'],
    finishes: [
      { name: 'Desert Titanium', hex: '#cbb7a2', image: '/iphone16pro.jpg' },
      { name: 'Natural Titanium', hex: '#9e9893', image: '/iphone16pro.jpg' },
      { name: 'White Titanium', hex: '#f0f0f2', image: '/iphone15.jpg' },
      { name: 'Black Titanium', hex: '#2f3133', image: '/iphone16pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.9-inch Super Retina XDR OLED with ProMotion up to 120Hz' },
      { title: 'Camera System', desc: '48MP Fusion Main + 48MP Ultra Wide + 12MP 5x Telephoto' },
      { title: 'Processor', desc: 'A18 Pro chip with 6-core GPU and 16-core Neural Engine' },
      { title: 'Battery', desc: 'Up to 33 hours video playback with MagSafe 25W wireless charging' }
    ],
    badge: 'NEW FLAGSHIP',
    featured: true
  },
  {
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3294',
    tagline: 'Hello, Apple Intelligence.',
    description: '6.3-inch Super Retina XDR display with ProMotion 120Hz. Grade 5 titanium unibody, A18 Pro silicon, 48MP Fusion camera system with 5x telephoto optical zoom, and dedicated Camera Control.',
    price: 425000,
    originalPrice: 450000,
    stock: 25,
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
    badge: 'PRO',
    featured: true
  },
  {
    name: 'iPhone 16 Plus',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3290',
    tagline: 'Big screen. Huge battery life.',
    description: '6.7-inch Super Retina XDR display, A18 chip, Camera Control, 48MP Fusion camera, and up to 27 hours video playback.',
    price: 335000,
    originalPrice: 355000,
    stock: 15,
    mainImage: '/iphone15.jpg',
    images: ['/iphone15.jpg'],
    finishes: [
      { name: 'Ultramarine', hex: '#4361ee', image: '/iphone15.jpg' },
      { name: 'Teal', hex: '#2ec4b6', image: '/iphone15.jpg' },
      { name: 'Pink', hex: '#f72585', image: '/iphone15.jpg' },
      { name: 'White', hex: '#ffffff', image: '/iphone15.jpg' },
      { name: 'Black', hex: '#1e293b', image: '/iphone15.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.7-inch Super Retina XDR OLED with Dynamic Island' },
      { title: 'Camera', desc: '48MP Fusion with 2x Telephoto + 12MP Ultra Wide with Macro' },
      { title: 'Chip', desc: 'Apple A18 chip with 5-core GPU' },
      { title: 'Battery', desc: 'Up to 27 hours video playback' }
    ],
    badge: 'PLUS'
  },
  {
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3287',
    tagline: 'Built for Apple Intelligence.',
    description: '6.1-inch Super Retina XDR display, A18 chip, Camera Control, 48MP Fusion camera with 2x Telephoto, and aerospace-grade aluminum.',
    price: 295000,
    originalPrice: 315000,
    stock: 30,
    mainImage: '/iphone15.jpg',
    images: ['/iphone15.jpg'],
    finishes: [
      { name: 'Ultramarine', hex: '#4361ee', image: '/iphone15.jpg' },
      { name: 'Teal', hex: '#2ec4b6', image: '/iphone15.jpg' },
      { name: 'Pink', hex: '#f72585', image: '/iphone15.jpg' },
      { name: 'Black', hex: '#1e293b', image: '/iphone15.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.1-inch Super Retina XDR OLED, Dynamic Island' },
      { title: 'Camera', desc: '48MP 2-in-1 Fusion camera + 12MP Ultra Wide' },
      { title: 'Chip', desc: 'Apple A18 silicon with hardware ray tracing' }
    ],
    badge: 'POPULAR'
  },
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3106',
    tagline: 'Titanium powerhouse.',
    description: '6.7-inch Super Retina XDR display with ProMotion 120Hz, A17 Pro chip, Action button, and 5x optical telephoto camera.',
    price: 370000,
    originalPrice: 410000,
    stock: 12,
    mainImage: '/iphone16pro.jpg',
    images: ['/iphone16pro.jpg'],
    finishes: [
      { name: 'Natural Titanium', hex: '#9e9893', image: '/iphone16pro.jpg' },
      { name: 'Blue Titanium', hex: '#2c3e50', image: '/iphone16pro.jpg' },
      { name: 'Black Titanium', hex: '#2f3133', image: '/iphone16pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.7-inch Super Retina XDR OLED 120Hz' },
      { title: 'Camera', desc: '48MP Main + 5x 120mm Telephoto + Ultra Wide' },
      { title: 'Chip', desc: 'Apple A17 Pro 3nm with USB 3 speeds' }
    ],
    badge: 'VALUE DEAL'
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A3090',
    tagline: 'As durable as it is delightful.',
    description: '6.1-inch Super Retina XDR OLED with Dynamic Island. Color-infused back glass with contoured aluminum edges and A16 Bionic.',
    price: 245000,
    originalPrice: 265000,
    stock: 25,
    mainImage: '/iphone15.jpg',
    images: ['/iphone15.jpg'],
    finishes: [
      { name: 'Pastel Blue', hex: '#d2e2ee', image: '/iphone15.jpg' },
      { name: 'Pink', hex: '#f7d6d8', image: '/iphone15.jpg' },
      { name: 'Black', hex: '#35373b', image: '/iphone15.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.1-inch Super Retina XDR with Dynamic Island' },
      { title: 'Camera', desc: '48MP Main with 2x Telephoto crop' },
      { title: 'Chip', desc: 'A16 Bionic 5-core GPU' }
    ],
    badge: 'BESTSELLER'
  },
  {
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A2882',
    tagline: 'Big and bigger wonder.',
    description: '6.1-inch Super Retina XDR display, dual camera system, Crash Detection, and all-day battery life.',
    price: 195000,
    originalPrice: 215000,
    stock: 18,
    mainImage: '/iphone15.jpg',
    images: ['/iphone15.jpg'],
    finishes: [
      { name: 'Midnight', hex: '#1e293b', image: '/iphone15.jpg' },
      { name: 'Starlight', hex: '#f8fafc', image: '/iphone15.jpg' },
      { name: 'Blue', hex: '#93c5fd', image: '/iphone15.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.1-inch Super Retina XDR display' },
      { title: 'Camera', desc: '12MP Main + 12MP Ultra Wide with Photonic Engine' },
      { title: 'Chip', desc: 'A15 Bionic with 5-core GPU' }
    ],
    badge: 'BUDGET FRIENDLY'
  },
  {
    name: 'iPhone 13',
    brand: 'Apple',
    category: 'Phones',
    modelCode: 'A2633',
    tagline: 'Your new superpower.',
    description: '6.1-inch Super Retina XDR OLED, Cinematic mode in 1080p, durable flat-edge design, and water resistance.',
    price: 165000,
    originalPrice: 185000,
    stock: 14,
    mainImage: '/iphone15.jpg',
    images: ['/iphone15.jpg'],
    finishes: [
      { name: 'Midnight', hex: '#1e293b', image: '/iphone15.jpg' },
      { name: 'Starlight', hex: '#f8fafc', image: '/iphone15.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.1-inch OLED Super Retina XDR' },
      { title: 'Camera', desc: 'Advanced dual-camera system with Sensor-shift OIS' },
      { title: 'Chip', desc: 'A15 Bionic chip' }
    ],
    badge: 'ENTRY LEVEL'
  },
  // Apple Watch
  {
    name: 'Apple Watch Ultra 2 (49mm)',
    brand: 'Apple',
    category: 'Watch',
    modelCode: 'A2986',
    tagline: 'Relentless. Extreme adventure ready.',
    description: '49mm aerospace-grade titanium case with sapphire front crystal. 3,000 nits display, dual-frequency GPS, customizable Action button, and 36-hour battery.',
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
      { title: 'Case', desc: '49mm Grade 5 Titanium with 100m water resistance' },
      { title: 'Display', desc: '3,000 nits Always-On Retina display' },
      { title: 'Battery', desc: 'Up to 36 hours normal use, 72 hours Low Power' },
      { title: 'Sensors', desc: 'Depth gauge, water temperature sensor, ECG and Blood Oxygen' }
    ],
    badge: 'TITANIUM 49MM',
    featured: true
  },
  {
    name: 'Apple Watch Series 10 (46mm)',
    brand: 'Apple',
    category: 'Watch',
    modelCode: 'A3001',
    tagline: 'Thinnest Apple Watch ever with wide-angle OLED.',
    description: 'Up to 10% thinner design with Apple’s biggest, most advanced wide-angle OLED display, sleep apnea notifications, and fast charging.',
    price: 155000,
    originalPrice: 170000,
    stock: 15,
    mainImage: '/apple_watch_ultra.jpg',
    images: ['/apple_watch_ultra.jpg'],
    finishes: [
      { name: 'Jet Black Aluminum', hex: '#000000', image: '/apple_watch_ultra.jpg' },
      { name: 'Rose Gold Aluminum', hex: '#f43f5e', image: '/apple_watch_ultra.jpg' },
      { name: 'Silver Aluminum', hex: '#e2e8f0', image: '/apple_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: '46mm lightweight aluminum with Ion-X front glass' },
      { title: 'Display', desc: 'Wide-angle OLED, up to 40% brighter off-axis' },
      { title: 'Health', desc: 'Sleep apnea detection, ECG, cycle tracking' }
    ],
    badge: 'NEW SERIES 10'
  },
  {
    name: 'Apple Watch Series 10 (42mm)',
    brand: 'Apple',
    category: 'Watch',
    modelCode: 'A3000',
    tagline: 'Compact, ultra-thin, all-day comfort.',
    description: '42mm case with refined edge curves, wide-angle OLED, S10 SiP, depth gauge to 6m, and water temperature sensor.',
    price: 145000,
    originalPrice: 160000,
    stock: 15,
    mainImage: '/apple_watch_ultra.jpg',
    images: ['/apple_watch_ultra.jpg'],
    finishes: [
      { name: 'Jet Black Aluminum', hex: '#000000', image: '/apple_watch_ultra.jpg' },
      { name: 'Silver Aluminum', hex: '#e2e8f0', image: '/apple_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: '42mm aluminum case' },
      { title: 'Chip', desc: 'S10 SiP with 4-core Neural Engine' }
    ],
    badge: 'SERIES 10 42MM'
  },
  {
    name: 'Apple Watch SE (2nd Gen 44mm)',
    brand: 'Apple',
    category: 'Watch',
    modelCode: 'A2723',
    tagline: 'Heavy on features. Light on price.',
    description: '44mm case, Crash Detection, Heart rate notifications, Activity tracking, and water resistant to 50 meters.',
    price: 78000,
    originalPrice: 88000,
    stock: 20,
    mainImage: '/apple_watch_ultra.jpg',
    images: ['/apple_watch_ultra.jpg'],
    finishes: [
      { name: 'Midnight Aluminum', hex: '#1e293b', image: '/apple_watch_ultra.jpg' },
      { name: 'Starlight Aluminum', hex: '#f1f5f9', image: '/apple_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: '44mm aluminum with color-matched nylon back' },
      { title: 'Chip', desc: 'S8 SiP dual-core processor' }
    ],
    badge: 'BEST VALUE'
  },
  // Apple Audio
  {
    name: 'Apple AirPods Pro (2nd Gen) USB-C',
    brand: 'Apple',
    category: 'Audio',
    modelCode: 'A3048',
    tagline: 'Adaptive Audio. Now playing.',
    description: 'H2 chip with up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and MagSafe Charging Case (USB-C) with speaker and lanyard loop.',
    price: 76000,
    originalPrice: 84000,
    stock: 35,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [
      { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
    ],
    specs: [
      { title: 'Chip', desc: 'Apple H2 headphone chip + U1 in charging case' },
      { title: 'ANC', desc: 'Pro-level Active Noise Cancellation and Adaptive Audio' },
      { title: 'Battery', desc: 'Up to 6 hours listening with ANC, 30 hours total with case' },
      { title: 'Charging', desc: 'USB-C, MagSafe, Apple Watch charger compatible' }
    ],
    badge: 'H2 SILICON',
    featured: true
  },
  {
    name: 'Apple AirPods 4 with ANC',
    brand: 'Apple',
    category: 'Audio',
    modelCode: 'A3056',
    tagline: 'Active Noise Cancellation for an open-ear fit.',
    description: 'World’s first open-ear design with Active Noise Cancellation, Adaptive Audio, Transparency mode, and smallest wireless charging case.',
    price: 62000,
    originalPrice: 68000,
    stock: 25,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [
      { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
    ],
    specs: [
      { title: 'Chip', desc: 'Apple H2 audio silicon' },
      { title: 'Audio Features', desc: 'Active Noise Cancellation, Adaptive Audio, Spatial Audio' },
      { title: 'Case', desc: 'USB-C wireless charging case with Find My speaker' }
    ],
    badge: 'NEW AIRPODS 4 ANC'
  },
  {
    name: 'Apple AirPods 4',
    brand: 'Apple',
    category: 'Audio',
    modelCode: 'A3050',
    tagline: 'Next-level sound and comfort.',
    description: 'All-new acoustic architecture with H2 chip, Personalised Spatial Audio with dynamic head tracking, and USB-C case.',
    price: 46000,
    originalPrice: 52000,
    stock: 25,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [
      { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
    ],
    specs: [
      { title: 'Chip', desc: 'Apple H2 chip' },
      { title: 'Battery', desc: 'Up to 30 hours total listening time with USB-C case' }
    ],
    badge: 'AIRPODS 4'
  },
  {
    name: 'Apple AirPods Max (USB-C)',
    brand: 'Apple',
    category: 'Audio',
    modelCode: 'A3184',
    tagline: 'Over-ear studio master acoustics.',
    description: 'High-fidelity audio, Active Noise Cancellation with Transparency mode, Personalised Spatial Audio, knit-mesh canopy, and USB-C charging.',
    price: 185000,
    originalPrice: 210000,
    stock: 10,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [
      { name: 'Midnight', hex: '#1e293b', image: '/airpods_pro2.jpg' },
      { name: 'Starlight', hex: '#f8fafc', image: '/airpods_pro2.jpg' },
      { name: 'Blue', hex: '#3b82f6', image: '/airpods_pro2.jpg' }
    ],
    specs: [
      { title: 'Acoustics', desc: 'Apple-designed 40mm dynamic driver' },
      { title: 'ANC', desc: 'Eight microphones for Active Noise Cancellation' },
      { title: 'Battery', desc: 'Up to 20 hours listening time on a single charge' }
    ],
    badge: 'STUDIO PRO'
  },
  // Apple MagSafe & Power
  {
    name: 'Apple MagSafe 25W Charger (1m)',
    brand: 'Apple',
    category: 'Chargers',
    modelCode: 'A2580',
    tagline: 'Snap on. Super fast 25W wireless.',
    description: 'Up to 25W fast magnetic wireless charging for iPhone 16 models when paired with a 30W adapter. Braided 1-metre cable.',
    price: 15500,
    originalPrice: 18000,
    stock: 40,
    mainImage: '/apple_magsafe.jpg',
    images: ['/apple_magsafe.jpg'],
    finishes: [
      { name: 'Silver / Braided White', hex: '#e2e8f0', image: '/apple_magsafe.jpg' }
    ],
    specs: [
      { title: 'Charging Speed', desc: 'Up to 25W wireless charging (50% in 30 mins on iPhone 16)' },
      { title: 'Cable', desc: '1m durable braided cable' }
    ],
    badge: 'FAST 25W'
  },
  {
    name: 'Apple 30W USB-C Power Adapter',
    brand: 'Apple',
    category: 'Chargers',
    modelCode: 'A2164',
    tagline: 'Fast charging for iPhone, iPad, and MacBook Air.',
    description: 'Fast, efficient charging at home, in the office, or on the go. Required for 25W MagSafe fast charging.',
    price: 13500,
    originalPrice: 16000,
    stock: 35,
    mainImage: '/apple_magsafe.jpg',
    images: ['/apple_magsafe.jpg'],
    finishes: [
      { name: 'Gloss White', hex: '#ffffff', image: '/apple_magsafe.jpg' }
    ],
    specs: [
      { title: 'Power Output', desc: '30W USB-C Power Delivery' }
    ],
    badge: 'OFFICIAL 30W'
  },
  {
    name: 'Apple 20W USB-C Power Adapter',
    brand: 'Apple',
    category: 'Chargers',
    modelCode: 'A2305',
    tagline: 'Fast charging standard adapter.',
    description: 'Quickly recharge your iPhone 15, 14, 13 or AirPods. Compact single-port USB-C wall charger.',
    price: 7500,
    originalPrice: 9500,
    stock: 50,
    mainImage: '/apple_magsafe.jpg',
    images: ['/apple_magsafe.jpg'],
    finishes: [
      { name: 'Gloss White', hex: '#ffffff', image: '/apple_magsafe.jpg' }
    ],
    specs: [
      { title: 'Power', desc: '20W Power Delivery' }
    ],
    badge: 'ESSENTIAL'
  },
  {
    name: 'Anker 65W GaN Fast Charger',
    brand: 'Apple',
    category: 'Chargers',
    modelCode: 'A2668',
    tagline: 'GaNPrime 3-port ultra compact.',
    description: 'Charge iPhone, MacBook, and AirPods simultaneously with 2x USB-C ports and 1x USB-A port.',
    price: 16500,
    originalPrice: 19500,
    stock: 30,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    finishes: [
      { name: 'Matte Black', hex: '#1e293b', image: '/anker_65w.jpg' }
    ],
    specs: [
      { title: 'Total Power', desc: '65W Max across 3 ports' }
    ],
    badge: 'BESTSELLER'
  },
  // Apple Cases & Protection
  {
    name: 'Apple iPhone 16 Pro Silicone Case with MagSafe',
    brand: 'Apple',
    category: 'Cases',
    modelCode: 'MC16-SIL',
    tagline: 'Silky soft exterior with seamless Camera Control.',
    description: 'Built-in sapphire crystal coupled to a conductive layer transmits your finger movements directly to Camera Control.',
    price: 17500,
    originalPrice: 20000,
    stock: 25,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    finishes: [
      { name: 'Black', hex: '#1e293b', image: '/spigen_case.jpg' },
      { name: 'Denim', hex: '#3b82f6', image: '/spigen_case.jpg' },
      { name: 'Plum', hex: '#701a75', image: '/spigen_case.jpg' }
    ],
    specs: [
      { title: 'Material', desc: 'Soft-touch silicone with microfiber lining' },
      { title: 'Feature', desc: 'Conductive sapphire crystal for Camera Control' }
    ],
    badge: 'CAMERA CONTROL'
  },
  {
    name: 'Belkin UltraGlass 2 Screen Protector',
    brand: 'Apple',
    category: 'Accessories',
    modelCode: 'OVA144',
    tagline: 'Up to 2.7x stronger than tempered glass.',
    description: 'Double ion-exchange glass engineered for maximum scratch resistance and shatter protection with included alignment tray.',
    price: 6500,
    originalPrice: 8500,
    stock: 50,
    mainImage: '/belkin_glass.jpg',
    images: ['/belkin_glass.jpg'],
    finishes: [
      { name: 'Ultra Clear', hex: '#ffffff', image: '/belkin_glass.jpg' }
    ],
    specs: [
      { title: 'Hardness', desc: '9H pencil hardness with anti-fingerprint coating' }
    ],
    badge: 'GERMAN OPTICS'
  },

  // =========================================================================
  // 2. SAMSUNG GALAXY ECOSYSTEM
  // =========================================================================
  {
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-S928B',
    tagline: 'Titanium meets Galaxy AI brilliance.',
    description: '6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor anti-reflective glass. Integrated S Pen, 200MP Quad Camera with AI ProVisual Engine, and Snapdragon 8 Gen 3.',
    price: 385000,
    originalPrice: 425000,
    stock: 20,
    mainImage: '/samsung_s24.jpg',
    images: ['/samsung_s24.jpg'],
    finishes: [
      { name: 'Titanium Gray', hex: '#6b6e73', image: '/samsung_s24.jpg' },
      { name: 'Titanium Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
      { name: 'Titanium Violet', hex: '#818cf8', image: '/samsung_s24.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.8-inch QHD+ 120Hz LTPO with Gorilla Armor' },
      { title: 'Camera', desc: '200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP UW' },
      { title: 'Processor', desc: 'Snapdragon 8 Gen 3 for Galaxy' },
      { title: 'Battery', desc: '5,000mAh with 45W Super Fast Charging' }
    ],
    badge: 'GALAXY AI',
    featured: true
  },
  {
    name: 'Galaxy S24+',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-S926B',
    tagline: 'Bigger screen, bigger battery, full AI.',
    description: '6.7-inch QHD+ Dynamic AMOLED 2X, Armor Aluminum 2 frame, 4,900mAh battery, and full Galaxy AI suite.',
    price: 315000,
    originalPrice: 345000,
    stock: 15,
    mainImage: '/samsung_s24.jpg',
    images: ['/samsung_s24.jpg'],
    finishes: [
      { name: 'Onyx Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
      { name: 'Marble Gray', hex: '#9ca3af', image: '/samsung_s24.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.7-inch QHD+ 1-120Hz display' },
      { title: 'Battery', desc: '4,900mAh with 45W wired charging' }
    ],
    badge: 'QHD+ 120HZ'
  },
  {
    name: 'Galaxy S24',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-S921B',
    tagline: 'Compact power with Galaxy AI.',
    description: '6.2-inch FHD+ Dynamic AMOLED 2X, lightweight 167g pocket-friendly design, 50MP camera, and 4,000mAh battery.',
    price: 255000,
    originalPrice: 280000,
    stock: 20,
    mainImage: '/samsung_s24.jpg',
    images: ['/samsung_s24.jpg'],
    finishes: [
      { name: 'Onyx Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
      { name: 'Cobalt Violet', hex: '#6366f1', image: '/samsung_s24.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.2-inch 120Hz AMOLED 2X' },
      { title: 'Camera', desc: '50MP OIS + 10MP 3x Telephoto + 12MP UW' }
    ],
    badge: 'COMPACT FLAGSHIP'
  },
  {
    name: 'Galaxy Z Fold 6',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-F956B',
    tagline: 'Ultra-light, thinner, dual-screen AI productivity.',
    description: '7.6-inch folding Dynamic AMOLED 2X inner display + 6.3-inch cover screen. Redesigned symmetrical hinge, Snapdragon 8 Gen 3, and IP48 water resistance.',
    price: 545000,
    originalPrice: 595000,
    stock: 8,
    mainImage: '/zflip6.jpg',
    images: ['/zflip6.jpg'],
    finishes: [
      { name: 'Silver Shadow', hex: '#d1d5db', image: '/zflip6.jpg' },
      { name: 'Navy', hex: '#1e3a8a', image: '/zflip6.jpg' }
    ],
    specs: [
      { title: 'Main Screen', desc: '7.6-inch QXGA+ Dynamic AMOLED 2X 120Hz' },
      { title: 'Cover Screen', desc: '6.3-inch HD+ 120Hz Dynamic AMOLED' },
      { title: 'Weight', desc: '239g ultra-light foldable' }
    ],
    badge: 'FOLDABLE PREMIER',
    featured: true
  },
  {
    name: 'Galaxy Z Flip 6',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-F741B',
    tagline: 'Compact, high-impact AI flip.',
    description: '3.4-inch FlexWindow cover display, 6.7-inch folding inner display, 50MP FlexCam with Auto Zoom, and 4,000mAh battery.',
    price: 310000,
    originalPrice: 340000,
    stock: 16,
    mainImage: '/zflip6.jpg',
    images: ['/zflip6.jpg'],
    finishes: [
      { name: 'Silver Shadow', hex: '#cfd2d6', image: '/zflip6.jpg' },
      { name: 'Mint', hex: '#6ee7b7', image: '/zflip6.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.7-inch FHD+ AMOLED 2X + 3.4-inch FlexWindow' },
      { title: 'Camera', desc: '50MP OIS Main with 4K60 Auto Zoom' }
    ],
    badge: 'STYLE ICON'
  },
  {
    name: 'Galaxy A55 5G',
    brand: 'Samsung',
    category: 'Phones',
    modelCode: 'SM-A556E',
    tagline: 'Metal frame with Knox Vault security.',
    description: '6.6-inch Super AMOLED 120Hz display, Exynos 1480 processor with AMD RDNA graphics, 50MP OIS camera, and IP67 water/dust resistance.',
    price: 108000,
    originalPrice: 118000,
    stock: 30,
    mainImage: '/galaxy_a55.jpg',
    images: ['/galaxy_a55.jpg'],
    finishes: [
      { name: 'Awesome Iceblue', hex: '#bfdbfe', image: '/galaxy_a55.jpg' },
      { name: 'Awesome Navy', hex: '#1e3a8a', image: '/galaxy_a55.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.6-inch 120Hz Super AMOLED' },
      { title: 'Chip', desc: 'Exynos 1480 octa-core processor' },
      { title: 'Battery', desc: '5,000mAh with 25W fast charge' }
    ],
    badge: 'POPULAR MIDRANGE'
  },
  // Samsung Watch
  {
    name: 'Samsung Galaxy Watch Ultra (47mm)',
    brand: 'Samsung',
    category: 'Watch',
    modelCode: 'SM-L705F',
    tagline: 'Titanium cushion design for extreme athletics.',
    description: 'Grade 4 Titanium cushion case, 10ATM water resistance, dual-frequency GPS (L1+L5), 3nm Exynos W1000 processor, and up to 100-hour battery life.',
    price: 215000,
    originalPrice: 240000,
    stock: 10,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Titanium Gray + Marine Orange', hex: '#f97316', image: '/galaxy_watch_ultra.jpg' },
      { name: 'Titanium White', hex: '#f8fafc', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Case', desc: '47mm Grade 4 Titanium, 10ATM + IP68' },
      { title: 'Display', desc: '1.5-inch Super AMOLED, 3,000 nits' },
      { title: 'Processor', desc: 'Exynos W1000 3nm 5-core SiP' }
    ],
    badge: 'TITANIUM 10ATM',
    featured: true
  },
  {
    name: 'Samsung Galaxy Watch 7 (44mm)',
    brand: 'Samsung',
    category: 'Watch',
    modelCode: 'SM-L310N',
    tagline: 'Smarter health tracking with 3nm processor.',
    description: '3nm Exynos W1000 chipset, upgraded BioActive Sensor with metabolic AGEs index, dual-frequency GPS, and sleep apnea monitoring.',
    price: 115000,
    originalPrice: 130000,
    stock: 18,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Green', hex: '#374151', image: '/galaxy_watch_ultra.jpg' },
      { name: 'Silver', hex: '#e5e7eb', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '1.5-inch Super AMOLED Sapphire Crystal' },
      { title: 'Sensors', desc: 'BioActive Sensor (ECG, BIA, Optical HR)' }
    ],
    badge: '3NM PROCESSOR'
  },
  // Samsung Audio
  {
    name: 'Samsung Galaxy Buds3 Pro',
    brand: 'Samsung',
    category: 'Audio',
    modelCode: 'SM-R630N',
    tagline: 'Blade Lights. 24-bit Hi-Fi studio acoustics.',
    description: 'Ergonomic stem with Blade Lights, planar tweeters + dual amplifiers, 24-bit/96kHz high-resolution audio, and Galaxy AI real-time interpreter.',
    price: 68000,
    originalPrice: 75000,
    stock: 25,
    mainImage: '/galaxy_buds3.jpg',
    images: ['/galaxy_buds3.jpg'],
    finishes: [
      { name: 'Silver Blade', hex: '#94a3b8', image: '/galaxy_buds3.jpg' },
      { name: 'White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
    ],
    specs: [
      { title: 'Acoustics', desc: '2-way speaker with planar tweeter & dual amp' },
      { title: 'Audio Quality', desc: '24-bit / 96kHz SSC codec' },
      { title: 'ANC', desc: 'Adaptive Noise Control & Siren Detect' }
    ],
    badge: '24-BIT HI-FI',
    featured: true
  },
  {
    name: 'Samsung Galaxy Buds FE',
    brand: 'Samsung',
    category: 'Audio',
    modelCode: 'SM-R400N',
    tagline: 'Everyday comfort with powerful ANC.',
    description: 'Ergonomic wing-tip design, deep bass dynamic speaker, powerful Active Noise Cancellation, and up to 30 hours battery life with case.',
    price: 28000,
    originalPrice: 34000,
    stock: 30,
    mainImage: '/galaxy_buds3.jpg',
    images: ['/galaxy_buds3.jpg'],
    finishes: [
      { name: 'Graphite', hex: '#1f2937', image: '/galaxy_buds3.jpg' },
      { name: 'White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
    ],
    specs: [
      { title: 'Battery', desc: 'Up to 30 hours total playback' },
      { title: 'Design', desc: 'Secure fit wingtip design' }
    ],
    badge: 'FE EDITION'
  },
  // Samsung Power & Accessories
  {
    name: 'Samsung 45W Super Fast Power Adapter (EP-T4510)',
    brand: 'Samsung',
    category: 'Chargers',
    modelCode: 'EP-T4510',
    tagline: 'Official 45W Super Fast Charging 2.0.',
    description: 'Powers Galaxy S24 Ultra and laptops with 45W PPS output. Includes durable 5A USB-C to USB-C cable.',
    price: 14500,
    originalPrice: 17500,
    stock: 45,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    finishes: [
      { name: 'Black', hex: '#1e293b', image: '/anker_65w.jpg' }
    ],
    specs: [
      { title: 'Output', desc: '45W Max USB PD 3.0 PPS' }
    ],
    badge: 'OFFICIAL 45W'
  },
  {
    name: 'Galaxy S24 Ultra Smart View Wallet Case',
    brand: 'Samsung',
    category: 'Cases',
    modelCode: 'EF-ZS928',
    tagline: 'Small screen preview window with card pocket.',
    description: 'Check notifications and answer calls through the display window without opening the cover. Built-in card holder.',
    price: 14500,
    originalPrice: 17000,
    stock: 20,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    finishes: [
      { name: 'Black', hex: '#1e293b', image: '/spigen_case.jpg' },
      { name: 'Violet', hex: '#818cf8', image: '/spigen_case.jpg' }
    ],
    specs: [
      { title: 'Protection', desc: 'All-around front and back protection' }
    ],
    badge: 'SMART VIEW'
  },

  // =========================================================================
  // 3. GOOGLE PIXEL ECOSYSTEM
  // =========================================================================
  {
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    category: 'Phones',
    modelCode: 'GGX8B',
    tagline: 'Gemini AI flagship with 6.8-inch Super Actua.',
    description: '6.8-inch Super Actua LTPO OLED (1-120Hz) up to 3,000 nits. Google Tensor G4 with 16GB RAM for on-device Gemini Nano, 50MP triple pro camera, and 42MP front selfie camera.',
    price: 365000,
    originalPrice: 395000,
    stock: 12,
    mainImage: '/pixel9pro.jpg',
    images: ['/pixel9pro.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
      { name: 'Hazel', hex: '#8e978e', image: '/pixel9pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.8-inch Super Actua OLED (3,000 nits peak)' },
      { title: 'Processor', desc: 'Google Tensor G4 with Titan M2 coprocessor' },
      { title: 'Memory', desc: '16GB RAM for Gemini Nano AI models' },
      { title: 'Camera', desc: '50MP Main + 48MP Macro UW + 48MP 5x Telephoto' }
    ],
    badge: 'GEMINI PRO XL',
    featured: true
  },
  {
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    category: 'Phones',
    modelCode: 'GC14E',
    tagline: 'Pro cameras in a sleek 6.3-inch form.',
    description: 'Compact 6.3-inch Pro phone with identical triple cameras to XL, 16GB RAM, Tensor G4, sculpted satin camera visor, and 7 years of full OS updates.',
    price: 315000,
    originalPrice: 340000,
    stock: 16,
    mainImage: '/pixel9pro.jpg',
    images: ['/pixel9pro.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
      { name: 'Rose Quartz', hex: '#fbcfe8', image: '/pixel9pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.3-inch Super Actua 120Hz display' },
      { title: 'Cameras', desc: 'Triple pro camera system with 30x Super Res Zoom' },
      { title: 'Selfie', desc: '42MP Dual PD selfie with autofocus' }
    ],
    badge: 'COMPACT PRO'
  },
  {
    name: 'Google Pixel 9',
    brand: 'Google',
    category: 'Phones',
    modelCode: 'GUR25',
    tagline: 'Engineered by Google, powered by Gemini.',
    description: '6.3-inch Actua OLED display, Tensor G4 processor with 12GB RAM, 50MP main camera with 48MP macro ultra-wide, and satellite SOS.',
    price: 245000,
    originalPrice: 265000,
    stock: 20,
    mainImage: '/pixel9pro.jpg',
    images: ['/pixel9pro.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
      { name: 'Wintergreen', hex: '#a7f3d0', image: '/pixel9pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.3-inch Actua display up to 2,700 nits' },
      { title: 'Memory', desc: '12GB RAM + Tensor G4' }
    ],
    badge: 'PIXEL 9'
  },
  {
    name: 'Google Pixel 8a',
    brand: 'Google',
    category: 'Phones',
    modelCode: 'G6GPR',
    tagline: 'Delightful AI phone at an exceptional price.',
    description: '6.1-inch 120Hz Actua display, Tensor G3 chip, 64MP camera with Best Take and Audio Magic Eraser, and 7 years of software support.',
    price: 145000,
    originalPrice: 165000,
    stock: 22,
    mainImage: '/pixel9pro.jpg',
    images: ['/pixel9pro.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
      { name: 'Bay Blue', hex: '#93c5fd', image: '/pixel9pro.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.1-inch 120Hz OLED Actua display' },
      { title: 'Camera', desc: '64MP Main + 13MP Ultra Wide' }
    ],
    badge: 'A-SERIES HERO'
  },
  // Google Watch
  {
    name: 'Google Pixel Watch 3 (45mm)',
    brand: 'Google',
    category: 'Watch',
    modelCode: 'G4H3C',
    tagline: '45mm Actua Display with 2,000 nits & Fitbit AI.',
    description: '40% larger screen with ultra-narrow borders, 2,000 nits peak brightness, Daily Readiness score, Target Load running coach, and offline Google Maps.',
    price: 138000,
    originalPrice: 155000,
    stock: 14,
    mainImage: '/pixel_watch_3.jpg',
    images: ['/pixel_watch_3.jpg'],
    finishes: [
      { name: 'Matte Black Aluminum + Obsidian Band', hex: '#1e293b', image: '/pixel_watch_3.jpg' },
      { name: 'Matte Hazel Aluminum + Porcelain Band', hex: '#e5e2dc', image: '/pixel_watch_3.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '45mm Actua display up to 2,000 nits' },
      { title: 'Battery', desc: 'Up to 36 hours in Battery Saver mode' }
    ],
    badge: 'ACTUA 45MM',
    featured: true
  },
  // Google Audio
  {
    name: 'Google Pixel Buds Pro 2',
    brand: 'Google',
    category: 'Audio',
    modelCode: 'GA052',
    tagline: 'First earbuds with Google Tensor A1 chip.',
    description: 'Tensor A1 chip processes audio 90x faster than sound itself for Silent Seal 2.0 ANC cancelling 2x more noise. Conversational Detection and Gemini Live voice chat.',
    price: 68000,
    originalPrice: 75000,
    stock: 20,
    mainImage: '/airpods_pro2.jpg',
    images: ['/airpods_pro2.jpg'],
    finishes: [
      { name: 'Hazel', hex: '#8e978e', image: '/airpods_pro2.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/airpods_pro2.jpg' },
      { name: 'Wintergreen', hex: '#a7f3d0', image: '/airpods_pro2.jpg' }
    ],
    specs: [
      { title: 'Chip', desc: 'Google Tensor A1 audio silicon' },
      { title: 'ANC', desc: 'Silent Seal 2.0 with ultra-wideband noise cancellation' },
      { title: 'Features', desc: 'Hands-free Gemini Live AI access' }
    ],
    badge: 'TENSOR A1 CHIP',
    featured: true
  },
  // Google Power & Protection
  {
    name: 'Google 45W USB-C Fast Charger',
    brand: 'Google',
    category: 'Chargers',
    modelCode: 'GA045',
    tagline: 'Fastest official charging for Pixel 9 Pro XL.',
    description: 'High-speed 45W Power Delivery PPS adapter engineered by Google to charge Pixel 9 Pro XL to 70% in about 30 minutes.',
    price: 14500,
    originalPrice: 17500,
    stock: 30,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    finishes: [
      { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
    ],
    specs: [
      { title: 'Output', desc: '45W PD 3.0 PPS' }
    ],
    badge: 'OFFICIAL 45W'
  },
  {
    name: 'Official Google Pixel 9 Pro Case',
    brand: 'Google',
    category: 'Cases',
    modelCode: 'GA09-CASE',
    tagline: 'Stain-resistant silicone with metallic G logo.',
    description: 'Precision-moulded shock-absorbing silicone case that highlights the iconic Pixel camera bar while protecting against drops.',
    price: 12500,
    originalPrice: 15000,
    stock: 25,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    finishes: [
      { name: 'Obsidian', hex: '#2d2f33', image: '/spigen_case.jpg' },
      { name: 'Porcelain', hex: '#f0ece7', image: '/spigen_case.jpg' }
    ],
    specs: [
      { title: 'Material', desc: 'Recycled polycarbonate and silicone with microfiber' }
    ],
    badge: 'OFFICIAL PIXEL'
  },

  // =========================================================================
  // 4. ONEPLUS ECOSYSTEM
  // =========================================================================
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'Phones',
    modelCode: 'CPH2581',
    tagline: 'Smooth beyond belief. 4th Gen Hasselblad.',
    description: '6.82-inch 2K 120Hz ProXDR display (4,500 nits), Snapdragon 8 Gen 3 with dual Cryo-velocity cooling, 50MP Sony LYT-808 Hasselblad triple camera, and 100W SUPERVOOC charging.',
    price: 225000,
    originalPrice: 245000,
    stock: 20,
    mainImage: '/oneplus12.jpg',
    images: ['/oneplus12.jpg'],
    finishes: [
      { name: 'Flowy Emerald', hex: '#1d4838', image: '/oneplus12.jpg' },
      { name: 'Silky Black', hex: '#262829', image: '/oneplus12.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.82-inch 2K 120Hz ProXDR with Aqua Touch' },
      { title: 'Processor', desc: 'Snapdragon 8 Gen 3 with up to 16GB RAM' },
      { title: 'Charging', desc: '100W wired (1-100% in 26m) + 50W wireless' },
      { title: 'Camera', desc: '50MP LYT-808 + 64MP 3x Periscope + 48MP UW' }
    ],
    badge: 'HASSELBLAD',
    featured: true
  },
  {
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    category: 'Phones',
    modelCode: 'CPH2585',
    tagline: 'Smoothness redefined. 5,500mAh battery giant.',
    description: '6.78-inch 1.5K 120Hz 4th-Gen LTPO display, Snapdragon 8 Gen 2, 5,500mAh largest OnePlus battery, and 100W SUPERVOOC.',
    price: 165000,
    originalPrice: 185000,
    stock: 25,
    mainImage: '/oneplus12.jpg',
    images: ['/oneplus12.jpg'],
    finishes: [
      { name: 'Cool Blue', hex: '#60a5fa', image: '/oneplus12.jpg' },
      { name: 'Iron Gray', hex: '#374151', image: '/oneplus12.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.78-inch 120Hz LTPO 4.0 display' },
      { title: 'Battery', desc: '5,500mAh battery with 100W fast charge' }
    ],
    badge: 'FLAGSHIP KILLER'
  },
  {
    name: 'OnePlus Open',
    brand: 'OnePlus',
    category: 'Phones',
    modelCode: 'CPH2551',
    tagline: 'Open for everything. Flagship foldable.',
    description: '7.82-inch 2K Flexi-fluid folding screen + 6.31-inch cover display, Flexion hinge with invisible crease, and Hasselblad triple camera array.',
    price: 465000,
    originalPrice: 510000,
    stock: 8,
    mainImage: '/oneplus12.jpg',
    images: ['/oneplus12.jpg'],
    finishes: [
      { name: 'Emerald Dusk', hex: '#134e4a', image: '/oneplus12.jpg' },
      { name: 'Voyager Black (Leather)', hex: '#18181b', image: '/oneplus12.jpg' }
    ],
    specs: [
      { title: 'Displays', desc: '7.82-inch inner 120Hz + 6.31-inch outer 120Hz' },
      { title: 'Multitasking', desc: 'Open Canvas fluid three-app split screen' }
    ],
    badge: 'PREMIER FOLD'
  },
  // OnePlus Watch & Audio
  {
    name: 'OnePlus Watch 2 (Titanium Edition)',
    brand: 'OnePlus',
    category: 'Watch',
    modelCode: 'OPW241',
    tagline: 'Dual-Engine Architecture. 100-hour Wear OS.',
    description: 'Stainless steel chassis with sapphire crystal. Snapdragon W5 + BES2700 dual-chip system delivering full Google Wear OS 4 with 100-hour battery life.',
    price: 85000,
    originalPrice: 95000,
    stock: 15,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Radiant Steel', hex: '#94a3b8', image: '/galaxy_watch_ultra.jpg' },
      { name: 'Black Steel', hex: '#1e293b', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Battery', desc: 'Up to 100 hours in Smart Mode, 12 days in Power Save' },
      { title: 'OS', desc: 'Google Wear OS 4 with Fast Pair' }
    ],
    badge: 'DUAL ENGINE',
    featured: true
  },
  {
    name: 'OnePlus Buds Pro 3',
    brand: 'OnePlus',
    category: 'Audio',
    modelCode: 'E512A',
    tagline: 'Co-created with Dynaudio. 50dB Adaptive ANC.',
    description: 'Dual 11mm woofer + 6mm planar tweeter with dual DACs, tuned by Danish acoustic masters Dynaudio. 50dB adaptive noise cancellation and 43-hour battery.',
    price: 58000,
    originalPrice: 65000,
    stock: 22,
    mainImage: '/galaxy_buds3.jpg',
    images: ['/galaxy_buds3.jpg'],
    finishes: [
      { name: 'Midnight Opus', hex: '#18181b', image: '/galaxy_buds3.jpg' },
      { name: 'Lunar Radiance', hex: '#f8fafc', image: '/galaxy_buds3.jpg' }
    ],
    specs: [
      { title: 'Acoustic Tuning', desc: 'Dual drivers + dual DACs tuned by Dynaudio' },
      { title: 'ANC', desc: '50dB smart adaptive noise cancellation' }
    ],
    badge: 'DYNAUDIO',
    featured: true
  },
  // OnePlus Power & Cases
  {
    name: 'OnePlus 100W Dual-Port SUPERVOOC GaN Adapter',
    brand: 'OnePlus',
    category: 'Chargers',
    modelCode: 'VCBAUACH',
    tagline: 'Dual ports (USB-C + USB-A) with 100W max power.',
    description: 'Compact GaN architecture supporting 100W SUPERVOOC, 65W USB-PD for laptops, and simultaneous dual device fast charging.',
    price: 16500,
    originalPrice: 19500,
    stock: 35,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    finishes: [
      { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
    ],
    specs: [
      { title: 'Output', desc: '100W SUPERVOOC + 65W PD/PPS' }
    ],
    badge: '100W SUPERVOOC'
  },
  {
    name: 'OnePlus 12 Sandstone Magnetic Bumper Case',
    brand: 'OnePlus',
    category: 'Cases',
    modelCode: 'OP12-SAND',
    tagline: 'The iconic grippy Sandstone texture since One.',
    description: 'Classic textured Sandstone finish with magnetic ring compatibility, shock-absorbing corners, and raised camera bezel.',
    price: 8500,
    originalPrice: 10500,
    stock: 30,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    finishes: [
      { name: 'Sandstone Black', hex: '#262829', image: '/spigen_case.jpg' }
    ],
    specs: [
      { title: 'Material', desc: 'Polycarbonate with natural granular sandstone spray' }
    ],
    badge: 'ICONIC SANDSTONE'
  },

  // =========================================================================
  // 5. XIAOMI & REDMI ECOSYSTEM
  // =========================================================================
  {
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'Phones',
    modelCode: '24030PN60G',
    tagline: 'A camera that happens to be a phone. Leica Quad optics.',
    description: '1-inch Sony LYT-900 sensor with stepless f/1.63-f/4.0 variable physical aperture. Four 50MP Leica cameras covering 12mm to 120mm, 90W HyperCharge, and Snapdragon 8 Gen 3.',
    price: 365000,
    originalPrice: 395000,
    stock: 14,
    mainImage: '/xiaomi14ultra.jpg',
    images: ['/xiaomi14ultra.jpg'],
    finishes: [
      { name: 'Vegan Black Leather', hex: '#212326', image: '/xiaomi14ultra.jpg' },
      { name: 'Titanium White', hex: '#d4d7db', image: '/xiaomi14ultra.jpg' }
    ],
    specs: [
      { title: 'Camera Sensor', desc: '1-inch Sony LYT-900 with stepless variable aperture' },
      { title: 'Leica Optics', desc: 'Leica Quad 50MP system (12mm, 23mm, 75mm, 120mm)' },
      { title: 'Processor', desc: 'Qualcomm Snapdragon 8 Gen 3 with IceLoop liquid cooling' },
      { title: 'Charging', desc: '90W HyperCharge (0-100% in 33 mins) + 80W wireless' }
    ],
    badge: 'LEICA MASTER',
    featured: true
  },
  {
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'Phones',
    modelCode: '23127PN0CG',
    tagline: 'Compact 6.36-inch flagship with Leica Summilux.',
    description: 'Ultra-thin 1.61mm bezels, 6.36-inch 120Hz LTPO AMOLED, Light Fusion 900 custom sensor with Leica Summilux lens, and 4,610mAh battery.',
    price: 265000,
    originalPrice: 285000,
    stock: 20,
    mainImage: '/xiaomi14ultra.jpg',
    images: ['/xiaomi14ultra.jpg'],
    finishes: [
      { name: 'Jade Green', hex: '#4d7c0f', image: '/xiaomi14ultra.jpg' },
      { name: 'Black', hex: '#1f2937', image: '/xiaomi14ultra.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.36-inch 1.5K LTPO AMOLED 3,000 nits' },
      { title: 'Camera', desc: 'Leica Triple 50MP camera array' }
    ],
    badge: 'COMPACT LEICA'
  },
  {
    name: 'Redmi Note 13 Pro+ 5G',
    brand: 'Xiaomi',
    category: 'Phones',
    modelCode: '23090RA98G',
    tagline: '200MP OIS camera with 120W HyperCharge & IP68.',
    description: 'Curved 1.5K 120Hz CrystalRes AMOLED display, flagship 200MP Samsung ISOCELL sensor with 4x lossless zoom, and IP68 water resistance.',
    price: 135000,
    originalPrice: 148000,
    stock: 35,
    mainImage: '/xiaomi14ultra.jpg',
    images: ['/xiaomi14ultra.jpg'],
    finishes: [
      { name: 'Midnight Black', hex: '#111827', image: '/xiaomi14ultra.jpg' },
      { name: 'Aurora Purple', hex: '#a855f7', image: '/xiaomi14ultra.jpg' }
    ],
    specs: [
      { title: 'Camera', desc: '200MP OIS sensor with 2x/4x in-sensor zoom' },
      { title: 'Charging', desc: '120W HyperCharge (0-100% in 19 mins)' },
      { title: 'Durability', desc: 'IP68 water and dust resistance' }
    ],
    badge: '200MP HERO'
  },
  {
    name: 'Redmi Note 13 4G',
    brand: 'Xiaomi',
    category: 'Phones',
    modelCode: '23129RAA4G',
    tagline: 'Super-clear 108MP triple camera.',
    description: '6.67-inch AMOLED 120Hz display with ultra-thin bezels, 108MP triple camera, 5,000mAh battery with 33W fast charging.',
    price: 65000,
    originalPrice: 72000,
    stock: 40,
    mainImage: '/xiaomi14ultra.jpg',
    images: ['/xiaomi14ultra.jpg'],
    finishes: [
      { name: 'Midnight Black', hex: '#111827', image: '/xiaomi14ultra.jpg' },
      { name: 'Mint Green', hex: '#86efac', image: '/xiaomi14ultra.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '6.67-inch 120Hz AMOLED display' },
      { title: 'Camera', desc: '108MP 3x lossless zoom camera' }
    ],
    badge: 'BEST BUDGET'
  },
  // Xiaomi Watch & Audio
  {
    name: 'Xiaomi Watch 2 Pro',
    brand: 'Xiaomi',
    category: 'Watch',
    modelCode: 'M2234W1',
    tagline: 'Snapdragon W5+ Gen 1 with Google Wear OS.',
    description: 'Stainless steel case with rotating crown, 1.43-inch AMOLED, Wear OS with Google Assistant/Maps/Wallet, and dual-band GNSS.',
    price: 78000,
    originalPrice: 88000,
    stock: 18,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Black Case + Fluororubber Strap', hex: '#1f2937', image: '/galaxy_watch_ultra.jpg' },
      { name: 'Silver Case + Brown Leather', hex: '#78350f', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'OS', desc: 'Google Wear OS with Play Store' },
      { title: 'Processor', desc: 'Snapdragon W5+ Gen 1 4nm' }
    ],
    badge: 'WEAR OS',
    featured: true
  },
  {
    name: 'Xiaomi Smart Band 8 Pro',
    brand: 'Xiaomi',
    category: 'Watch',
    modelCode: 'M2303B1',
    tagline: 'Large 1.74-inch AMOLED with independent GNSS.',
    description: '1.74-inch 60Hz high-refresh AMOLED screen, metallic frame, built-in GPS/GLONASS/Galileo, and up to 14 days battery life.',
    price: 24000,
    originalPrice: 28000,
    stock: 45,
    mainImage: '/galaxy_watch_ultra.jpg',
    images: ['/galaxy_watch_ultra.jpg'],
    finishes: [
      { name: 'Black', hex: '#1f2937', image: '/galaxy_watch_ultra.jpg' },
      { name: 'Light Grey', hex: '#e5e7eb', image: '/galaxy_watch_ultra.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '1.74-inch 60Hz AMOLED screen' },
      { title: 'Battery', desc: 'Up to 14 days on a single charge' }
    ],
    badge: 'BAND PRO'
  },
  {
    name: 'Redmi Buds 5 Pro',
    brand: 'Xiaomi',
    category: 'Audio',
    modelCode: 'M2317E1',
    tagline: 'Hi-Res Audio with 52dB ultra-wide ANC.',
    description: 'Coaxial dual drivers (11mm titanium woofer + 10mm piezoelectric tweeter), LDAC certified, 52dB active noise cancellation with 4kHz ultra-wide frequency band.',
    price: 26000,
    originalPrice: 31000,
    stock: 30,
    mainImage: '/galaxy_buds3.jpg',
    images: ['/galaxy_buds3.jpg'],
    finishes: [
      { name: 'Midnight Black (Vegan Leather)', hex: '#18181b', image: '/galaxy_buds3.jpg' },
      { name: 'Moonlight White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
    ],
    specs: [
      { title: 'ANC', desc: '52dB active noise reduction up to 4kHz' },
      { title: 'Codecs', desc: 'Hi-Res Wireless with LDAC support' }
    ],
    badge: '52DB ANC',
    featured: true
  },
  // Xiaomi Power & Accessories
  {
    name: 'Xiaomi 120W HyperCharge GaN Combo',
    brand: 'Xiaomi',
    category: 'Chargers',
    modelCode: 'MDY-13-EE',
    tagline: 'Blazing 120W power in a pocket-sized GaN block.',
    description: 'Ultra-high frequency Gallium Nitride adapter charges Redmi Note 13 Pro+ in under 19 minutes. Includes 6A Type-C fast cable.',
    price: 16500,
    originalPrice: 19500,
    stock: 40,
    mainImage: '/anker_65w.jpg',
    images: ['/anker_65w.jpg'],
    finishes: [
      { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
    ],
    specs: [
      { title: 'Speed', desc: '120W Max wired output' }
    ],
    badge: '120W HYPERCHARGE'
  },
  {
    name: 'Xiaomi 14 Ultra Professional Leica Photography Kit',
    brand: 'Xiaomi',
    category: 'Accessories',
    modelCode: 'X14U-KIT',
    tagline: 'Physical shutter grip with built-in 1,500mAh battery.',
    description: 'Camera grip with two-stage shutter release button, zoom lever, dedicated video record button, custom dial, 67mm filter adapter ring, and decorative lens ring.',
    price: 58000,
    originalPrice: 65000,
    stock: 12,
    mainImage: '/spigen_case.jpg',
    images: ['/spigen_case.jpg'],
    finishes: [
      { name: 'Leather Texture Black', hex: '#18181b', image: '/spigen_case.jpg' }
    ],
    specs: [
      { title: 'Grip Battery', desc: '1,500mAh built-in power reserve' },
      { title: 'Filter Thread', desc: 'Standard 67mm filter adapter ring' },
      { title: 'Controls', desc: 'Two-stage physical shutter & zoom dial' }
    ],
    badge: 'LEICA GRIP KIT',
    featured: true
  }
];

async function seedProducts() {
  try {
    await connectDB();
    console.log('[Product Seeder] Connected to MongoDB database: quantum_mobile');

    // Remove existing products to avoid duplicates and ensure clean schemas
    await Product.deleteMany({});
    console.log('[Product Seeder] Cleared previous products collection.');

    // Insert all catalog products
    const inserted = await Product.insertMany(allProducts);
    console.log(`[Product Seeder] Successfully seeded ${inserted.length} official products!`);

    // Grouping summary by brand
    const brandCounts = {};
    const categoryCounts = {};
    inserted.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    console.log('\n--- Products by Brand ---');
    console.table(brandCounts);

    console.log('\n--- Products by Category ---');
    console.table(categoryCounts);

    process.exit(0);
  } catch (error) {
    console.error('[Product Seeder Error]:', error);
    process.exit(1);
  }
}

seedProducts();
