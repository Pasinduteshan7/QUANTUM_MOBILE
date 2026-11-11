import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Smartphone, Wrench, ShoppingCart, Search, ShieldCheck, Crown, ChevronDown, UserCheck, Sparkles, PanelLeft, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { totalCount } = useCart();
    const { user, isAdmin, isSuperAdmin, logout, openAuthModal } = useAuth();
    const { collapsed, toggleCollapse, toggleMobile } = useSidebar();
    const [searchQuery, setSearchQuery] = useState('');
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const handleSidebarToggle = () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            toggleMobile();
        } else {
            toggleCollapse();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (<nav className="navbar">
      <div className="nav-inner">
        {/* Sidebar Toggle & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="sidebar-toggle-btn"
            title={collapsed ? "Expand Store Directory" : "Collapse Store Directory"}
            aria-label="Toggle Store Directory"
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 10,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#0284c7';
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.background = '#f0f9ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#334155';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <PanelLeft size={18} />
          </button>

          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <Smartphone size={20} color="#0284c7"/>
            </div>
            <span className="nav-logo-text">QUANTUM MOBILE</span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="nav-search">
          <Search size={16} className="nav-search-icon"/>
          <input type="text" placeholder="Search iPhone 18, S26 Ultra, GaN chargers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </form>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* Quick Vertical Directory Shortcut */}
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              font: 'inherit',
              padding: '8px 12px',
              borderRadius: 8
            }}
            title="Toggle Vertical Ecosystems & Accessories Hub"
          >
            <Sparkles size={16} color="#0284c7" />
            <span style={{ fontWeight: 600 }}>Directory</span>
          </button>

          <Link to="/repairs/book" className="nav-repairs-btn">
            <Wrench size={16}/>
            Book Repair
          </Link>
          <Link to="/cart" className="nav-cart-btn" title="View Shopping Cart">
            <ShoppingCart size={16}/>
            <span>Cart</span>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>

          {/* User Account / Sign In State */}
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal('Sign in to access your Quantum account & express checkout.')}
              className="nav-auth-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: '10px',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#0369a1'}
              onMouseLeave={e => e.currentTarget.style.background = '#0284c7'}
            >
              <User size={15} />
              <span>Sign In</span>
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  borderRadius: '10px',
                  background: isSuperAdmin ? '#f3e8ff' : isAdmin ? '#f0f9ff' : '#f8fafc',
                  border: isSuperAdmin ? '1px solid #d8b4fe' : isAdmin ? '1px solid #bae6fd' : '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isSuperAdmin ? (
                  <Crown size={15} color="#7c3aed" />
                ) : isAdmin ? (
                  <ShieldCheck size={15} color="#0284c7" />
                ) : (
                  <UserCheck size={15} color="#0284c7" />
                )}
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                {isAdmin && (
                  <span
                    style={{
                      fontSize: 9.5,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 800,
                      background: isSuperAdmin ? '#7c3aed' : '#0284c7',
                      color: '#ffffff',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                  </span>
                )}
                <ChevronDown size={13} color="#64748b" />
              </button>

              {showRoleMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: 230,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 14,
                    padding: 10,
                    boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{user.email}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                    {/* Admin portal shortcut if authorized */}
                    {isSuperAdmin ? (
                      <Link
                        to="/super-admin"
                        onClick={() => setShowRoleMenu(false)}
                        style={{
                          fontSize: 12.5,
                          padding: '7px 10px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          color: '#7c3aed',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: '#faf5ff'
                        }}
                      >
                        <Crown size={15} /> Executive Command
                      </Link>
                    ) : isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setShowRoleMenu(false)}
                        style={{
                          fontSize: 12.5,
                          padding: '7px 10px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          color: '#0284c7',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: '#f0f9ff'
                        }}
                      >
                        <ShieldCheck size={15} /> Operations Dashboard
                      </Link>
                    ) : null}

                    <Link
                      to="/cart"
                      onClick={() => setShowRoleMenu(false)}
                      style={{
                        fontSize: 12.5,
                        padding: '7px 10px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <ShoppingCart size={15} color="#0284c7" /> Shopping Cart ({totalCount})
                    </Link>

                    <Link
                      to="/repairs/book"
                      onClick={() => setShowRoleMenu(false)}
                      style={{
                        fontSize: 12.5,
                        padding: '7px 10px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Wrench size={15} color="#0284c7" /> Book Device Repair
                    </Link>

                    <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />

                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '7px 10px',
                        borderRadius: 8,
                        color: '#dc2626',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>);
}
