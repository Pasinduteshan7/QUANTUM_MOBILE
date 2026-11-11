import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Headphones,
  Zap,
  Shield,
  Watch,
  Wrench,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const ECOSYSTEM_BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    emblem: '',
    flagship: 'iPhone 18 Pro Max',
    chip: 'A20 Pro Extreme',
    tag: 'iPhone • AirPods • Watch',
    color: '#831843',
    path: '/ecosystem/apple'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    emblem: '✦',
    flagship: 'Galaxy S26 Ultra',
    chip: 'Galaxy AI 2.0',
    tag: 'S26 Ultra • Buds • Watch',
    color: '#2563eb',
    path: '/ecosystem/samsung'
  },
  {
    id: 'google',
    name: 'Google Pixel',
    emblem: 'G',
    flagship: 'Pixel 11 Pro XL',
    chip: 'Gemini Nano',
    tag: 'Pixel 11 • Tensor G5',
    color: '#059669',
    path: '/ecosystem/google'
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    emblem: '1+',
    flagship: 'OnePlus 15 5G',
    chip: '120W SuperVOOC',
    tag: 'OP 15 • Hasselblad',
    color: '#dc2626',
    path: '/ecosystem/oneplus'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    emblem: 'mi',
    flagship: 'Xiaomi 17 Ultra',
    chip: 'Leica Optics',
    tag: '17 Ultra • HyperOS',
    color: '#ea580c',
    path: '/ecosystem/xiaomi'
  }
];

const ACCESSORY_CATEGORIES = [
  {
    id: 'all',
    label: 'All Accessories',
    icon: Sparkles,
    badge: '180+ Items',
    sub: 'Full genuine collection',
    path: '/accessories'
  },
  {
    id: 'audio',
    label: 'Audio & Earphones',
    icon: Headphones,
    badge: 'Lossless',
    sub: 'AirPods, Buds, EarPods',
    path: '/accessories?category=audio'
  },
  {
    id: 'power',
    label: 'Power & Fast Chargers',
    icon: Zap,
    badge: 'Qi2 / GaN',
    sub: '25W MagSafe, 65W GaN',
    path: '/accessories?category=power'
  },
  {
    id: 'protection',
    label: 'Protection & Cases',
    icon: Shield,
    badge: 'Mil-Drop',
    sub: 'Spigen MagArmor, Silicone',
    path: '/accessories?category=protection'
  },
  {
    id: 'smartwatches',
    label: 'Smartwatches & Bands',
    icon: Watch,
    badge: 'Cellular',
    sub: 'Ultra 2, Series 10, Galaxy',
    path: '/accessories?category=smartwatches'
  }
];

export default function VerticalSidebar() {
  const { pathname, search } = useLocation();
  const { collapsed, toggleCollapse, mobileOpen, closeMobile } = useSidebar();

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-store-chat', {
      detail: {
        name: 'General Store Inquiry',
        price: 0,
        image: '/hero_iphone18.jpg'
      }
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Main Vertical Sidebar Container */}
      <aside
        className={`vertical-store-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          position: 'fixed',
          top: 72,
          left: 0,
          bottom: 0,
          width: collapsed ? 72 : 270,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid #e2e8f0',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}
      >
        {/* Top Header / Toggle Bar */}
        <div
          style={{
            padding: collapsed ? '14px 10px' : '14px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            background: '#fafafa'
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#475569',
                letterSpacing: 1,
                textTransform: 'uppercase'
              }}>
                Store Directory
              </span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            title={collapsed ? "Expand full navigation" : "Collapse to slim rail"}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#0284c7';
              e.currentTarget.style.borderColor = '#0284c7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* Scrollable Vertical Navigation Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: collapsed ? '12px 6px' : '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          {/* 1. BRAND ECOSYSTEMS VERTICAL STACK */}
          <div>
            {!collapsed && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px 8px',
                fontSize: 10,
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: 1.2,
                textTransform: 'uppercase'
              }}>
                <span>Brand Ecosystems</span>
                <span style={{ fontSize: 9, background: '#e0f2fe', color: '#0284c7', padding: '1px 5px', borderRadius: 4 }}>
                  5 Brands
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ECOSYSTEM_BRANDS.map(b => {
                const isActive = pathname === b.path;

                return (
                  <Link
                    key={b.id}
                    to={b.path}
                    onClick={closeMobile}
                    title={`${b.name} — ${b.flagship} (${b.chip})`}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: collapsed ? '10px 0' : '9px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 12,
                      background: isActive ? `${b.color}12` : 'transparent',
                      border: isActive ? `1.5px solid ${b.color}50` : '1.5px solid transparent',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.transform = collapsed ? 'scale(1.06)' : 'translateX(3px)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    {/* Brand Emblem */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: isActive ? b.color : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        fontWeight: 900,
                        flexShrink: 0,
                        boxShadow: isActive ? `0 4px 12px ${b.color}40` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {b.emblem}
                    </div>

                    {/* Brand Titles & Flagship Chip (Expanded only) */}
                    {!collapsed && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{
                            fontSize: 13,
                            fontWeight: isActive ? 800 : 700,
                            color: isActive ? b.color : '#0f172a',
                            fontFamily: 'Outfit, sans-serif'
                          }}>
                            {b.name}
                          </span>

                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: isActive ? `${b.color}20` : '#f1f5f9',
                            color: isActive ? b.color : '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: 0.3
                          }}>
                            {b.chip}
                          </span>
                        </div>

                        <div style={{
                          fontSize: 10,
                          color: isActive ? '#475569' : '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {b.tag}
                        </div>
                      </div>
                    )}

                    {/* Active Accent Indicator */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: 3.5,
                          background: b.color,
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 2. ACCESSORIES VERTICAL STACK */}
          <div>
            {!collapsed && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px 8px',
                fontSize: 10,
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                borderTop: '1px solid #f1f5f9',
                paddingTop: 16
              }}>
                <span>Accessories Hub</span>
                <span style={{ fontSize: 9, background: '#f1f5f9', color: '#64748b', padding: '1px 5px', borderRadius: 4 }}>
                  Official
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ACCESSORY_CATEGORIES.map(acc => {
                const IconComponent = acc.icon;
                const currentCat = new URLSearchParams(search).get('category') || 'all';
                const isAccessoriesPage = pathname === '/accessories';
                const isActive = isAccessoriesPage && (acc.id === 'all' ? !search || currentCat === 'all' : currentCat === acc.id);

                return (
                  <Link
                    key={acc.id}
                    to={acc.path}
                    onClick={closeMobile}
                    title={`${acc.label} — ${acc.sub}`}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: collapsed ? '10px 0' : '9px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 12,
                      background: isActive ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      border: isActive ? '1.5px solid rgba(2, 132, 199, 0.4)' : '1.5px solid transparent',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.transform = collapsed ? 'scale(1.06)' : 'translateX(3px)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    {/* Category Icon */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: isActive ? '#0284c7' : '#f8fafc',
                        color: isActive ? '#ffffff' : '#0284c7',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <IconComponent size={16} />
                    </div>

                    {/* Titles (Expanded only) */}
                    {!collapsed && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{
                            fontSize: 12.5,
                            fontWeight: isActive ? 800 : 700,
                            color: isActive ? '#0284c7' : '#0f172a'
                          }}>
                            {acc.label}
                          </span>

                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: isActive ? '#e0f2fe' : '#f1f5f9',
                            color: isActive ? '#0284c7' : '#64748b'
                          }}>
                            {acc.badge}
                          </span>
                        </div>

                        <div style={{
                          fontSize: 10,
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {acc.sub}
                        </div>
                      </div>
                    )}

                    {/* Active Accent Indicator */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: 3.5,
                          background: '#0284c7',
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. BOTTOM UTILITIES & QUICK ACTION */}
        <div
          style={{
            padding: collapsed ? '12px 6px' : '14px 14px',
            borderTop: '1px solid #f1f5f9',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          {/* Repair Booking Shortcut */}
          <Link
            to="/repairs/book"
            onClick={closeMobile}
            title="Book Certified Repair"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '8px 0' : '8px 10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 10,
              background: '#f1f5f9',
              color: '#334155',
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <Wrench size={16} color="#0284c7" />
            {!collapsed && <span>Book 30-Min Repair</span>}
          </Link>

          {/* Ask Specialist Button */}
          <button
            onClick={() => {
              closeMobile();
              handleOpenChat();
            }}
            title="Ask Specialist Online"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '8px 0' : '8px 10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 10,
              background: '#0284c7',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0369a1'}
            onMouseLeave={e => e.currentTarget.style.background = '#0284c7'}
          >
            <MessageSquare size={16} />
            {!collapsed && <span>Ask Specialist</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
