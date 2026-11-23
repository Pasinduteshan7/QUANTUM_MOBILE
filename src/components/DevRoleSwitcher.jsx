import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, ShieldCheck, User, LogOut, Zap, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DevRoleSwitcher() {
  const { user, isAdmin, isSuperAdmin, quickLoginAs, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (roleKey, label, destination) => {
    setSwitching(true);
    toast.loading(`Switching to ${label}...`, { id: 'dev-switch', duration: 1000 });
    try {
      const authUser = await quickLoginAs(roleKey);
      toast.dismiss('dev-switch');
      toast.success(`Active as ${authUser.name} (${authUser.role})`, { icon: '⚡' });
      if (destination) {
        navigate(destination);
      }
    } catch (err) {
      toast.dismiss('dev-switch');
      toast.error(err.message || 'Failed to switch role.');
    } finally {
      setSwitching(false);
      setIsOpen(false);
    }
  };

  const handleGuest = () => {
    logout();
    toast('Logged out to Guest Mode', { icon: '👤' });
    setIsOpen(false);
  };

  // Active badge label and color
  let activeLabel = 'Guest (Not logged in)';
  let activeColor = '#64748b';
  let activeBg = '#f1f5f9';
  let activeIcon = <Zap size={14} color="#64748b" />;

  if (isSuperAdmin) {
    activeLabel = `👑 Super Admin (${user?.name?.split(' ')[0] || 'Owner'})`;
    activeColor = '#7c3aed';
    activeBg = '#f3e8ff';
    activeIcon = <Crown size={14} color="#7c3aed" />;
  } else if (isAdmin) {
    activeLabel = `🛡️ Admin (${user?.name?.split(' ')[0] || 'Store'})`;
    activeColor = '#0284c7';
    activeBg = '#e0f2fe';
    activeIcon = <ShieldCheck size={14} color="#0284c7" />;
  } else if (user) {
    activeLabel = `👤 Customer (${user?.name?.split(' ')[0] || 'User'})`;
    activeColor = '#059669';
    activeBg = '#dcfce7';
    activeIcon = <User size={14} color="#059669" />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 99999,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Expanded Popover */}
      {isOpen && (
        <div
          style={{
            marginBottom: 10,
            width: 290,
            background: '#ffffff',
            borderRadius: 18,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 800 }}>
              <Zap size={14} color="#38bdf8" />
              <span>QUICK DEV ROLE SWITCHER</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 2,
                fontSize: 11
              }}
            >
              ✕
            </button>
          </div>

          {/* Body with 1-Click Fast Pass Buttons */}
          <div style={{ padding: '12px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
              Click to instantly sign in without typing passwords:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleSwitch('super_admin', 'Platform Owner (Super Admin)', '/super-admin')}
                disabled={switching}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: isSuperAdmin ? '#f3e8ff' : '#f8fafc',
                  border: isSuperAdmin ? '1.5px solid #a855f7' : '1px solid #e2e8f0',
                  color: '#4c1d95',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: switching ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Crown size={15} color="#7c3aed" />
                  <span>Platform Owner (Super Admin)</span>
                </div>
                {isSuperAdmin && <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 800 }}>ACTIVE</span>}
              </button>

              {/* Store Admin */}
              <button
                type="button"
                onClick={() => handleSwitch('admin', 'Store Manager (Admin)', '/admin')}
                disabled={switching}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: isAdmin && !isSuperAdmin ? '#e0f2fe' : '#f8fafc',
                  border: isAdmin && !isSuperAdmin ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  color: '#0369a1',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: switching ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={15} color="#0284c7" />
                  <span>Store Manager (Admin)</span>
                </div>
                {isAdmin && !isSuperAdmin && <span style={{ fontSize: 10, color: '#0284c7', fontWeight: 800 }}>ACTIVE</span>}
              </button>

              {/* Customer Pasindu (Placed #8E974A) */}
              <button
                type="button"
                onClick={() => handleSwitch('pasindu', 'Pasindu (Buyer #8E974A)', '/orders')}
                disabled={switching}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: user?.email === 'pasinduteshan007@gmail.com' ? '#dcfce7' : '#f8fafc',
                  border: user?.email === 'pasinduteshan007@gmail.com' ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                  color: '#15803d',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: switching ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={15} color="#16a34a" />
                  <span>Pasindu (Buyer #8E974A)</span>
                </div>
                {user?.email === 'pasinduteshan007@gmail.com' && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>ACTIVE</span>}
              </button>

              {/* Customer Kasun */}
              <button
                type="button"
                onClick={() => handleSwitch('customer', 'Customer Kasun')}
                disabled={switching}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: user && !isAdmin ? '#dcfce7' : '#f8fafc',
                  border: user && !isAdmin ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                  color: '#15803d',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: switching ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={15} color="#16a34a" />
                  <span>Kasun (Customer Shopper)</span>
                </div>
                {user && !isAdmin && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>ACTIVE</span>}
              </button>

              {/* Guest / Logout */}
              {user && (
                <button
                  type="button"
                  onClick={handleGuest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#64748b',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 2
                  }}
                >
                  <LogOut size={13} />
                  <span>Log Out to Guest</span>
                </button>
              )}
            </div>

            {/* Direct Portal Links */}
            <div
              style={{
                marginTop: 10,
                paddingTop: 8,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: 6
              }}
            >
              <button
                type="button"
                onClick={() => {
                  navigate('/admin');
                  setIsOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: 11,
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#0284c7',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Go to /admin →
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/super-admin');
                  setIsOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: 11,
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#7c3aed',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Go to /super-admin →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="1-Click Role Switcher (Super Admin, Store Admin, Customer)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 24,
          background: activeBg,
          border: `1.5px solid ${activeColor}`,
          color: activeColor,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.16)',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: 12,
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
      >
        {activeIcon}
        <span>{activeLabel}</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
}

