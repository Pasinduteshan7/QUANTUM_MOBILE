import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/mockData';
import { Sparkles, ArrowRight, Wrench, Truck, CreditCard, ShieldCheck, Star, MessageSquare, Smartphone, Battery, Droplets, Zap, ChevronRight } from 'lucide-react';
const slides = [
    {
        image: '/hero1.jpg',
        badge: 'NEW ARRIVAL 2024',
        title: 'Next-Gen Smartphones',
        titleHighlight: 'Are Here.',
        subtitle: 'Experience the iPhone 16 Pro, Galaxy S24 Ultra and Pixel 9 Pro. Direct imports, genuine warranty, islandwide delivery.',
        cta: 'Shop Smartphones',
        ctaLink: '/phones'
    },
    {
        image: '/hero2.jpg',
        badge: 'CERTIFIED REPAIR LAB',
        title: 'Expert Phone Repair',
        titleHighlight: 'You Can Trust.',
        subtitle: 'Cracked screen or drained battery? Certified technicians fix all major brands. Book a walk-in 30-min slot or mail-in courier pickup.',
        cta: 'Book Repair Slot',
        ctaLink: '/repairs/book'
    },
];
const brands = [
    'Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Spigen', 'Belkin',
    'Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Spigen', 'Belkin'
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
    const featuredPhones = products.filter(p => p.category === 'Phones').slice(0, 4);
    const featuredAccessories = products.filter(p => p.category !== 'Phones').slice(0, 4);
    return (<>
      {/* HERO SECTION */}
      <section className="hero-section">
        {slides.map((s, i) => (<div key={i} className={`hero-slide${slide === i ? ' active' : ''}`} style={{ backgroundImage: `url('${s.image}')` }}>
            <div className="hero-overlay"/>
          </div>))}

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14}/>
            <span>{slides[slide].badge}</span>
          </div>

          <h1 className="hero-title">
            {slides[slide].title}<br />
            <span>{slides[slide].titleHighlight}</span>
          </h1>

          <p className="hero-subtitle">
            {slides[slide].subtitle}
          </p>

          <div className="hero-buttons">
            <Link to={slides[slide].ctaLink} className="btn-primary">
              <span>{slides[slide].cta}</span>
              <ArrowRight size={16}/>
            </Link>
            <Link to="/repairs/book" className="btn-outline">
              <Wrench size={16}/>
              <span>Book Repair</span>
            </Link>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((_, i) => (<button key={i} className={`hero-dot${slide === i ? ' active' : ''}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}/>))}
        </div>
      </section>

      {/* BRAND TICKER MARQUEE */}
      <section className="brand-ticker">
        <div className="brand-track">
          {brands.map((b, idx) => (<div key={idx} className="brand-pill">
              {b}
            </div>))}
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
            <Link to="/phones" className="btn-outline">
              <span>Browse All Smartphones</span>
              <ChevronRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US (TRUST & NFR FEATURES) */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
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

      {/* TRENDING ACCESSORIES */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
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
