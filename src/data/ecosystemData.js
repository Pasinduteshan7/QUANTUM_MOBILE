// Official Comprehensive Product Lineups for All 5 Ecosystems
// Linked with MongoDB Product Collections, authentic images, and Sri Lanka market prices (in LKR)

export const ECOSYSTEM_DATA = {
  apple: {
    brand: 'Apple',
    name: 'Apple Ecosystem',
    tagline: 'Engineered to Work Together Seamlessly.',
    headline: 'Experience the Apple Universe',
    description: 'Forged iPhone 18 Pro in deep Burgundy with mechanical Variable Aperture, 8x optical zoom, Apple Watch Ultra, and AirPods Pro.',
    accentColor: '#831843',
    badgeText: 'APPLE KEYNOTE 2026 • DIALOG 5G',
    heroTitleMain: 'iPhone 18 Pro',
    heroTitleSub: 'Forged in Burgundy.',
    heroImage: '/APPLE/apple_iphone-18-pro-max_burgundy.webp',
    heroVideo: encodeURI('/hero banner/iphone 18.mp4'),
    videoTitle: 'iPhone 18 Pro — Official Keynote Film',
    videoDuration: '0:48 • 4K Dolby Vision',

    chromeTitle: 'PRO',
    highlights: [
      {
        id: 'aperture',
        title: 'Mechanical Variable Aperture.',
        caption: 'Physical multi-blade aperture inside the 48MP Fusion lens for unprecedented depth-of-field control.',
        tag: '01 Variable Aperture',
        image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp',
        badge: 'MECHANICAL BLADES'
      },
      {
        id: 'zoom',
        title: '8x Optical-Quality Zoom.',
        caption: 'All-new tetraprism telephoto optics delivering crystal clear 8x optical portraits and framing.',
        tag: '02 8x Optical Zoom',
        image: '/APPLE/apple_iphone-18-pro_silver.webp',
        badge: '8X TETRAPRISM'
      },
      {
        id: 'ai',
        title: 'Apple Intelligence 2.0.',
        caption: 'Next-generation on-device machine learning model integrated deeply into iOS.',
        tag: '03 Apple Intelligence',
        image: '/APPLE/apple_iphone-18_blue.jpg',
        badge: 'NEURAL 3NM'
      },
      {
        id: 'control',
        title: 'Sapphire Camera Control.',
        caption: 'Multi-function haptic button for seamless exposure, zoom, and focus rack control.',
        tag: '04 Camera Control',
        image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg',
        badge: 'HAPTIC SAPPHIRE'
      },
      {
        id: 'battery',
        title: '36-Hour Expedition Battery.',
        caption: 'Stacked high-density graphene cell delivering up to 36 hours of continuous video playback.',
        tag: '05 36H Battery',
        image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp',
        badge: 'GRAPHENE CELL'
      }
    ],

    subCategories: [
      { id: 'iphone', label: 'iPhone', icon: '📱' },
      { id: 'watch', label: 'Watch', icon: '⌚' },
      { id: 'airpods', label: 'AirPods', icon: '🎧' },
      { id: 'magsafe', label: 'MagSafe & Power', icon: '⚡' },
      { id: 'accessories', label: 'Protection & Cases', icon: '🛡️' }
    ],

    flagship: {
      id: 'iphone-18-pro-max',
      name: 'iPhone 18 Pro Max',
      badge: 'LATEST APPLE FLAGSHIP',
      tagline: 'Forged in Burgundy Titanium. Mechanical Variable Aperture & 8x Optical Zoom.',
      price: 585000,
      monthlyPrice: 'LKR 24,375/mo. for 24 mos.',
      leasePrice: 'LKR 19,500/mo. with Apple Trade-In',
      finishes: [
        { name: 'Deep Burgundy', hex: '#5b142b', image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp' },
        { name: 'Silver Titanium', hex: '#d1d5db', image: '/APPLE/apple_iphone-18-pro_silver.webp' },
        { name: 'Titanium Blue', hex: '#1e3a5f', image: '/APPLE/apple_iphone-18_blue.jpg' },
        { name: 'Cosmic Orange', hex: '#ea580c', image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg' }
      ],
      specs: [
        { title: 'Display', desc: '6.9-inch Super Retina XDR OLED with 1-120Hz ProMotion & Ultra-Thin Border unibody' },
        { title: 'Camera System', desc: '48MP Fusion with Mechanical Multi-Blade Variable Aperture + 48MP Ultra Wide + 8x Tetraprism Optical Zoom' },
        { title: 'Processor & AI', desc: 'Apple A20 Pro 2nm silicon with 6-core GPU, hardware ray tracing, and Apple Intelligence 2.0 on-device neural models' },
        { title: 'Battery & Power', desc: 'Up to 36 hours video playback with high-density stacked graphene cell and MagSafe 30W wireless charging' }
      ]
    },

    catalogByCategory: {
      iphone: [
        {
          id: 'iphone-18-pro-max',
          name: 'iPhone 18 Pro Max',
          badge: 'NEW FLAGSHIP',
          tagline: 'Forged in Burgundy Titanium. Variable Aperture & 8x Zoom.',
          price: 585000,
          monthlyPrice: 'LKR 24,375/mo. for 24 mos.',
          leasePrice: 'LKR 19,500/mo. with Trade-In',
          finishes: [
            { name: 'Deep Burgundy', hex: '#5b142b', image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp' },
            { name: 'Silver Titanium', hex: '#d1d5db', image: '/APPLE/apple_iphone-18-pro_silver.webp' },
            { name: 'Titanium Blue', hex: '#1e3a5f', image: '/APPLE/apple_iphone-18_blue.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.9-inch Super Retina XDR OLED with 1-120Hz ProMotion' },
            { title: 'Camera', desc: '48MP Variable Aperture + 48MP Ultra Wide + 8x Tetraprism Optical Zoom' },
            { title: 'Processor', desc: 'Apple A20 Pro 2nm Extreme Bionic Silicon' },
            { title: 'Battery', desc: 'Up to 36 hours video playback with 4880 mAh Graphene cell' }
          ]
        },
        {
          id: 'iphone-18-pro',
          name: 'iPhone 18 Pro',
          badge: 'PRO',
          tagline: 'Precision Titanium. Mechanical Variable Aperture.',
          price: 515000,
          monthlyPrice: 'LKR 21,450/mo. for 24 mos.',
          leasePrice: 'LKR 17,200/mo. with Trade-In',
          finishes: [
            { name: 'Silver Titanium', hex: '#d1d5db', image: '/APPLE/apple_iphone-18-pro_silver.webp' },
            { name: 'Deep Burgundy', hex: '#5b142b', image: '/APPLE/apple_iphone-18-pro-max_burgundy.webp' },
            { name: 'Titanium Blue', hex: '#1e3a5f', image: '/APPLE/apple_iphone-18_blue.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.3-inch Super Retina XDR OLED with ProMotion 120Hz' },
            { title: 'Camera', desc: '48MP Fusion Camera with Mechanical Multi-Blade Variable Aperture' },
            { title: 'Processor', desc: 'Apple A20 Pro 2nm Bionic Silicon with 12GB Unified RAM' }
          ]
        },
        {
          id: 'iphone-18',
          name: 'iPhone 18',
          badge: 'NEW',
          tagline: 'Apple Intelligence 2.0. Dynamic vibrant design.',
          price: 385000,
          monthlyPrice: 'LKR 16,040/mo. for 24 mos.',
          leasePrice: 'LKR 12,800/mo. with Trade-In',
          finishes: [
            { name: 'Sky Blue', hex: '#38bdf8', image: '/APPLE/apple_iphone-18_blue.jpg' },
            { name: 'Silver', hex: '#e2e8f0', image: '/APPLE/apple_iphone-18-pro_silver.webp' }
          ],
          specs: [
            { title: 'Display', desc: '6.3-inch Super Retina XDR OLED Display' },
            { title: 'Camera', desc: '48MP Dual Rear Fusion Camera System' },
            { title: 'Processor', desc: 'Apple A20 Bionic Silicon with Hardware Ray Tracing' }
          ]
        },
        {
          id: 'iphone-17-pro-max',
          name: 'iPhone 17 Pro Max',
          badge: 'TITANIUM PRO',
          tagline: 'Cosmic Orange Titanium & Periscope Zoom.',
          price: 433000,
          monthlyPrice: 'LKR 18,040/mo. for 24 mos.',
          leasePrice: 'LKR 14,400/mo. with Trade-In',
          finishes: [
            { name: 'Cosmic Orange', hex: '#ea580c', image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg' },
            { name: 'Deep Blue', hex: '#1e3a8a', image: '/APPLE/apple_iphone-17-pro_deep-blue.jpg' },
            { name: 'Silver Titanium', hex: '#d1d5db', image: '/APPLE/apple_iphone-17-pro_silver.jpg' },
            { name: 'Space Black', hex: '#1f2937', image: '/APPLE/apple_iphone-17-pro_black_300x300.webp' }
          ],
          specs: [
            { title: 'Display', desc: '6.9-inch Super Retina XDR OLED 1-120Hz ProMotion' },
            { title: 'Camera', desc: '48MP Triple Fusion Camera with 48MP Periscope Telephoto' },
            { title: 'Processor', desc: 'Apple A19 Pro Bionic (3nm) with 12GB Unified RAM' }
          ]
        },
        {
          id: 'iphone-17-pro',
          name: 'iPhone 17 Pro',
          badge: 'PRO',
          tagline: 'Titanium powerhouse in Cosmic Orange & Deep Blue.',
          price: 411900,
          monthlyPrice: 'LKR 17,160/mo. for 24 mos.',
          leasePrice: 'LKR 13,700/mo. with Trade-In',
          finishes: [
            { name: 'Cosmic Orange', hex: '#ea580c', image: '/APPLE/apple_iphone-17-pro_cosmic-orange.jpg' },
            { name: 'Deep Blue', hex: '#1e3a8a', image: '/APPLE/apple_iphone-17-pro_deep-blue.jpg' },
            { name: 'Silver Titanium', hex: '#d1d5db', image: '/APPLE/apple_iphone-17-pro_silver.jpg' },
            { name: 'Space Black', hex: '#1f2937', image: '/APPLE/apple_iphone-17-pro_black_300x300.webp' }
          ],
          specs: [
            { title: 'Display', desc: '6.3-inch Super Retina XDR ProMotion OLED' },
            { title: 'Camera', desc: '48MP Triple Rear Fusion Camera System with 24MP TrueDepth' },
            { title: 'Processor', desc: 'Apple A19 Pro Bionic Chip' }
          ]
        },
        {
          id: 'iphone-17',
          name: 'iPhone 17',
          badge: 'ALL-NEW',
          tagline: 'Speed meets elegance in Midnight and Starlight.',
          price: 310900,
          monthlyPrice: 'LKR 12,950/mo. for 24 mos.',
          leasePrice: 'LKR 10,300/mo. with Trade-In',
          finishes: [
            { name: 'Midnight Black', hex: '#18181b', image: '/APPLE/apple_iphone-17_black.jpg' },
            { name: 'Starlight White', hex: '#f8fafc', image: '/APPLE/apple_iphone-17_white.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.3-inch Super Retina XDR OLED display' },
            { title: 'Camera', desc: '48MP Dual Rear Fusion Camera with Center Stage' },
            { title: 'Processor', desc: 'Apple A19 Bionic Chip with Neural Engine' }
          ]
        },
        {
          id: 'iphone-16-pro-max',
          name: 'iPhone 16 Pro Max',
          badge: 'PRO MAX',
          tagline: 'Hello, Apple Intelligence. 6.9-inch Titanium.',
          price: 425000,
          monthlyPrice: 'LKR 17,700/mo. for 24 mos.',
          leasePrice: 'LKR 14,200/mo. with Apple Trade-In',
          finishes: [
            { name: 'Desert Titanium', hex: '#cbb7a2', image: '/APPLE/apple_iphone-16-pro-max_desert-titanium.png' },
            { name: 'Natural Titanium', hex: '#9e9893', image: '/APPLE/apple_iphone-16-pro-max_natural-titanium.png' },
            { name: 'White Titanium', hex: '#f0f0f2', image: '/APPLE/apple_iphone-16-pro-max_white-titanium.png' },
            { name: 'Black Titanium', hex: '#2f3133', image: '/APPLE/apple_iphone-16-pro-max_black-titanium.png' }
          ],
          specs: [
            { title: 'Display', desc: '6.9-inch Super Retina XDR OLED with ProMotion up to 120Hz' },
            { title: 'Camera System', desc: '48MP Fusion Main + 48MP Ultra Wide + 12MP 5x Telephoto' },
            { title: 'Processor', desc: 'A18 Pro chip with 6-core GPU and 16-core Neural Engine' },
            { title: 'Battery', desc: 'Up to 33 hours video playback with MagSafe 25W wireless charging' }
          ]
        },
        {
          id: 'iphone-16-pro',
          name: 'iPhone 16 Pro',
          badge: 'PRO',
          tagline: 'Grade 5 Titanium with Camera Control.',
          price: 301990,
          monthlyPrice: 'LKR 12,580/mo. for 24 mos.',
          leasePrice: 'LKR 10,050/mo. with Trade-In',
          finishes: [
            { name: 'Desert Titanium', hex: '#cbb7a2', image: '/APPLE/apple_iphone-16-pro_desert-titanium.png' },
            { name: 'Natural Titanium', hex: '#9e9893', image: '/APPLE/apple_iphone-16-pro_natural-titanium.png' },
            { name: 'White Titanium', hex: '#f0f0f2', image: '/APPLE/apple_iphone-16-pro_white-titanium.png' },
            { name: 'Black Titanium', hex: '#2f3133', image: '/APPLE/apple_iphone-16-pro_black-titanium.png' }
          ],
          specs: [
            { title: 'Display & Build', desc: '6.3-inch Super Retina XDR with ProMotion 120Hz. Grade 5 titanium.' },
            { title: 'Camera System', desc: '48MP Fusion Main + 48MP Ultra Wide + 5x Telephoto' },
            { title: 'Processor & AI', desc: 'A18 Pro chip with 6-core GPU, hardware ray tracing' }
          ]
        },
        {
          id: 'iphone-16',
          name: 'iPhone 16',
          badge: 'NEW',
          tagline: 'Built for Apple Intelligence in Ultramarine and Pink.',
          price: 265000,
          monthlyPrice: 'LKR 11,040/mo. for 24 mos.',
          leasePrice: 'LKR 8,800/mo. with Trade-In',
          finishes: [
            { name: 'Ultramarine', hex: '#4338ca', image: '/APPLE/apple_iphone-16_ultramarine.webp' },
            { name: 'Pink', hex: '#f472b6', image: '/APPLE/apple_iphone-16_pink.webp' },
            { name: 'Black', hex: '#18181b', image: '/APPLE/apple_iphone-16_black.png' }
          ],
          specs: [
            { title: 'Display', desc: '6.1-inch Super Retina XDR OLED, Dynamic Island' },
            { title: 'Camera', desc: '48MP 2-in-1 Fusion camera + 12MP Ultra Wide' },
            { title: 'Chip', desc: 'Apple A18 silicon with hardware ray tracing' }
          ]
        },
        {
          id: 'iphone-15-pro-max',
          name: 'iPhone 15 Pro Max',
          badge: 'TITANIUM',
          tagline: 'Titanium powerhouse with 5x optical telephoto.',
          price: 375000,
          monthlyPrice: 'LKR 15,625/mo. for 24 mos.',
          leasePrice: 'LKR 12,500/mo. with Trade-In',
          finishes: [
            { name: 'Black Titanium', hex: '#18181b', image: '/APPLE/apple_iphone-15-pro-max_black-titanium.jpg' },
            { name: 'Blue Titanium', hex: '#1e3a8a', image: '/APPLE/apple_iphone-15-pro-max_blue-titanium.jpg' },
            { name: 'White Titanium', hex: '#f8fafc', image: '/APPLE/apple_iphone-15-pro-max_white-titanium.jpg' },
            { name: 'Starlight', hex: '#f1f5f9', image: '/APPLE/apple_iphone-15-pro-max_starlight.jpg' },
            { name: 'Natural Titanium', hex: '#9e9893', image: '/APPLE/apple_iphone-15-pro_natural-titanium.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.7-inch Super Retina XDR OLED 120Hz ProMotion' },
            { title: 'Camera', desc: '48MP Main + 5x 120mm Telephoto + Ultra Wide' },
            { title: 'Chip', desc: 'Apple A17 Pro 3nm with USB-C 3.0 data transfer' }
          ]
        },
        {
          id: 'iphone-15-pro',
          name: 'iPhone 15 Pro',
          badge: 'PRO TITANIUM',
          tagline: 'Brushed titanium unibody with Action Button.',
          price: 335000,
          monthlyPrice: 'LKR 13,950/mo. for 24 mos.',
          leasePrice: 'LKR 11,200/mo. with Trade-In',
          finishes: [
            { name: 'Natural Titanium', hex: '#9e9893', image: '/APPLE/apple_iphone-15-pro_natural-titanium.jpg' },
            { name: 'Blue Titanium', hex: '#1e3a8a', image: '/APPLE/apple_iphone-15-pro_blue-titanium.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.1-inch Super Retina XDR ProMotion OLED' },
            { title: 'Camera', desc: '48MP Main + 12MP Ultra Wide + 3x Telephoto' },
            { title: 'Chip', desc: 'Apple A17 Pro processor with Ray Tracing' }
          ]
        },
        {
          id: 'iphone-15-plus',
          name: 'iPhone 15 Plus',
          badge: 'PLUS',
          tagline: 'Massive 6.7-inch display and huge battery life.',
          price: 285000,
          monthlyPrice: 'LKR 11,875/mo. for 24 mos.',
          leasePrice: 'LKR 9,500/mo. with Trade-In',
          finishes: [
            { name: 'Pink', hex: '#fbcfe8', image: '/APPLE/apple_iphone-15-plus_pink.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.7-inch Super Retina XDR OLED with Dynamic Island' },
            { title: 'Camera', desc: '48MP Main + 12MP Ultra Wide' },
            { title: 'Chip', desc: 'Apple A16 Bionic Chip' }
          ]
        },
        {
          id: 'iphone-15',
          name: 'iPhone 15',
          badge: 'POPULAR',
          tagline: 'Dynamic Island and 48MP Main camera with USB-C.',
          price: 245000,
          monthlyPrice: 'LKR 10,200/mo. for 24 mos.',
          leasePrice: 'LKR 8,500/mo. with Trade-In',
          finishes: [
            { name: 'Blue', hex: '#93c5fd', image: '/APPLE/apple_iphone-15_blue.png' },
            { name: 'Black', hex: '#18181b', image: '/APPLE/apple_iphone-15_black_300x300.png' },
            { name: 'Pink', hex: '#f472b6', image: '/APPLE/apple_iphone-15_pink_100x100.png' },
            { name: 'Green', hex: '#86efac', image: '/APPLE/apple_iphone-15_green_100x100.png' }
          ],
          specs: [
            { title: 'Display & Design', desc: '6.1-inch Super Retina XDR OLED with Dynamic Island.' },
            { title: 'Camera', desc: '48MP Main camera with 2x Telephoto optical crop.' },
            { title: 'Performance', desc: 'A16 Bionic chip with USB-C universal connector.' }
          ]
        },
        {
          id: 'iphone-14',
          name: 'iPhone 14',
          badge: 'VALUE',
          tagline: 'Dual-camera system with Photonic Engine.',
          price: 195000,
          monthlyPrice: 'LKR 8,125/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Blue', hex: '#60a5fa', image: '/APPLE/apple_iphone-14_blue.jpg' },
            { name: '(PRODUCT)RED', hex: '#dc2626', image: '/APPLE/apple_iphone-14_product-red.jpg' },
            { name: 'Purple', hex: '#c084fc', image: '/APPLE/apple_iphone-14_purple.jpg' },
            { name: 'Starlight', hex: '#f8fafc', image: '/APPLE/apple_iphone-14_starlight.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.1-inch Super Retina XDR OLED display' },
            { title: 'Camera', desc: '12MP Main + 12MP Ultra Wide with Photonic Engine' },
            { title: 'Chip', desc: 'A15 Bionic with 5-core GPU' }
          ]
        }
      ],
      watch: [
        {
          id: 'watch-ultra-2',
          name: 'Apple Watch Ultra 2 (49mm)',
          badge: 'TITANIUM 49MM',
          tagline: 'Relentless. Extreme adventure ready.',
          price: 245000,
          monthlyPrice: 'LKR 10,200/mo. for 24 mos.',
          leasePrice: 'LKR 8,200/mo. with Trade-In',
          finishes: [
            { name: 'Natural Titanium + Orange Ocean Band', hex: '#f97316', image: '/apple_watch_ultra.jpg' },
            { name: 'Black Titanium', hex: '#1e2022', image: '/apple_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Case & Screen', desc: '49mm aerospace-grade titanium case, 3,000 nits brightest Apple display.' },
            { title: 'Action Button', desc: 'Customizable Action button for workout tracking and dive logs.' },
            { title: 'Battery Endurance', desc: 'Up to 36 hours of normal battery life, 72 hours in Low Power Mode.' },
            { title: 'Sensors', desc: 'Precision dual-frequency GPS (L1+L5), depth gauge to 40 meters.' }
          ]
        },
        {
          id: 'watch-series-10-46',
          name: 'Apple Watch Series 10 (46mm)',
          badge: 'NEW SERIES 10',
          tagline: 'Thinnest Apple Watch ever with wide-angle OLED.',
          price: 155000,
          monthlyPrice: 'LKR 6,450/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Jet Black Aluminum', hex: '#000000', image: '/apple_watch_ultra.jpg' },
            { name: 'Rose Gold Aluminum', hex: '#f43f5e', image: '/apple_watch_ultra.jpg' },
            { name: 'Silver Aluminum', hex: '#e2e8f0', image: '/apple_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Case', desc: '46mm lightweight aluminum with Ion-X front glass' },
            { title: 'Display', desc: 'Wide-angle OLED, up to 40% brighter off-axis' },
            { title: 'Health', desc: 'Sleep apnea notifications, ECG, cycle tracking' }
          ]
        },
        {
          id: 'watch-series-10-42',
          name: 'Apple Watch Series 10 (42mm)',
          badge: 'SERIES 10 42MM',
          tagline: 'Compact, ultra-thin, all-day comfort.',
          price: 145000,
          monthlyPrice: 'LKR 6,040/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Jet Black Aluminum', hex: '#000000', image: '/apple_watch_ultra.jpg' },
            { name: 'Silver Aluminum', hex: '#e2e8f0', image: '/apple_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Case', desc: '42mm aluminum case' },
            { title: 'Chip', desc: 'S10 SiP with 4-core Neural Engine' }
          ]
        },
        {
          id: 'watch-se-2',
          name: 'Apple Watch SE (2nd Gen 44mm)',
          badge: 'BEST VALUE',
          tagline: 'Heavy on features. Light on price.',
          price: 78000,
          monthlyPrice: 'LKR 3,250/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Midnight Aluminum', hex: '#1e293b', image: '/apple_watch_ultra.jpg' },
            { name: 'Starlight Aluminum', hex: '#f1f5f9', image: '/apple_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Case', desc: '44mm aluminum with color-matched back' },
            { title: 'Chip', desc: 'S8 SiP dual-core processor with Crash Detection' }
          ]
        }
      ],
      airpods: [
        {
          id: 'airpods-pro-2',
          name: 'Apple AirPods Pro (2nd Gen) USB-C',
          badge: 'H2 SILICON',
          tagline: 'Adaptive Audio. Now playing.',
          price: 76000,
          monthlyPrice: 'LKR 3,160/mo. for 24 mos.',
          leasePrice: 'LKR 2,500/mo. with Apple Trade-In',
          finishes: [
            { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
          ],
          specs: [
            { title: 'Chip', desc: 'Apple H2 headphone chip + U1 in MagSafe USB-C case' },
            { title: 'Noise Cancellation', desc: 'Up to 2x more Active Noise Cancellation and Adaptive Audio' },
            { title: 'Case', desc: 'Precision Finding via built-in speaker and lanyard loop' }
          ]
        },
        {
          id: 'airpods-4-anc',
          name: 'Apple AirPods 4 with ANC',
          badge: 'NEW AIRPODS 4 ANC',
          tagline: 'Active Noise Cancellation for an open-ear fit.',
          price: 62000,
          monthlyPrice: 'LKR 2,580/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
          ],
          specs: [
            { title: 'Chip', desc: 'Apple H2 audio silicon' },
            { title: 'Audio Features', desc: 'Active Noise Cancellation, Adaptive Audio, Transparency' },
            { title: 'Case', desc: 'USB-C wireless charging case with Find My speaker' }
          ]
        },
        {
          id: 'airpods-4',
          name: 'Apple AirPods 4',
          badge: 'AIRPODS 4',
          tagline: 'Next-level sound and comfort.',
          price: 46000,
          monthlyPrice: 'LKR 1,915/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Gloss White', hex: '#ffffff', image: '/airpods_pro2.jpg' }
          ],
          specs: [
            { title: 'Chip', desc: 'Apple H2 chip' },
            { title: 'Battery', desc: 'Up to 30 hours total listening time with USB-C case' }
          ]
        },
        {
          id: 'airpods-max-usbc',
          name: 'Apple AirPods Max (USB-C)',
          badge: 'STUDIO PRO',
          tagline: 'Over-ear studio master acoustics.',
          price: 185000,
          monthlyPrice: 'LKR 7,700/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Midnight', hex: '#1e293b', image: '/airpods_pro2.jpg' },
            { name: 'Starlight', hex: '#f8fafc', image: '/airpods_pro2.jpg' },
            { name: 'Blue', hex: '#3b82f6', image: '/airpods_pro2.jpg' }
          ],
          specs: [
            { title: 'Acoustics', desc: 'Apple-designed 40mm dynamic driver' },
            { title: 'ANC', desc: 'Active Noise Cancellation with Transparency mode' }
          ]
        }
      ],
      magsafe: [
        {
          id: 'apple-magsafe-25w',
          name: 'Apple MagSafe 25W Charger (1m)',
          badge: 'FAST 25W',
          tagline: 'Snap on. Super fast 25W wireless.',
          price: 15500,
          monthlyPrice: 'LKR 1,290/mo. for 12 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Silver Aluminum / Braided White', hex: '#e2e8f0', image: '/apple_magsafe.jpg' }
          ],
          specs: [
            { title: 'High-Speed Wireless', desc: 'Up to 25W fast magnetic wireless charging for iPhone 16 series' },
            { title: 'Cable', desc: '1m durable braided cable' }
          ]
        },
        {
          id: 'apple-30w-usbc',
          name: 'Apple 30W USB-C Power Adapter',
          badge: 'OFFICIAL 30W',
          tagline: 'Fast charging for iPhone and MacBook Air.',
          price: 13500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Gloss White', hex: '#ffffff', image: '/apple_magsafe.jpg' }
          ],
          specs: [
            { title: 'Power Output', desc: '30W USB-C Power Delivery' }
          ]
        },
        {
          id: 'apple-20w-usbc',
          name: 'Apple 20W USB-C Power Adapter',
          badge: 'ESSENTIAL',
          tagline: 'Fast charging standard UK 3-pin adapter.',
          price: 7900,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Gloss White (UK 3-Pin)', hex: '#ffffff', image: '/APPLE/apple_20w-usb-c-power-adapter.webp' }
          ],
          specs: [
            { title: 'Power Output', desc: '20W USB-C Power Delivery with Sri Lanka UK 3-pin plug' }
          ]
        },
        {
          id: 'anker-65w-gan',
          name: 'Anker 65W GaN Fast Charger',
          badge: 'BESTSELLER',
          tagline: 'Power laptops, phones and earbuds at once.',
          price: 16500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Matte Black', hex: '#1e293b', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'GaNPrime Technology', desc: '3 ports (2x USB-C + 1x USB-A) delivering 65W max power.' }
          ]
        }
      ],
      accessories: [
        {
          id: 'apple-usbc-earpods',
          name: 'Apple USB-C EarPods with Remote & Mic',
          badge: 'GENUINE AUDIO',
          tagline: 'High-fidelity lossless audio with integrated remote.',
          price: 9900,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Gloss White', hex: '#ffffff', image: '/APPLE/apple_usb-c-earpods.jpg' }
          ],
          specs: [
            { title: 'Connectivity', desc: 'Direct USB-C digital audio with in-line microphone and volume buttons' }
          ]
        },
        {
          id: 'apple-silicone-case-16',
          name: 'Apple iPhone 16 Pro Silicone Case with MagSafe',
          badge: 'CAMERA CONTROL',
          tagline: 'Silky soft exterior with Camera Control sapphire cap.',
          price: 17500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Black', hex: '#1e293b', image: '/spigen_case.jpg' },
            { name: 'Denim', hex: '#3b82f6', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Material', desc: 'Silicone with sapphire crystal for Camera Control' }
          ]
        },
        {
          id: 'belkin-ultraglass',
          name: 'Belkin UltraGlass 2 Screen Protector',
          badge: 'GERMAN OPTICS',
          tagline: 'Up to 2.7x stronger than tempered glass.',
          price: 6500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Ultra Clear', hex: '#ffffff', image: '/belkin_glass.jpg' }
          ],
          specs: [
            { title: 'Ion-Exchange Glass', desc: 'Lithium aluminosilicate glass with Easy Align tray included.' }
          ]
        },
        {
          id: 'spigen-ultra-hybrid',
          name: 'Spigen Ultra Hybrid MagSafe Case',
          badge: 'MIL-GRADE',
          tagline: 'Crystal clarity. Magnetic armor.',
          price: 7500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Crystal Clear', hex: '#f8fafc', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Drop Protection', desc: 'Air Cushion Technology in all corners protects against drops.' }
          ]
        }
      ]
    },

    bundle: {
      id: 'bundle-apple-pro',
      name: 'The Ultimate Apple Pro Setup',
      subtitle: 'iPhone 16 Pro (256GB) + AirPods Pro 2 USB-C + MagSafe 25W Charger',
      originalPrice: 516500,
      price: 499000,
      savings: 17500,
      image: '/airpods_pro2.jpg',
      badge: 'SAVE LKR 17,500'
    },
    repairHighlight: 'Certified Apple Board & Screen Diagnostics with Genuine OEM-grade glass and thermal-tested battery packs.'
  },

  samsung: {
    brand: 'Samsung',
    name: 'Samsung Galaxy Ecosystem',
    tagline: 'Unfold Your World with Galaxy AI.',
    headline: 'The Next Generation Galaxy Experience',
    description: 'Galaxy S24 Ultra in Titanium with Snapdragon 8 Gen 3, Galaxy AI ProVisual camera, 200MP sensor, and S-Pen.',
    accentColor: '#2563eb',
    badgeText: 'SAMSUNG UNPACKED • GALAXY AI',
    heroTitleMain: 'Galaxy S26 Ultra',
    heroTitleSub: 'Titanium Armor with Galaxy AI 2.0.',
    heroImage: '/s26_ultra.jpg',
    heroVideo: encodeURI('/hero banner/s26.mp4'),
    videoTitle: 'Galaxy S24 Ultra — Official Unpacked Film',
    videoDuration: '0:52 • 4K HDR10+',

    chromeTitle: 'ULTRA',
    highlights: [
      {
        id: 'ai',
        title: 'Galaxy AI Multi-Modal Engine.',
        caption: 'Live call translation, Circle to Search with Google, Note Assist, and Generative Photo Edit.',
        tag: '01 Galaxy AI',
        image: '/samsung_s24.jpg',
        badge: 'GALAXY AI'
      },
      {
        id: 'camera',
        title: '200MP ProVisual Camera.',
        caption: '200MP sensor with 5x periscope optical zoom and AI nightography.',
        tag: '02 200MP Quad Cam',
        image: '/samsung_s24.jpg',
        badge: '200MP SENSOR'
      },
      {
        id: 'spen',
        title: 'Integrated S Pen.',
        caption: 'Built-in stylus for drawing, signing documents, and precise note-taking.',
        tag: '03 Built-In S Pen',
        image: '/samsung_s24.jpg',
        badge: 'S PEN DOCK'
      },
      {
        id: 'silicon',
        title: 'Snapdragon 8 Gen 3 for Galaxy.',
        caption: 'Extreme computing power with 1.9x larger vapor chamber cooling.',
        tag: '04 Snapdragon 8 Gen 3',
        image: '/samsung_s24.jpg',
        badge: 'FOR GALAXY'
      }
    ],

    subCategories: [
      { id: 'phones', label: 'Galaxy Phones', icon: '📱' },
      { id: 'watch', label: 'Galaxy Watch', icon: '⌚' },
      { id: 'buds', label: 'Galaxy Buds', icon: '🎧' },
      { id: 'power', label: 'Super Fast Power', icon: '⚡' },
      { id: 'accessories', label: 'Armor & Accessories', icon: '🛡️' }
    ],

        flagship: {
      id: 'galaxy-s26-ultra',
      name: 'Samsung Galaxy S26 Ultra',
      badge: 'LATEST GALAXY FLAGSHIP',
      tagline: 'Titanium armor meets Galaxy AI 2.0 and integrated S Pen.',
      price: 425000,
      monthlyPrice: 'LKR 17,700/mo. for 24 mos.',
      leasePrice: 'LKR 14,200/mo. with Galaxy Trade-In',
      finishes: [
        { name: 'Titanium Cobalt Blue', hex: '#1e3a8a', image: '/s26_ultra.jpg' },
        { name: 'Titanium Silver', hex: '#d1d5db', image: '/s26_ultra_portrait.jpg' },
        { name: 'Titanium Phantom Black', hex: '#18181b', image: '/s26_ultra.jpg' },
        { name: 'Titanium Jade', hex: '#065f46', image: '/s26_ultra_portrait.jpg' }
      ],
      specs: [
        { title: 'Display & S Pen', desc: '6.9-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor 3 anti-reflective crystal and integrated S Pen' },
        { title: '200MP Quad ProVisual Camera', desc: '200MP wide sensor, 50MP 5x periscope telephoto, 50MP ultra-wide, and 10MP 3x telephoto with 100x Space Zoom' },
        { title: 'Galaxy AI 2.0 System', desc: 'Real-time multilingual live call translation, Circle to Search with Google, Note Assist, and Generative Photo Studio' },
        { title: 'Processor & Battery', desc: 'Snapdragon 8 Elite Gen 2 for Galaxy with vapor chamber cooling, 5,200mAh battery and 65W Fast Charging' }
      ]
    },

catalogByCategory: {
      phones: [
        {
          id: 'galaxy-s24-ultra',
          name: 'Galaxy S24 Ultra',
          badge: 'GALAXY AI',
          tagline: 'Titanium meets AI brilliance.',
          price: 385000,
          monthlyPrice: 'LKR 16,000/mo. for 24 mos.',
          leasePrice: 'LKR 13,500/mo. with Trade-In',
          finishes: [
            { name: 'Titanium Gray', hex: '#6b6e73', image: '/samsung_s24.jpg' },
            { name: 'Titanium Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
            { name: 'Titanium Violet', hex: '#818cf8', image: '/samsung_s24.jpg' }
          ],
          specs: [
            { title: 'Display & S Pen', desc: '6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor anti-reflective glass. Integrated S Pen.' },
            { title: '200MP Quad Camera', desc: '200MP wide sensor, 50MP 5x periscope optical zoom, 10MP 3x telephoto, and 12MP ultra-wide.' },
            { title: 'Galaxy AI System', desc: 'Circle to Search with Google, Live Call Two-Way Translation, Note Assist, and Generative Photo Edit.' },
            { title: 'Performance', desc: 'Snapdragon 8 Gen 3 for Galaxy with 5,000mAh battery and 45W fast charging.' }
          ]
        },
        {
          id: 'galaxy-s24-plus',
          name: 'Galaxy S24+',
          badge: 'QHD+ 120HZ',
          tagline: 'Bigger screen, bigger battery, full AI.',
          price: 315000,
          monthlyPrice: 'LKR 13,125/mo. for 24 mos.',
          leasePrice: 'LKR 10,800/mo. with Trade-In',
          finishes: [
            { name: 'Onyx Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
            { name: 'Marble Gray', hex: '#9ca3af', image: '/samsung_s24.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.7-inch QHD+ 1-120Hz display with Armor Aluminum 2 frame.' },
            { title: 'Battery', desc: '4,900mAh with 45W Super Fast Charging 2.0.' }
          ]
        },
        {
          id: 'galaxy-s24',
          name: 'Galaxy S24',
          badge: 'COMPACT FLAGSHIP',
          tagline: 'Compact power with Galaxy AI.',
          price: 255000,
          monthlyPrice: 'LKR 10,625/mo. for 24 mos.',
          leasePrice: 'LKR 8,800/mo. with Trade-In',
          finishes: [
            { name: 'Onyx Black', hex: '#2b2c2e', image: '/samsung_s24.jpg' },
            { name: 'Cobalt Violet', hex: '#6366f1', image: '/samsung_s24.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.2-inch 120Hz AMOLED 2X display' },
            { title: 'Camera', desc: '50MP OIS Main + 10MP 3x Telephoto + 12MP Ultra-Wide' }
          ]
        },
        {
          id: 'galaxy-z-fold-6',
          name: 'Galaxy Z Fold 6',
          badge: 'FOLDABLE PREMIER',
          tagline: 'Ultra-light, thinner, dual-screen AI productivity.',
          price: 545000,
          monthlyPrice: 'LKR 22,700/mo. for 24 mos.',
          leasePrice: 'LKR 18,500/mo. with Trade-In',
          finishes: [
            { name: 'Silver Shadow', hex: '#d1d5db', image: '/zflip6.jpg' },
            { name: 'Navy', hex: '#1e3a8a', image: '/zflip6.jpg' }
          ],
          specs: [
            { title: 'Main Screen', desc: '7.6-inch QXGA+ Dynamic AMOLED 2X 120Hz folding screen' },
            { title: 'Cover Screen', desc: '6.3-inch HD+ 120Hz Dynamic AMOLED cover display' },
            { title: 'Durability', desc: 'Enhanced Armor Aluminum frame, IP48 water resistance' }
          ]
        },
        {
          id: 'galaxy-z-flip-6',
          name: 'Galaxy Z Flip 6',
          badge: 'STYLE ICON',
          tagline: 'Compact, high-impact AI flip.',
          price: 310000,
          monthlyPrice: 'LKR 12,900/mo. for 24 mos.',
          leasePrice: 'LKR 10,500/mo. with Trade-In',
          finishes: [
            { name: 'Silver Shadow', hex: '#cfd2d6', image: '/zflip6.jpg' },
            { name: 'Mint', hex: '#6ee7b7', image: '/zflip6.jpg' }
          ],
          specs: [
            { title: 'Displays', desc: '6.7-inch FHD+ AMOLED 2X + 3.4-inch Super AMOLED FlexWindow.' },
            { title: '50MP FlexCam', desc: '50MP wide camera with auto-zoom framing on external cover screen.' }
          ]
        },
        {
          id: 'galaxy-a55',
          name: 'Galaxy A55 5G',
          badge: 'POPULAR MIDRANGE',
          tagline: 'Metal frame with Knox Vault security.',
          price: 108000,
          monthlyPrice: 'LKR 4,500/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Awesome Iceblue', hex: '#bfdbfe', image: '/galaxy_a55.jpg' },
            { name: 'Awesome Navy', hex: '#1e3a8a', image: '/galaxy_a55.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.6-inch 120Hz Super AMOLED with metal frame' },
            { title: 'Camera', desc: '50MP OIS Main + 12MP Ultra-Wide + 5MP Macro' }
          ]
        }
      ],
      watch: [
        {
          id: 'galaxy-watch-ultra',
          name: 'Samsung Galaxy Watch Ultra (47mm)',
          badge: 'TITANIUM 10ATM',
          tagline: 'Conquer the ocean and mountains.',
          price: 215000,
          monthlyPrice: 'LKR 8,950/mo. for 24 mos.',
          leasePrice: 'LKR 7,500/mo. with Trade-In',
          finishes: [
            { name: 'Titanium Gray + Marine Orange', hex: '#f97316', image: '/galaxy_watch_ultra.jpg' },
            { name: 'Titanium White', hex: '#f8fafc', image: '/galaxy_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Titanium Cushion Case', desc: '47mm Grade 4 titanium cushion design, 10ATM + IP68.' },
            { title: 'Dual-Frequency GPS', desc: 'L1 + L5 GPS tracking for precise route navigation.' },
            { title: 'Battery', desc: 'Up to 100 hours in Power Saving Mode.' }
          ]
        },
        {
          id: 'galaxy-watch-7',
          name: 'Samsung Galaxy Watch 7 (44mm)',
          badge: '3NM PROCESSOR',
          tagline: 'Smarter health tracking with 3nm processor.',
          price: 115000,
          monthlyPrice: 'LKR 4,790/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Green', hex: '#374151', image: '/galaxy_watch_ultra.jpg' },
            { name: 'Silver', hex: '#e5e7eb', image: '/galaxy_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Processor', desc: '3nm Exynos W1000 5-core SiP' },
            { title: 'Sensors', desc: 'BioActive Sensor with metabolic AGEs index' }
          ]
        }
      ],
      buds: [
        {
          id: 'galaxy-buds3-pro',
          name: 'Samsung Galaxy Buds3 Pro',
          badge: '24-BIT HI-FI',
          tagline: 'Blade Lights. Studio acoustics.',
          price: 68000,
          monthlyPrice: 'LKR 2,830/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Silver Blade', hex: '#a1a5ab', image: '/galaxy_buds3.jpg' },
            { name: 'White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
          ],
          specs: [
            { title: 'Acoustic Innovation', desc: 'Dual amplifiers with planar tweeters delivering 24-bit/96kHz audio.' },
            { title: 'Galaxy AI Sound', desc: 'Real-Time Voice Interpreter, Adaptive Noise Control.' }
          ]
        },
        {
          id: 'galaxy-buds-fe',
          name: 'Samsung Galaxy Buds FE',
          badge: 'FE EDITION',
          tagline: 'Everyday comfort with powerful ANC.',
          price: 28000,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Graphite', hex: '#1f2937', image: '/galaxy_buds3.jpg' },
            { name: 'White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
          ],
          specs: [
            { title: 'ANC', desc: 'Active Noise Canceling with ergonomic wingtip fit' }
          ]
        }
      ],
      power: [
        {
          id: 'samsung-45w-adapter',
          name: 'Samsung 45W Super Fast Power Adapter (EP-T4510)',
          badge: 'OFFICIAL 45W',
          tagline: 'Official 45W Super Fast Charging 2.0.',
          price: 14500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Black', hex: '#1e293b', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'Output', desc: '45W USB PD 3.0 PPS. Includes 5A Type-C cable.' }
          ]
        },
        {
          id: 'anker-65w-samsung',
          name: 'Anker 65W GaN Fast Charger (PPS)',
          badge: 'SUPER FAST 2.0',
          tagline: 'Supports Samsung 45W PPS Super Fast Charging.',
          price: 16500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Black', hex: '#1e293b', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'Compatibility', desc: 'Programmable Power Supply protocol charges Galaxy S24 Ultra in 35 mins.' }
          ]
        }
      ],
      accessories: [
        {
          id: 'samsung-smart-view-case',
          name: 'Galaxy S24 Ultra Smart View Wallet Case',
          badge: 'SMART VIEW',
          tagline: 'Preview window with card pocket.',
          price: 14500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Black', hex: '#1e293b', image: '/spigen_case.jpg' },
            { name: 'Violet', hex: '#818cf8', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Protection', desc: 'Check notifications through display window without opening cover.' }
          ]
        },
        {
          id: 'spigen-s24-case',
          name: 'Spigen Ultra Hybrid Galaxy Case',
          badge: 'AIR CUSHION',
          tagline: 'Yellowing-resistant clear protection.',
          price: 7500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Crystal Clear', hex: '#f8fafc', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Engineered for Galaxy', desc: 'Precise cutouts for S Pen port and raised camera bezels.' }
          ]
        }
      ]
    },

    bundle: {
      id: 'bundle-samsung-ultra',
      name: 'Galaxy Ultra AI Power Bundle',
      subtitle: 'Galaxy S24 Ultra (512GB) + Galaxy Buds3 Pro + Anker 65W GaN Charger',
      originalPrice: 469500,
      price: 452000,
      savings: 17500,
      image: '/galaxy_buds3.jpg',
      badge: 'SAVE LKR 17,500'
    },
    repairHighlight: 'Specialized Samsung AMOLED display calibration, Foldable hinge servicing, and ultrasonic PCB bath restoration.'
  },

  google: {
    brand: 'Google',
    name: 'Google Pixel Ecosystem',
    tagline: 'The Purest Android, Supercharged with Gemini AI.',
    headline: 'Built by Google for Everyday Brilliance',
    description: 'Google Pixel 9 Pro XL with custom Google Tensor G4 silicon, Gemini Nano on-device AI, and sculpted satin camera visor.',
    accentColor: '#059669',
    badgeText: 'GOOGLE DEEPMIND • GEMINI NANO',
    heroTitleMain: 'Pixel 11 Pro XL',
    heroTitleSub: 'The Pinnacle of Google Gemini AI.',
    heroImage: '/pixel11_pro_xl.png',
    heroVideo: encodeURI('/hero banner/pixel11.mp4'),
    videoTitle: 'Pixel 9 Pro — Official Launch Film',
    videoDuration: '0:42 • 4K 60fps',

    chromeTitle: 'PRO',
    highlights: [
      {
        id: 'gemini',
        title: 'Gemini Intelligence Built-In.',
        caption: 'Next-generation real-time multi-modal AI with on-device DeepMind reasoning and local inference.',
        tag: '01 Gemini Intelligence',
        image: '/pixel9pro.jpg',
        badge: 'DEEPMIND AI'
      },
      {
        id: 'tensor',
        title: 'Google Tensor G4 Silicon.',
        caption: 'Built from the ground up with 16GB RAM engineered specifically for on-device AI models.',
        tag: '02 Tensor G4',
        image: '/pixel9pro.jpg',
        badge: 'TENSOR G4'
      },
      {
        id: 'camera',
        title: 'Triple Pro Camera & 42MP Selfie.',
        caption: '50MP main sensor with 48MP macro ultrawide and 48MP telephoto with Real Tone computational ISP.',
        tag: '03 Triple Pro Lens',
        image: '/pixel9pro.jpg',
        badge: 'PRO CONTROLS'
      },
      {
        id: 'support',
        title: '7 Years of Full OS & Feature Updates.',
        caption: 'Guaranteed Android versions, security patches, and Pixel Feature Drops until 2031.',
        tag: '04 7 Years Updates',
        image: '/pixel9pro.jpg',
        badge: 'FUTURE-PROOF'
      }
    ],

    subCategories: [
      { id: 'phones', label: 'Pixel Phones', icon: '📱' },
      { id: 'watch', label: 'Pixel Watch', icon: '⌚' },
      { id: 'buds', label: 'Pixel Buds', icon: '🎧' },
      { id: 'power', label: 'Fast Power', icon: '⚡' },
      { id: 'accessories', label: 'Pixel Cases & Protection', icon: '🛡️' }
    ],

        flagship: {
      id: 'pixel-11-pro-xl',
      name: 'Google Pixel 11 Pro XL',
      badge: 'LATEST PIXEL FLAGSHIP',
      tagline: 'The pinnacle of Google AI with on-device Gemini and 6.8-inch Super Actua.',
      price: 395000,
      monthlyPrice: 'LKR 16,450/mo. for 24 mos.',
      leasePrice: 'LKR 13,100/mo. with Pixel Trade-In',
      finishes: [
        { name: 'Obsidian Black', hex: '#1f2937', image: '/pixel11_pro_xl.png' },
        { name: 'Porcelain White', hex: '#f3f4f6', image: '/pixel10_pro.jpg' },
        { name: 'Hazel Mint', hex: '#6b7280', image: '/pixel11_pro_xl.png' },
        { name: 'Sunburst Amber', hex: '#f59e0b', image: '/pixel10_pro.jpg' }
      ],
      specs: [
        { title: 'Super Actua Display', desc: '6.8-inch Super Actua OLED (1-120Hz LTPO, 3,200 nits peak brightness) with Corning Gorilla Glass Victus 3' },
        { title: 'Pro Triple Camera System', desc: '50MP Octa PD main camera, 48MP Quad PD ultra-wide with Macro Focus, and 48MP 5x telephoto with 30x Super Res Zoom' },
        { title: 'Google Tensor Silicon & Gemini', desc: 'Custom Tensor processor with Titan M3 security coprocessor and 16GB RAM engineered for multimodal Gemini AI' },
        { title: 'Battery & Fast Charging', desc: '5,200mAh battery delivering 24+ hours battery life, charged up to 75% in 30 minutes with 45W Fast Charging' }
      ]
    },

catalogByCategory: {
      phones: [
        {
          id: 'pixel-9-pro-xl',
          name: 'Google Pixel 9 Pro XL',
          badge: 'GEMINI PRO XL',
          tagline: 'Gemini AI flagship with 6.8-inch Super Actua.',
          price: 365000,
          monthlyPrice: 'LKR 15,200/mo. for 24 mos.',
          leasePrice: 'LKR 12,200/mo. with Trade-In',
          finishes: [
            { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
            { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
            { name: 'Hazel', hex: '#8e978e', image: '/pixel9pro.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.8-inch Super Actua OLED (3,000 nits peak brightness)' },
            { title: 'Processor & AI', desc: 'Tensor G4 with 16GB RAM for Gemini Nano AI' },
            { title: 'Camera', desc: '50MP Main + 48MP Macro UW + 48MP 5x Telephoto' }
          ]
        },
        {
          id: 'pixel-9-pro',
          name: 'Google Pixel 9 Pro',
          badge: 'COMPACT PRO',
          tagline: 'Pro cameras in a sleek 6.3-inch form.',
          price: 315000,
          monthlyPrice: 'LKR 13,125/mo. for 24 mos.',
          leasePrice: 'LKR 10,500/mo. with Trade-In',
          finishes: [
            { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
            { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
            { name: 'Rose Quartz', hex: '#fbcfe8', image: '/pixel9pro.jpg' }
          ],
          specs: [
            { title: 'Super Actua Display', desc: '6.3-inch LTPO OLED up to 120Hz with 3,000 nits brightness.' },
            { title: 'Cameras', desc: 'Triple pro camera system with 30x Super Res Zoom.' },
            { title: 'Support', desc: '7 years of guaranteed Android OS upgrades and Feature Drops.' }
          ]
        },
        {
          id: 'pixel-9',
          name: 'Google Pixel 9',
          badge: 'PIXEL 9',
          tagline: 'Engineered by Google, powered by Gemini.',
          price: 245000,
          monthlyPrice: 'LKR 10,200/mo. for 24 mos.',
          leasePrice: 'LKR 8,200/mo. with Trade-In',
          finishes: [
            { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
            { name: 'Porcelain', hex: '#f0ece7', image: '/pixel9pro.jpg' },
            { name: 'Wintergreen', hex: '#a7f3d0', image: '/pixel9pro.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.3-inch Actua display with 120Hz refresh rate.' },
            { title: 'Chip', desc: 'Google Tensor G4 with 12GB RAM.' }
          ]
        },
        {
          id: 'pixel-8a',
          name: 'Google Pixel 8a',
          badge: 'A-SERIES HERO',
          tagline: 'Delightful AI phone at an exceptional price.',
          price: 145000,
          monthlyPrice: 'LKR 6,040/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Obsidian', hex: '#2d2f33', image: '/pixel9pro.jpg' },
            { name: 'Bay Blue', hex: '#93c5fd', image: '/pixel9pro.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.1-inch 120Hz OLED Actua display.' },
            { title: 'Features', desc: 'Best Take, Audio Magic Eraser, and 7 years of updates.' }
          ]
        }
      ],
      watch: [
        {
          id: 'pixel-watch-3',
          name: 'Google Pixel Watch 3 (45mm)',
          badge: 'ACTUA 45MM',
          tagline: '45mm Actua Display with 2,000 nits & Fitbit AI.',
          price: 138000,
          monthlyPrice: 'LKR 5,750/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Matte Black Aluminum + Obsidian Band', hex: '#1e293b', image: '/pixel_watch_3.jpg' },
            { name: 'Matte Hazel Aluminum + Porcelain Band', hex: '#e5e2dc', image: '/pixel_watch_3.jpg' }
          ],
          specs: [
            { title: '45mm Actua Display', desc: 'Twice as bright at 2,000 nits with custom curved 3D glass.' },
            { title: 'Fitbit Integration', desc: 'Daily Readiness score, Cardio Load tracking, and Target Load coach.' },
            { title: 'Navigation', desc: 'Offline Google Maps directly on your wrist.' }
          ]
        }
      ],
      buds: [
        {
          id: 'pixel-buds-pro-2',
          name: 'Google Pixel Buds Pro 2',
          badge: 'TENSOR A1 CHIP',
          tagline: 'First earbuds with Google Tensor A1 chip.',
          price: 68000,
          monthlyPrice: 'LKR 2,830/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Hazel', hex: '#8e978e', image: '/airpods_pro2.jpg' },
            { name: 'Porcelain', hex: '#f0ece7', image: '/airpods_pro2.jpg' },
            { name: 'Wintergreen', hex: '#a7f3d0', image: '/airpods_pro2.jpg' }
          ],
          specs: [
            { title: 'Chip', desc: 'Google Tensor A1 audio silicon for ultra-low latency.' },
            { title: 'Silent Seal 2.0', desc: 'Cancels 2x more noise across mid and high frequencies.' },
            { title: 'Gemini Live', desc: 'Talk freely to Gemini Live without taking your phone out.' }
          ]
        }
      ],
      power: [
        {
          id: 'google-45w-charger',
          name: 'Google 45W USB-C Fast Charger',
          badge: 'OFFICIAL 45W',
          tagline: 'Fastest official charging for Pixel 9 Pro XL.',
          price: 14500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'Speed', desc: 'Charges Pixel 9 Pro XL to 70% in 30 minutes.' }
          ]
        },
        {
          id: 'anker-maggo-pixel',
          name: 'Anker MagGo Qi2 10000mAh Power Bank',
          badge: '15W QI2',
          tagline: 'Fast magnetic power with digital display.',
          price: 24500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Dark Titanium', hex: '#334155', image: '/anker_maggo.jpg' }
          ],
          specs: [
            { title: 'Qi2 Certified', desc: '15W high-speed magnetic wireless charging with smart display.' }
          ]
        }
      ],
      accessories: [
        {
          id: 'google-pixel-case',
          name: 'Official Google Pixel 9 Pro Case',
          badge: 'OFFICIAL PIXEL',
          tagline: 'Stain-resistant silicone with metallic G logo.',
          price: 12500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Obsidian', hex: '#2d2f33', image: '/spigen_case.jpg' },
            { name: 'Porcelain', hex: '#f0ece7', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Protection', desc: 'Drop-tested shock-absorbing silicone with microfiber lining.' }
          ]
        },
        {
          id: 'spigen-pixel-case',
          name: 'Spigen Ultra Hybrid Pixel Case',
          badge: 'SHOCKPROOF',
          tagline: 'Shows off the iconic Pixel camera bar.',
          price: 7500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Clear', hex: '#f8fafc', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Camera Shield', desc: 'Reinforced edges surround aluminum camera bar against scratches.' }
          ]
        }
      ]
    },

    bundle: {
      id: 'bundle-pixel-creator',
      name: 'Pixel 9 Pro Creator Kit',
      subtitle: 'Pixel 9 Pro (256GB Obsidian) + Anker MagGo Qi2 + Spigen Ultra Hybrid Case',
      originalPrice: 347000,
      price: 332000,
      savings: 15000,
      image: '/pixel9pro.jpg',
      badge: 'SAVE LKR 15,000'
    },
    repairHighlight: 'Direct Google Pixel OEM screen replacements and battery optimization with factory sensor recalibration.'
  },

  oneplus: {
    brand: 'OnePlus',
    name: 'OnePlus Ecosystem',
    tagline: 'Never Settle. Pure Fluidity and Blazing Speed.',
    headline: 'Ultra-Fast Performance & Hasselblad Optics',
    description: 'OnePlus 12 with Snapdragon 8 Gen 3, 5,400mAh battery, 100W SUPERVOOC, and 4th Gen Hasselblad optics.',
    accentColor: '#dc2626',
    badgeText: 'ONEPLUS EXTREME SPEED • HASSELBLAD',
    heroTitleMain: 'OnePlus 15 5G',
    heroTitleSub: 'Extreme Speed. 4th Gen Hasselblad.',
    heroImage: '/oneplus13.jpg',
    heroVideo: encodeURI('/hero banner/oneplus.mp4'),
    videoTitle: 'OnePlus 12 — Extreme Speed Film',
    videoDuration: '0:38 • 4K 120fps',

    chromeTitle: 'SPEED',
    highlights: [
      {
        id: 'silicon',
        title: 'Snapdragon 8 Gen 3 Architecture.',
        caption: 'Extreme computing with Dual Cryo-velocity cooling sustaining peak 120fps gaming.',
        tag: '01 Snapdragon 8 Gen 3',
        image: '/oneplus12.jpg',
        badge: 'GEN 3 SILICON'
      },
      {
        id: 'battery',
        title: '5,400mAh & 100W SUPERVOOC.',
        caption: 'High-density battery charged from 1% to 100% in 26 minutes with 50W AIRVOOC wireless.',
        tag: '02 100W SUPERVOOC',
        image: '/oneplus12.jpg',
        badge: '100W CHARGING'
      },
      {
        id: 'hasselblad',
        title: '4th Gen Hasselblad Camera.',
        caption: '50MP Sony LYT-808 primary, 64MP 3x periscope telephoto, and 48MP ultrawide.',
        tag: '03 Hasselblad Optics',
        image: '/oneplus12.jpg',
        badge: 'HASSELBLAD'
      },
      {
        id: 'display',
        title: '2K 120Hz ProXDR with Aqua Touch.',
        caption: '4,500 nits peak brightness with DisplayMate A+ and wet finger recognition.',
        tag: '04 2K ProXDR Display',
        image: '/oneplus12.jpg',
        badge: '4,500 NITS'
      }
    ],

    subCategories: [
      { id: 'phones', label: 'Flagship Phones', icon: '📱' },
      { id: 'watch', label: 'OnePlus Watch', icon: '⌚' },
      { id: 'buds', label: 'Audio Gear', icon: '🎧' },
      { id: 'power', label: 'SUPERVOOC Power', icon: '⚡' },
      { id: 'accessories', label: 'Armor & Accessories', icon: '🛡️' }
    ],

        flagship: {
      id: 'oneplus-15-5g',
      name: 'OnePlus 15 5G',
      badge: 'LATEST ONEPLUS FLAGSHIP',
      tagline: 'Extreme performance with 4th Gen Hasselblad optics and 6,000mAh Glacier battery.',
      price: 285000,
      monthlyPrice: 'LKR 11,875/mo. for 24 mos.',
      leasePrice: 'LKR 9,500/mo. with Trade-In',
      finishes: [
        { name: 'Flowy Emerald', hex: '#064e3b', image: '/oneplus13_emerald.jpg' },
        { name: 'Silky Black', hex: '#111827', image: '/oneplus13_black.jpg' },
        { name: 'Midnight Ocean', hex: '#1e3a5f', image: '/oneplus13_blue.jpg' }
      ],
      specs: [
        { title: '2K 120Hz Oriental Display', desc: '6.82-inch DisplayMate A++ rated 2K 120Hz 8T LTPO screen with 4,500 nits peak brightness and Glove/Rain touch' },
        { title: 'Hasselblad Triple Camera', desc: '50MP Sony LYT-808 main sensor, 50MP 3x periscope telephoto, and 50MP 120-degree ultra-wide with Master Mode color science' },
        { title: 'Flagship Platform Silicon', desc: 'Top-tier 3nm flagship SoC with 16GB LPDDR5X RAM and second-gen Tiangong Cooling System' },
        { title: '100W SUPERVOOC & 50W AIRVOOC', desc: '6,000mAh silicon-carbon Glacier battery charged 1% to 100% in 28 minutes, plus IP68/IP69 water resistance' }
      ]
    },

catalogByCategory: {
      phones: [
        {
          id: 'oneplus-12',
          name: 'OnePlus 12',
          badge: '100W FAST',
          tagline: 'Smooth beyond belief. 4th Gen Hasselblad.',
          price: 225000,
          monthlyPrice: 'LKR 9,375/mo. for 24 mos.',
          leasePrice: 'LKR 7,800/mo. with Trade-In',
          finishes: [
            { name: 'Flowy Emerald', hex: '#1d4838', image: '/oneplus12.jpg' },
            { name: 'Silky Black', hex: '#262829', image: '/oneplus12.jpg' }
          ],
          specs: [
            { title: '2K 120Hz ProXDR', desc: 'DisplayMate A+ certified 4,500 nits peak brightness with Aqua Touch.' },
            { title: '4th Gen Hasselblad', desc: '50MP Sony LYT-808 main sensor, 64MP periscope 3x optical zoom, and 48MP ultra wide.' },
            { title: 'Snapdragon 8 Gen 3', desc: 'Dual Cryo-velocity VC cooling sustaining 120fps gaming with zero throttling.' },
            { title: '100W SUPERVOOC', desc: '5,400mAh battery charged 1% to 100% in 26 minutes, plus 50W wireless.' }
          ]
        },
        {
          id: 'oneplus-12r',
          name: 'OnePlus 12R',
          badge: 'FLAGSHIP KILLER',
          tagline: 'Smoothness redefined. 5,500mAh battery giant.',
          price: 165000,
          monthlyPrice: 'LKR 6,875/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Cool Blue', hex: '#60a5fa', image: '/oneplus12.jpg' },
            { name: 'Iron Gray', hex: '#374151', image: '/oneplus12.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.78-inch 120Hz 4th-Gen LTPO display.' },
            { title: 'Battery', desc: '5,500mAh largest OnePlus battery with 100W SUPERVOOC.' }
          ]
        },
        {
          id: 'oneplus-open',
          name: 'OnePlus Open',
          badge: 'PREMIER FOLD',
          tagline: 'Open for everything. Flagship foldable.',
          price: 465000,
          monthlyPrice: 'LKR 19,375/mo. for 24 mos.',
          leasePrice: 'LKR 15,500/mo. with Trade-In',
          finishes: [
            { name: 'Emerald Dusk', hex: '#134e4a', image: '/oneplus12.jpg' },
            { name: 'Voyager Black', hex: '#18181b', image: '/oneplus12.jpg' }
          ],
          specs: [
            { title: 'Displays', desc: '7.82-inch inner 120Hz + 6.31-inch outer 120Hz displays.' },
            { title: 'Multitasking', desc: 'Open Canvas fluid three-app split screen.' }
          ]
        }
      ],
      watch: [
        {
          id: 'oneplus-watch-2',
          name: 'OnePlus Watch 2 (Titanium Edition)',
          badge: 'DUAL ENGINE',
          tagline: 'Dual-Engine Architecture. 100-hour Wear OS.',
          price: 85000,
          monthlyPrice: 'LKR 3,540/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Radiant Steel', hex: '#94a3b8', image: '/galaxy_watch_ultra.jpg' },
            { name: 'Black Steel', hex: '#1e293b', image: '/galaxy_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Dual-Engine Architecture', desc: 'Snapdragon W5 + BES2700 dual chipsets delivering full Wear OS 4 with 100-hour battery.' },
            { title: 'Case', desc: 'Stainless steel chassis with 2.5D sapphire crystal glass.' }
          ]
        }
      ],
      buds: [
        {
          id: 'oneplus-buds-pro-3',
          name: 'OnePlus Buds Pro 3',
          badge: 'DYNAUDIO',
          tagline: 'Co-created with Dynaudio. 50dB Adaptive ANC.',
          price: 58000,
          monthlyPrice: 'LKR 2,410/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Midnight Opus', hex: '#18181b', image: '/galaxy_buds3.jpg' },
            { name: 'Lunar Radiance', hex: '#f8fafc', image: '/galaxy_buds3.jpg' }
          ],
          specs: [
            { title: 'Acoustics', desc: 'Dual drivers + dual DACs tuned by Danish masters Dynaudio.' },
            { title: 'ANC', desc: '50dB smart adaptive noise cancellation with real-time ear canal compensation.' }
          ]
        }
      ],
      power: [
        {
          id: 'oneplus-100w-supervooc',
          name: 'OnePlus 100W Dual-Port SUPERVOOC GaN Adapter',
          badge: '100W SUPERVOOC',
          tagline: 'Dual ports (USB-C + USB-A) with 100W max power.',
          price: 16500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'Output', desc: '100W SUPERVOOC + 65W PD/PPS laptop fast charging.' }
          ]
        }
      ],
      accessories: [
        {
          id: 'oneplus-sandstone-case',
          name: 'OnePlus 12 Sandstone Magnetic Bumper Case',
          badge: 'ICONIC SANDSTONE',
          tagline: 'The iconic grippy Sandstone texture.',
          price: 8500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Sandstone Black', hex: '#262829', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Material', desc: 'Natural granular sandstone spray with magnetic ring compatibility.' }
          ]
        }
      ]
    },

    bundle: {
      id: 'bundle-oneplus-speed',
      name: 'OnePlus 12 SuperSpeed Setup',
      subtitle: 'OnePlus 12 (256GB Emerald) + Anker 65W GaN Charger + Belkin UltraGlass',
      originalPrice: 248000,
      price: 238000,
      savings: 10000,
      image: '/oneplus12.jpg',
      badge: 'SAVE LKR 10,000'
    },
    repairHighlight: 'Fast-track OnePlus battery upgrades, thermal paste re-application, and genuine warp-charging port repairs.'
  },

  xiaomi: {
    brand: 'Xiaomi',
    name: 'Xiaomi & Redmi Ecosystem',
    tagline: 'Pinnacle of Mobile Imagery with Leica Optics.',
    headline: 'Masterpiece Photography & HyperOS Power',
    description: 'Xiaomi 14 Ultra with 1-inch Sony sensor, stepless variable physical aperture, Leica Quad optics, and 90W HyperCharge.',
    accentColor: '#ea580c',
    badgeText: 'LEICA OPTICAL MASTERPIECE',
    heroTitleMain: 'Xiaomi 17 Ultra',
    heroTitleSub: 'Leica Master Optics & 1-Inch Variable Aperture.',
    heroImage: '/xiaomi15ultra.jpg',
    heroVideo: encodeURI('/hero banner/xiaomi11.mp4'),
    videoTitle: 'Xiaomi 14 Ultra — Official Leica Premiere',
    videoDuration: '0:45 • 4K 60fps',

    chromeTitle: 'ULTRA',
    highlights: [
      {
        id: 'sensor',
        title: '1-inch Sony LYT-900 Sensor.',
        caption: 'Stepless variable physical aperture f/1.63 - f/4.0 with 14EV optical dynamic range.',
        tag: '01 1-inch Sensor',
        image: '/xiaomi14ultra.jpg',
        badge: 'VARIABLE APERTURE'
      },
      {
        id: 'leica',
        title: 'Leica Quad 50MP Array.',
        caption: 'Four 50MP cameras covering 12mm ultra-wide, 75mm floating telephoto, and 120mm periscope.',
        tag: '02 Leica Quad 50MP',
        image: '/xiaomi14ultra.jpg',
        badge: 'LEICA OPTICS'
      },
      {
        id: 'silicon',
        title: 'Snapdragon 8 Gen 3 Silicon.',
        caption: 'Extreme computing power with Xiaomi IceLoop circular cooling system.',
        tag: '03 Snapdragon 8 Gen 3',
        image: '/xiaomi14ultra.jpg',
        badge: 'ICELOOP COOLING'
      },
      {
        id: 'charging',
        title: '90W HyperCharge Wired + 80W Wireless.',
        caption: '5,000mAh battery charged 0% to 100% in 33 minutes wired and 46 minutes wireless.',
        tag: '04 90W HyperCharge',
        image: '/xiaomi14ultra.jpg',
        badge: 'HYPERCHARGE'
      }
    ],

    subCategories: [
      { id: 'phones', label: 'Xiaomi Flagships', icon: '📱' },
      { id: 'watch', label: 'Xiaomi Watch', icon: '⌚' },
      { id: 'audio', label: 'Redmi Buds', icon: '🎧' },
      { id: 'power', label: 'HyperCharge 120W', icon: '⚡' },
      { id: 'accessories', label: 'Leica Kits & Armor', icon: '🛡️' }
    ],

        flagship: {
      id: 'xiaomi-17-ultra',
      name: 'Xiaomi 17 Ultra',
      badge: 'LATEST XIAOMI LEICA FLAGSHIP',
      tagline: 'Pinnacle mobile optics. 1-inch stepless variable aperture with 200MP Leica Periscope.',
      price: 385000,
      monthlyPrice: 'LKR 16,000/mo. for 24 mos.',
      leasePrice: 'LKR 12,800/mo. with Trade-In',
      finishes: [
        { name: 'Titanium White', hex: '#e5e7eb', image: '/xiaomi15_white.jpg' },
        { name: 'Vegan Carbon Black', hex: '#18181b', image: '/xiaomi15_black.jpg' }
      ],
      specs: [
        { title: '1-inch Leica Optical System', desc: '1-inch Sony LYT-900 flagship sensor with stepless f/1.63 - f/4.0 mechanical variable aperture' },
        { title: '200MP Leica Periscope Zoom', desc: '200MP periscope telephoto lens with ultra-clear optics plus 50MP floating telephoto and 50MP ultra-wide' },
        { title: 'Flagship Performance Platform', desc: 'Leading-edge 3nm architecture with Xiaomi HyperOS 2.0 and Dual-Ring Loop LiquidCool thermal system' },
        { title: '90W HyperCharge & 5,300mAh', desc: '5,300mAh high-density battery with 90W wired HyperCharge and 80W wireless HyperCharge' }
      ]
    },

catalogByCategory: {
      phones: [
        {
          id: 'xiaomi-14-ultra',
          name: 'Xiaomi 14 Ultra',
          badge: 'LEICA OPTICS',
          tagline: 'A camera that happens to be a phone.',
          price: 365000,
          monthlyPrice: 'LKR 15,200/mo. for 24 mos.',
          leasePrice: 'LKR 12,800/mo. with Trade-In',
          finishes: [
            { name: 'Vegan Black Leather', hex: '#212326', image: '/xiaomi14ultra.jpg' },
            { name: 'Titanium White', hex: '#d4d7db', image: '/xiaomi14ultra.jpg' }
          ],
          specs: [
            { title: '1-inch Sony LYT-900', desc: '1-inch flagship image sensor with stepless f/1.63 - f/4.0 variable physical aperture.' },
            { title: 'Leica Quad 50MP Array', desc: 'Four 50MP cameras covering 12mm, 75mm floating telephoto, and 120mm periscope.' },
            { title: 'Xiaomi Shield Glass', desc: '10x higher drop resistance wrapped in high-strength aluminum 6M42 frame.' },
            { title: '90W HyperCharge', desc: '5,000mAh battery charged 0% to 100% in 33 minutes wired.' }
          ]
        },
        {
          id: 'xiaomi-14',
          name: 'Xiaomi 14',
          badge: 'COMPACT LEICA',
          tagline: 'Compact 6.36-inch flagship with Leica Summilux.',
          price: 265000,
          monthlyPrice: 'LKR 11,040/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Jade Green', hex: '#4d7c0f', image: '/xiaomi14ultra.jpg' },
            { name: 'Black', hex: '#1f2937', image: '/xiaomi14ultra.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.36-inch 1.5K LTPO AMOLED with 3,000 nits peak brightness.' },
            { title: 'Camera', desc: 'Leica Triple 50MP camera array with Light Fusion 900 sensor.' }
          ]
        },
        {
          id: 'redmi-note-13-pro-plus',
          name: 'Redmi Note 13 Pro+ 5G',
          badge: '200MP HERO',
          tagline: '200MP OIS camera with 120W HyperCharge & IP68.',
          price: 135000,
          monthlyPrice: 'LKR 5,625/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Midnight Black', hex: '#111827', image: '/xiaomi14ultra.jpg' },
            { name: 'Aurora Purple', hex: '#a855f7', image: '/xiaomi14ultra.jpg' }
          ],
          specs: [
            { title: 'Camera', desc: '200MP OIS sensor with 2x/4x in-sensor lossless zoom.' },
            { title: '120W HyperCharge', desc: '5,000mAh battery charged 0% to 100% in 19 minutes.' },
            { title: 'Durability', desc: 'IP68 water and dust resistance rating.' }
          ]
        },
        {
          id: 'redmi-note-13-4g',
          name: 'Redmi Note 13 4G',
          badge: 'BEST BUDGET',
          tagline: 'Super-clear 108MP triple camera.',
          price: 65000,
          monthlyPrice: 'LKR 2,700/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Midnight Black', hex: '#111827', image: '/xiaomi14ultra.jpg' },
            { name: 'Mint Green', hex: '#86efac', image: '/xiaomi14ultra.jpg' }
          ],
          specs: [
            { title: 'Display', desc: '6.67-inch 120Hz AMOLED display with ultra-thin bezels.' },
            { title: 'Camera', desc: '108MP 3x lossless zoom triple camera.' }
          ]
        }
      ],
      watch: [
        {
          id: 'xiaomi-watch-2-pro',
          name: 'Xiaomi Watch 2 Pro',
          badge: 'WEAR OS',
          tagline: 'Snapdragon W5+ Gen 1 with classic rotating crown.',
          price: 78000,
          monthlyPrice: 'LKR 3,250/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Gunmetal Steel', hex: '#475569', image: '/galaxy_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Google Wear OS', desc: 'Full Google Play app ecosystem with LTE and dual-band GNSS.' },
            { title: 'Chip', desc: 'Snapdragon W5+ Gen 1 4nm processor.' }
          ]
        },
        {
          id: 'xiaomi-band-8-pro',
          name: 'Xiaomi Smart Band 8 Pro',
          badge: 'BAND PRO',
          tagline: 'Large 1.74-inch AMOLED with independent GNSS.',
          price: 24000,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Black', hex: '#1f2937', image: '/galaxy_watch_ultra.jpg' }
          ],
          specs: [
            { title: 'Screen', desc: '1.74-inch 60Hz AMOLED screen with 14-day battery life.' }
          ]
        }
      ],
      audio: [
        {
          id: 'redmi-buds-5-pro',
          name: 'Redmi Buds 5 Pro',
          badge: '52DB ANC',
          tagline: 'Ultra wide-frequency active noise canceling.',
          price: 26000,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'Midnight Black', hex: '#1e293b', image: '/galaxy_buds3.jpg' },
            { name: 'Moonlight White', hex: '#ffffff', image: '/galaxy_buds3.jpg' }
          ],
          specs: [
            { title: 'ANC', desc: '52dB active noise reduction up to 4kHz with LDAC Hi-Res Audio.' }
          ]
        }
      ],
      power: [
        {
          id: 'xiaomi-120w-hypercharge',
          name: 'Xiaomi 120W HyperCharge GaN Combo',
          badge: '120W HYPERCHARGE',
          tagline: 'Blazing 120W power in a pocket-sized GaN block.',
          price: 16500,
          monthlyPrice: null,
          leasePrice: null,
          finishes: [
            { name: 'White', hex: '#ffffff', image: '/anker_65w.jpg' }
          ],
          specs: [
            { title: 'Speed', desc: 'Charges compatible Redmi Note 13 Pro+ in under 19 minutes.' }
          ]
        }
      ],
      accessories: [
        {
          id: 'xiaomi-leica-photo-kit',
          name: 'Xiaomi 14 Ultra Professional Leica Photography Kit',
          badge: 'LEICA GRIP KIT',
          tagline: 'Physical shutter grip with built-in 1,500mAh battery.',
          price: 58000,
          monthlyPrice: 'LKR 2,410/mo. for 24 mos.',
          leasePrice: null,
          finishes: [
            { name: 'Leather Texture Black', hex: '#18181b', image: '/spigen_case.jpg' }
          ],
          specs: [
            { title: 'Controls', desc: 'Camera grip with two-stage shutter release, zoom lever, and 67mm filter ring.' }
          ]
        }
      ]
    },

    bundle: {
      id: 'bundle-xiaomi-leica',
      name: 'Xiaomi 14 Ultra Leica Director Kit',
      subtitle: 'Xiaomi 14 Ultra (512GB Black) + Leica Photography Kit + 120W GaN Charger',
      originalPrice: 439500,
      price: 418000,
      savings: 21500,
      image: '/xiaomi14ultra.jpg',
      badge: 'SAVE LKR 21,500'
    },
    repairHighlight: 'Authorized Leica lens alignment, stepless aperture calibration, and Xiaomi HyperCharge battery restoration.'
  }
};
