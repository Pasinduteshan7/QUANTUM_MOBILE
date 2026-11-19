import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCheck,
  Sparkles,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSocket, joinThreadRoom } from '@/services/socket';

export default function ChatWidget() {
  const { user, token, openAuthModal } = useAuth();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'threads'
  const [product, setProduct] = useState(null);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [threads, setThreads] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [msgs, setMsgs] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Quantum Mobile. How can our store specialists assist your purchase, stock inquiry, or repair today?",
      own: false,
      time: "Just now"
    }
  ]);
  const endRef = useRef(null);

  // Initialize or re-bind conversation ID when authentication state changes
  useEffect(() => {
    // Purge any legacy shared localStorage key to prevent cross-account leak
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quantum_chat_session');
    }

    let effectiveConvId = '';
    if (user?._id) {
      // Authenticated customer: Bound strictly to their account
      effectiveConvId = `user_${user._id}`;
    } else {
      // Guest visitor: Isolated to ephemeral sessionStorage (clears when browser tab closes)
      let guestId = typeof window !== 'undefined' ? sessionStorage.getItem('quantum_guest_chat') : null;
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('quantum_guest_chat', guestId);
        }
      }
      effectiveConvId = guestId;
    }

    setConversationId(effectiveConvId);
    setActiveThreadId('');
    setProduct(null);
    setViewMode('chat');

    // Fresh welcome message tailored to current user state
    setMsgs([
      {
        id: 1,
        text: user
          ? `Hello, ${user.name}! Welcome to Quantum Mobile. How can our store specialists assist your purchase, order, or repair today?`
          : "Hello! Welcome to Quantum Mobile. How can our store specialists assist your purchase, stock inquiry, or repair today?",
        own: false,
        time: "Just now"
      }
    ]);
    setThreads([]);

    fetchThreads(effectiveConvId, token);
    fetchHistory(effectiveConvId, null, token);
  }, [user?._id, token]);

  // Listen for explicit logout event
  useEffect(() => {
    const handleLogout = () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('quantum_guest_chat');
        localStorage.removeItem('quantum_chat_session');
        const freshGuestId = 'guest_' + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem('quantum_guest_chat', freshGuestId);
        setConversationId(freshGuestId);
      }
      setThreads([]);
      setProduct(null);
      setActiveThreadId('');
      setViewMode('chat');
      setMsgs([
        {
          id: 1,
          text: "Hello! Welcome to Quantum Mobile. How can our store specialists assist your purchase, stock inquiry, or repair today?",
          own: false,
          time: "Just now"
        }
      ]);
    };

    window.addEventListener('quantum-auth-logout', handleLogout);
    return () => window.removeEventListener('quantum-auth-logout', handleLogout);
  }, []);

  const fetchThreads = async (convId, authToken = token) => {
    if (!convId) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`http://localhost:5000/api/chat/threads/${convId}`, { headers });
      const data = await res.json();
      if (data.success && data.data) {
        setThreads(data.data);
        const unread = data.data.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
        setUnreadTotal(unread);
      } else {
        setThreads([]);
        setUnreadTotal(0);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const fetchHistory = async (convId, threadId = null, authToken = token) => {
    if (!convId) return;
    try {
      const url = threadId
        ? `http://localhost:5000/api/chat/history/${convId}?threadId=${encodeURIComponent(threadId)}`
        : `http://localhost:5000/api/chat/history/${convId}`;

      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.length > 0) {
          const formatted = data.data.map((m) => ({
            id: m._id,
            text: m.message,
            own: !m.isStaff,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            productContext: m.productContext
          }));
          setMsgs([
            {
              id: 1,
              text: user
                ? `Welcome back, ${user.name}! Our store specialist is connected to your inquiry thread.`
                : "Hello! Our store specialist is connected to this product thread. How can we help?",
              own: false,
              time: "Connected"
            },
            ...formatted
          ]);

          const lastWithContext = [...data.data].reverse().find((m) => m.productContext?.name);
          if (lastWithContext && !product) {
            setProduct(lastWithContext.productContext);
          }
        } else {
          setMsgs([
            {
              id: 1,
              text: product
                ? `You are now inquiring about ${product.name} (${product.finish || 'Standard'}). Ask any question below to connect with our admin team!`
                : (user
                    ? `Hello, ${user.name}! Welcome to Quantum Mobile. Ask any question below to chat with our specialists.`
                    : "Hello! Welcome to Quantum Mobile. Ask any question below to chat with our specialists."),
              own: false,
              time: "Just now"
            }
          ]);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  };

  // Real-time WebSocket listener for instant Admin replies
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    if (activeThreadId) {
      joinThreadRoom(activeThreadId);
    }

    const handleIncomingMessage = (msg) => {
      if (!msg) return;
      const isRelevant =
        msg.conversationId === conversationId ||
        (activeThreadId && msg.threadId === activeThreadId);

      if (isRelevant) {
        setMsgs((prev) => {
          const alreadyExists = prev.some(
            (m) => m._id === msg._id || (m.createdAt === msg.createdAt && m.text === msg.message)
          );
          if (alreadyExists) return prev;
          return [
            ...prev,
            {
              id: msg._id || Date.now(),
              text: msg.message,
              own: !msg.isStaff,
              time: msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now'
            }
          ];
        });
        fetchThreads(conversationId, token);
      }
    };

    socket.on('chat:message', handleIncomingMessage);
    return () => {
      socket.off('chat:message', handleIncomingMessage);
    };
  }, [conversationId, activeThreadId, token]);

  // Fallback poll for replies from Admin every 10 seconds when chat is open
  useEffect(() => {
    if (!open || !conversationId) return;
    const interval = setInterval(() => {
      fetchHistory(conversationId, activeThreadId, token);
      fetchThreads(conversationId, token);
    }, 10000);
    return () => clearInterval(interval);
  }, [open, conversationId, activeThreadId, token]);

  // Listener for product inquiry triggers from AppleMallSection or PhoneDetailPage
  useEffect(() => {
    const handler = (e) => {
      const p = e.detail;
      setProduct(p);
      const newThreadId = p.id ? `${conversationId}_${p.id}` : conversationId;
      setActiveThreadId(newThreadId);
      setViewMode('chat');
      setOpen(true);
      fetchHistory(conversationId, newThreadId, token);
    };
    window.addEventListener('open-store-chat', handler);
    return () => window.removeEventListener('open-store-chat', handler);
  }, [conversationId, token]);

  useEffect(() => {
    if (open && viewMode === 'chat') {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs, open, viewMode]);

  const sendMessageToBackend = async (text, attachedProduct = null) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs((prev) => [...prev, { id: Date.now(), text, own: true, time: now }]);

    const currentProd = attachedProduct || product;
    const effectiveThreadId = activeThreadId || (currentProd?.id ? `${conversationId}_${currentProd.id}` : conversationId);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conversationId,
          threadId: effectiveThreadId,
          name: user?.name || 'Guest Customer',
          email: user?.email || '',
          message: text,
          productContext: currentProd
        })
      });

      fetchThreads(conversationId, token);
    } catch (err) {
      console.warn('Chat send error:', err);
    }
  };

  const sendMsg = () => {
    if (!input.trim()) return;
    sendMessageToBackend(input);
    setInput('');
  };

  const handleSelectThread = (t) => {
    setActiveThreadId(t._id);
    if (t.productContext) {
      setProduct(t.productContext);
    } else {
      setProduct(null);
    }
    setViewMode('chat');
    fetchHistory(conversationId, t._id, token);
  };

  const handleStartGeneralInquiry = () => {
    setProduct(null);
    setActiveThreadId(conversationId);
    setViewMode('chat');
    fetchHistory(conversationId, conversationId, token);
  };

  return (
    <div className="chat-widget" style={{ zIndex: 9999 }}>
      {open && (
        <div className="chat-window" style={{ width: 400, height: 570, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div
            className="chat-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: '#0f172a'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {viewMode === 'threads' ? (
                <button
                  onClick={() => setViewMode('chat')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title="Back to current chat"
                >
                  <ArrowLeft size={18} color="#ffffff" />
                </button>
              ) : (
                <div
                  className="chat-avatar"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck size={18} color="#ffffff" />
                </div>
              )}

              <div className="chat-header-info">
                <div className="chat-header-name" style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  {viewMode === 'threads'
                    ? (user ? `${user.name}'s Inquiries` : 'Guest Inquiries')
                    : (product ? `Inquiry: ${product.name}` : 'Quantum Store Support')}
                </div>
                <div
                  className="chat-status"
                  style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span
                    className="chat-status-dot"
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}
                  />
                  Store Admin Online
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Toggle to view inquiries */}
              <button
                onClick={() => setViewMode(viewMode === 'threads' ? 'chat' : 'threads')}
                style={{
                  background: viewMode === 'threads' ? '#1e293b' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 14,
                  padding: '4px 9px',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title={user ? 'View All My Product Inquiries' : 'View Guest Inquiries'}
              >
                <span>Inquiries</span>
                {threads.length > 0 && (
                  <span style={{ background: '#0284c7', color: '#fff', borderRadius: 8, padding: '1px 5px', fontSize: 10 }}>
                    {threads.length}
                  </span>
                )}
              </button>

              <button
                className="chat-close"
                onClick={() => setOpen(false)}
                title="Close Chat"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* VIEW MODE: THREADS LIST (Customer's Product Inquiries) */}
          {viewMode === 'threads' ? (
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 12 }}>
              
              {/* Guest Session Privacy Notice */}
              {!user && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    marginBottom: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={16} color="#0284c7" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1' }}>
                      Temporary Guest Inquiries
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    You are chatting as a guest. Questions sent during this session are private and will not be accessible after your browser closes.
                  </p>
                  <button
                    onClick={() => openAuthModal && openAuthModal('Sign in to permanently save and track your product inquiries.')}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    <span>Sign In / Create Account</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                  padding: '4px 4px'
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user ? 'Your Product Inquiries' : 'Current Session Inquiries'}
                </span>
                <button
                  onClick={handleStartGeneralInquiry}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#0284c7',
                    cursor: 'pointer'
                  }}
                >
                  + General Inquiry
                </button>
              </div>

              {threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                  <MessageSquare size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: '#1e293b' }}>
                    {user ? 'No product inquiries yet' : 'No active inquiries in this session'}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
                    {user
                      ? 'Click "Ask Admin About This Product" on any phone to start an inquiry.'
                      : 'Ask a question about any product to chat live with our store team. Sign in to view and restore your past conversations.'}
                  </p>
                  {!user && (
                    <button
                      onClick={() => openAuthModal && openAuthModal('Sign in to view your past product inquiry threads.')}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Sign In to Access History
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {threads.map((t, idx) => {
                    const prod = t.productContext;
                    const isSelected = activeThreadId === t._id;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectThread(t)}
                        style={{
                          background: isSelected ? '#f0f9ff' : '#ffffff',
                          border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                          borderRadius: 12,
                          padding: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {prod?.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{
                              width: 44,
                              height: 44,
                              objectFit: 'contain',
                              background: '#f8fafc',
                              borderRadius: 8,
                              padding: 2
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              background: '#e0f2fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <MessageSquare size={18} color="#0284c7" />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#0f172a',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {prod?.name || 'General Inquiry'}
                            </div>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>
                              {new Date(t.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {prod?.finish && (
                            <span
                              style={{
                                fontSize: 10,
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontWeight: 600
                              }}
                            >
                              {prod.finish}
                            </span>
                          )}

                          <div
                            style={{
                              fontSize: 12,
                              color: '#64748b',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: 4
                            }}
                          >
                            {t.isStaffReply ? 'Staff: ' : 'You: '}
                            {t.lastMessage}
                          </div>
                        </div>

                        <ChevronRight size={16} color="#94a3b8" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* VIEW MODE: ACTIVE CHAT THREAD */
            <>
              {/* Attached Product Preview Header */}
              {product && (
                <div
                  style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <img
                    src={product.image || product.mainImage}
                    alt={product.name}
                    style={{
                      width: 38,
                      height: 38,
                      objectFit: 'contain',
                      background: '#ffffff',
                      borderRadius: 6,
                      padding: 2,
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      {product.finish && (
                        <span
                          style={{
                            fontSize: 10,
                            background: '#e0f2fe',
                            color: '#0284c7',
                            padding: '1px 5px',
                            borderRadius: 4,
                            fontWeight: 700
                          }}
                        >
                          {product.finish}
                        </span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>
                        රු {Number(product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProduct(null);
                      setActiveThreadId(conversationId);
                      fetchHistory(conversationId, conversationId, token);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 10,
                      fontWeight: 600
                    }}
                    title="Switch to General Inquiry"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Messages Feed */}
              <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                {msgs.map((m, idx) => (
                  <div key={idx} className={`chat-msg${m.own ? ' own' : ''}`} style={{ marginBottom: 12 }}>
                    {!m.own && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#ecfdf5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Bot size={15} color="#059669" />
                      </div>
                    )}
                    <div>
                      <div className="chat-bubble">{m.text}</div>
                      <div className="chat-time" style={{ textAlign: m.own ? 'right' : 'left' }}>
                        {m.time} {m.own && '✓'}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {/* Product-Specific Quick Action Chips */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  padding: '6px 12px',
                  overflowX: 'auto',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                {(product
                  ? [
                      `Is ${product.finish || 'this'} in stock now?`,
                      'Can I pay in monthly installments?',
                      'What warranty is included in Sri Lanka?',
                      'Can I pick this up in Colombo today?'
                    ]
                  : [
                      'Check stock in Colombo store',
                      'Repair cost estimate',
                      'PayHere installment options',
                      'Warranty terms'
                    ]
                ).map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessageToBackend(tag)}
                    style={{
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                      padding: '4px 10px',
                      borderRadius: 14,
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0284c7')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div
                className="chat-input-area"
                style={{
                  display: 'flex',
                  padding: '10px 14px',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  gap: 8
                }}
              >
                <input
                  className="chat-input"
                  placeholder={product ? `Ask about ${product.name}...` : 'Ask a store specialist anything...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 20,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={sendMsg}
                  title="Send Message"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Persistent Floating Toggle Pill Button */}
      {!open ? (
        <button
          className="chat-toggle-pill"
          onClick={() => setOpen(true)}
          title="Chat directly with Store Admin & Product Specialists"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 30,
            border: 'none',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13.5,
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(2, 132, 199, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(2, 132, 199, 0.45)';
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MessageSquare size={19} />
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}
            />
          </div>
          <span>Chat with Store Admin</span>
          {unreadTotal > 0 && (
            <span
              style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: 11,
                padding: '2px 7px',
                borderRadius: 10,
                fontWeight: 800
              }}
            >
              {unreadTotal}
            </span>
          )}
        </button>
      ) : (
        <button
          className="chat-toggle-btn"
          onClick={() => setOpen(false)}
          title="Close Chat"
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
