import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Lock, Mail, User, Phone, CheckCircle2, ArrowRight, UserPlus, ShoppingBag, ShieldCheck, Crown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, login, register, forgotPassword, logout } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showAuthFormAnyway, setShowAuthFormAnyway] = useState(false);

  // If already logged in, show session state with one-click Switch to Guest Mode or Customer Login
  if (user && !showAuthFormAnyway) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
          background: 'radial-gradient(ellipse at top, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 460,
            background: '#ffffff',
            borderRadius: 24,
            boxShadow: '0 20px 48px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
            padding: '36px 32px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: isAdmin ? '#f3e8ff' : '#e0f2fe',
              color: isAdmin ? '#7c3aed' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <User size={28} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>
            Currently Signed In
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
            You are active as <strong style={{ color: '#0f172a' }}>{user.name}</strong> ({user.email}) with <strong>{isAdmin ? 'Staff / Admin privileges' : 'a Customer account'}</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Direct switch to Customer Login form */}
            <button
              type="button"
              onClick={() => {
                logout();
                setShowAuthFormAnyway(true);
                toast('Customer sign-in form ready. Enter customer credentials.', { icon: '👤' });
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#0284c7',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
              }}
            >
              <UserPlus size={16} />
              <span>Sign In with a Customer Account</span>
            </button>

            {/* Direct switch to Guest Storefront */}
            <button
              type="button"
              onClick={() => {
                logout();
                toast.success('Browsing storefront as Guest Shopper.');
                navigate('/');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                color: '#047857',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <ShoppingBag size={16} color="#059669" />
              <span>Browse Storefront as Guest</span>
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                Go to Staff Admin Dashboard →
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                toast.success('Signed out. Session cleared.');
              }}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <span>🚪 Sign Out Completely</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const authUser = await login(loginEmail, loginPassword);
      toast.success(`Welcome back, ${authUser.name}!`);
      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const authUser = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone
      });
      toast.success(`Welcome to Quantum Mobile, ${authUser.name}!`);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!forgotEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
      toast.success('Password reset link sent! Check your inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: 'radial-gradient(ellipse at top, #f8fafc 0%, #f1f5f9 100%)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 20px 48px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px 28px 24px',
            textAlign: 'center',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Smartphone size={26} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
            {mode === 'login' ? 'Customer Sign In' : mode === 'register' ? 'Create Customer Account' : 'Reset Your Password'}
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            {mode === 'login'
              ? 'Access your orders, track genuine warranty & express checkout'
              : mode === 'register'
              ? 'Join Sri Lanka’s premier mobile flagship marketplace'
              : 'Enter your registered email to receive a secure reset link'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: 13,
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? '#0284c7' : '#64748b',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2.5px solid #0284c7' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: 13,
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? '#0284c7' : '#64748b',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2.5px solid #0284c7' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body Form */}
        <div style={{ padding: '28px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20
              }}
            >
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="email"
                    placeholder="kasun@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setForgotSent(false);
                      setForgotEmail(loginEmail);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: 13,
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
                  padding: '13px',
                  borderRadius: 12,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 14,
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
                <span>{submitting ? 'Signing In...' : 'Sign In to Account'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
            </div>
          ) : mode === 'register' ? (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="text"
                    placeholder="Kasun Perera"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="email"
                    placeholder="customer@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
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
                  padding: '13px',
                  borderRadius: 12,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 14,
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
                <span>{submitting ? 'Creating Account...' : 'Register Account'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          ) : (
            <div>
              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#dcfce7',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                    Reset Link Dispatched!
                  </h3>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: '0 0 24px' }}>
                    We just sent an email to <strong>{forgotEmail}</strong> with instructions to reset your password. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotSent(false);
                      setErrorMsg('');
                    }}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: 12,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    Enter your registered email address. We will send you a secure link to create a new password.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
                      <input
                        type="email"
                        placeholder="kasun@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          borderRadius: 12,
                          border: '1px solid #cbd5e1',
                          fontSize: 14,
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
                      padding: '13px',
                      borderRadius: 12,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 14,
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
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: 13,
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

          {mode !== 'forgot' && (
            <SocialLoginButtons
              onSuccess={(authUser) => {
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
              }}
              onError={(err) => setErrorMsg(err)}
            />
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
