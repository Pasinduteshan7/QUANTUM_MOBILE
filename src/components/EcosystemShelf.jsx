import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ECOSYSTEM_BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    icon: '',
    badge: 'A18 Pro',
    tag: 'iPhone • AirPods • MagSafe',
    color: '#0284c7',
    path: '/ecosystem/apple'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    icon: '✦',
    badge: 'Galaxy AI',
    tag: 'S24 Ultra • Z Flip • Buds',
    color: '#2563eb',
    path: '/ecosystem/samsung'
  },
  {
    id: 'google',
    name: 'Google Pixel',
    icon: 'G',
    badge: 'Gemini AI',
    tag: 'Pixel 9 Pro • Tensor G4',
    color: '#059669',
    path: '/ecosystem/google'
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    icon: '1+',
    badge: '100W Fast',
    tag: 'OP 12 • Hasselblad',
    color: '#dc2626',
    path: '/ecosystem/oneplus'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi',
    icon: 'mi',
    badge: 'Leica Optics',
    tag: '14 Ultra • HyperOS',
    color: '#ea580c',
    path: '/ecosystem/xiaomi'
  }
];

export default function EcosystemShelf() {
  const { pathname } = useLocation();

  return (
    <div 
      className="ecosystem-shelf-wrapper"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 64,
        zIndex: 35,
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.25s ease'
      }}
    >
      <div 
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 28,
          overflowX: 'auto',
          padding: '10px 16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <span 
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0284c7' }} />
          Ecosystems:
        </span>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {ECOSYSTEM_BRANDS.map(brand => {
            const isActive = pathname === brand.path;

            return (
              <Link
                key={brand.id}
                to={brand.path}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 16px',
                  borderRadius: 14,
                  background: isActive ? `${brand.color}10` : 'transparent',
                  border: isActive ? `1.5px solid ${brand.color}` : '1.5px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Brand Emblem */}
                <div 
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: isActive ? brand.color : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 4px 10px ${brand.color}40` : 'none'
                  }}
                >
                  {brand.icon}
                </div>

                {/* Company Name & Tag */}
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span 
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 800 : 700,
                        color: isActive ? brand.color : '#0f172a',
                        fontFamily: 'Outfit, sans-serif'
                      }}
                    >
                      {brand.name}
                    </span>

                    {/* Micro Highlight Badge */}
                    <span 
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 5px',
                        borderRadius: 4,
                        background: isActive ? `${brand.color}20` : '#f1f5f9',
                        color: isActive ? brand.color : '#64748b',
                        letterSpacing: 0.4,
                        textTransform: 'uppercase'
                      }}
                    >
                      {brand.badge}
                    </span>
                  </div>

                  <span 
                    style={{
                      fontSize: 10,
                      color: isActive ? 'var(--text-secondary)' : '#94a3b8',
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    {brand.tag}
                  </span>
                </div>

                {/* Active Underline Glow */}
                {isActive && (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: -10,
                      left: '20%',
                      right: '20%',
                      height: 3,
                      background: brand.color,
                      borderRadius: '3px 3px 0 0',
                      boxShadow: `0 0 8px ${brand.color}`
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
