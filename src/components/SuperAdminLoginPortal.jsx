import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Lock, Mail, ArrowRight, AlertTriangle, ArrowLeft, ShieldAlert, Zap, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminLoginPortal() {
  const { login, logout } = useAuth();
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
      if (role !== 'super_admin' && role !== 'role_super_admin') {
        logout();
        setErrorMsg('Access Denied: Super Admin executive clearance required. Staff and customer accounts are forbidden.');
        return;
      }
      toast.success(`Welcome to Executive Command, ${authUser.name}!`, { icon: '👑' });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid executive credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleFastLogin = async (targetEmail, targetPassword, label) => {
    setEmail(targetEmail);
    setPassword(targetPassword);
    toast.loading(`Authenticating as ${label}...`, { id: 'fast-super-login', duration: 1200 });
    await executeLogin(targetEmail, targetPassword);
    toast.dismiss('fast-super-login');
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
        background: 'radial-gradient(ellipse at top, #1e1145 0%, #0f0728 50%, #050210 100%)',
        color: '#f8fafc'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(23, 14, 46, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Top Executive Banner */}
        <div
          style={{
            padding: '34px 28px 24px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.2) 0%, transparent 100%)'
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.6)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}
          >
            <Crown size={30} />
          </div>

          <div
            style={{
              display: 'inline-block',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
              padding: '3px 12px',
              borderRadius: 20,
              background: 'rgba(124, 58, 237, 0.3)',
              color: '#d8b4fe',
              border: '1px solid rgba(192, 132, 252, 0.35)',
              marginBottom: 8
            }}
          >
            Executive Master Command
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
            Platform Owner Gateway
          </h2>
          <p style={{ fontSize: 13, color: '#c4b5fd', margin: 0, lineHeight: 1.4 }}>
            Highest-level authorization for revenue audits, staff provisioning & critical platform infrastructure.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px' }}>
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
              <ShieldAlert size={17} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ⚡ 1-Click Super Admin Fast Pass */}
          <div
            style={{
              marginBottom: 22,
              padding: '14px 16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(30, 20, 60, 0.8) 100%)',
              border: '1px solid rgba(192, 132, 252, 0.4)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: '#d8b4fe' }}>
                <Zap size={14} color="#fde047" />
                <span>EXECUTIVE FAST PASS (ZERO PASSWORDS)</span>
              </div>
              <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 600 }}>1-Click Auth</span>
            </div>

            <button
              type="button"
              onClick={() => handleFastLogin('owner@quick.lk', 'password123', 'Platform Owner (Super Admin)')}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                cursor: submitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.45)',
                transition: 'transform 0.1s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <Crown size={17} color="#fde047" />
              <span>👑 Unlock as Platform Owner (owner@quick.lk)</span>
            </button>

            <div style={{ fontSize: 10.5, color: '#c4b5fd', marginTop: 8, textAlign: 'center' }}>
              💡 Click above to unlock Executive Console instantly without typing passwords.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0 16px',
              color: '#9333ea',
              fontSize: 11,
              fontWeight: 700
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#4c1d95' }} />
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#a78bfa' }}>
              or enter passkey manually
            </span>
            <div style={{ flex: 1, height: 1, background: '#4c1d95' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e9d5ff', marginBottom: 6 }}>
                Master Executive Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9333ea" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="email"
                  placeholder="owner@quick.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    border: '1px solid #4c1d95',
                    background: '#0a041a',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#a855f7')}
                  onBlur={(e) => (e.target.style.borderColor = '#4c1d95')}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e9d5ff', marginBottom: 6 }}>
                Executive Passkey
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9333ea" style={{ position: 'absolute', left: 14, top: 14 }} />
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
                    border: '1px solid #4c1d95',
                    background: '#0a041a',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#a855f7')}
                  onBlur={(e) => (e.target.style.borderColor = '#4c1d95')}
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
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: submitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.45)',
                transition: 'opacity 0.15s ease'
              }}
            >
              <span>{submitting ? 'Authorizing Command...' : 'Unlock Executive Console'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontSize: 12.5,
                color: '#a78bfa',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
