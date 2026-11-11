// Official Comprehensive Catalog data for AppleMall LK & Apple Store
// Integrated with authentic renamed images from public/APPLE

export const APPLE_CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '✨' },
  { id: 'iphone', label: 'iPhone', icon: '📱' },
  { id: 'watch', label: 'Watch', icon: '⌚' },
  { id: 'airpods', label: 'AirPods', icon: '🎧' },
  { id: 'magsafe', label: 'MagSafe & Power', icon: '⚡' },
  { id: 'accessories', label: 'Protection & Cases', icon: '🛡️' }
];

export const APPLE_MALL_PRODUCTS = [
  {
    id: 'iphone-18-pro-max-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 18 Pro Max (256GB)',
    price: 585000,
    originalPrice: 620000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-18-pro-max_burgundy.webp',
    variants: [
      { name: 'Deep Burgundy', image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp', hex: '#5b142b' },
      { name: 'Silver Titanium', image: '/APPLE/apple_iphone-18-pro_silver.webp', hex: '#d1d5db' },
      { name: 'Titanium Blue', image: '/APPLE/apple_iphone-18_blue.jpg', hex: '#1e3a5f' }
    ],
    specs: [
      'Apple A20 Pro 2nm Extreme Bionic Silicon',
      '12 GB Unified LPDDR5X RAM',
      '48 MP Variable Aperture Triple Camera with 8x Tetraprism Optical Zoom',
      '48 MP Front Center-Stage TrueDepth Camera',
      '4880 mAh High-Density Graphene Extended Battery',
      '6.9 inches Super Retina XDR ProMotion OLED (1-120Hz)'
    ]
  },
  {
    id: 'iphone-18-pro-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 18 Pro (256GB)',
    price: 515000,
    originalPrice: 550000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-18-pro_silver.webp',
    variants: [
      { name: 'Silver Titanium', image: '/APPLE/apple_iphone-18-pro_silver.webp', hex: '#d1d5db' },
      { name: 'Deep Burgundy', image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp', hex: '#5b142b' },
      { name: 'Titanium Blue', image: '/APPLE/apple_iphone-18_blue.jpg', hex: '#1e3a5f' }
    ],
    specs: [
      'Apple A20 Pro 2nm Bionic Silicon',
      '12 GB Unified RAM',
      '48 MP Mechanical Variable Aperture Fusion Camera',
      'Sapphire Capacitive Camera Control Button',
      '4288 mAh All-Day Endurance Battery',
      '6.3 inches Super Retina XDR OLED (120Hz ProMotion)'
    ]
  },
  {
    id: 'iphone-18-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 18 (256GB)',
    price: 385000,
    originalPrice: 410000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-18_blue.jpg',
    variants: [
      { name: 'Sky Blue', image: '/APPLE/apple_iphone-18_blue.jpg', hex: '#38bdf8' },
      { name: 'Silver', image: '/APPLE/apple_iphone-18-pro_silver.webp', hex: '#e2e8f0' }
    ],
    specs: [
      'Apple A20 Bionic Silicon with Apple Intelligence 2.0',
      '8 GB RAM with Hardware Ray Tracing',
      '48 MP Dual Rear Fusion Camera System',
      'Action Button + Camera Control',
      '3920 mAh Battery with MagSafe 25W Charging',
      '6.3 inches Super Retina XDR OLED Display'
    ]
  },
  {
    id: 'iphone-17-pro-max-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 17 Pro Max (256GB)',
    price: 433000,
    originalPrice: 449000,
    discountPercent: 4,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg',
    variants: [
      { name: 'Cosmic Orange', image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg', hex: '#ea580c' },
      { name: 'Deep Blue', image: '/APPLE/apple_iphone-17-pro_deep-blue.jpg', hex: '#1e3a8a' },
      { name: 'Silver Titanium', image: '/APPLE/apple_iphone-17-pro_silver.jpg', hex: '#d1d5db' },
      { name: 'Space Black', image: '/APPLE/apple_iphone-17-pro_black_300x300.webp', hex: '#1f2937' }
    ],
    specs: [
      'Apple A19 Pro Bionic (3nm)',
      '12 GB High-Speed RAM',
      '48 MP Triple Camera with 48MP Periscope Telephoto',
      '24 MP Front TrueDepth Camera',
      '4680 mAh All-Day Battery',
      '6.9 inches Super Retina XDR 1-120Hz ProMotion'
    ]
  },
  {
    id: 'iphone-17-pro-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 17 Pro (256GB)',
    price: 411900,
    originalPrice: 429000,
    discountPercent: 4,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg',
    variants: [
      { name: 'Cosmic Orange', image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg', hex: '#ea580c' },
      { name: 'Deep Blue', image: '/APPLE/apple_iphone-17-pro_deep-blue.jpg', hex: '#1e3a8a' },
      { name: 'Silver Titanium', image: '/APPLE/apple_iphone-17-pro_silver.jpg', hex: '#d1d5db' },
      { name: 'Space Black', image: '/APPLE/apple_iphone-17-pro_black_300x300.webp', hex: '#1f2937' }
    ],
    specs: [
      'Apple A19 Pro Bionic Chip',
      '12 GB RAM',
      '48 MP Triple Rear Fusion Camera System',
      '24 MP Front FaceID Camera',
      '4120 mAh Battery',
      '6.3 inches Super Retina XDR ProMotion OLED'
    ]
  },
  {
    id: 'iphone-17-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 17 (256GB)',
    price: 310900,
    originalPrice: 330000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-17_black.jpg',
    variants: [
      { name: 'Midnight Black', image: '/APPLE/apple_iphone-17_black.jpg', hex: '#18181b' },
      { name: 'Starlight White', image: '/APPLE/apple_iphone-17_white.jpg', hex: '#f8fafc' }
    ],
    specs: [
      'Apple A19 Bionic Chip with Neural Engine',
      '8 GB RAM with Apple Intelligence',
      '48 MP Dual Rear Fusion Camera System',
      '12 MP Front Camera with Center Stage',
      '3877 mAh Battery',
      '6.3 inches Super Retina XDR OLED display'
    ]
  },
  {
    id: 'iphone-16-pro-max-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 16 Pro Max (256GB)',
    price: 425000,
    originalPrice: 449000,
    discountPercent: 5,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-16-pro-max_desert-titanium.png',
    variants: [
      { name: 'Desert Titanium', image: '/APPLE/apple_iphone-16-pro-max_desert-titanium.png', hex: '#cbb7a2' },
      { name: 'Natural Titanium', image: '/APPLE/apple_iphone-16-pro-max_natural-titanium.png', hex: '#9e9893' },
      { name: 'White Titanium', image: '/APPLE/apple_iphone-16-pro-max_white-titanium.png', hex: '#f0f0f2' },
      { name: 'Black Titanium', image: '/APPLE/apple_iphone-16-pro-max_black-titanium.png', hex: '#2f3133' }
    ],
    specs: [
      'Apple A18 Pro 3nm Flagship Processor',
      '8 GB RAM with Neural Engine 2.0',
      '48 MP Triple Camera with 5x Optical Zoom',
      'Capacitive Camera Control switch',
      '4685 mAh battery with 25W MagSafe fast charging',
      '6.9 inches Super Retina XDR OLED'
    ]
  },
  {
    id: 'iphone-16-pro-max-512gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 16 Pro Max (512GB)',
    price: 465000,
    originalPrice: 489000,
    discountPercent: 5,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-16-pro-max_natural-titanium.png',
    variants: [
      { name: 'Natural Titanium', image: '/APPLE/apple_iphone-16-pro-max_natural-titanium.png', hex: '#9e9893' },
      { name: 'Desert Titanium', image: '/APPLE/apple_iphone-16-pro-max_desert-titanium.png', hex: '#cbb7a2' },
      { name: 'White Titanium', image: '/APPLE/apple_iphone-16-pro-max_white-titanium.png', hex: '#f0f0f2' },
      { name: 'Black Titanium', image: '/APPLE/apple_iphone-16-pro-max_black-titanium.png', hex: '#2f3133' }
    ],
    specs: [
      'Apple A18 Pro chip with 6-core GPU',
      '8 GB RAM with Hardware Ray Tracing',
      '48 MP Fusion + 48 MP Ultra Wide + 12 MP 5x Telephoto',
      'Camera Control button with haptic feedback',
      '4685 mAh all-day battery life (up to 33 hrs video)',
      '6.9 inches Super Retina XDR with ProMotion 120Hz'
    ]
  },
  {
    id: 'iphone-16-pro-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 16 Pro (128GB)',
    price: 301990,
    originalPrice: 320000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-16-pro_desert-titanium.png',
    variants: [
      { name: 'Desert Titanium', image: '/APPLE/apple_iphone-16-pro_desert-titanium.png', hex: '#cbb7a2' },
      { name: 'Natural Titanium', image: '/APPLE/apple_iphone-16-pro_natural-titanium.png', hex: '#9e9893' },
      { name: 'White Titanium', image: '/APPLE/apple_iphone-16-pro_white-titanium.png', hex: '#f0f0f2' },
      { name: 'Black Titanium', image: '/APPLE/apple_iphone-16-pro_black-titanium.png', hex: '#2f3133' }
    ],
    specs: [
      'Apple A18 Pro processor',
      '8 GB RAM',
      '48 MP Fusion + 48 MP Ultra Wide + 5x Telephoto',
      'Camera Control haptic sensor',
      '3582 mAh Battery',
      '6.3 inches Super Retina XDR Display'
    ]
  },
  {
    id: 'iphone-16-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 16 (128GB)',
    price: 265000,
    originalPrice: 285000,
    discountPercent: 7,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-16_ultramarine.webp',
    variants: [
      { name: 'Ultramarine', image: '/APPLE/apple_iphone-16_ultramarine.webp', hex: '#4338ca' },
      { name: 'Pink', image: '/APPLE/apple_iphone-16_pink.webp', hex: '#f472b6' },
      { name: 'Black', image: '/APPLE/apple_iphone-16_black.png', hex: '#18181b' }
    ],
    specs: [
      'Apple A18 Silicon with 5-core GPU',
      '8 GB RAM with Apple Intelligence',
      '48 MP 2-in-1 Fusion Camera + 12 MP Ultra Wide',
      'Camera Control + Action Button',
      '3561 mAh Battery',
      '6.1 inches Super Retina XDR OLED'
    ]
  },
  {
    id: 'iphone-15-pro-max-256gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 15 Pro Max (256GB)',
    price: 375000,
    originalPrice: 409000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-15-pro-max_black-titanium.jpg',
    variants: [
      { name: 'Black Titanium', image: '/APPLE/apple_iphone-15-pro-max_black-titanium.jpg', hex: '#18181b' },
      { name: 'Blue Titanium', image: '/APPLE/apple_iphone-15-pro-max_blue-titanium.jpg', hex: '#1e3a8a' },
      { name: 'White Titanium', image: '/APPLE/apple_iphone-15-pro-max_white-titanium.jpg', hex: '#f8fafc' },
      { name: 'Starlight', image: '/APPLE/apple_iphone-15-pro-max_starlight.jpg', hex: '#f1f5f9' }
    ],
    specs: [
      'Apple A17 Pro (3nm) with 6-core GPU',
      '8 GB RAM',
      '48 MP Main + 12 MP Ultra Wide + 12 MP 5x Telephoto',
      'Action Button customizable trigger',
      '4422 mAh Battery with USB-C 3.0',
      '6.7 inches Super Retina XDR OLED (120Hz)'
    ]
  },
  {
    id: 'iphone-15-pro-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 15 Pro (128GB)',
    price: 335000,
    originalPrice: 355000,
    discountPercent: 6,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-15-pro_natural-titanium.jpg',
    variants: [
      { name: 'Natural Titanium', image: '/APPLE/apple_iphone-15-pro_natural-titanium.jpg', hex: '#9e9893' },
      { name: 'Blue Titanium', image: '/APPLE/apple_iphone-15-pro_blue-titanium.jpg', hex: '#1e3a8a' }
    ],
    specs: [
      'Apple A17 Pro Processor with Ray Tracing',
      '8 GB RAM',
      '48 MP Main + 12 MP Ultra Wide + 3x Telephoto',
      'Titanium frame with brushed edges',
      '3274 mAh Battery with USB-C',
      '6.1 inches Super Retina XDR ProMotion OLED'
    ]
  },
  {
    id: 'iphone-15-plus-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 15 Plus (128GB)',
    price: 285000,
    originalPrice: 310000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-15-plus_pink.jpg',
    variants: [
      { name: 'Pink', image: '/APPLE/apple_iphone-15-plus_pink.jpg', hex: '#fbcfe8' }
    ],
    specs: [
      'Apple A16 Bionic Chip',
      '6 GB RAM',
      '48 MP Main + 12 MP Ultra Wide',
      'Dynamic Island notifications',
      '4383 mAh Long-Lasting Battery',
      '6.7 inches Super Retina XDR OLED'
    ]
  },
  {
    id: 'iphone-15-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 15 (128GB)',
    price: 245000,
    originalPrice: 272000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-15_blue.png',
    variants: [
      { name: 'Blue', image: '/APPLE/apple_iphone-15_blue.png', hex: '#93c5fd' },
      { name: 'Black', image: '/APPLE/apple_iphone-15_black_300x300.png', hex: '#18181b' },
      { name: 'Pink', image: '/APPLE/apple_iphone-15_pink_100x100.png', hex: '#f472b6' },
      { name: 'Green', image: '/APPLE/apple_iphone-15_green_100x100.png', hex: '#86efac' }
    ],
    specs: [
      'Apple A16 Bionic Chip',
      '6 GB RAM',
      '48 MP Main + 12 MP Ultra Wide',
      'Dynamic Island interactive pill',
      '3349 mAh Battery with USB-C connector',
      '6.1 inches Super Retina XDR display'
    ]
  },
  {
    id: 'iphone-14-128gb',
    category: 'iphone',
    categoryLabel: 'iPhone',
    name: 'Apple iPhone 14 (128GB)',
    price: 195000,
    originalPrice: 215000,
    discountPercent: 9,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_iphone-14_blue.jpg',
    variants: [
      { name: 'Blue', image: '/APPLE/apple_iphone-14_blue.jpg', hex: '#60a5fa' },
      { name: '(PRODUCT)RED', image: '/APPLE/apple_iphone-14_product-red.jpg', hex: '#dc2626' },
      { name: 'Purple', image: '/APPLE/apple_iphone-14_purple.jpg', hex: '#c084fc' },
      { name: 'Starlight', image: '/APPLE/apple_iphone-14_starlight.jpg', hex: '#f8fafc' }
    ],
    specs: [
      'Apple A15 Bionic (5-core GPU)',
      '6 GB RAM',
      '12 MP Dual Rear Camera with Photonic Engine',
      'Emergency SOS via satellite',
      '3279 mAh Battery',
      '6.1 inches Super Retina XDR OLED'
    ]
  },
  {
    id: 'apple-watch-ultra-2',
    category: 'watch',
    categoryLabel: 'Watch',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
    price: 265000,
    originalPrice: 289000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/apple_watch_ultra.jpg',
    variants: [
      { name: 'Natural Titanium / Orange Ocean Band', image: '/apple_watch_ultra.jpg', hex: '#f97316' }
    ],
    specs: [
      'S9 SiP with 64-bit dual-core processor',
      'Double tap gesture control',
      '3000 nits peak brightness display',
      'Precision dual-frequency GPS (L1 and L5)',
      'Up to 36 hours normal use (72 hours Low Power Mode)',
      '100m water resistance with Depth gauge & Water temp sensor'
    ]
  },
  {
    id: 'apple-airpods-pro-2',
    category: 'airpods',
    categoryLabel: 'AirPods',
    name: 'Apple AirPods Pro (2nd Gen) USB-C with MagSafe Case',
    price: 68500,
    originalPrice: 78000,
    discountPercent: 12,
    availability: 'In Stock',
    mainImage: '/airpods_pro2.jpg',
    variants: [
      { name: 'White', image: '/airpods_pro2.jpg', hex: '#ffffff' }
    ],
    specs: [
      'Apple H2 headphone chip + U1 in case',
      'Up to 2x more Active Noise Cancellation',
      'Adaptive Audio and Transparency mode',
      'Personalized Spatial Audio with dynamic head tracking',
      'Up to 6 hours listening time (30 hours with case)',
      'Dust, sweat, and water resistant (IP54)'
    ]
  },
  {
    id: 'apple-magsafe-charger-25w',
    category: 'magsafe',
    categoryLabel: 'MagSafe & Power',
    name: 'Apple MagSafe Charger 25W (1m)',
    price: 18500,
    originalPrice: 21900,
    discountPercent: 15,
    availability: 'In Stock',
    mainImage: '/apple_magsafe.jpg',
    variants: [
      { name: 'Silver / White', image: '/apple_magsafe.jpg', hex: '#e2e8f0' }
    ],
    specs: [
      'Up to 25W fast wireless charging for iPhone 16/17/18',
      'Perfect magnetic alignment with Qi2 support',
      'Braided 1-meter USB-C integrated cable',
      'Compatible with AirPods with wireless charging case',
      '100% genuine Apple accessories guarantee'
    ]
  },
  {
    id: 'apple-20w-adapter',
    category: 'magsafe',
    categoryLabel: 'MagSafe & Power',
    name: 'Apple 20W USB-C Power Adapter (UK 3-Pin)',
    price: 7900,
    originalPrice: 9990,
    discountPercent: 21,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_20w-usb-c-power-adapter.webp',
    variants: [
      { name: 'White (UK 3-Pin)', image: '/APPLE/apple_20w-usb-c-power-adapter.webp', hex: '#ffffff' }
    ],
    specs: [
      '20W Fast Charging USB-C Power Delivery',
      'UK 3-Pin standard plug for Sri Lanka',
      '0% to 50% battery in 30 minutes',
      'Optimal charging for iPhone 14 / 15 / 16 / 17 / 18',
      'Genuine Apple factory warranty & TRCSL approved'
    ]
  },
  {
    id: 'apple-usbc-earpods',
    category: 'accessories',
    categoryLabel: 'Accessories, iPhone',
    name: 'Apple USB-C EarPods with Remote & Mic',
    price: 9900,
    originalPrice: 12900,
    discountPercent: 23,
    availability: 'In Stock',
    mainImage: '/APPLE/apple_usb-c-earpods.jpg',
    variants: [
      { name: 'White', image: '/APPLE/apple_usb-c-earpods.jpg', hex: '#f8fafc' }
    ],
    specs: [
      'Built-in remote to adjust volume & playback',
      'High-quality digital audio via USB-C connector',
      'Deeper, richer bass tones',
      'Greater protection from sweat and water',
      'Compatible with iPhone 15/16/17/18 and USB-C iPads'
    ]
  },
  {
    id: 'spigen-case-iphone',
    category: 'accessories',
    categoryLabel: 'Protection & Cases',
    name: 'Spigen MagArmor MagFit Magnetic Case for iPhone',
    price: 9500,
    originalPrice: 10500,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/spigen_case.jpg',
    variants: [
      { name: 'Matte Black', image: '/spigen_case.jpg', hex: '#1e293b' }
    ],
    specs: [
      'Built-in magnetic ring for robust MagSafe connection',
      'Air Cushion Technology for certified drop defense',
      'Matte chevron texture for secure slip-free grip',
      'Raised edges safeguard screen and camera lenses',
      'Tactile button covers for crisp feedback'
    ]
  },
  {
    id: 'belkin-ultraglass-2',
    category: 'accessories',
    categoryLabel: 'Protection & Cases',
    name: 'Belkin UltraGlass 2 Treated Screen Protector',
    price: 6900,
    originalPrice: 8000,
    discountPercent: 14,
    availability: 'In Stock',
    mainImage: '/belkin_glass.jpg',
    variants: [
      { name: 'Crystal Clear', image: '/belkin_glass.jpg', hex: '#ffffff' }
    ],
    specs: [
      'Up to 2.7x stronger than standard tempered glass',
      'Ultra-slim 0.29mm preserves native touch sensitivity',
      'Antimicrobial coating minimizes microbial growth',
      'Fingerprint resistant oleophobic barrier',
      'Includes Easy Align tray for bubble-free application'
    ]
  }
];
