import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SocialLoginButtons from './SocialLoginButtons';

export default function CustomerAuthModal() {
  const { isAuthModalOpen, authModalReason, pendingCartItem, closeAuthModal, clearPendingCartItem, login, register, forgotPassword } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePostAuthSuccess = async (authUser) => {
    closeAuthModal();
    if (pendingCartItem) {
      const itemToAdd = pendingCartItem;
      clearPendingCartItem();
      try {
        await addToCart(itemToAdd);
        toast.success(`Welcome back, ${authUser.name}! ${itemToAdd.name} added to cart.`, { icon: '🛒' });
      } catch (e) {
        toast.success(`Welcome, ${authUser.name}!`);
      }
    } else {
      toast.success(`Welcome, ${authUser.name}!`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      await handlePostAuthSuccess(loggedUser);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in Name, Email and Password.');
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone
      });
      await handlePostAuthSuccess(newUser);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!forgotEmail) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(2, 132, 199, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7'
                }}
              >
                <Lock size={15} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                Customer Account
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {activeTab === 'login' ? 'Sign in to Continue' : activeTab === 'register' ? 'Create Customer Account' : 'Reset Your Password'}
            </h3>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Reason banner if triggered by Add to Cart */}
        {authModalReason && (
          <div
            style={{
              padding: '10px 24px',
              background: '#eff6ff',
              borderBottom: '1px solid #dbeafe',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#1e40af',
              lineHeight: 1.4
            }}
          >
            <Sparkles size={15} color="#2563eb" flexShrink={0} />
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: 13,
              fontWeight: activeTab === 'login' ? 700 : 500,
              color: activeTab === 'login' ? '#0284c7' : '#64748b',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'login' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: 13,
              fontWeight: activeTab === 'register' ? 700 : 500,
              color: activeTab === 'register' ? '#0284c7' : '#64748b',
              background: activeTab === 'register' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'register' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16
              }}
            >
              {errorMsg}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="email"
                    placeholder="e.g. kasun@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg('');
                      setForgotSent(false);
                      setForgotEmail(loginEmail);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 6,
                  padding: '12px',
                  borderRadius: 10,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In & Continue'}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          ) : activeTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="text"
                    placeholder="e.g. Kasun Perera"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="tel"
                    placeholder="e.g. +94 77 123 4567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Create Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 6,
                  padding: '12px',
                  borderRadius: 10,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                }}
              >
                <span>{submitting ? 'Creating Account...' : 'Create Account & Continue'}</span>
                <CheckCircle2 size={15} />
              </button>
            </form>
          ) : (
            <div>
              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: '#dcfce7',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    Reset Link Dispatched!
                  </h4>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 20px' }}>
                    We just sent an email to <strong>{forgotEmail}</strong> with instructions to reset your password. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setForgotSent(false);
                      setErrorMsg('');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 10,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px', lineHeight: 1.5 }}>
                    Enter your registered account email. We will send you a secure one-time link to create a new password.
                  </p>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                      <input
                        type="email"
                        placeholder="e.g. kasun@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 38px',
                          borderRadius: 10,
                          border: '1px solid #cbd5e1',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      marginTop: 6,
                      padding: '12px',
                      borderRadius: 10,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: submitting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    <span>{submitting ? 'Sending Reset Email...' : 'Send Password Reset Link'}</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '6px'
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab !== 'forgot' && (
            <SocialLoginButtons
              onSuccess={handlePostAuthSuccess}
              onError={(err) => setErrorMsg(err)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
