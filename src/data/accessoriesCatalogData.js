// Comprehensive Accessories Catalog Data categorized into 6 core groups
// Sourced from public/ACCESORIES/images/ with exact verified file extensions

export const ACCESSORY_CATEGORIES = [
  { id: 'all', label: 'All Accessories', icon: '✨' },
  { id: 'audio', label: 'Audio & Earphones', icon: '🎧' },
  { id: 'smartwatches', label: 'Smartwatches & Fitness', icon: '⌚' },
  { id: 'power', label: 'Power, Chargers & Cables', icon: '⚡' },
  { id: 'protection', label: 'Protection & Cases', icon: '🛡️' },
  { id: 'creator', label: 'Creator, Cameras & Gimbals', icon: '🎥' },
  { id: 'smart-home', label: 'Smart Home & Streaming', icon: '📺' }
];

export const ACCESSORY_PRODUCTS = [
  // --- 1. AUDIO & EARPHONES ---
  {
    id: 'acc-airpods-pro-2',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'Apple',
    name: 'Apple AirPods Pro (2nd Gen) USB-C MagSafe',
    price: 68500,
    originalPrice: 78000,
    discountPercent: 12,
    availability: 'In Stock',
    mainImage: '/airpods_pro2.jpg',
    variants: [{ name: 'White', image: '/airpods_pro2.jpg' }],
    specs: [
      'Apple H2 audio silicon with U1 precision chip',
      'Up to 2x more Active Noise Cancellation',
      'Adaptive Audio, Transparency & Conversation Awareness',
      'Personalized Spatial Audio with dynamic head tracking',
      'Up to 30 hours total battery life with MagSafe USB-C case'
    ]
  },
  {
    id: 'acc-galaxy-buds-3',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'Samsung',
    name: 'Samsung Galaxy Buds 3 Pro AI Wireless Earbuds',
    price: 64900,
    originalPrice: 72000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/samsung-galaxy-buds-3/01.webp',
    variants: [
      { name: 'Silver Titanium', image: '/ACCESORIES/images/samsung-galaxy-buds-3/01.webp' },
      { name: 'Charging Case', image: '/ACCESORIES/images/samsung-galaxy-buds-3/02.webp' }
    ],
    specs: [
      'Galaxy AI Live Interpreter with voice translation',
      'Blade Lights iconic acoustic design',
      '24-bit Hi-Fi sound with dual amp & 2-way speaker',
      'Adaptive Noise Control with Siren & Voice detect',
      'IP57 water & sweat resistance'
    ]
  },
  {
    id: 'acc-anker-q30',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'Anker',
    name: 'Anker Soundcore Life Q30 Hybrid Active Noise Cancelling Headphones',
    price: 24500,
    originalPrice: 28500,
    discountPercent: 14,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/anker-overhead-q30-noise-canceling/01.jpg',
    variants: [
      { name: 'Midnight Black', image: '/ACCESORIES/images/anker-overhead-q30-noise-canceling/01.jpg' },
      { name: 'Earcups Detail', image: '/ACCESORIES/images/anker-overhead-q30-noise-canceling/02.jpg' }
    ],
    specs: [
      'Hi-Res Audio certified with 40mm silk diaphragm drivers',
      'Multi-mode hybrid active noise cancellation (Transport, Outdoor, Indoor)',
      '40-hour playtime in ANC mode (60 hours normal)',
      'Ultra-soft protein leather earcups with memory foam',
      'Fast 5-minute charge delivers 4 hours listening'
    ]
  },
  {
    id: 'acc-jbl-tune-520bt',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'JBL',
    name: 'JBL Tune 520BT Wireless On-Ear Pure Bass Headphones',
    price: 16900,
    originalPrice: 19900,
    discountPercent: 15,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/jbl-tune-520bt-wireless-on-ear-headphones-best-price-in-srilanka/01.jpg',
    variants: [
      { name: 'Black', image: '/ACCESORIES/images/jbl-tune-520bt-wireless-on-ear-headphones-best-price-in-srilanka/01.jpg' }
    ],
    specs: [
      'Famous JBL Pure Bass sound technology',
      'Up to 57 hours of continuous battery life',
      'Bluetooth 5.3 with multi-point seamless connection',
      'Foldable, lightweight and comfortable design',
      'Speed charge: 5 mins charge gives 3 hours playback'
    ]
  },
  {
    id: 'acc-cmf-buds-pro-2',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'Nothing CMF',
    name: 'CMF by Nothing Buds Pro 2 with Customizable Smart Dial',
    price: 21900,
    originalPrice: 24900,
    discountPercent: 12,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/cmf-by-nothing-buds-pro-2-wireless-earbuds/01.webp',
    variants: [
      { name: 'Dark Grey', image: '/ACCESORIES/images/cmf-by-nothing-buds-pro-2-wireless-earbuds/01.webp' },
      { name: 'Case Dial View', image: '/ACCESORIES/images/cmf-by-nothing-buds-pro-2-wireless-earbuds/02.webp' },
      { name: 'Earbuds Open', image: '/ACCESORIES/images/cmf-by-nothing-buds-pro-2-wireless-earbuds/03.webp' }
    ],
    specs: [
      'Industry-first customizable Smart Dial on charging case',
      '50 dB Smart Active Noise Cancellation',
      'Dual drivers: 11mm bass driver + 6mm micro-planar tweeter',
      'LDAC Technology certified for Hi-Res Wireless audio',
      '43 hours total playback with Ultra Bass 2.0'
    ]
  },
  {
    id: 'acc-apple-homepod-mini',
    category: 'audio',
    categoryLabel: 'Audio & Earphones',
    brand: 'Apple',
    name: 'Apple HomePod mini 2 Smart Speaker with Siri',
    price: 38500,
    originalPrice: 42000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/apple-homepod-mini-2/01.webp',
    variants: [
      { name: 'Space Grey', image: '/ACCESORIES/images/apple-homepod-mini-2/01.webp' },
      { name: 'Top Touchpad', image: '/ACCESORIES/images/apple-homepod-mini-2/02.webp' }
    ],
    specs: [
      'Full-range driver & dual passive radiators for deep bass',
      '360-degree room-filling acoustic audio',
      'Apple S5 chip computational audio in real time',
      'Smart home hub for Apple HomeKit & Thread/Matter',
      'Intercom broadcast across your Apple devices'
    ]
  },

  // --- 2. SMARTWATCHES & FITNESS ---
  {
    id: 'acc-apple-watch-ultra-2',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Apple',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
    price: 265000,
    originalPrice: 289000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/apple_watch_ultra.jpg',
    variants: [{ name: 'Titanium / Ocean Band', image: '/apple_watch_ultra.jpg' }],
    specs: [
      'S9 SiP chip with Double Tap touchless gesture control',
      '3000 nits peak brightness Super Retina OLED',
      'Precision dual-frequency GPS (L1 & L5)',
      '100m water resistant with depth gauge & water temp sensor',
      'Up to 72 hours battery life in Low Power Mode'
    ]
  },
  {
    id: 'acc-samsung-watch-ultra',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Samsung',
    name: 'Samsung Galaxy Watch Ultra 47mm LTE Titanium',
    price: 215000,
    originalPrice: 239000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/samsung-galaxy-watch-ultra-47mm-2025/01.jpg',
    variants: [
      { name: 'Titanium Grey', image: '/ACCESORIES/images/samsung-galaxy-watch-ultra-47mm-2025/01.jpg' },
      { name: 'Titanium White', image: '/ACCESORIES/images/samsung-galaxy-watch-ultra-47mm-titanium-white/01.jpg' }
    ],
    specs: [
      'Grade 4 Titanium cushion frame with 100m water resistance (10ATM)',
      '3nm processor with dual-frequency GPS',
      'BioActive Sensor 2.0 with Energy Score & sleep apnea monitoring',
      'Quick Button for instant multi-sport workouts and siren',
      'Up to 100 hours of extreme battery endurance'
    ]
  },
  {
    id: 'acc-cmf-watch-pro-2-acc',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Nothing CMF',
    name: 'CMF by Nothing Watch Pro 2 Calling Smartwatch',
    price: 26500,
    originalPrice: 29900,
    discountPercent: 11,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/cmf-by-nothing-watch-pro-2-calling-smartwatch/01.webp',
    variants: [
      { name: 'Dark Grey Bezel', image: '/ACCESORIES/images/cmf-by-nothing-watch-pro-2-calling-smartwatch/01.webp' },
      { name: 'Ash Grey Strap', image: '/ACCESORIES/images/cmf-by-nothing-watch-pro-2-calling-smartwatch/02.webp' },
      { name: 'Display Angle', image: '/ACCESORIES/images/cmf-by-nothing-watch-pro-2-calling-smartwatch/03.webp' }
    ],
    specs: [
      'Interchangeable bezel design with 1.32-inch AMOLED display',
      'Bluetooth phone calls with AI noise reduction',
      'Built-in multi-system GPS with 120 sports modes',
      '11-day battery life on typical use',
      'Gesture control & IP68 water resistance'
    ]
  },
  {
    id: 'acc-apple-watch-11',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Apple',
    name: 'Apple Watch Series 11 42mm Aluminum GPS',
    price: 148000,
    originalPrice: 165000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/apple-watch-series-11-42mm-aluminum-gps/01.jpg',
    variants: [
      { name: 'Jet Black', image: '/ACCESORIES/images/apple-watch-series-11-42mm-aluminum-gps/01.jpg' }
    ],
    specs: [
      'Next-generation thin unibody with wide-angle OLED display',
      'S11 dual-core silicon with on-device health neural engine',
      'Sleep apnea tracking, ECG, temperature sensing, blood oxygen',
      'Fast magnetic charging (0 to 80% in 30 minutes)',
      'WR50 water resistance and swimproof'
    ]
  },
  {
    id: 'acc-galaxy-watch-9',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Samsung',
    name: 'Samsung Galaxy Watch 9 44mm Graphite Bluetooth',
    price: 119000,
    originalPrice: 132000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/samsung-galaxy-watch-9-44mm-graphite/01.jpg',
    variants: [
      { name: 'Graphite', image: '/ACCESORIES/images/samsung-galaxy-watch-9-44mm-graphite/01.jpg' }
    ],
    specs: [
      'Super AMOLED sapphire crystal glass screen',
      'Galaxy AI Energy Score and personalized HR zones',
      'Blood pressure, ECG, and body composition BIA sensor',
      'Wear OS Powered by Samsung with Google Maps on wrist',
      'WPC wireless fast charging'
    ]
  },
  {
    id: 'acc-pixel-watch-3',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Google',
    name: 'Google Pixel Watch 3 45mm Actua AMOLED',
    price: 138000,
    originalPrice: 149000,
    discountPercent: 7,
    availability: 'In Stock',
    mainImage: '/pixel_watch_3.jpg',
    variants: [{ name: 'Matte Black', image: '/pixel_watch_3.jpg' }],
    specs: [
      '45mm Super Actua AMOLED display with 2000 nits brightness',
      'Comprehensive Fitbit readiness, cardio load and recovery metrics',
      'Loss of Pulse detection & emergency SOS assistance',
      'Google Gemini AI voice assistant integration',
      '24-hour battery with fast charging (0-80% in 35 mins)'
    ]
  },
  {
    id: 'acc-huawei-band-11-pro',
    category: 'smartwatches',
    categoryLabel: 'Smartwatches & Fitness',
    brand: 'Huawei',
    name: 'Huawei Band 11 Pro AMOLED Smart Fitness Tracker',
    price: 24500,
    originalPrice: 28000,
    discountPercent: 12,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/huawei-band-11-pro-smartwatch/01.webp',
    variants: [
      { name: 'Black Band', image: '/ACCESORIES/images/huawei-band-11-pro-smartwatch/01.webp' },
      { name: 'Side Profile', image: '/ACCESORIES/images/huawei-band-11-pro-smartwatch/02.webp' }
    ],
    specs: [
      '1.64-inch HD AMOLED borderless color screen',
      'Built-in standalone GNSS GPS for outdoor runs',
      'TruSeen 5.5+ heart rate & SpO2 blood oxygen tracking',
      'Up to 14 days ultra-long battery endurance',
      'Water resistant up to 50 meters (5ATM)'
    ]
  },

  // --- 3. POWER, CHARGERS & CABLES ---
  {
    id: 'acc-apple-20w',
    category: 'power',
    categoryLabel: 'Power, Chargers & Cables',
    brand: 'Apple',
    name: 'Apple 20W USB-C Power Adapter (UK 3-Pin)',
    price: 7900,
    originalPrice: 9990,
    discountPercent: 21,
    availability: 'In Stock',
    mainImage: '/APPLE/Apple-20W-Original-Adapter--768x768.webp',
    variants: [{ name: 'White', image: '/APPLE/Apple-20W-Original-Adapter--768x768.webp' }],
    specs: [
      'Official Apple 20W USB-C Fast Charging standard',
      'UK 3-Pin plug standard for Sri Lanka electrical safety',
      '0% to 50% battery in 30 minutes for iPhone 15/16/17/18',
      'Compatible with iPhone, iPad, and Apple Watch fast cables',
      'Certified TRCSL genuine accessory'
    ]
  },
  {
    id: 'acc-samsung-65w-trio',
    category: 'power',
    categoryLabel: 'Power, Chargers & Cables',
    brand: 'Samsung',
    name: 'Samsung 65W Trio Power Adapter Super Fast (EP-T6530)',
    price: 19500,
    originalPrice: 24000,
    discountPercent: 18,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/samsung-65w-trio-charger-power-adapter-price-in-sri-lanka-samsung-65w-trio-charg/01.webp',
    variants: [
      { name: 'Black Trio Adapter', image: '/ACCESORIES/images/samsung-65w-trio-charger-power-adapter-price-in-sri-lanka-samsung-65w-trio-charg/01.webp' }
    ],
    specs: [
      'Triple output ports: 2x USB-C (65W + 25W) + 1x USB-A (15W)',
      'Simultaneously fast charges phone, tablet and laptop',
      'Super Fast Charging 2.0 (45W PPS) for Galaxy S24/S25/S26 Ultra',
      'Compact travel design with surge & overheating protection',
      'Universal compatibility with Apple, Samsung, Google & laptops'
    ]
  },
  {
    id: 'acc-anker-65w-gan',
    category: 'power',
    categoryLabel: 'Power, Chargers & Cables',
    brand: 'Anker',
    name: 'Anker 65W GaNPrime Multi-Device Fast Charger',
    price: 16500,
    originalPrice: 19500,
    discountPercent: 15,
    availability: 'In Stock',
    mainImage: '/anker_65w.jpg',
    variants: [{ name: 'Black', image: '/anker_65w.jpg' }],
    specs: [
      'GaNPrime gallium nitride revolutionary efficiency',
      'PowerIQ 4.0 dynamic power distribution',
      'Charges a MacBook Air or iPhone at maximum possible speeds',
      'ActiveShield 2.0 monitors temperature over 3 million times daily',
      'Foldable compact pins for effortless travel'
    ]
  },
  {
    id: 'acc-apple-magsafe-25w',
    category: 'power',
    categoryLabel: 'Power, Chargers & Cables',
    brand: 'Apple',
    name: 'Apple MagSafe Charger (25W Fast Wireless)',
    price: 18500,
    originalPrice: 21900,
    discountPercent: 15,
    availability: 'In Stock',
    mainImage: '/apple_magsafe.jpg',
    variants: [{ name: 'Silver / White', image: '/apple_magsafe.jpg' }],
    specs: [
      'Up to 25W fast wireless charging for iPhone 16/17/18',
      'Snap-on magnetic alignment with Qi2 protocol support',
      'Durable braided 1-meter USB-C cable',
      'Charges AirPods with wireless case effortlessly',
      '100% genuine factory warranty'
    ]
  },
  {
    id: 'acc-anker-maggo',
    category: 'power',
    categoryLabel: 'Power, Chargers & Cables',
    brand: 'Anker',
    name: 'Anker MagGo Qi2 10000mAh Magnetic Power Bank',
    price: 24500,
    originalPrice: 28000,
    discountPercent: 12,
    availability: 'In Stock',
    mainImage: '/anker_maggo.jpg',
    variants: [{ name: 'Dark Grey', image: '/anker_maggo.jpg' }],
    specs: [
      'Qi2 Certified 15W high-speed magnetic wireless charging',
      'Smart LCD display shows real-time battery % and remaining time',
      'Built-in sturdy kickstand for hands-free video viewing',
      'Bi-directional 27W USB-C wired charging port',
      '10,000mAh capacity powers iPhone twice'
    ]
  },

  // --- 4. PROTECTION & CASES ---
  {
    id: 'acc-belkin-glass-2',
    category: 'protection',
    categoryLabel: 'Protection & Cases',
    brand: 'Belkin',
    name: 'Belkin UltraGlass 2 Double Ion-Exchange Screen Protector',
    price: 6900,
    originalPrice: 8000,
    discountPercent: 14,
    availability: 'In Stock',
    mainImage: '/belkin_glass.jpg',
    variants: [{ name: 'Crystal Clear', image: '/belkin_glass.jpg' }],
    specs: [
      'German engineered lithium aluminosilicate glass',
      'Up to 2.7x stronger than traditional tempered glass',
      '0.29mm ultra-slim profile retains native touch sensitivity',
      'Anti-microbial coating repels bacteria and oils',
      'Includes Easy Align tray for bubble-free application'
    ]
  },
  {
    id: 'acc-spigen-case',
    category: 'protection',
    categoryLabel: 'Protection & Cases',
    brand: 'Spigen',
    name: 'Spigen MagArmor MagFit Military Drop Protection Case',
    price: 9500,
    originalPrice: 10500,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/spigen_case.jpg',
    variants: [{ name: 'Matte Black', image: '/spigen_case.jpg' }],
    specs: [
      'Built-in neodymium magnetic ring for flawless MagSafe attachment',
      'Air Cushion Technology in all corners for certified drop defense',
      'Matte texture with chevron pattern for anti-slip grip',
      'Raised screen lip and camera bevel safeguards lenses',
      'Tactile button covers for immediate responsive clicks'
    ]
  },
  {
    id: 'acc-ipad-magic-keyboard-11',
    category: 'protection',
    categoryLabel: 'Protection & Cases',
    brand: 'Apple',
    name: 'Apple Magic Keyboard for iPad Pro 11-inch (M4 / M5)',
    price: 115000,
    originalPrice: 128000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/apple-magic-keyboard-for-ipad-pro-11-inch-m4-m5/01.jpg',
    variants: [
      { name: 'Black', image: '/ACCESORIES/images/apple-magic-keyboard-for-ipad-pro-11-inch-m4-m5/01.jpg' }
    ],
    specs: [
      'Floating cantilever design attaches magnetically',
      'Aluminum palm rest with haptic glass trackpad',
      '14-key function row for quick access to brightness & volume',
      'USB-C pass-through charging port',
      'Folds into a sleek protective case for front and back defense'
    ]
  },
  {
    id: 'acc-xundd-keyboard-case',
    category: 'protection',
    categoryLabel: 'Protection & Cases',
    brand: 'Xundd',
    name: 'Xundd Magnetic Wireless Detachable Keyboard Folio Case',
    price: 24500,
    originalPrice: 28500,
    discountPercent: 14,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/xundo-magnetic-wireless-detachable-keyboard-case/01.webp',
    variants: [
      { name: 'Space Grey', image: '/ACCESORIES/images/xundo-magnetic-wireless-detachable-keyboard-case/01.webp' },
      { name: 'Standing Angle', image: '/ACCESORIES/images/xundo-magnetic-wireless-detachable-keyboard-case/02.webp' }
    ],
    specs: [
      'Detachable magnetic Bluetooth scissor-switch keyboard',
      'Integrated high-precision multi-touch trackpad',
      'Honeycomb heat dissipation back with military drop corners',
      'Pencil slot with magnetic charging support',
      'Multi-angle adjustable viewing stand'
    ]
  },
  {
    id: 'acc-apple-airtag-4pack',
    category: 'protection',
    categoryLabel: 'Protection & Cases',
    brand: 'Apple',
    name: 'Apple AirTag (4-Pack) Item Tracker',
    price: 36500,
    originalPrice: 41000,
    discountPercent: 11,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/apple-airtag-4-pack-1st-gen/01.jpeg',
    variants: [
      { name: 'White 4-Pack', image: '/ACCESORIES/images/apple-airtag-4-pack-1st-gen/01.jpeg' }
    ],
    specs: [
      'Keep track of keys, wallet, luggage, and backpacks in Find My app',
      'Precision Finding with Ultra Wideband U1 chip guidance',
      'Built-in speaker plays sounds to help locate misplaced items',
      'Encrypted anonymous Find My network with billions of devices',
      'IP67 water and dust resistant with replaceable CR2032 battery'
    ]
  },

  // --- 5. CREATOR, CAMERAS & GIMBALS (DJI & HOLLYLAND) ---
  {
    id: 'acc-dji-mic-3-dual',
    category: 'creator',
    categoryLabel: 'Creator, Cameras & Gimbals',
    brand: 'DJI',
    name: 'DJI Mic 3 Dual Wireless Microphone System with Charging Case',
    price: 118000,
    originalPrice: 132000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/dji-mic-3-dual-wireless-microphone/01.webp',
    variants: [
      { name: 'Standard Kit', image: '/ACCESORIES/images/dji-mic-3-dual-wireless-microphone/01.webp' },
      { name: 'Case View', image: '/ACCESORIES/images/dji-mic-3-dual-wireless-microphone/02.webp' }
    ],
    specs: [
      'Dual-channel high-fidelity 32-bit float audio recording',
      '250-meter (820 ft) ultra-stable transmission range',
      'Intelligent noise canceling for crystal-clear vocals',
      'Includes Lightning, USB-C, and 3.5mm TRS camera adapters',
      'Up to 18 hours battery life with the portable charging case'
    ]
  },
  {
    id: 'acc-dji-osmo-pocket-3',
    category: 'creator',
    categoryLabel: 'Creator, Cameras & Gimbals',
    brand: 'DJI',
    name: 'DJI Osmo Pocket 3 Creator Combo Vlogging Camera',
    price: 245000,
    originalPrice: 268000,
    discountPercent: 8,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/dji-osmo-pocket-3-creator-combo/01.webp',
    variants: [
      { name: 'Creator Combo', image: '/ACCESORIES/images/dji-osmo-pocket-3-creator-combo/01.webp' }
    ],
    specs: [
      '1-inch CMOS sensor with stunning 4K/120fps video capability',
      '2-inch rotatable OLED touchscreen for horizontal & vertical shooting',
      '3-axis mechanical gimbal stabilization (buttery smooth motion)',
      'ActiveTrack 6.0 intelligent subject follow',
      'Creator Combo includes DJI Mic 2 transmitter, battery handle & tripod'
    ]
  },
  {
    id: 'acc-dji-osmo-mobile-7',
    category: 'creator',
    categoryLabel: 'Creator, Cameras & Gimbals',
    brand: 'DJI',
    name: 'DJI Osmo Mobile 7 Smartphone Gimbal Stabilizer',
    price: 49500,
    originalPrice: 56000,
    discountPercent: 11,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/dji-osmo-mobile-7-smartphone-gimbal-stabilizer/01.webp',
    variants: [
      { name: 'Slate Grey', image: '/ACCESORIES/images/dji-osmo-mobile-7-smartphone-gimbal-stabilizer/01.webp' }
    ],
    specs: [
      '3-Axis phone stabilization with quick-release magnetic clamp',
      'Built-in 215mm extension rod for dynamic high and low angles',
      'ActiveTrack 7.0 for flawless tracking even during fast action',
      'Integrated status panel for battery and gimbal modes',
      'One-tap editing with DJI Mimo app templates'
    ]
  },
  {
    id: 'acc-hollyland-lark-m2',
    category: 'creator',
    categoryLabel: 'Creator, Cameras & Gimbals',
    brand: 'Hollyland',
    name: 'Hollyland Lark M2 Button Wireless Lapel Microphone Combo',
    price: 48500,
    originalPrice: 54000,
    discountPercent: 10,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/hollyland-lark-m2-wireless-microphone/01.jpg',
    variants: [
      { name: 'Charcoal Black', image: '/ACCESORIES/images/hollyland-lark-m2-wireless-microphone/01.jpg' }
    ],
    specs: [
      'Ultra-compact 9g button transmitter design (practically invisible)',
      '48kHz / 24-bit Hi-Fi studio grade audio recording',
      'Environmental Noise Cancellation (ENC) for outdoor winds',
      'Works seamlessly with iPhone, Android, Cameras & Laptops',
      'Up to 40 hours continuous battery with charging case'
    ]
  },

  // --- 6. SMART HOME & STREAMING ---
  {
    id: 'acc-xiaomi-tv-box-s-3',
    category: 'smart-home',
    categoryLabel: 'Smart Home & Streaming',
    brand: 'Xiaomi',
    name: 'Xiaomi Mi TV Box S (3rd Gen) 4K Ultra HD Google TV',
    price: 19500,
    originalPrice: 22500,
    discountPercent: 13,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/xiaomi-mi-tv-box-s-3rd-gen/01.webp',
    variants: [
      { name: 'Black', image: '/ACCESORIES/images/xiaomi-mi-tv-box-s-3rd-gen/01.webp' }
    ],
    specs: [
      '4K UHD resolution with Dolby Vision & HDR10+ support',
      'Dolby Atmos and DTS:X cinema-grade spatial audio',
      'Google TV with personalized recommendations and voice remote',
      'Fast 6nm quad-core CPU with 2GB RAM + 32GB storage',
      'Wi-Fi 6 wireless networking with Chromecast built-in'
    ]
  },
  {
    id: 'acc-xiaomi-tv-stick-4k',
    category: 'smart-home',
    categoryLabel: 'Smart Home & Streaming',
    brand: 'Xiaomi',
    name: 'Xiaomi TV Stick 4K (2nd Gen) Portable Media Player',
    price: 16500,
    originalPrice: 19000,
    discountPercent: 13,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/xiaomi-tv-stick-4k-2nd-gen/01.webp',
    variants: [
      { name: 'Black', image: '/ACCESORIES/images/xiaomi-tv-stick-4k-2nd-gen/01.webp' }
    ],
    specs: [
      'Compact plug-and-play stick transforms any TV into 4K Smart TV',
      'Dolby Atmos and Dolby Vision immersive cinematic streaming',
      'Android TV 11 with Google Assistant built directly into Bluetooth remote',
      'Quad-core performance with dual-band Wi-Fi',
      'Cast films, music, and games directly from your smartphone'
    ]
  },
  {
    id: 'acc-xiaomi-party-speaker',
    category: 'smart-home',
    categoryLabel: 'Smart Home & Streaming',
    brand: 'Xiaomi',
    name: 'Xiaomi Mi Sound Party Outdoor Bluetooth Speaker',
    price: 29500,
    originalPrice: 34000,
    discountPercent: 13,
    availability: 'In Stock',
    mainImage: '/ACCESORIES/images/xiaomi-mi-sound-party-speaker-price-in-srilanka/01.webp',
    variants: [
      { name: 'Black Party Speaker', image: '/ACCESORIES/images/xiaomi-mi-sound-party-speaker-price-in-srilanka/01.webp' },
      { name: 'Angle View', image: '/ACCESORIES/images/xiaomi-mi-sound-party-speaker-price-in-srilanka/02.webp' }
    ],
    specs: [
      'Dynamic RGB ambient light ring pulses to your music beat',
      'Massive acoustic soundstage with dual passive radiator bass',
      'IP67 waterproof and dustproof for beach & pool parties',
      'Up to 12 hours playback with high-speed power bank output',
      'Stereo Pair technology connects multiple units wirelessly'
    ]
  }
,

  // --- EXPANDED GENUINE ACCESSORIES LINEUP ---
  {
    "id": "acc-anker-k20i",
    "category": "audio",
    "categoryLabel": "Audio & Earphones",
    "brand": "Anker",
    "name": "Anker Soundcore K20i Semi-In-Ear Wireless Earbuds",
    "price": 9900,
    "originalPrice": 12500,
    "discountPercent": 20,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/anker-soundcore-k20i-wireless-earbuds/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/anker-soundcore-k20i-wireless-earbuds/01.webp"
      }
    ],
    "specs": [
      "Semi-in-ear comfort fit with 13mm dynamic drivers",
      "36-hour ultra-long battery life with fast charging",
      "AI-powered dual microphone noise cancellation for calls",
      "IPX5 water and sweat resistant"
    ]
  },

  {
    "id": "acc-anker-q11i",
    "category": "audio",
    "categoryLabel": "Audio & Earphones",
    "brand": "Anker",
    "name": "Anker Soundcore Q11i Wireless Over-Ear Headphones",
    "price": 18500,
    "originalPrice": 22000,
    "discountPercent": 15,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/anker-soundcore-q11i-wireless-headphones/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/anker-soundcore-q11i-wireless-headphones/01.webp"
      }
    ],
    "specs": [
      "40mm oversized drivers with BassUp technology",
      "Up to 60 hours of continuous playtime",
      "Fast charge: 5 mins gives 5 hours listening",
      "Ultra-comfortable memory foam ear cushions"
    ]
  },

  {
    "id": "acc-cmf-buds-2-plus",
    "category": "audio",
    "categoryLabel": "Audio & Earphones",
    "brand": "Nothing CMF",
    "name": "CMF by Nothing Buds 2 Plus Wireless Earbuds",
    "price": 18500,
    "originalPrice": 21500,
    "discountPercent": 13,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/cmf-by-nothing-buds-2-plus-wireless-earbuds/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/cmf-by-nothing-buds-2-plus-wireless-earbuds/01.webp"
      }
    ],
    "specs": [
      "48 dB Active Noise Cancellation with Transparency mode",
      "Dirac Opteo sound calibration and custom EQ",
      "Dual-device connection with Bluetooth 5.3",
      "Up to 35.5 hours total playback"
    ]
  },

  {
    "id": "acc-samsung-buds-4-pro",
    "category": "audio",
    "categoryLabel": "Audio & Earphones",
    "brand": "Samsung",
    "name": "Samsung Galaxy Buds 4 Pro Hi-Fi ANC Earbuds",
    "price": 74900,
    "originalPrice": 82000,
    "discountPercent": 8,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/samsung-buds-4-pro/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/samsung-buds-4-pro/01.jpg"
      }
    ],
    "specs": [
      "Next-generation 24-bit studio audio engine",
      "Enhanced Intelligent Active Noise Control",
      "Seamless multi-device Galaxy auto switch",
      "IP57 water & dust ingress protection"
    ]
  },

  {
    "id": "acc-samsung-buds-3-fe",
    "category": "audio",
    "categoryLabel": "Audio & Earphones",
    "brand": "Samsung",
    "name": "Samsung Galaxy Buds 3 FE Wireless Earbuds",
    "price": 36500,
    "originalPrice": 42000,
    "discountPercent": 13,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/samsung-galaxy-buds-3-fe/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/samsung-galaxy-buds-3-fe/01.webp"
      }
    ],
    "specs": [
      "Powerful active noise cancellation with deep bass",
      "Ergonomic wing-tip comfort fit design",
      "Clear call quality with 3 microphones",
      "Up to 30 hours battery life with charging case"
    ]
  },

  {
    "id": "acc-apple-watch-se-3-mid",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Apple",
    "name": "Apple Watch SE (3rd Gen) 40mm Midnight Aluminum",
    "price": 89000,
    "originalPrice": 99000,
    "discountPercent": 10,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-watch-series-se-3-40mm-midnight/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-watch-series-se-3-40mm-midnight/01.jpg"
      }
    ],
    "specs": [
      "All-new S9 dual-core chip with Double Tap gestures",
      "Crash Detection, Fall Detection & Emergency SOS",
      "Sleep tracking with sleep stages analysis",
      "Water resistant 50 meters (Swimproof)"
    ]
  },

  {
    "id": "acc-apple-watch-se-3-star",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Apple",
    "name": "Apple Watch SE (3rd Gen) 40mm Starlight Aluminum",
    "price": 89000,
    "originalPrice": 99000,
    "discountPercent": 10,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-watch-series-se-3-40mm-starlight/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-watch-series-se-3-40mm-starlight/01.jpg"
      }
    ],
    "specs": [
      "Starlight color-matched aluminum case and sport band",
      "Advanced fitness workouts with Heart Rate Zones",
      "Retina OLED display up to 1000 nits",
      "Comprehensive watchOS 11 support"
    ]
  },

  {
    "id": "acc-samsung-watch-8-classic",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Samsung",
    "name": "Samsung Galaxy Watch 8 Classic 46mm Rotating Bezel",
    "price": 138000,
    "originalPrice": 155000,
    "discountPercent": 10,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/samsung-galaxy-watch8-classic-watch-8-46mm-price-in-srilanka/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/samsung-galaxy-watch8-classic-watch-8-46mm-price-in-srilanka/01.webp"
      }
    ],
    "specs": [
      "Physical rotating bezel for tactile precision navigation",
      "Stainless steel armor body with sapphire crystal display",
      "BioActive sensor: ECG, blood pressure & BIA body fat",
      "Wear OS 5 with Google Maps and offline audio"
    ]
  },

  {
    "id": "acc-samsung-watch-8-44",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Samsung",
    "name": "Samsung Galaxy Watch 8 44mm Bluetooth",
    "price": 98000,
    "originalPrice": 110000,
    "discountPercent": 10,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/samsung-galaxy-watch-8-44mm-price-in-srilanka/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/samsung-galaxy-watch-8-44mm-price-in-srilanka/01.jpg"
      }
    ],
    "specs": [
      "Super AMOLED 1.5-inch sapphire glass touchscreen",
      "Galaxy AI Energy Score & Sleep Apnea detection",
      "Comprehensive outdoor running & cycling coaching",
      "Fast wireless magnetic charging"
    ]
  },

  {
    "id": "acc-samsung-galaxy-fit-3",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Samsung",
    "name": "Samsung Galaxy Fit 3 AMOLED Fitness Tracker",
    "price": 19500,
    "originalPrice": 23500,
    "discountPercent": 17,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/samsung-galaxy-fit-3-smartwatch/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/samsung-galaxy-fit-3-smartwatch/01.webp"
      }
    ],
    "specs": [
      "1.6-inch vibrant AMOLED display with aluminum frame",
      "Up to 13 days of battery life on a single charge",
      "Over 100 workouts tracked automatically",
      "5ATM and IP68 water & dust resistance rating"
    ]
  },

  {
    "id": "acc-huawei-band-11",
    "category": "smartwatches",
    "categoryLabel": "Smartwatches & Fitness",
    "brand": "Huawei",
    "name": "Huawei Band 11 Smart Fitness Band",
    "price": 16500,
    "originalPrice": 19500,
    "discountPercent": 15,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/huawei-band-11-smartwatch/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/huawei-band-11-smartwatch/01.webp"
      }
    ],
    "specs": [
      "Ultra-thin 8.9mm lightweight comfortable body",
      "TruSleep 4.0 science-based sleep tracking",
      "SpO2 blood oxygen & continuous heart rate monitoring",
      "Up to 14 days endurance with fast magnetic charging"
    ]
  },

  {
    "id": "acc-apple-40w-dynamic",
    "category": "power",
    "categoryLabel": "Power, Chargers & Cables",
    "brand": "Apple",
    "name": "Apple 40W Dynamic Dual USB-C Power Adapter (60W Max)",
    "price": 14500,
    "originalPrice": 17000,
    "discountPercent": 14,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-40w-dynamic-power-adapter-60w-max/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-40w-dynamic-power-adapter-60w-max/01.webp"
      }
    ],
    "specs": [
      "Dual USB-C ports with intelligent power allocation",
      "Fast charges two Apple devices simultaneously",
      "UK 3-Pin safety standard for Sri Lanka",
      "Optimized for iPhone, Apple Watch and iPad"
    ]
  },

  {
    "id": "acc-dji-action-5-pro",
    "category": "creator",
    "categoryLabel": "Creator, Cameras & Gimbals",
    "brand": "DJI",
    "name": "DJI Osmo Action 5 Pro Adventure Combo 4K Camera",
    "price": 185000,
    "originalPrice": 205000,
    "discountPercent": 9,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/dji-osmo-action-5-pro-adventure-combo/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/dji-osmo-action-5-pro-adventure-combo/01.jpg"
      }
    ],
    "specs": [
      "Next-gen 1/1.3-inch sensor with revolutionary 13.5 stops dynamic range",
      "4K/120fps video with 155-degree ultra-wide angle view",
      "HorizonSteady 360-degree gimbal-like stabilization",
      "Up to 4 hours extended recording per battery",
      "Adventure Combo includes 3 extreme batteries, extension rod & case"
    ]
  },

  {
    "id": "acc-dji-action-6",
    "category": "creator",
    "categoryLabel": "Creator, Cameras & Gimbals",
    "brand": "DJI",
    "name": "DJI Osmo Action 6 Adventure Combo 8K Action Camera",
    "price": 225000,
    "originalPrice": 248000,
    "discountPercent": 9,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/dji-osmo-action-6-adventure-combo/01.png",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/dji-osmo-action-6-adventure-combo/01.png"
      }
    ],
    "specs": [
      "Flagship 8K high-resolution action optics with AI night mode",
      "Dual high-brightness OLED touchscreens front and rear",
      "20-meter waterproof without external waterproof case",
      "Direct wireless connection to DJI Mic transmitters",
      "Includes 3 extreme cold-resistant batteries and case"
    ]
  },

  {
    "id": "acc-dji-osmo-mobile-8",
    "category": "creator",
    "categoryLabel": "Creator, Cameras & Gimbals",
    "brand": "DJI",
    "name": "DJI Osmo Mobile 8 AI Smart Smartphone Gimbal",
    "price": 56000,
    "originalPrice": 63000,
    "discountPercent": 11,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/dji-osmo-mobile-8-smart-gimbal/01.png",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/dji-osmo-mobile-8-smart-gimbal/01.png"
      }
    ],
    "specs": [
      "Next-generation 3-axis stabilization with AI subject lock",
      "Built-in extendable selfie and vlogging telescopic rod",
      "Quick launch magnetic clamp: instantly start filming",
      "Gesture control for solo vloggers and group selfies"
    ]
  },

  {
    "id": "acc-dji-osmo-pocket-4",
    "category": "creator",
    "categoryLabel": "Creator, Cameras & Gimbals",
    "brand": "DJI",
    "name": "DJI Osmo Pocket 4 Creator Combo 4K Handheld Gimbal Camera",
    "price": 275000,
    "originalPrice": 298000,
    "discountPercent": 7,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/dji-osmo-pocket-4-creater-combo/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/dji-osmo-pocket-4-creater-combo/01.webp"
      }
    ],
    "specs": [
      "Upgraded 1-inch stacked CMOS sensor with 10-bit D-Log M color",
      "OLED rotatable touch display for instant landscape and vertical vlogging",
      "3-axis mechanical stabilization with ActiveTrack 7.0",
      "Includes DJI wireless microphone, battery handle, wide-angle lens & tripod"
    ]
  },

  {
    "id": "acc-dji-mic-mini",
    "category": "creator",
    "categoryLabel": "Creator, Cameras & Gimbals",
    "brand": "DJI",
    "name": "DJI Mic Mini 2 Ultra-Light Wireless Microphone (USB-C)",
    "price": 38500,
    "originalPrice": 43000,
    "discountPercent": 10,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/dji-mic-mini-2-mobile-version-usb-c/01.webp",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/dji-mic-mini-2-mobile-version-usb-c/01.webp"
      }
    ],
    "specs": [
      "Featherweight clip-on transmitter (only 10 grams)",
      "Direct plug-and-play USB-C receiver for iPhone and Android",
      "Smart two-level noise cancellation for windy outdoor audio",
      "Up to 48 hours battery life with compact charging dock"
    ]
  },

  {
    "id": "acc-apple-magic-keyboard-13",
    "category": "protection",
    "categoryLabel": "Protection & Cases",
    "brand": "Apple",
    "name": "Apple Magic Keyboard for iPad Pro 13-inch (M4 / M5)",
    "price": 135000,
    "originalPrice": 148000,
    "discountPercent": 8,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-magic-keyboard-for-ipad-pro-13-inch-m4-m5/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-magic-keyboard-for-ipad-pro-13-inch-m4-m5/01.jpg"
      }
    ],
    "specs": [
      "Floating cantilever magnetic design with aluminum palm rest",
      "Larger glass trackpad with haptic feedback",
      "Full 14-key function row for volume and media control",
      "USB-C pass-through charging port"
    ]
  },

  {
    "id": "acc-apple-airtag-1pack",
    "category": "protection",
    "categoryLabel": "Protection & Cases",
    "brand": "Apple",
    "name": "Apple AirTag Single Pack Item Tracker",
    "price": 11500,
    "originalPrice": 13500,
    "discountPercent": 14,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-airtag-single-pack-1st-gen/01.jpeg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-airtag-single-pack-1st-gen/01.jpeg"
      }
    ],
    "specs": [
      "Keep track of keys, bags, wallet, and luggage via Find My app",
      "Precision Finding with Ultra Wideband U1 chip direction pointer",
      "One-tap setup connects immediately with your iPhone",
      "IP67 water and dust resistance"
    ]
  },

  {
    "id": "acc-apple-mac-mini-m4",
    "category": "protection",
    "categoryLabel": "Productivity & Mac",
    "brand": "Apple",
    "name": "Apple Mac mini M4 (16GB Unified Memory | 256GB SSD)",
    "price": 245000,
    "originalPrice": 268000,
    "discountPercent": 8,
    "availability": "In Stock",
    "mainImage": "/ACCESORIES/images/apple-mac-mini-m4-16gb-256gb/01.jpg",
    "variants": [
      {
        "name": "Standard",
        "image": "/ACCESORIES/images/apple-mac-mini-m4-16gb-256gb/01.jpg"
      }
    ],
    "specs": [
      "All-new ultra-compact 5-inch by 5-inch redesigned enclosure",
      "Apple M4 chip: 10-core CPU & 10-core GPU with hardware ray tracing",
      "16GB unified memory standard with 120GB/s bandwidth",
      "Front USB-C ports & headphone jack + rear Thunderbolt ports",
      "Apple Intelligence ready with macOS Sequoia"
    ]
  }
];
