// Catalog datasets for Samsung, Google, OnePlus, and Xiaomi
// Using exact verified image filenames from public/store_export_android/images/ and public/ACCESORIES/images/

export const ECOSYSTEM_CATALOGS = {
  samsung: {
    title: 'Official Samsung Galaxy Lineup',
    subtitle: 'Factory sealed Galaxy smartphones, tablets, wearables & authentic accessories.',
    accentColor: '#2563eb',
    categories: [
      { id: 'all', label: 'All Galaxy Products', icon: '✨' },
      { id: 'phones', label: 'Galaxy Phones', icon: '📱' },
      { id: 'tabs', label: 'Galaxy Tabs', icon: '💻' },
      { id: 'watches', label: 'Galaxy Watch', icon: '⌚' },
      { id: 'audio', label: 'Galaxy Buds', icon: '🎧' },
      { id: 'power', label: 'Fast Power', icon: '⚡' }
    ],
    products: [
      {
        id: 'samsung-s26-ultra',
        category: 'phones',
        categoryLabel: 'Galaxy S Series',
        name: 'Samsung Galaxy S26 Ultra 5G (512GB)',
        price: 495000,
        originalPrice: 540000,
        discountPercent: 8,
        availability: 'Available on backorder',
        mainImage: '/galaxy_s26_ultra.jpg',
        variants: [
          { name: 'Titanium Black', image: '/galaxy_s26_ultra.jpg' },
          { name: 'Titanium Gray', image: '/samsung_s24.jpg' }
    ,

    ],
        specs: [
          'Snapdragon 8 Elite / Exynos 2600 AI Flagship',
          '16 GB RAM with Galaxy AI 3.0',
          '200 MP Quad Camera with 10x Periscope Zoom & ProVisual Engine',
          'Integrated S Pen with Bluetooth gestures',
          '5200 mAh Battery with 65W Super Fast Charging 2.0',
          '6.9-inch Dynamic AMOLED 2X (1-120Hz, 3200 nits)'
        ]
      },

      // --- EXPANDED SAMSUNG OFFICIAL LINEUP ---
      {
        "id": "samsung-z-fold-7",
        "category": "phones",
        "categoryLabel": "Galaxy Z Fold",
        "name": "Samsung Galaxy Z Fold 7 5G 12GB | 256GB",
        "price": 525000,
        "originalPrice": 570000,
        "discountPercent": 8,
        "availability": "Available on backorder",
        "mainImage": "/store_export_android/images/samsung-galaxy-z-fold-7-12gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-z-fold-7-12gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "Next-generation ultra-flat zero-crease folding AMOLED display",
          "Snapdragon 8 Elite flagship chipset with ray tracing graphics",
          "50 MP ProVisual AI triple camera system",
          "Armor Aluminum frame with IP48 dust & water resistance",
          "4600 mAh extended battery with 45W fast charging"
        ]
      },

      {
        "id": "samsung-s24-fe",
        "category": "phones",
        "categoryLabel": "Galaxy S Series",
        "name": "Samsung Galaxy S24 FE 8GB | 256GB",
        "price": 215000,
        "originalPrice": 239000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-s24-fe-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-s24-fe-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "6.7-inch Dynamic AMOLED 2X display with 120Hz refresh rate",
          "Exynos 2400e 4nm processor with Galaxy AI features",
          "50 MP Main + 12 MP Ultra Wide + 8 MP 3x Telephoto",
          "4700 mAh all-day battery life with 25W fast charging"
        ]
      },

      {
        "id": "samsung-a57-5g",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A57 5G 12GB | 256GB Price in Sri Lanka",
        "price": 169000,
        "originalPrice": 185000,
        "discountPercent": 9,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a57-5g-12gb-256gb-price-in-srilanka/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a57-5g-12gb-256gb-price-in-srilanka/01.jpg"
          }
        ],
        "specs": [
          "Exynos 1680 high-performance processor with 12GB RAM",
          "50 MP OIS Main camera with Nightography & Super HDR",
          "6.6-inch Super AMOLED 120Hz display with Vision Booster",
          "IP67 water and dust resistance with 5000 mAh battery"
        ]
      },

      {
        "id": "samsung-a37-5g",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A37 5G 8GB | 256GB Price in Sri Lanka",
        "price": 139000,
        "originalPrice": 152000,
        "discountPercent": 9,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a37-5g-8gb-256gb-price-in-srilanka/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a37-5g-8gb-256gb-price-in-srilanka/01.jpg"
          }
        ],
        "specs": [
          "Octa-core 5G processor with 8GB RAM + 256GB storage",
          "50 MP Triple Camera with optical image stabilization",
          "6.6-inch Super AMOLED display with 120Hz refresh rate",
          "5000 mAh 2-day battery with 25W Super Fast Charging"
        ]
      },

      {
        "id": "samsung-a27-5g",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A27 5G 8GB | 256GB Price in Sri Lanka",
        "price": 115000,
        "originalPrice": 126000,
        "discountPercent": 9,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a27-8gb-256-5g-price-in-srilanka/01.webp",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a27-8gb-256-5g-price-in-srilanka/01.webp"
          }
        ],
        "specs": [
          "6.5-inch Super AMOLED display with 120Hz smooth scrolling",
          "50 MP high-resolution main camera with OIS",
          "MediaTek Dimensity 5G chipset with 8GB RAM",
          "5000 mAh battery with 25W Fast Charging"
        ]
      },

      {
        "id": "samsung-a17-5g",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A17 5G 8GB RAM | 256GB",
        "price": 89000,
        "originalPrice": 99000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a17-5g-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a17-5g-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "Fast 5G connectivity with 8GB RAM & 256GB internal storage",
          "50 MP clear triple camera with macro lens",
          "6.5-inch FHD+ 90Hz Super AMOLED display",
          "5000 mAh battery with 25W charging"
        ]
      },

      {
        "id": "samsung-a07-4g",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A07 4G 8GB | 256GB",
        "price": 54500,
        "originalPrice": 62000,
        "discountPercent": 12,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a07-4g-8gb-256gb/01.png",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a07-4g-8gb-256gb/01.png"
          }
        ],
        "specs": [
          "6.7-inch expansive HD+ display with 90Hz smooth motion",
          "50 MP dual camera with depth sensor for portraits",
          "5000 mAh long-lasting battery with 25W fast charging",
          "Side-mounted fingerprint scanner for instant unlock"
        ]
      },

      {
        "id": "samsung-a06-6gb",
        "category": "phones",
        "categoryLabel": "Galaxy A Series",
        "name": "Samsung Galaxy A06 6GB RAM | 128GB",
        "price": 44500,
        "originalPrice": 49500,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a06-6gb-ram-128gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a06-6gb-ram-128gb/01.jpg"
          }
        ],
        "specs": [
          "MediaTek Helio G85 processor with 6GB RAM",
          "50 MP high-resolution primary camera",
          "6.7-inch PLS LCD large display",
          "5000 mAh battery with 25W fast charging support"
        ]
      },

      {
        "id": "samsung-tab-a9-plus",
        "category": "tabs",
        "categoryLabel": "Galaxy Tab",
        "name": "Samsung Galaxy Tab A9+ 5G 8GB | 128GB (SIM + Wi-Fi)",
        "price": 98000,
        "originalPrice": 110000,
        "discountPercent": 11,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-tab-a9-plus-5g-8gb-ram-128gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-tab-a9-plus-5g-8gb-ram-128gb/01.jpg"
          }
        ],
        "specs": [
          "11.0-inch 90Hz smooth display with quad stereo speakers",
          "Qualcomm Snapdragon 695 5G processor with 8GB RAM",
          "Samsung DeX multi-tasking mode support",
          "7040 mAh battery with 15W fast charge"
        ]
      },

      {
        "id": "samsung-tab-a11",
        "category": "tabs",
        "categoryLabel": "Galaxy Tab",
        "name": "Samsung Galaxy Tab A11 8GB | 128GB (LTE + Wi-Fi)",
        "price": 84500,
        "originalPrice": 94000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-a11-tab-8gb-128gb/01.png",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-a11-tab-8gb-128gb/01.png"
          }
        ],
        "specs": [
          "8.7-inch portable compact entertainment tablet",
          "Dual stereo speakers with Dolby Atmos spatial sound",
          "LTE SIM slot for on-the-go browsing and calling",
          "5100 mAh battery with fast charging"
        ]
      },

      {
        "id": "samsung-tab-s9-fe",
        "category": "tabs",
        "categoryLabel": "Galaxy Tab",
        "name": "Samsung Galaxy Tab S9 FE 5G 6GB | 128GB with S Pen",
        "price": 185000,
        "originalPrice": 205000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-galaxy-tab-s9-fe-5g-6gb-ram-128gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-galaxy-tab-s9-fe-5g-6gb-ram-128gb/01.jpg"
          }
        ],
        "specs": [
          "10.9-inch 90Hz display with IP68 water & dust resistance",
          "Inbox IP68 magnetic water-resistant S Pen",
          "Exynos 1380 with 5G SIM card connectivity",
          "8000 mAh battery with 45W fast charge"
        ]
      },

      {
        "id": "samsung-buds-4-pro-cat",
        "category": "audio",
        "categoryLabel": "Galaxy Buds",
        "name": "Samsung Galaxy Buds 4 Pro Studio Hi-Fi Earbuds",
        "price": 74900,
        "originalPrice": 82000,
        "discountPercent": 8,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/samsung-buds-4-pro/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/samsung-buds-4-pro/01.jpg"
          }
        ],
        "specs": [
          "Next-generation 24-bit studio audio engine",
          "Enhanced Intelligent Active Noise Control with Voice Detect",
          "Seamless multi-device Galaxy auto switch",
          "IP57 water & dust ingress protection"
        ]
      },
      {
        id: 'samsung-s25-ultra',
        category: 'phones',
        categoryLabel: 'Galaxy S Series',
        name: 'Samsung Galaxy S25 Ultra 5G 12GB | 512GB',
        price: 445000,
        originalPrice: 485000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/samsung_s24.jpg',
        variants: [{ name: 'Titanium Silver', image: '/samsung_s24.jpg' }],
        specs: [
          'Snapdragon 8 Elite for Galaxy (3nm)',
          '12 GB RAM with On-device Gemini Nano AI',
          '200 MP Main + 50 MP Ultra Wide + 50 MP 5x Telephoto',
          'Built-in S Pen stylus with remote shutter',
          '5000 mAh all-day battery',
          '6.86-inch flat Dynamic AMOLED 2X display'
        ]
      },
      {
        id: 'samsung-z-fold-6',
        category: 'phones',
        categoryLabel: 'Galaxy Z Fold',
        name: 'Samsung Galaxy Z Fold 6 12GB | 256GB',
        price: 485000,
        originalPrice: 530000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-z-fold-6-12gb-ram-256gb/01.png',
        variants: [
          { name: 'Silver Shadow', image: '/store_export_android/images/samsung-galaxy-z-fold-6-12gb-ram-256gb/01.png' },
          { name: 'Open Display', image: '/store_export_android/images/samsung-galaxy-z-fold-6-12gb-ram-256gb/02.png' }
        ],
        specs: [
          'Ultra-thin dual-screen folding chassis with Armor Aluminum',
          '7.6-inch Dynamic AMOLED 2X inner screen + 6.3-inch cover display',
          'Snapdragon 8 Gen 3 for Galaxy with ray tracing',
          'Dual screen Live Translation with Galaxy AI',
          '4400 mAh Dual Battery with 25W Fast Charging'
        ]
      },
      {
        id: 'samsung-a56-5g',
        category: 'phones',
        categoryLabel: 'Galaxy A Series',
        name: 'Samsung Galaxy A56 5G 12GB | 256GB',
        price: 158000,
        originalPrice: 175000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-a56-5g-12gb-ram-256gb-2/01.jpg',
        variants: [{ name: 'Awesome Iceblue', image: '/store_export_android/images/samsung-galaxy-a56-5g-12gb-ram-256gb-2/01.jpg' }],
        specs: [
          'Exynos 1580 4nm processor with high-performance NPU',
          '12 GB RAM with 256 GB internal storage',
          '50 MP OIS Main Camera with 12 MP Ultra Wide',
          'IP67 dust & water resistance',
          '5000 mAh battery with 45W Fast Charging support',
          '6.6-inch Super AMOLED 120Hz display'
        ]
      },
      {
        id: 'samsung-a36-5g',
        category: 'phones',
        categoryLabel: 'Galaxy A Series',
        name: 'Samsung Galaxy A36 5G 8GB | 256GB',
        price: 129000,
        originalPrice: 142000,
        discountPercent: 9,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-a36-5g-8gb-ram-256gb/01.jpg',
        variants: [{ name: 'Awesome Navy', image: '/store_export_android/images/samsung-galaxy-a36-5g-8gb-ram-256gb/01.jpg' }],
        specs: [
          'Octa-core 5G processor with 8GB RAM',
          '50 MP Triple Camera with Super HDR video',
          '5000 mAh battery with 2-day battery endurance',
          'Corning Gorilla Glass Victus+ front protection',
          '4 generations of Android OS updates guaranteed'
        ]
      },
      {
        id: 'samsung-tab-s10-fe',
        category: 'tabs',
        categoryLabel: 'Galaxy Tab',
        name: 'Samsung Galaxy Tab S10 FE 5G 8GB | 128GB (SIM + Wi-Fi)',
        price: 215000,
        originalPrice: 238000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-tab-s10-fe-5g-8gb-128gb-wifi/01.jpg',
        variants: [{ name: 'Gray', image: '/store_export_android/images/samsung-galaxy-tab-s10-fe-5g-8gb-128gb-wifi/01.jpg' }],
        specs: [
          'Includes IP68 water-resistant S Pen inside the box',
          '10.9-inch 90Hz WQXGA vibrant display',
          '5G SIM connectivity + Wi-Fi 6',
          'Samsung DeX multi-window desktop mode',
          '8000 mAh battery with 45W fast charge'
        ]
      },
      {
        id: 'samsung-watch-ultra-cat',
        category: 'watches',
        categoryLabel: 'Galaxy Watch',
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
          'Grade 4 Titanium cushion body with 10ATM / 100m water resistance',
          'Dual-frequency GPS (L1 + L5) with Track Back navigation',
          'BioActive 2.0 sensor with Galaxy AI Energy Score',
          'Quick button triggers customizable sports tracking & 86dB siren',
          'Up to 100 hours power-saving battery'
        ]
      },
      {
        id: 'samsung-watch-9-cat',
        category: 'watches',
        categoryLabel: 'Galaxy Watch',
        name: 'Samsung Galaxy Watch 9 44mm Graphite Bluetooth',
        price: 119000,
        originalPrice: 132000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/ACCESORIES/images/samsung-galaxy-watch-9-44mm-graphite/01.jpg',
        variants: [{ name: 'Graphite', image: '/ACCESORIES/images/samsung-galaxy-watch-9-44mm-graphite/01.jpg' }],
        specs: [
          '1.5-inch Super AMOLED with sapphire crystal glass',
          'Advanced sleep coaching and heart rate zone analytics',
          'Wear OS 5 with Google Play apps and NFC wallet',
          'Fast magnetic wireless charging',
          'IP68 and 5ATM water resistance'
        ]
      },
      {
        id: 'samsung-buds-3-cat',
        category: 'audio',
        categoryLabel: 'Galaxy Buds',
        name: 'Samsung Galaxy Buds 3 Pro AI Wireless Earbuds',
        price: 64900,
        originalPrice: 72000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/ACCESORIES/images/samsung-galaxy-buds-3/01.webp',
        variants: [
          { name: 'Silver Titanium', image: '/ACCESORIES/images/samsung-galaxy-buds-3/01.webp' },
          { name: 'Charging Case View', image: '/ACCESORIES/images/samsung-galaxy-buds-3/02.webp' }
        ],
        specs: [
          'Galaxy AI real-time interpreter with voice translation',
          'Blade Lights acoustic futuristic stem design',
          '24-bit Hi-Fi sound with planar tweeter & dynamic woofer',
          'Enhanced ANC with noise and siren detection',
          'IP57 sweat and dust protection'
        ]
      },
      {
        id: 'samsung-65w-trio-cat',
        category: 'power',
        categoryLabel: 'Power & Charging',
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
          '3-in-1 multi-port: 2x USB-C (65W + 25W) + 1x USB-A (15W)',
          'Supports Samsung 45W Super Fast Charging 2.0 PPS',
          'Simultaneously fast charges phone, tablet and laptop',
          'Compact travel-friendly build with internal surge protection'
        ]
      },
      {
        id: 'samsung-f05-4gb',
        category: 'phones',
        categoryLabel: 'Galaxy F Series',
        name: 'Samsung Galaxy F05 4GB RAM | 64GB',
        price: 27500,
        originalPrice: 32000,
        discountPercent: 14,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-f05-4gb-ram-64gb/01.jpg',
        variants: [
          { name: 'Twilight Blue', image: '/store_export_android/images/samsung-galaxy-f05-4gb-ram-64gb/01.jpg' }
        ],
        specs: [
          'MediaTek Helio G85 Octa-core processor',
          '50 MP Main Camera + 2 MP Depth Camera',
          '6.7-inch HD+ PLS LCD display',
          '5000 mAh battery with 25W Fast Charging'
        ]
      },
      {
        id: 'samsung-f04-4gb',
        category: 'phones',
        categoryLabel: 'Galaxy F Series',
        name: 'Samsung Galaxy F04 4GB RAM | 64GB',
        price: 27500,
        originalPrice: 31000,
        discountPercent: 11,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-f04-4gb-ram-64gb/01.jpg',
        variants: [
          { name: 'Opal Green', image: '/store_export_android/images/samsung-galaxy-f04-4gb-ram-64gb/01.jpg' },
          { name: 'Jade Purple', image: '/store_export_android/images/samsung-galaxy-f04-4gb-ram-64gb/02.webp' }
        ],
        specs: [
          'MediaTek Helio P35 processor with RAM Plus (up to 8GB)',
          '13 MP + 2 MP dual rear camera',
          '6.5-inch HD+ display',
          '5000 mAh long-lasting battery'
        ]
      },
      {
        id: 'samsung-m04-4gb',
        category: 'phones',
        categoryLabel: 'Galaxy M Series',
        name: 'Samsung Galaxy M04 4GB RAM | 128GB',
        price: 31200,
        originalPrice: 35000,
        discountPercent: 11,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-m04-4gb-ram-128gb/01.png',
        variants: [
          { name: 'Dark Blue', image: '/store_export_android/images/samsung-galaxy-m04-4gb-ram-128gb/01.png' }
        ],
        specs: [
          'MediaTek Helio P35 processor with 128GB internal storage',
          '13 MP + 2 MP dual rear cameras',
          '6.5-inch HD+ display',
          '5000 mAh all-day battery'
        ]
      },
      {
        id: 'samsung-a04s-3gb',
        category: 'phones',
        categoryLabel: 'Galaxy A Series',
        name: 'Samsung Galaxy A04s (3GB RAM | 32GB)',
        price: 30400,
        originalPrice: 34500,
        discountPercent: 12,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-a04s-3-32gb-trcsl-approved/01.webp',
        variants: [
          { name: 'Black', image: '/store_export_android/images/samsung-galaxy-a04s-3-32gb-trcsl-approved/01.webp' },
          { name: 'Copper', image: '/store_export_android/images/samsung-galaxy-a04s-3-32gb-trcsl-approved/02.webp' }
        ],
        specs: [
          'Exynos 850 (8nm) Octa-core processor',
          '50 MP Triple Camera system with PDAF',
          '6.5-inch 90Hz PLS LCD display',
          '5000 mAh battery with 15W charging'
        ]
      },
      {
        id: 'samsung-a04e-3gb',
        category: 'phones',
        categoryLabel: 'Galaxy A Series',
        name: 'Samsung Galaxy A04e (3GB RAM | 64GB)',
        price: 29400,
        originalPrice: 33000,
        discountPercent: 11,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/samsung-galaxy-a04e-3-64gb-trcsl-approved/01.jpg',
        variants: [
          { name: 'Light Blue', image: '/store_export_android/images/samsung-galaxy-a04e-3-64gb-trcsl-approved/01.jpg' },
          { name: 'Copper', image: '/store_export_android/images/samsung-galaxy-a04e-3-64gb-trcsl-approved/02.jpg' }
        ],
        specs: [
          'MediaTek Helio P35 processor with 64GB storage',
          '13 MP + 2 MP dual rear camera',
          '6.5-inch PLS LCD display',
          '5000 mAh high-capacity battery'
        ]
      }
    ]
  },

  google: {
    title: 'Official Google Pixel Lineup',
    subtitle: 'The purest Android experience supercharged with Google DeepMind Gemini AI.',
    accentColor: '#059669',
    categories: [
      { id: 'all', label: 'All Pixel Devices', icon: '✨' },
      { id: 'phones', label: 'Pixel Phones', icon: '📱' },
      { id: 'wearables', label: 'Pixel Watch', icon: '⌚' },
      { id: 'audio', label: 'Pixel Buds', icon: '🎧' },
      { id: 'power', label: 'Fast Power', icon: '⚡' }
    ],
    products: [
      {
        id: 'google-pixel-10-pro',
        category: 'phones',
        categoryLabel: 'Pixel Phones',
        name: 'Google Pixel 10 Pro 5G (256GB)',
        price: 385000,
        originalPrice: 420000,
        discountPercent: 8,
        availability: 'Available on backorder',
        mainImage: '/pixel10_pro.jpg',
        variants: [
          { name: 'Porcelain White', image: '/pixel10_pro.jpg' },
          { name: 'Obsidian Black', image: '/pixel9pro.jpg' }
    ,

    ],
        specs: [
          'Custom Google Tensor G5 Silicon (TSMC 3nm)',
          '16 GB High-Speed RAM with Gemini Nano on-device AI',
          '50 MP Main + 48 MP Macro Ultra-Wide + 48 MP 5x Telephoto',
          'Gemini Live real-time multi-modal conversational AI',
          '6.8-inch Super Actua LTPO OLED (3000 nits)',
          '7 years of guaranteed Android OS upgrades & Feature Drops'
        ]
      },

      // --- EXPANDED GOOGLE OFFICIAL LINEUP ---
      {
        "id": "google-pixel-8-256",
        "category": "phones",
        "categoryLabel": "Pixel Phones",
        "name": "Google Pixel 8 5G 8GB RAM | 256GB",
        "price": 195000,
        "originalPrice": 218000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/google-pixel-8-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/google-pixel-8-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "Google Tensor G3 processor with Titan M2 security",
          "50 MP Octa PD main camera + 12 MP ultra-wide with macro",
          "Best Take, Magic Audio Eraser and Real Tone photo science",
          "6.2-inch Actua display with 60-120Hz refresh rate",
          "7 years of guaranteed OS and security updates"
        ]
      },

      {
        "id": "google-pixel-7-128",
        "category": "phones",
        "categoryLabel": "Pixel Phones",
        "name": "Google Pixel 7 5G 8GB RAM | 128GB",
        "price": 145000,
        "originalPrice": 165000,
        "discountPercent": 12,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/google-pixel-7-128gb/01.png",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/google-pixel-7-128gb/01.png"
          }
        ],
        "specs": [
          "Google Tensor G2 custom chip with advanced machine learning",
          "50 MP wide lens + 12 MP ultrawide with Cinematic Blur",
          "All-day battery life with Extreme Battery Saver up to 72 hours",
          "6.3-inch smooth 90Hz OLED display with IP68 protection"
        ]
      },
      {
        id: 'google-pixel-9-pro-xl',
        category: 'phones',
        categoryLabel: 'Pixel Phones',
        name: 'Google Pixel 9 Pro XL 16GB | 128GB',
        price: 345000,
        originalPrice: 375000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/pixel9pro.jpg',
        variants: [{ name: 'Obsidian', image: '/pixel9pro.jpg' }],
        specs: [
          'Google Tensor G4 processor with 16GB RAM',
          'Triple pro rear cameras with 30x Super Res Zoom',
          '42 MP front camera with autofocus for 4K video',
          '5060 mAh battery with 37W fast wired charging',
          '6.8-inch Super Actua display with Gorilla Glass Victus 2'
        ]
      },
      {
        id: 'google-pixel-9-128gb',
        category: 'phones',
        categoryLabel: 'Pixel Phones',
        name: 'Google Pixel 9 5G 12GB RAM | 128GB',
        price: 245000,
        originalPrice: 268000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/google-pixel-9-12gb-ram-128gb/01.jpg',
        variants: [
          { name: 'Peony Pink', image: '/store_export_android/images/google-pixel-9-12gb-ram-128gb/01.jpg' },
          { name: 'Back Profile', image: '/store_export_android/images/google-pixel-9-12gb-ram-128gb/02.jpg' }
        ],
        specs: [
          'Google Tensor G4 with 12GB RAM',
          '50 MP Main + 48 MP Ultra Wide with Macro Focus',
          'Add Me and Magic Editor photo manipulation tools',
          '6.3-inch Actua OLED (120Hz smooth display)',
          'All-day battery life with Extreme Battery Saver up to 100 hours'
        ]
      },
      {
        id: 'google-pixel-8-pro',
        category: 'phones',
        categoryLabel: 'Pixel Phones',
        name: 'Google Pixel 8 Pro 12GB | 128GB',
        price: 215000,
        originalPrice: 239000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/google-pixel-8-pro-12gb-ram-128gb/01.jpg',
        variants: [
          { name: 'Bay Blue', image: '/store_export_android/images/google-pixel-8-pro-12gb-ram-128gb/01.jpg' },
          { name: 'Camera Visor', image: '/store_export_android/images/google-pixel-8-pro-12gb-ram-128gb/02.jpg' }
        ],
        specs: [
          'Google Tensor G3 chip with Titan M2 security',
          '50 MP Main with dedicated object temperature sensor',
          'Best Take and Audio Magic Eraser features',
          '5050 mAh battery with wireless charging',
          '6.7-inch Super Actua OLED display'
        ]
      },
      {
        id: 'google-pixel-watch-3-cat',
        category: 'wearables',
        categoryLabel: 'Pixel Watch',
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
          '24-hour battery with fast charging'
        ]
      },
      {
        id: 'google-anker-maggo',
        category: 'power',
        categoryLabel: 'Fast Power',
        name: 'Anker MagGo Qi2 10000mAh Magnetic Power Bank',
        price: 24500,
        originalPrice: 28000,
        discountPercent: 12,
        availability: 'In Stock',
        mainImage: '/anker_maggo.jpg',
        variants: [{ name: 'Dark Titanium', image: '/anker_maggo.jpg' }],
        specs: [
          'Qi2 Certified 15W high-speed magnetic wireless charging',
          'Smart LCD screen displays exact power percentage and duration',
          'Built-in kickstand for upright bedside or desk viewing',
          '27W bi-directional USB-C fast wired port'
        ]
      }
    ]
  },

  oneplus: {
    title: 'Official OnePlus Lineup',
    subtitle: 'Never Settle. Ultra-fast performance, Hasselblad photography & 100W SuperVOOC.',
    accentColor: '#dc2626',
    categories: [
      { id: 'all', label: 'All OnePlus Gear', icon: '✨' },
      { id: 'flagships', label: 'Flagship Phones', icon: '📱' },
      { id: 'nord', label: 'Nord Series', icon: '⚡' },
      { id: 'audio-watch', label: 'Audio & Watch', icon: '🎧' },
      { id: 'power', label: 'SuperVOOC Chargers', icon: '🔋' }
    ],
    products: [
      {
        id: 'oneplus-13-5g',
        category: 'flagships',
        categoryLabel: 'Flagship Series',
        name: 'OnePlus 13 5G 16GB RAM | 512GB',
        price: 365000,
        originalPrice: 395000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/oneplus13.jpg',
        variants: [
          { name: 'Midnight Ocean Blue', image: '/oneplus13.jpg' },
          { name: 'Obsidian Black', image: '/store_export_android/images/oneplus-13-5g-16gb-ram-512gb/01.jpg' }
    ,

    ],
        specs: [
          'Snapdragon 8 Elite (3nm) Flagship Processor',
          '16 GB LPDDR5X RAM + 512 GB UFS 4.0 storage',
          '50 MP Sony LYT-808 Main + 50 MP Periscope Telephoto + 50 MP Ultra Wide',
          'Hasselblad Master Color science calibration',
          '6000 mAh Silicon-Carbon battery with 100W SuperVOOC & 50W Wireless',
          '6.82-inch 2K Oriental OLED with DisplayMate A++ rating'
        ]
      },

      // --- EXPANDED ONEPLUS OFFICIAL LINEUP ---
      {
        "id": "oneplus-13s-5g",
        "category": "flagships",
        "categoryLabel": "Flagship Series",
        "name": "OnePlus 13s 5G 12GB RAM | 512GB",
        "price": 285000,
        "originalPrice": 310000,
        "discountPercent": 8,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/oneplus-13s-5g-12gb-ram-512gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/oneplus-13s-5g-12gb-ram-512gb/01.jpg"
          }
        ],
        "specs": [
          "Snapdragon 8 Gen 3 gaming processor with 12GB LPDDR5X RAM",
          "50 MP Sony flagship sensor with Optical Image Stabilization",
          "5500 mAh battery with 100W SuperVOOC flash charging",
          "6.74-inch 1.5K 120Hz ProXDR AMOLED display"
        ]
      },

      {
        "id": "oneplus-nord-ce4-lite",
        "category": "nord",
        "categoryLabel": "Nord Series",
        "name": "OnePlus Nord CE4 Lite 5G 8GB | 256GB",
        "price": 89000,
        "originalPrice": 99000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/oneplus-nord-ce4-lite-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/oneplus-nord-ce4-lite-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "Qualcomm Snapdragon 695 5G chipset with 8GB RAM",
          "50 MP Sony LYT-600 camera with OIS",
          "5500 mAh huge battery with 80W SuperVOOC fast charging",
          "6.67-inch 120Hz AMOLED display (2100 nits peak brightness)"
        ]
      },

      {
        "id": "oneplus-cmf-buds-2-plus",
        "category": "audio-watch",
        "categoryLabel": "Audio & Watch",
        "name": "CMF by Nothing Buds 2 Plus Wireless Earbuds",
        "price": 18500,
        "originalPrice": 21500,
        "discountPercent": 13,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/cmf-by-nothing-buds-2-plus-wireless-earbuds/01.webp",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/cmf-by-nothing-buds-2-plus-wireless-earbuds/01.webp"
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
        id: 'oneplus-13r-5g',
        category: 'flagships',
        categoryLabel: 'Flagship Series',
        name: 'OnePlus 13R 5G 16GB RAM | 512GB',
        price: 245000,
        originalPrice: 268000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/oneplus-13r-16gb-ram-512gb/01.webp',
        variants: [{ name: 'Iron Gray', image: '/store_export_android/images/oneplus-13r-16gb-ram-512gb/01.webp' }],
        specs: [
          'Snapdragon 8 Gen 3 high-performance gaming platform',
          '16 GB RAM with Dual Cryo-velocity VC cooling system',
          '50 MP Sony IMX890 sensor with OIS',
          '6000 mAh Glacier battery with 100W SuperVOOC (0 to 100% in 26 mins)',
          '6.78-inch 1.5K 120Hz ProXDR display'
        ]
      },
      {
        id: 'oneplus-12',
        category: 'flagships',
        categoryLabel: 'Flagship Series',
        name: 'OnePlus 12 5G (256GB Flowy Emerald)',
        price: 275000,
        originalPrice: 299000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/oneplus12.jpg',
        variants: [{ name: 'Flowy Emerald', image: '/oneplus12.jpg' }],
        specs: [
          'Snapdragon 8 Gen 3 with 16GB RAM',
          '4th Gen Hasselblad Camera System for Mobile',
          '64 MP 3x periscope telephoto lens',
          '5400 mAh battery with 100W wired & 50W AIRVOOC wireless',
          '4500 nits peak brightness 2K 120Hz ProXDR display'
        ]
      },
      {
        id: 'oneplus-nord-ce5',
        category: 'nord',
        categoryLabel: 'Nord Series',
        name: 'OnePlus Nord CE5 5G 8GB | 256GB',
        price: 119000,
        originalPrice: 132000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/oneplus-nord-ce5-5g-8gb-ram-256gb/01.jpg',
        variants: [{ name: 'Silver Ray', image: '/store_export_android/images/oneplus-nord-ce5-5g-8gb-ram-256gb/01.jpg' }],
        specs: [
          'Snapdragon 5G processor with 8GB RAM',
          '50 MP Sony LYT-600 OIS camera sensor',
          '5500 mAh battery with 80W SuperVOOC fast charging',
          'Dual stereo speakers with 300% Ultra Volume Mode',
          '6.7-inch 120Hz AMOLED display with Aqua Touch'
        ]
      },
      {
        id: 'oneplus-cmf-watch',
        category: 'audio-watch',
        categoryLabel: 'Audio & Watch',
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
        id: 'oneplus-cmf-buds-cat',
        category: 'audio-watch',
        categoryLabel: 'Audio & Watch',
        name: 'CMF by Nothing Buds Pro 2 with Smart Dial',
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
          'Customizable smart dial on charging case for instant volume and ANC control',
          '50 dB Hybrid Active Noise Cancellation',
          'Dual drivers: 11mm bass driver + 6mm micro-planar tweeter',
          'Hi-Res Wireless certified with LDAC audio codec'
        ]
      }
    ]
  },

  xiaomi: {
    title: 'Official Xiaomi Lineup',
    subtitle: 'Innovation for Everyone. Flagship Leica optics, HyperOS & Smart Living.',
    accentColor: '#f97316',
    categories: [
      { id: 'all', label: 'All Xiaomi & Redmi', icon: '✨' },
      { id: 'flagships', label: 'Flagship Xiaomi', icon: '📱' },
      { id: 'redmi', label: 'Redmi Series', icon: '⚡' },
      { id: 'tv-audio', label: 'TV & Audio', icon: '📺' },
      { id: 'wearables', label: 'Fitness Bands', icon: '⌚' }
    ],
    products: [
      {
        id: 'xiaomi-15-ultra',
        category: 'flagships',
        categoryLabel: 'Leica Flagship',
        name: 'Xiaomi 15 Ultra 5G (512GB Leica Kit)',
        price: 435000,
        originalPrice: 475000,
        discountPercent: 8,
        availability: 'Available on backorder',
        mainImage: '/xiaomi15ultra.jpg',
        variants: [
          { name: 'Ceramic Black', image: '/xiaomi15ultra.jpg' },
          { name: 'Titanium White', image: '/xiaomi14ultra.jpg' }
    ,

    ],
        specs: [
          'Snapdragon 8 Elite (3nm) Flagship CPU',
          '16 GB LPDDR5X RAM + 512 GB UFS 4.0 storage',
          'Quad 50 MP Leica Summilux lens with 1-inch variable aperture sensor',
          '200 MP Periscope Telephoto with 10x optical zoom',
          '6000 mAh Silicon-Carbon battery with 90W HyperCharge & 80W Wireless',
          '6.73-inch 2K LTPO OLED with 3200 nits brightness and Xiaomi HyperOS 2.0'
        ]
      },

      // --- EXPANDED XIAOMI OFFICIAL LINEUP ---
      {
        "id": "xiaomi-redmi-14c",
        "category": "redmi",
        "categoryLabel": "Redmi Series",
        "name": "Xiaomi Redmi 14C 8GB RAM | 256GB",
        "price": 49500,
        "originalPrice": 56000,
        "discountPercent": 11,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/xiaomi-redmi-14c-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/xiaomi-redmi-14c-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "MediaTek Helio G81-Ultra processor with up to 16GB RAM with memory extension",
          "50 MP AI dual camera with filmCamera filters",
          "6.88-inch massive 120Hz immersive eye-comfort display",
          "5160 mAh battery with 18W fast charging"
        ]
      },

      {
        "id": "xiaomi-redmi-13",
        "category": "redmi",
        "categoryLabel": "Redmi Series",
        "name": "Xiaomi Redmi 13 4G 8GB RAM | 256GB",
        "price": 58000,
        "originalPrice": 65000,
        "discountPercent": 10,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/xiaomi-redmi-13-4g-8gb-ram-256gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/xiaomi-redmi-13-4g-8gb-ram-256gb/01.jpg"
          }
        ],
        "specs": [
          "108 MP super-clear main camera with 3x in-sensor lossless zoom",
          "MediaTek Helio G91-Ultra high-performance processor",
          "Sleek glass back design with IP53 splash resistance",
          "5030 mAh battery with 33W fast charging"
        ]
      },

      {
        "id": "xiaomi-redmi-a5",
        "category": "redmi",
        "categoryLabel": "Redmi Series",
        "name": "Xiaomi Redmi A5 4G 3GB RAM | 64GB",
        "price": 32500,
        "originalPrice": 36500,
        "discountPercent": 11,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/xiaomi-redmi-a5-4g-3gb-ram-64gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/xiaomi-redmi-a5-4g-3gb-ram-64gb/01.jpg"
          }
        ],
        "specs": [
          "Octa-core reliable processor with Android Go edition",
          "32 MP clear AI camera with HDR mode",
          "5000 mAh battery for up to 3 days standby",
          "6.52-inch Dot Drop display"
        ]
      },

      {
        "id": "xiaomi-redmi-a3",
        "category": "redmi",
        "categoryLabel": "Redmi Series",
        "name": "Xiaomi Redmi A3 3GB RAM | 64GB",
        "price": 29500,
        "originalPrice": 34000,
        "discountPercent": 13,
        "availability": "In Stock",
        "mainImage": "/store_export_android/images/xiaomi-redmi-a3-3gb-ram-64gb/01.jpg",
        "variants": [
          {
            "name": "Standard",
            "image": "/store_export_android/images/xiaomi-redmi-a3-3gb-ram-64gb/01.jpg"
          }
        ],
        "specs": [
          "Premium circular camera deco design with leather texture",
          "6.71-inch 90Hz smooth eye-protection screen",
          "5000 mAh battery with USB-C connector",
          "Side-mounted fingerprint sensor"
        ]
      },
      {
        id: 'xiaomi-14-ultra',
        category: 'flagships',
        categoryLabel: 'Leica Flagship',
        name: 'Xiaomi 14 Ultra 5G 16GB | 512GB Leica',
        price: 385000,
        originalPrice: 419000,
        discountPercent: 8,
        availability: 'In Stock',
        mainImage: '/xiaomi14ultra.jpg',
        variants: [{ name: 'Vegan Leather White', image: '/xiaomi14ultra.jpg' }],
        specs: [
          'Snapdragon 8 Gen 3 with 16GB RAM',
          'Leica Quad Camera with 1-inch Sony LYT-900 sensor and stepless aperture',
          'Dual Telephoto lenses (75mm floating + 120mm periscope)',
          '5000 mAh battery with 90W HyperCharge',
          'Xiaomi Shield Glass with IP68 water resistance'
        ]
      },
      {
        id: 'xiaomi-redmi-note-14-pro-plus',
        category: 'redmi',
        categoryLabel: 'Redmi Series',
        name: 'Xiaomi Redmi Note 14 Pro+ 5G 12GB | 512GB',
        price: 168000,
        originalPrice: 185000,
        discountPercent: 9,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/xiaomi-redmi-note-14-pro-plus-5g-12gb-ram-512gb/01.jpg',
        variants: [{ name: 'Titanium Gray', image: '/store_export_android/images/xiaomi-redmi-note-14-pro-plus-5g-12gb-ram-512gb/01.jpg' }],
        specs: [
          'Snapdragon 7s Gen 3 with 12GB RAM',
          '50 MP Light Hunter 800 flagship sensor with OIS',
          '6200 mAh Silicon-Carbon huge battery with 90W fast charging',
          'IP68/IP69K extreme dust & pressurized water resistance',
          '6.67-inch 1.5K 120Hz curved AMOLED display'
        ]
      },
      {
        id: 'xiaomi-redmi-note-14',
        category: 'redmi',
        categoryLabel: 'Redmi Series',
        name: 'Xiaomi Redmi Note 14 5G 8GB | 256GB',
        price: 98000,
        originalPrice: 110000,
        discountPercent: 10,
        availability: 'In Stock',
        mainImage: '/store_export_android/images/xiaomi-redmi-note-14-8gb-ram-256gb/01.jpg',
        variants: [{ name: 'Phantom Blue', image: '/store_export_android/images/xiaomi-redmi-note-14-8gb-ram-256gb/01.jpg' }],
        specs: [
          'MediaTek Dimensity 7025-Ultra 5G processor',
          '50 MP Sony LYT-600 OIS main camera',
          '5110 mAh battery with 45W fast charging',
          '6.67-inch 120Hz eye-protection OLED screen',
          'Stereo dual speakers with Hi-Res Audio certification'
        ]
      },
      {
        id: 'xiaomi-tv-box-cat',
        category: 'tv-audio',
        categoryLabel: 'TV & Audio',
        name: 'Xiaomi Mi TV Box S (3rd Gen) 4K Ultra HD Google TV',
        price: 19500,
        originalPrice: 22500,
        discountPercent: 13,
        availability: 'In Stock',
        mainImage: '/ACCESORIES/images/xiaomi-mi-tv-box-s-3rd-gen/01.webp',
        variants: [{ name: 'Black', image: '/ACCESORIES/images/xiaomi-mi-tv-box-s-3rd-gen/01.webp' }],
        specs: [
          '4K UHD resolution with Dolby Vision & HDR10+ support',
          'Dolby Atmos and DTS:X cinema spatial audio',
          'Google TV with Chromecast built-in and voice assistant',
          'Quad-core 64-bit CPU with 2GB RAM + 32GB storage',
          'Wi-Fi 6 for buffer-free 4K streaming'
        ]
      },
      {
        id: 'xiaomi-party-speaker-cat',
        category: 'tv-audio',
        categoryLabel: 'TV & Audio',
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
          'Dynamic RGB ambient light ring synchronized to music beats',
          'Dual passive radiators delivering room-thumping bass',
          'IP67 waterproof and dustproof for beach and pool parties',
          'Up to 12 hours playback with built-in power bank output'
        ]
      },
      {
        id: 'xiaomi-huawei-band-cat',
        category: 'wearables',
        categoryLabel: 'Fitness Bands',
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
          '1.64-inch borderless HD AMOLED display',
          'Standalone GNSS satellite positioning for accurate run tracking',
          'TruSeen 5.5+ heart rate & blood oxygen monitoring',
          'Up to 14 days ultra-long battery life'
        ]
      }
    ]
  }
};
