import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { 
  Smartphone, Headphones, ShieldCheck, Zap, 
  Wrench, ArrowRight, Sparkles, CheckCircle2, 
  ShoppingBag, Award, Play, X, ChevronRight, 
  CreditCard, RefreshCw, Watch, BatteryCharging,
  Eye, Layers, Info, Volume2, VolumeX, RotateCcw, ZoomIn
} from 'lucide-react';

import { ECOSYSTEM_DATA } from '../data/ecosystemData';
import AppleMallSection from '../components/AppleMallSection';
import EcosystemBrandCatalog from '../components/EcosystemBrandCatalog';
import { ecosystemService } from '@/services/ecosystemService';
import { productService } from '@/services/productService';

const formatMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : encodeURI(decodeURI(url));
};

export default function EcosystemPage() {
  const { brand } = useParams();
  const { addToCart } = useCart();

  const brandKey = (brand || 'apple').toLowerCase();
  const [config, setConfig] = useState(ECOSYSTEM_DATA[brandKey] || ECOSYSTEM_DATA.apple);

  useEffect(() => {
    // 1. Initial fallback to local data
    const localData = ECOSYSTEM_DATA[brandKey] || ECOSYSTEM_DATA.apple;
    setConfig(localData);

    // 2. Fetch live data from MongoDB for dynamic or edited ecosystems
    ecosystemService.getEcosystemBySlug(brandKey)
      .then(res => {
        if (res?.data) {
          setConfig(prev => ({
            ...prev,
            ...res.data,
            heroVideo: res.data.heroVideo || prev.heroVideo,
            heroImage: res.data.heroImage || prev.heroImage,
            flagship: {
              ...(prev.flagship || {}),
              ...(res.data.flagship || {})
            },
            bundle: {
              ...(prev.bundle || {}),
              ...(res.data.bundle || {})
            }
          }));
        }
      })
      .catch(() => {});

    // 3. Fetch live products from MongoDB to dynamically sync flagship colors, stock, and prices with catalog
    productService.getProducts({ brand: brandKey })
      .then(res => {
        const prodList = res?.products || res?.data?.products || [];
        if (prodList.length > 0) {
          const currentFlagshipName = (config.flagship?.name || '').toLowerCase();
          const phonesOnly = prodList.filter(p => (p.category || '').toLowerCase() === 'phones');
          const candidates = phonesOnly.length > 0 ? phonesOnly : prodList;

          const matchedProd = candidates.find(p => {
            const pName = (p.name || '').toLowerCase();
            return pName.includes(currentFlagshipName) || currentFlagshipName.includes(pName);
          }) || candidates.sort((a, b) => (b.price || 0) - (a.price || 0))[0];

          if (matchedProd && matchedProd.finishes && matchedProd.finishes.length > 0) {
            setConfig(prev => ({
              ...prev,
              flagship: {
                ...(prev.flagship || {}),
                id: matchedProd._id || matchedProd.id,
                name: matchedProd.name,
                price: matchedProd.price,
                originalPrice: matchedProd.originalPrice,
                finishes: matchedProd.finishes,
                stock: matchedProd.stock,
                highlights: matchedProd.highlights || []
              }
            }));
          }
        }
      })
      .catch(() => {});
  }, [brandKey]);

  // The pinnacle flagship phone of this ecosystem
  const flagship = config.flagship || config.catalogByCategory?.phones?.[0] || config.catalogByCategory?.iphone?.[0] || {};

  // Selected Color Finish for the Flagship Phone
  const [selectedFinishIdx, setSelectedFinishIdx] = useState(0);
  const activeFinish = flagship.finishes?.[selectedFinishIdx] || flagship.finishes?.[0] || { name: 'Standard', image: config.heroImage, hex: config.accentColor };

  // Video Film Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleAddToCart = (item, customName) => {
    addToCart({
      id: item.id || `item-${Date.now()}`,
      productId: item.id || `item-${Date.now()}`,
      itemCode: item.id || `item-${Date.now()}`,
      name: customName || item.name,
      price: item.price,
      unitPrice: item.price,
      quantity: 1,
      image: activeFinish.image || item.image || config.heroImage,
      finishName: activeFinish.name
    });
    toast.success(`Added ${customName || item.name} (${activeFinish.name}) to cart!`, { icon: '🛍️' });
  };

  const handleAddBundleToCart = () => {
    addToCart({
      id: config.bundle.id,
      productId: config.bundle.id,
      itemCode: config.bundle.id,
      name: config.bundle.name,
      price: config.bundle.price,
      unitPrice: config.bundle.price,
      quantity: 1,
      image: config.bundle.image
    });
    toast.success(`Added ${config.bundle.name} to cart with LKR ${config.bundle.savings.toLocaleString()} savings!`);
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Grand Hero Video States: Macro Zoom & Audio & Replay
  const [isHeroVideoZooming, setIsHeroVideoZooming] = useState(true);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState(true);
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const heroCinemaVideoRef = useRef(null);

  // Reset finish index and play video once on navigating to ecosystem page
  useEffect(() => {
    setSelectedFinishIdx(0);
    setIsHeroVideoZooming(true);
    setIsVideoFinished(false);
    setHeroVideoProgress(0);
    if (heroCinemaVideoRef.current) {
      heroCinemaVideoRef.current.currentTime = 0;
      heroCinemaVideoRef.current.play().catch(() => {});
    }
  }, [brandKey]);

  const handleReplayHeroVideo = () => {
    if (heroCinemaVideoRef.current) {
      heroCinemaVideoRef.current.currentTime = 0;
      setIsHeroVideoZooming(false);
      setTimeout(() => {
        setIsHeroVideoZooming(true);
        setIsVideoFinished(false);
        heroCinemaVideoRef.current.play().catch(() => {});
      }, 60);
    }
  };

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: 80, color: '#1d1d1f' }}>
      
      {/* CINEMATIC FLAGSHIP ECOSYSTEM HERO BANNER (Exact Match to User Reference Screenshot) */}
      <section 
        className="hero-section" 
        style={{ 
          position: 'relative',
          minHeight: 'clamp(580px, 72vh, 760px)', 
          height: 'clamp(580px, 72vh, 760px)', 
          overflow: 'hidden', 
          background: '#020617',
          display: 'flex',
          alignItems: 'center',
          padding: '60px 0 40px'
        }}
      >
        {/* Full-Bleed Background Video Stage with Macro Dolly Camera Zoom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1
        }}>
          <video
            ref={heroCinemaVideoRef}
            key={`${brandKey}-${config.heroVideo}`}
            src={formatMediaUrl(config.heroVideo)}
            poster={formatMediaUrl(config.heroImage)}
            autoPlay
            muted
            playsInline
            loop={false}
            className="hero-full-banner-video zooming"
            onEnded={(e) => e.target.pause()}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center right',
              transformOrigin: '75% 50%',
              filter: 'brightness(1.18) contrast(1.06)',
              animation: 'heroMacroDollyZoom 14s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          />
        </div>

        {/* Ambient Brand Accent Light Glow */}
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '18%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: config.accentColor,
          opacity: 0.38,
          filter: 'blur(110px)',
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {/* Cinematic Gradient Vignette & Content Protection Mask */}
        <div 
          className="hero-overlay" 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            background: 'linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.70) 35%, rgba(2, 6, 23, 0.05) 60%, rgba(2, 6, 23, 0.20) 100%), radial-gradient(ellipse at 75% 50%, transparent 60%, rgba(2, 6, 23, 0.25) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Giant Watermark Behind Content (e.g. Google, Apple, Samsung, OnePlus, Xiaomi) */}
        <div style={{
          position: 'absolute',
          left: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(90px, 15vw, 210px)',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.04)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 3,
          lineHeight: 1,
          fontFamily: 'Outfit, sans-serif'
        }}>
          {config.brand}
        </div>

        {/* Content Container (Razor-sharp typography on the left, full video open on the right) */}
        <div style={{ position: 'relative', zIndex: 4, width: '100%', maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ maxWidth: 620 }}>
            {/* Top Keynote Badge */}
            <div className="hero-badge" style={{
              background: `${config.accentColor}30`,
              border: `1px solid ${config.accentColor}80`,
              color: '#ffffff',
              boxShadow: `0 0 20px ${config.accentColor}40`
            }}>
              <Sparkles size={14}/>
              <span>{config.badgeText || `${config.brand.toUpperCase()} KEYNOTE 2026`}</span>
            </div>

            {/* Giant Title with Brand Gradient */}
            <h1 className="hero-title" style={{ fontSize: 'clamp(38px, 5vw, 66px)', lineHeight: 1.08, marginBottom: 20, letterSpacing: '-0.02em', color: '#ffffff' }}>
              {config.heroTitleMain || `${config.brand} Flagship`}<br />
              <span 
                className="hero-title-gradient"
                style={{
                  backgroundImage: `linear-gradient(90deg, #ffffff 0%, ${config.accentColor || '#38bdf8'} 55%, #ffffff 100%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  display: 'inline-block'
                }}
              >
                {config.heroTitleSub || config.tagline}
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="hero-subtitle" style={{ fontSize: 17, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 32, maxWidth: 520, textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}>
              {config.description}
            </p>

            {/* CTAs */}
            <div className="hero-buttons" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a 
                href="#flagship-spotlight" 
                className="btn-primary" 
                style={{ background: config.accentColor, padding: '14px 28px', fontSize: 15, fontWeight: 700, borderRadius: 999, textDecoration: 'none' }}
              >
                <span>Explore {config.heroTitleMain || config.brand}</span>
                <ArrowRight size={17}/>
              </a>
              <Link to="/repairs/book" className="btn-outline" style={{ padding: '14px 26px', fontSize: 15, fontWeight: 700, borderRadius: 999, textDecoration: 'none' }}>
                <Wrench size={17}/>
                <span>Book Certified Repair</span>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 2. ECOSYSTEM NAVIGATION SHORTCUT BAR (Static / Non-Floating) */}
      <nav 
        id="ecosystem-explorer"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          overflowX: 'auto',
          padding: '12px 16px',
          scrollbarWidth: 'none'
        }}>
          <a
            href="#flagship-spotlight"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              color: '#1d1d1f',
              padding: '6px 16px',
              borderRadius: 999,
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span>👑</span>
            <span>Flagship: {flagship.name}</span>
          </a>

          <a
            href="#why-buy-cards"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: '#64748b',
              padding: '6px 12px',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease'
            }}
          >
            <span>💳</span>
            <span>0% Installments & TRCSL</span>
          </a>

          <a
            href="#ecosystem-bundle"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: '#64748b',
              padding: '6px 12px',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease'
            }}
          >
            <span>🎁</span>
            <span>Curated Setup Bundle</span>
          </a>

          <a
            href="#store-catalog"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: config.accentColor,
              padding: '6px 16px',
              borderRadius: 999,
              border: `1px solid ${config.accentColor}30`,
              background: `${config.accentColor}10`,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🛍️</span>
            <span>Explore All {config.brand} Products</span>
          </a>
        </div>
      </nav>

      {/* 3. DEDICATED LATEST FLAGSHIP PHONE SPOTLIGHT & SPEC BREAKDOWN */}
      <section id="flagship-spotlight" style={{ padding: '40px 0 48px' }}>
        <div className="container">
          
          {/* Flagship Showcase Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 800,
              color: config.accentColor,
              background: `${config.accentColor}15`,
              border: `1px solid ${config.accentColor}30`,
              padding: '6px 16px',
              borderRadius: 999,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 10
            }}>
              <Sparkles size={14} />
              <span>{flagship.badge || `LATEST ${config.brand.toUpperCase()} FLAGSHIP`}</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              color: '#1d1d1f',
              margin: '0 0 6px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              {flagship.name}
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0, fontWeight: 500 }}>
              {flagship.tagline}
            </p>
          </div>

          {/* The Flagship Explorer Card (Left: Gallery & Swatches | Right: Pricing & Spec Stack) */}
          {flagship.id ? (
            <div style={{
              background: '#ffffff',
              borderRadius: 28,
              border: '1px solid rgba(0,0,0,0.06)',
              padding: 'clamp(24px, 4vw, 44px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              alignItems: 'start'
            }}>
              
              {/* Left Column: Device Photo, Finishes & Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Photo Preview Stage */}
                <div style={{
                  width: '100%',
                  height: 380,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #ffffff 80%)',
                  borderRadius: 20,
                  position: 'relative',
                  marginBottom: 20
                }}>
                  <img 
                    src={activeFinish.image || flagship.image || config.heroImage} 
                    alt={flagship.name}
                    style={{
                      maxHeight: 340,
                      maxWidth: '90%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                {/* Available in X finishes label */}
                <div style={{ fontSize: 13, color: '#86868b', marginBottom: 12 }}>
                  Available in {flagship.finishes?.length || 1} flagship finishes: <strong style={{ color: '#1d1d1f' }}>{activeFinish.name}</strong>
                </div>

                {/* Color Swatch Circles */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                  {flagship.finishes?.map((finish, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => setSelectedFinishIdx(fIdx)}
                      title={finish.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: finish.hex,
                        border: selectedFinishIdx === fIdx ? `2.5px solid ${config.accentColor}` : '2px solid #ffffff',
                        boxShadow: selectedFinishIdx === fIdx 
                          ? `0 0 0 2px ${config.accentColor}, 0 2px 8px rgba(0,0,0,0.15)` 
                          : '0 0 0 1px #d2d2d7',
                        cursor: 'pointer',
                        transform: selectedFinishIdx === fIdx ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>

                <div style={{ fontSize: 12, color: '#86868b', lineHeight: 1.5 }}>
                  Includes 100% Genuine {config.brand} warranty & TRCSL certification certificate in Sri Lanka.
                </div>
              </div>

              {/* Right Column: Pricing, Buy Button & Signature Spec Stack */}
              <div>
                
                {/* Badge & Model Title */}
                {flagship.badge && (
                  <div style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    color: config.accentColor,
                    background: `${config.accentColor}12`,
                    padding: '3px 10px',
                    borderRadius: 6,
                    letterSpacing: 0.5,
                    marginBottom: 8
                  }}>
                    {flagship.badge}
                  </div>
                )}

                <h2 style={{
                  fontSize: 'clamp(28px, 3.5vw, 38px)',
                  fontWeight: 800,
                  color: '#1d1d1f',
                  margin: '0 0 4px',
                  fontFamily: 'Outfit, -apple-system, sans-serif'
                }}>
                  {flagship.name}
                </h2>

                <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 16px', fontWeight: 600 }}>
                  {flagship.tagline}
                </p>

                {/* Price Display Block */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e5ea',
                  borderRadius: 16,
                  padding: '16px 20px',
                  marginBottom: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: '#1d1d1f' }}>
                      LKR {flagship.price?.toLocaleString()}
                    </span>
                    {flagship.monthlyPrice && (
                      <span style={{ fontSize: 13, color: '#64748b' }}>
                        or {flagship.monthlyPrice}
                      </span>
                    )}
                  </div>

                  {flagship.leasePrice && (
                    <div style={{ fontSize: 12, color: config.accentColor, fontWeight: 700, marginTop: 4 }}>
                      🔄 {flagship.leasePrice}
                    </div>
                  )}
                </div>

                {/* Primary Buy Button */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
                  <button
                    onClick={() => handleAddToCart(flagship, `${flagship.name} (${activeFinish.name})`)}
                    className="btn-apple-buy"
                    style={{ background: config.accentColor, padding: '12px 28px', fontSize: 15 }}
                  >
                    <ShoppingBag size={16} style={{ marginRight: 6 }} />
                    <span>Buy — {flagship.name}</span>
                  </button>

                  <a 
                    href="#store-catalog" 
                    style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                  >
                    <span>Explore All {config.brand} Products</span>
                    <ChevronRight size={14} />
                  </a>

                  {flagship.id && (
                    <Link
                      to={`/phones/${flagship.id}`}
                      style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                    >
                      <span>Full Specifications & In-Box</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {/* The Signature Flagship Spec Stack (Bold heading + descriptive sentences) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {flagship.specs?.map((spec, sIdx) => (
                    <div 
                      key={sIdx}
                      style={{
                        padding: '14px 0',
                        borderTop: '1px solid #e5e5ea',
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: '#515154'
                      }}
                    >
                      <strong style={{ color: '#1d1d1f', display: 'block', marginBottom: 2, fontSize: 14 }}>
                        {spec.title}
                      </strong>
                      <span>{spec.desc}</span>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#86868b' }}>
              Select a brand ecosystem to view flagship hardware specifications.
            </div>
          )}

          {/* C. Ways to Buy Value Cards (Pay Over Time / Trade In / Authorized Warranty) */}
          <div 
            id="why-buy-cards" 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              marginTop: 32
            }}
          >
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <CreditCard size={20} color={config.accentColor} />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#1d1d1f' }}>Even more ways to pay</h3>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Pay in full, or choose 0% interest monthly installment plans for 12 to 24 months with leading Sri Lankan bank credit cards.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <RefreshCw size={20} color="#059669" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#1d1d1f' }}>Trade in for credit</h3>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Get up to LKR 120,000 credit toward your new device when you exchange your existing smartphone at our Colombo store.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ShieldCheck size={20} color="#2563eb" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#1d1d1f' }}>Authorized TRCSL Warranty</h3>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Every device is factory sealed with 100% genuine parts, official manufacturer warranty, and verified TRCSL registration.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. COMPLETE THE SETUP - CURATED BUNDLE */}
      <section style={{ padding: '24px 0 48px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 24,
            padding: '36px',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.15)',
                color: '#38bdf8',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,
                marginBottom: 12
              }}>
                <Sparkles size={12} />
                <span>ECOSYSTEM BUNDLE EXCLUSIVE</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>
                {config.bundle.name}
              </h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.5 }}>
                {config.bundle.subtitle}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8' }}>
                  LKR {config.bundle.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 16, color: '#64748b', textDecoration: 'line-through' }}>
                  LKR {config.bundle.originalPrice.toLocaleString()}
                </span>
                <span style={{ background: '#22c55e', color: '#ffffff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                  {config.bundle.badge}
                </span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                style={{
                  background: 'var(--gradient-cyan)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)'
                }}
              >
                <ShoppingBag size={16} />
                <span>Add Complete Bundle to Cart</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: 24,
                textAlign: 'center',
                maxWidth: 320,
                width: '100%'
              }}>
                <img 
                  src={config.bundle.image} 
                  alt={config.bundle.name} 
                  style={{ width: '100%', height: 200, objectFit: 'contain', marginBottom: 12 }}
                />
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Includes 100% genuine factory warranty on all bundled items.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4B. OFFICIAL BRAND STORE CATALOG */}
      <div id="store-catalog">
        {brandKey === 'apple' && <AppleMallSection />}
        {brandKey !== 'apple' && <EcosystemBrandCatalog brandKey={brandKey} />}
      </div>

      {/* 5. CERTIFIED REPAIR BOOKING CARD */}
      <section style={{ padding: '16px 0 40px' }}>
        <div className="container">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e5ea',
            borderRadius: 20,
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Wrench size={22} color={config.accentColor} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', margin: 0 }}>
                  Need Service on your {config.brand}?
                </h3>
              </div>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {config.repairHighlight}
              </p>
            </div>

            <Link 
              to={`/repairs/book?brand=${encodeURIComponent(config.brand)}`} 
              className="btn-apple-buy"
              style={{ background: config.accentColor, padding: '12px 24px', fontSize: 14 }}
            >
              <span>Book 30-Min {config.brand} Slot</span>
              <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. KEYNOTE FILM MODAL */}
      {isVideoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 720,
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid #e5e5ea',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="live-record-dot" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f' }}>{config.videoTitle}</span>
              </div>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: '#090d16',
              height: 380,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: config.accentColor,
                filter: 'blur(80px)',
                opacity: 0.35
              }} />

              {config.heroVideo ? (
                <video 
                  src={formatMediaUrl(config.heroVideo)} 
                  autoPlay 
                  controls 
                  playsInline 
                  loop={false}
                  poster={formatMediaUrl(config.heroImage)}
                  style={{
                    width: '100%',
                    maxHeight: 360,
                    objectFit: 'contain',
                    zIndex: 2,
                    borderRadius: 16,
                    filter: 'brightness(1.15) contrast(1.05)'
                  }}
                  onEnded={(e) => e.target.pause()}
                />
              ) : (
                <img 
                  src={config.heroImage} 
                  alt={config.name}
                  style={{
                    height: 260,
                    objectFit: 'contain',
                    zIndex: 2,
                    animation: 'floatPhone 6s ease-in-out infinite'
                  }}
                />
              )}

              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 24,
                right: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 3,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(10px)',
                padding: '10px 18px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{config.name} • Official Keynote Film</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Featuring Pro Performance & Cinema Optics</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>4K 60FPS HDR</span>
                  <button 
                    onClick={() => {
                      toast.success(`Playing high-res preview of ${config.name}!`);
                    }}
                    style={{
                      background: config.accentColor,
                      border: 'none',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Play size={12} />
                    <span>Replay</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Factory sealed with verified TRCSL authorization.
              </span>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="btn-apple-buy"
                style={{ padding: '8px 20px', fontSize: 13, background: config.accentColor }}
              >
                Close Reel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
