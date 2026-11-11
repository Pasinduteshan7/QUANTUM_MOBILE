import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPortal() {
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const authUser = await login(email, password);
      const role = String(authUser.role || '').toLowerCase();
      if (role !== 'admin' && role !== 'super_admin' && role !== 'role_admin' && role !== 'role_super_admin') {
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

  const fillDemoAdmin = () => {
    setEmail('admin@quick.lk');
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
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

            {/* Quick Demo Admin Helper */}
            <button
              type="button"
              onClick={fillDemoAdmin}
              style={{
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px dashed rgba(56, 189, 248, 0.4)',
                borderRadius: 10,
                padding: '10px',
                fontSize: 12,
                fontWeight: 600,
                color: '#38bdf8',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ⚡ Fill Demo Store Admin (admin@quick.lk)
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
