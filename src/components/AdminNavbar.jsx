import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Smartphone,
  ShieldCheck,
  Crown,
  ExternalLink,
  LogOut,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();

  const isSuperAdminRoute = pathname.startsWith('/super-admin') || pathname.startsWith('/superadmin');

  const handleSignOut = () => {
    logout();
    navigate(isSuperAdminRoute ? '/super-admin' : '/admin');
  };

  return (
    <header
      style={{
        flexShrink: 0,
        zIndex: 900,
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        color: '#ffffff',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Brand & Portal Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link
          to={isSuperAdminRoute ? '/super-admin' : '/admin'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: '#ffffff'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: isSuperAdminRoute
                ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                : 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSuperAdminRoute
                ? '0 2px 10px rgba(124, 58, 237, 0.4)'
                : '0 2px 10px rgba(2, 132, 199, 0.4)'
            }}
          >
            {isSuperAdminRoute ? <Crown size={19} color="#ffffff" /> : <Smartphone size={19} color="#ffffff" />}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.04em', fontFamily: 'Outfit, sans-serif' }}>
              QUANTUM MOBILE
            </div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600 }}>
              {isSuperAdminRoute ? 'EXECUTIVE COMMAND' : 'OPERATIONS PORTAL'}
            </div>
          </div>
        </Link>

        {/* Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: isSuperAdminRoute ? 'rgba(124, 58, 237, 0.2)' : 'rgba(2, 132, 199, 0.2)',
            border: isSuperAdminRoute ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(2, 132, 199, 0.4)',
            fontSize: 11,
            fontWeight: 800,
            color: isSuperAdminRoute ? '#c084fc' : '#38bdf8'
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          {isSuperAdminRoute ? 'SURVEILLANCE LIVE' : 'OPERATIONS SECURED'}
        </div>
      </div>

      {/* Admin Navigation & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Switch Between Store Admin & Super Admin if permitted */}
        {isSuperAdmin && (
          <Link
            to={isSuperAdminRoute ? '/admin' : '/super-admin'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#e2e8f0',
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {isSuperAdminRoute ? (
              <>
                <ShieldCheck size={14} color="#38bdf8" /> Store Admin Operations
              </>
            ) : (
              <>
                <Crown size={14} color="#c084fc" /> Super Admin Executive
              </>
            )}
          </Link>
        )}

        {/* View Customer Storefront Button */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live customer storefront in new tab"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.15s ease'
          }}
        >
          <ExternalLink size={14} />
          <span>View Customer Storefront</span>
        </Link>

        {/* Active Logged-in Identity */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 10px',
              borderRadius: 8,
              background: '#1e293b',
              border: '1px solid #334155'
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isSuperAdmin ? '#7c3aed' : '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {user.role || 'Staff'}
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out of Admin Session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
}

