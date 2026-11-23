import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, ArrowLeft, Zap, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPortal() {
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeLogin = async (targetEmail, targetPassword) => {
    setErrorMsg('');
    setSubmitting(true);

    try {
      const authUser = await login(targetEmail, targetPassword);
      const role = String(authUser.role || '').toLowerCase();
      const isAllowedAdmin = [
        'admin',
        'super_admin',
        'store_admin',
        'tech_admin',
        'cashier_admin',
        'logistics_admin',
        'technician'
      ].includes(role) || role.includes('admin');

      if (!isAllowedAdmin) {
        logout();
        setErrorMsg('Access Denied: This portal is strictly for Quantum Mobile Store Administrators. Customer accounts cannot enter operations.');
        return;
      }
      toast.success(`Welcome to Operations Hub, ${authUser.name}!`, { icon: '🛡️' });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleFastLogin = async (targetEmail, targetPassword, roleLabel) => {
    setEmail(targetEmail);
    setPassword(targetPassword);
    toast.loading(`Authenticating as ${roleLabel}...`, { id: 'fast-login', duration: 1200 });
    await executeLogin(targetEmail, targetPassword);
    toast.dismiss('fast-login');
  };

  return (
    <div
      style={{
        minHeight: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f8fafc'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 450,
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 132, 199, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Top Operational Banner */}
        <div
          style={{
            padding: '32px 28px 24px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.12) 0%, transparent 100%)'
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(2, 132, 199, 0.5)'
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <div
            style={{
              display: 'inline-block',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 20,
              background: 'rgba(2, 132, 199, 0.25)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: 8
            }}
          >
            Store Operations Gateway
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
            Administrator Access
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Restricted to authorized Quantum Store Staff, inventory controllers & workshop technicians.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px' }}>
          {user && !isAdmin && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#bae6fd',
                fontSize: 12,
                lineHeight: 1.4,
                marginBottom: 16
              }}
            >
              ℹ️ You are currently active as customer <strong>{user.name}</strong> ({user.email}). Sign in below with an Administrator account to access operations.
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: 12.5,
                fontWeight: 600,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                lineHeight: 1.4
              }}
            >
              <AlertTriangle size={17} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ⚡ 1-Click Instant Fast Pass (Zero Password Typing) */}
          <div
            style={{
              marginBottom: 22,
              padding: '14px 16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.15)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: '#38bdf8' }}>
                <Zap size={14} color="#38bdf8" />
                <span>ONE-CLICK FAST PASS (DEV & OPS)</span>
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Zero typing needed</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {/* Store Admin 1-Click Button */}
              <button
                type="button"
                onClick={() => handleFastLogin('admin@quick.lk', 'password123', 'Store Manager (Admin)')}
                disabled={submitting}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                  transition: 'transform 0.1s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <ShieldCheck size={14} />
                <span>Store Admin</span>
              </button>

              {/* Super Admin 1-Click Button */}
              <button
                type="button"
                onClick={() => handleFastLogin('owner@quick.lk', 'password123', 'Platform Owner (Super Admin)')}
                disabled={submitting}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                  border: '1px solid rgba(192, 132, 252, 0.5)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
                  transition: 'transform 0.1s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <Crown size={14} color="#fde047" />
                <span>Super Admin</span>
              </button>
            </div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
              💡 Click above to authenticate instantly with zero password typing.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0 16px',
              color: '#64748b',
              fontSize: 11,
              fontWeight: 700
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              or enter credentials manually
            </span>
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Staff Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="email"
                  placeholder="admin@quick.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                  onBlur={(e) => (e.target.style.borderColor = '#334155')}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Operations Key / Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                  onBlur={(e) => (e.target.style.borderColor = '#334155')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: 6,
                padding: '13px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: submitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.4)',
                transition: 'opacity 0.15s ease'
              }}
            >
              <span>{submitting ? 'Verifying Credentials...' : 'Authenticate & Enter Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontSize: 12.5,
                color: '#94a3b8',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
