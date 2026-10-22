import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Smartphone, Headphones, Wrench, ShoppingCart, Search, ShieldCheck, Crown, Package, ChevronDown, UserCheck } from 'lucide-react';
export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { totalCount } = useCart();
    const { user, isAdmin, isSuperAdmin, loginAs } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/'));
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (<nav className="navbar">
      <div className="nav-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <Smartphone size={20} color="#0284c7"/>
          </div>
          <span className="nav-logo-text">QUANTUM MOBILE</span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="nav-search">
          <Search size={16} className="nav-search-icon"/>
          <input type="text" placeholder="Search iPhone 16, S24 Ultra, GaN chargers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </form>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/phones" className={`nav-link${isActive('/phones') ? ' active' : ''}`}>
            <Smartphone size={16}/>
            Phones
          </Link>
          <Link to="/accessories" className={`nav-link${isActive('/accessories') ? ' active' : ''}`}>
            <Headphones size={16}/>
            Accessories
          </Link>
          <Link to="/repairs/book" className="nav-repairs-btn">
            <Wrench size={16}/>
            Book Repair
          </Link>
          <Link to="/orders" className={`nav-link${isActive('/orders') ? ' active' : ''}`}>
            <Package size={16}/>
            Orders
          </Link>
          <Link to="/cart" className="nav-cart-btn" title="View Shopping Cart">
            <ShoppingCart size={16}/>
            <span>Cart</span>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>

          {/* Quick Role Switcher (RBAC) */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowRoleMenu(!showRoleMenu)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: '10px',
            background: isSuperAdmin
                ? '#f3e8ff'
                : isAdmin
                    ? '#f0f9ff'
                    : '#f8fafc',
            border: isSuperAdmin
                ? '1px solid #d8b4fe'
                : isAdmin
                    ? '1px solid #bae6fd'
                    : '1px solid #cbd5e1',
            color: '#0f172a',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
        }}>
              {isSuperAdmin ? (<Crown size={15} color="#7c3aed"/>) : isAdmin ? (<ShieldCheck size={15} color="#0284c7"/>) : (<UserCheck size={15} color="#059669"/>)}
              <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              <span style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            fontWeight: 700,
            background: isSuperAdmin ? '#7c3aed' : isAdmin ? '#0284c7' : '#059669',
            color: '#ffffff'
        }}>
                {user?.role || 'CUSTOMER'}
              </span>
              <ChevronDown size={13} color="#64748b"/>
            </button>

            {showRoleMenu && (<div style={{
                position: 'absolute',
                right: 0,
                top: '115%',
                width: 250,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 14,
                padding: 10,
                boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
                zIndex: 1000
            }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '4px 8px 8px' }}>
                  Role Switcher (RBAC)
                </div>

                <button onClick={() => { loginAs('CUSTOMER'); setShowRoleMenu(false); navigate('/phones'); }} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: user?.role === 'CUSTOMER' ? '#ecfdf5' : 'transparent',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 12,
                marginBottom: 4
            }}>
                  <UserCheck size={16} color="#059669"/>
                  <div>
                    <div style={{ fontWeight: 700 }}>Customer Portal</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Storefront, Cart & Repairs</div>
                  </div>
                </button>

                <button onClick={() => { loginAs('ADMIN'); setShowRoleMenu(false); navigate('/admin'); }} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: user?.role === 'ADMIN' ? '#f0f9ff' : 'transparent',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 12,
                marginBottom: 4
            }}>
                  <ShieldCheck size={16} color="#0284c7"/>
                  <div>
                    <div style={{ fontWeight: 700 }}>Store Admin & Tech</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Workshop, Orders & Chats</div>
                  </div>
                </button>

                <button onClick={() => { loginAs('SUPER_ADMIN'); setShowRoleMenu(false); navigate('/super-admin'); }} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: isSuperAdmin ? '#f3e8ff' : 'transparent',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 12,
                marginBottom: 8
            }}>
                  <Crown size={16} color="#7c3aed"/>
                  <div>
                    <div style={{ fontWeight: 700 }}>Super Admin (Owner)</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Revenue, Staff & Audit</div>
                  </div>
                </button>

                <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0 8px' }}/>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Link to="/repairs/track" onClick={() => setShowRoleMenu(false)} style={{ fontSize: 12, padding: '6px 8px', color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <Wrench size={13}/> Track Live Repair (REP-104)
                  </Link>
                  <Link to="/login" onClick={() => setShowRoleMenu(false)} style={{ fontSize: 12, padding: '6px 8px', color: '#64748b', textDecoration: 'none' }}>
                    Account Login / Register
                  </Link>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </nav>);
}
