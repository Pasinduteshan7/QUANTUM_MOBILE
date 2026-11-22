import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import BrandLogo from '@/components/BrandLogo';
import { products } from '@/lib/mockData';
import { Sparkles, ArrowRight, Wrench, Truck, CreditCard, ShieldCheck, Star, MessageSquare, Smartphone, Battery, Droplets, Zap, ChevronRight, Headphones } from 'lucide-react';
const slides = [
    {
        brand: 'Apple',
        image: '/hero_iphone18.jpg',
        video: encodeURI('/hero banner/iphone 18.mp4'),
        badge: 'APPLE KEYNOTE 2026 • DIALOG 5G',
        title: 'iPhone 18 Pro',
        titleHighlight: 'Forged in Burgundy.',
        subtitle: 'Featuring mechanical Variable Aperture, 8x Optical-Quality Zoom, and Ceramic Shield 2 unibody with Apple Intelligence.',
        cta: 'Explore iPhone 18 Pro',
        ctaLink: '/ecosystem/apple',
        accentColor: '#831843'
    },
    {
        brand: 'Samsung',
        image: '/hero_galaxy_s26.jpg',
        video: encodeURI('/hero banner/s26.mp4'),
        badge: 'SAMSUNG UNPACKED 2026',
        title: 'Galaxy S26 Ultra',
        titleHighlight: 'Ultra-Thin 7.9mm Armor.',
        subtitle: 'Ergonomic rounded corners in Armor Aluminum 2 with built-in Hardware Privacy Display, 200MP camera & S-Pen.',
        cta: 'Explore S26 Ultra',
        ctaLink: '/ecosystem/samsung',
        accentColor: '#2563eb'
    },
    {
        brand: 'Google',
        image: '/hero_pixel11.png',
        video: encodeURI('/hero banner/pixel11.mp4'),
        badge: 'GOOGLE DEEPMIND 2026',
        title: 'Google Pixel 11 Pro',
        titleHighlight: 'Gemini Intelligence.',
        subtitle: 'All-new sculpted horizontal camera visor in Rose Gold, powered by custom TSMC 3nm Tensor silicon.',
        cta: 'Explore Pixel 11 Pro',
        ctaLink: '/ecosystem/google',
        accentColor: '#059669'
    },
    {
        brand: 'OnePlus',
        image: '/hero_oneplus16.webp',
        video: encodeURI('/hero banner/oneplus.mp4'),
        badge: 'ONEPLUS EXTREME SPEED',
        title: 'OnePlus 16 Series',
        titleHighlight: 'Never Settle.',
        subtitle: 'Snapdragon 8 Elite computing with Swiss chronometer watch fluting and glowing numeric typography.',
        cta: 'Explore OnePlus 16',
        ctaLink: '/ecosystem/oneplus',
        accentColor: '#dc2626'
    },
    {
        brand: 'Xiaomi',
        image: '/hero_xiaomi.jpg',
        video: encodeURI('/hero banner/xiaomi11.mp4'),
        badge: 'LEICA OPTICAL MASTERPIECE',
        title: 'Xiaomi Leica Flagship',
        titleHighlight: 'Interactive Dual Display.',
        subtitle: 'Interactive rear preview display with 1-inch Sony sensor and stepped knurled jewelry-grade gold ring.',
        cta: 'Explore Xiaomi Leica',
        ctaLink: '/ecosystem/xiaomi',
        accentColor: '#ea580c'
    }
];
const brands = [
    'Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Spigen', 'Belkin',
    'Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Spigen', 'Belkin',
    'Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Spigen', 'Belkin'
];

const brandLinks = {
  'Apple': '/ecosystem/apple',
  'Samsung': '/ecosystem/samsung',
  'Google Pixel': '/ecosystem/google',
  'OnePlus': '/ecosystem/oneplus',
  'Xiaomi': '/ecosystem/xiaomi',
  'Realme': '/ecosystem/xiaomi',
  'Anker': '/accessories',
  'Spigen': '/accessories',
  'Belkin': '/accessories'
};

const brandEcosystems = [
  {
    id: 'apple',
    name: 'Apple Universe',
    tagline: 'Titanium & A18 Pro Power',
    highlight: 'iPhone 18 Pro Burgundy, AirPods Pro 2, MagSafe ecosystem',
    image: '/hero_iphone18.jpg',
    color: '#831843',
    badge: 'FLAGSHIP ECOSYSTEM'
  },
  {
    id: 'samsung',
    name: 'Samsung Galaxy',
    tagline: 'Ultra-thin 7.9mm & Galaxy AI',
    highlight: 'Galaxy S26 Ultra, S-Pen, Galaxy Buds3 Pro, 45W Charging',
    image: '/hero_galaxy_s26.jpg',
    color: '#2563eb',
    badge: 'AI REVOLUTION'
  },
  {
    id: 'google',
    name: 'Google Pixel',
    tagline: 'Gemini AI & Pure Android',
    highlight: 'Pixel 11 Pro, TSMC 3nm Tensor, 7 Years OS Updates',
    image: '/hero_pixel11.png',
    color: '#059669',
    badge: 'PURE ANDROID'
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    tagline: '100W Fast & Extreme Speed',
    highlight: 'OnePlus 16 Series, Swiss Watch Fluting, SuperVOOC',
    image: '/hero_oneplus16.webp',
    color: '#dc2626',
    badge: 'SUPER SPEED'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi',
    tagline: 'Leica Optics & Dual-Display',
    highlight: 'Xiaomi Dual-Display Flagship, 1-inch sensor, HyperCharge',
    image: '/hero_xiaomi.jpg',
    color: '#ea580c',
    badge: 'LEICA OPTICS'
  }
];
const features = [
    { icon: Truck, title: 'Islandwide Delivery', desc: 'Fast, secure courier delivery across Sri Lanka within 1-3 business days.' },
    { icon: CreditCard, title: 'PayHere & COD', desc: 'Pay online securely in LKR with cards or mobile wallets, or choose Cash on Delivery.' },
    { icon: Wrench, title: 'Certified Technicians', desc: 'Board-level repair specialists for Apple, Samsung, Google & all major brands.' },
    { icon: ShieldCheck, title: 'Genuine Warranty', desc: '100% authentic devices and OEM Grade A+ parts with official warranty certificates.' },
    { icon: Star, title: 'Verified Reviews Only', desc: 'Reviews enabled exclusively for customers with delivered orders (NFR8 Integrity).' },
    { icon: MessageSquare, title: 'Live Consultation', desc: 'Chat with our store technicians in real time before buying for instant compatibility checks.' },
];
const repairServices = [
    { icon: Smartphone, title: 'Screen & OLED Repair', desc: 'Cracked glass, black screen or unresponsive digitizer replaced same-day.', price: 'From LKR 8,500' },
    { icon: Battery, title: 'Battery Replacement', desc: 'Restore full day capacity with genuine OEM-grade cells and thermal testing.', price: 'From LKR 5,000' },
    { icon: Droplets, title: 'Water Damage Diagnostic', desc: 'Ultrasonic PCB bath, micro-soldering and corrosion recovery.', price: 'From LKR 12,000' },
    { icon: Zap, title: 'Charging Port & Audio', desc: 'Fix loose ports, slow charging or intermittent microphone connection.', price: 'From LKR 4,500' },
];
export default function Home() {
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 6000);
        return () => clearInterval(t);
    }, []);

    const [liveProducts, setLiveProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products?limit=50')
            .then(r => r.json())
            .then(d => {
                const list = d.data?.products || d.data || [];
                if (Array.isArray(list) && list.length > 0) {
                    setLiveProducts(list);
                }
            })
            .catch(() => {});
    }, []);

    const allProducts = (liveProducts.length > 0 ? [...liveProducts, ...products] : products)
        .slice()
        .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    const featuredPhones = allProducts.filter(p => p.category === 'Phones').slice(0, 4);
    const featuredAccessories = allProducts.filter(p => p.category !== 'Phones').slice(0, 4);

    return (<>
      {/* HERO SECTION (Dynamic Carousel for Flagship Launches) */}
      <section className="hero-section">
        {slides.map((s, i) => (
          <div 
            key={i} 
            className={`hero-slide${slide === i ? ' active' : ''}`} 
            style={{ backgroundImage: `url('${s.image}')` }}
          >
            <div className="hero-overlay"/>
          </div>
        ))}

        <div className="hero-content">
          <div className="hero-badge" style={{
            background: `${slides[slide].accentColor || '#38bdf8'}25`,
            border: `1px solid ${slides[slide].accentColor || '#38bdf8'}60`,
            color: '#ffffff'
          }}>
            <Sparkles size={14}/>
            <span>{slides[slide].badge}</span>
          </div>

          <h1 className="hero-title">
            {slides[slide].title}<br />
            <span 
              className="hero-title-gradient"
              style={{
                backgroundImage: `linear-gradient(90deg, #ffffff 0%, ${slides[slide].accentColor || '#38bdf8'} 60%, #ffffff 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              {slides[slide].titleHighlight}
            </span>
          </h1>

          <p className="hero-subtitle">
            {slides[slide].subtitle}
          </p>

          <div className="hero-buttons">
            <Link 
              to={slides[slide].ctaLink} 
              className="btn-primary"
              style={{ background: slides[slide].accentColor }}
            >
              <span>{slides[slide].cta}</span>
              <ArrowRight size={16}/>
            </Link>
            <Link to="/repairs/book" className="btn-outline">
              <Wrench size={16}/>
              <span>Book Certified Repair</span>
            </Link>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((_, i) => (
            <button 
              key={i} 
              className={`hero-dot${slide === i ? ' active' : ''}`} 
              onClick={() => setSlide(i)} 
              aria-label={`Slide ${i + 1}`}
              style={{ background: slide === i ? slides[slide].accentColor : undefined }}
            />
          ))}
        </div>
      </section>

      {/* BRAND TICKER MARQUEE */}
      <section className="brand-ticker" aria-label="Brand Ecosystems & Manufacturers Ticker">
        <div className="brand-track">
          {brands.map((b, idx) => (
            <Link
              key={idx}
              to={brandLinks[b] || '/ecosystem/apple'}
              className="brand-pill"
              title={`Explore ${b}`}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '4px 6px',
                transition: 'transform 0.2s ease, filter 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.12)';
                e.currentTarget.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <BrandLogo brand={b} size={24} />
            </Link>
          ))}
        </div>
      </section>

      {/* BRAND ECOSYSTEMS SHOWCASE */}
      <section className="section" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', paddingTop: 48, paddingBottom: 56 }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 36 }}>
            <div className="section-badge">
              <Sparkles size={13}/>
              <span>Dedicated Brand Universes</span>
            </div>
            <h2 className="section-title">Explore by <span>Brand Ecosystem</span></h2>
            <p className="section-subtitle">
              Every flagship device paired with its perfect audio, charging, and protective gear.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20
          }}>
            {brandEcosystems.map((eco) => (
              <Link
                key={eco.id}
                to={`/ecosystem/${eco.id}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '24px 20px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = eco.color;
                  e.currentTarget.style.boxShadow = `0 14px 30px ${eco.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 800,
                    color: eco.color,
                    background: `${eco.color}12`,
                    padding: '3px 8px',
                    borderRadius: 6,
                    letterSpacing: 0.5,
                    marginBottom: 12
                  }}>
                    {eco.badge}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>
                    {eco.name}
                  </h3>
                  <div style={{ fontSize: 13, fontWeight: 700, color: eco.color, marginBottom: 8 }}>
                    {eco.tagline}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.4 }}>
                    {eco.highlight}
                  </p>
                </div>

                <div>
                  <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 16px' }}>
                    <img 
                      src={eco.image} 
                      alt={eco.name} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    fontWeight: 800,
                    color: eco.color,
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 12
                  }}>
                    <span>Explore Universe</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SMARTPHONES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Smartphone size={13}/>
              <span>Flagship Devices</span>
            </div>
            <h2 className="section-title">Latest <span>Smartphones</span></h2>
            <p className="section-subtitle">
              Brand new, factory sealed, TRCSL approved smartphones with official manufacturer warranty.
            </p>
          </div>

          <div className="product-grid">
            {featuredPhones.map(product => (<ProductCard key={product.id} product={product}/>))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/ecosystem/apple" className="btn-outline">
              <span>Explore Brand Ecosystems</span>
              <ChevronRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL LIFESTYLE 1: STUDIO ACOUSTICS & AUDIO */}
      <section style={{ padding: '16px 0 32px' }}>
        <div className="container">
          <div
            style={{
              borderRadius: 28,
              background: 'linear-gradient(135deg, #090d16 0%, #17172b 55%, #0d111c 100%)',
              padding: '48px 44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 36,
              flexWrap: 'wrap',
              color: '#ffffff',
              boxShadow: '0 20px 48px rgba(15, 23, 42, 0.22)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Ambient Burgundy Bloom */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                right: '5%',
                width: 480,
                height: 480,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(131, 24, 67, 0.38) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ flex: '1 1 360px', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#fb7185',
                  background: 'rgba(244, 63, 94, 0.15)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  marginBottom: 16
                }}
              >
                <Headphones size={13} />
                <span>Acoustic Engineering</span>
              </div>

              <h3
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: '0 0 14px',
                  fontFamily: 'Outfit, sans-serif',
                  lineHeight: 1.15
                }}
              >
                Studio Acoustics.<br />Pure Spatial Silence.
              </h3>

              <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 480 }}>
                Immerse yourself in lossless drivers, ultra-low latency DACs, and precision active noise cancellation engineered for iPhone, Galaxy & Pixel.
              </p>

              <div>
                <Link
                  to="/accessories?category=audio"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 14,
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: 13,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <span>Explore Wireless Audio</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div style={{ flex: '0 1 380px', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
              <img
                src="/accessories.jpg"
                alt="Studio Audio Gear"
                style={{
                  maxHeight: 260,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.55))'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US (TRUST & NFR FEATURES) */}
      <section className="section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <ShieldCheck size={13}/>
              <span>Enterprise Reliability</span>
            </div>
            <h2 className="section-title">Built For <span>Trust & Speed</span></h2>
            <p className="section-subtitle">
              Sri Lanka&apos;s first unified platform combining retail shopping with real-time consultation and device repair reservations.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feat, i) => {
            const Icon = feat.icon;
            return (<div key={i} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Icon size={22} color="#0284c7"/>
                  </div>
                  <div className="feature-title">{feat.title}</div>
                  <div className="feature-desc">{feat.desc}</div>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* REPAIR SERVICES TIERS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Wrench size={13}/>
              <span>Colombo 03 Workshop</span>
            </div>
            <h2 className="section-title">Professional <span>Device Repairs</span></h2>
            <p className="section-subtitle">
              Book a walk-in 30-minute appointment or request an islandwide courier mail-in pickup with a system-generated waybill.
            </p>
          </div>

          <div className="services-grid">
            {repairServices.map((srv, i) => {
            const Icon = srv.icon;
            return (<div key={i} className="service-card">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={22} color="#10b981"/>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{srv.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{srv.desc}</div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>{srv.price}</span>
                    <Link to="/repairs/book" style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Book <ChevronRight size={14}/>
                    </Link>
                  </div>
                </div>);
        })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/repairs" className="btn-primary">
              <span>View Repair Hub & Pricing</span>
              <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL LIFESTYLE 2: WORKSPACE & GAN CHARGING */}
      <section style={{ padding: '16px 0 32px' }}>
        <div className="container">
          <div
            style={{
              borderRadius: 28,
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0fdf4 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              padding: '48px 44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 36,
              flexWrap: 'wrap',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Cyan Mesh Bloom */}
            <div
              style={{
                position: 'absolute',
                top: '-25%',
                left: '25%',
                width: 440,
                height: 440,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ flex: '1 1 360px', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#0284c7',
                  background: 'rgba(2, 132, 199, 0.1)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  marginBottom: 16
                }}
              >
                <Zap size={13} color="#0284c7" />
                <span>GaNPrime & Qi2 Wireless</span>
              </div>

              <h3
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#1d1d1f',
                  margin: '0 0 14px',
                  fontFamily: 'Outfit, sans-serif',
                  lineHeight: 1.15
                }}
              >
                All-Day Power.<br />Zero Desk Clutter.
              </h3>

              <p style={{ fontSize: 15, color: '#424245', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 480 }}>
                Supercharge your iPhone, MacBook, and Galaxy simultaneously with pocket-sized 65W GaN adapters, 15W Qi2 magnetic stands, and armored cables.
              </p>

              <div>
                <Link
                  to="/accessories?category=power"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 14,
                    background: '#0071e3',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 113, 227, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <span>Explore Fast Chargers</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div style={{ flex: '0 1 340px', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
              <img
                src="/hero_iphone18.jpg"
                alt="GaN Fast Charging Gear"
                style={{
                  maxHeight: 240,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 18,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING ACCESSORIES */}
      <section className="section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Zap size={13}/>
              <span>Fast Charging & Protection</span>
            </div>
            <h2 className="section-title">Trending <span>Accessories</span></h2>
            <p className="section-subtitle">
              GaN fast chargers, magnetic cases, tempered protectors and high-fidelity audio with guaranteed compatibility.
            </p>
          </div>

          <div className="product-grid">
            {featuredAccessories.map(product => (<ProductCard key={product.id} product={product}/>))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/accessories" className="btn-outline">
              <span>Explore All Accessories</span>
              <ChevronRight size={16}/>
            </Link>
          </div>
        </div>
      </section>
    </>);
}
