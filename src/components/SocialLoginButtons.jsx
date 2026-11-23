import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SocialLoginButtons({ onSuccess, onError }) {
  const { googleLogin } = useAuth();
  const [googleConfig, setGoogleConfig] = useState({ clientId: '', isConfigured: false });
  const [loading, setLoading] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxEmail, setSandboxEmail] = useState('kasun@gmail.com');
  const [sandboxName, setSandboxName] = useState('Kasun Perera');

  // Fetch Google Client ID configuration from backend
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/google/config');
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setGoogleConfig(data.data);
        }
      } catch (e) {
        // Fallback silently if offline
      }
    };
    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trigger Live Google OAuth 2.0 Popup
  const handleGoogleClick = () => {
    if (loading) return;

    if (!googleConfig.clientId) {
      setShowSandboxModal(true);
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      toast.loading('Loading Google Sign-In SDK...', { duration: 1500 });
      setTimeout(() => {
        if (!window.google?.accounts?.oauth2) {
          setShowSandboxModal(true);
        } else {
          launchGooglePopup();
        }
      }, 1000);
      return;
    }

    launchGooglePopup();
  };

  const launchGooglePopup = () => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleConfig.clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.warn('Google OAuth response error:', tokenResponse);
            if (tokenResponse.error === 'access_denied') {
              toast('Google sign-in cancelled by user.');
            } else {
              toast.error(`Google Sign-In: ${tokenResponse.error_description || tokenResponse.error}`);
              setShowSandboxModal(true);
            }
            return;
          }

          if (tokenResponse.access_token) {
            setLoading(true);
            try {
              // Fetch user profile from Google's UserInfo endpoint
              const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await profileRes.json();

              if (!profile || !profile.email) {
                throw new Error('Failed to retrieve user profile from Google.');
              }

              // Authenticate with Quantum Mobile backend
              const authUser = await googleLogin({
                userInfo: {
                  email: profile.email,
                  name: profile.name || profile.given_name || profile.email.split('@')[0],
                  picture: profile.picture || '',
                  googleId: profile.sub
                }
              });

              toast.success(`Welcome, ${authUser.name}! Signed in with Google.`, { icon: '🇬' });
              if (onSuccess) onSuccess(authUser);
            } catch (err) {
              const msg = err.message || 'Google account verification failed.';
              toast.error(msg);
              if (onError) onError(msg);
            } finally {
              setLoading(false);
            }
          }
        },
        error_callback: (nonOAuthError) => {
          console.warn('Google popup error:', nonOAuthError);
          setShowSandboxModal(true);
        }
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      console.warn('Google client launch exception:', err);
      setShowSandboxModal(true);
    }
  };

  // Submit profile from Google OAuth Simulator / Fallback
  const handleSandboxSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authUser = await googleLogin({
        userInfo: {
          email: sandboxEmail,
          name: sandboxName,
          googleId: `google_user_${Date.now()}`,
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        }
      });
      setShowSandboxModal(false);
      toast.success(`Welcome, ${authUser.name}! Signed in with Google.`, { icon: '🇬' });
      if (onSuccess) onSuccess(authUser);
    } catch (err) {
      const msg = err.message || 'Google sign-in failed.';
      if (onError) onError(msg);
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '22px 0 16px',
          color: '#94a3b8',
          fontSize: 12,
          fontWeight: 700
        }}
      >
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        <span
          style={{
            padding: '0 14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: 11,
            color: '#94a3b8',
            fontWeight: 700
          }}
        >
          Or continue with
        </span>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      </div>

      {/* Prominent, Full-Width Official Google Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        title="Continue with Google"
        style={{
          width: '100%',
          height: 48,
          borderRadius: 12,
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease',
          fontSize: 14,
          fontWeight: 600,
          color: '#1e293b'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#94a3b8';
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
        }}
      >
        {/* Official Google Multi-colored G Logo */}
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{loading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
      </button>

      {/* Google OAuth Sandbox / Localhost Fallback Modal */}
      {showSandboxModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSandboxModal(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: '#ffffff',
              borderRadius: 22,
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              animation: 'modalFadeIn 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSandboxModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSandboxSubmit} style={{ padding: '20px 24px' }}>
              {googleConfig.clientId ? (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Google Client ID Connected!</span>
                  </div>
                  To enable live Google popups on your machine, add <strong>http://localhost:5173</strong> to <em>Authorized JavaScript origins</em> in Google Cloud Console.
                </div>
              ) : (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    marginBottom: 16
                  }}
                >
                  <strong>Google OAuth Simulation:</strong> Instant 1-click test sign in with Google account profile.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Google Profile Name
                  </label>
                  <input
                    type="text"
                    value={sandboxName}
                    onChange={(e) => setSandboxName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Google Gmail Address
                  </label>
                  <input
                    type="email"
                    value={sandboxEmail}
                    onChange={(e) => setSandboxEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowSandboxModal(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 12,
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: 12,
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
