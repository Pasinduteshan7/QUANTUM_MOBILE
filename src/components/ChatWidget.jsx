import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, ShieldCheck, ArrowLeft, Clock, CheckCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ChatWidget() {
  const { user } = useAuth();
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

  // Initialize persistent conversation ID
  useEffect(() => {
    let convId = localStorage.getItem('quantum_chat_session');
    if (!convId) {
      convId = 'cust-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('quantum_chat_session', convId);
    }
    setConversationId(convId);
    fetchThreads(convId);
    fetchHistory(convId);
  }, []);

  const fetchThreads = async (convId) => {
    if (!convId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/chat/threads/${convId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setThreads(data.data);
        const unread = data.data.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
        setUnreadTotal(unread);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const fetchHistory = async (convId, threadId = null) => {
    if (!convId) return;
    try {
      const url = threadId
        ? `http://localhost:5000/api/chat/history/${convId}?threadId=${encodeURIComponent(threadId)}`
        : `http://localhost:5000/api/chat/history/${convId}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.length > 0) {
          const formatted = data.data.map(m => ({
            id: m._id,
            text: m.message,
            own: !m.isStaff,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            productContext: m.productContext
          }));
          setMsgs([
            {
              id: 1,
              text: "Hello! Our store specialist is connected to this product thread. How can we help?",
              own: false,
              time: "Connected"
            },
            ...formatted
          ]);

          // If the last message has product context and we don't have one active, attach it
          const lastWithContext = [...data.data].reverse().find(m => m.productContext?.name);
          if (lastWithContext && !product) {
            setProduct(lastWithContext.productContext);
          }
        } else {
          // Empty thread welcome
          setMsgs([
            {
              id: 1,
              text: product
                ? `You are now inquiring about ${product.name} (${product.finish || 'Standard'}). Ask any question below to connect with our admin team!`
                : "Hello! Welcome to Quantum Mobile. Ask any question below to chat with our specialists.",
              own: false,
              time: "Just now"
            }
          ]);
        }
      }
    } catch (e) {
      // Backend offline fallback
    }
  };

  // Poll for replies from Admin every 6 seconds when chat is open
  useEffect(() => {
    if (!open || !conversationId) return;
    const interval = setInterval(() => {
      fetchHistory(conversationId, activeThreadId);
      fetchThreads(conversationId);
    }, 6000);
    return () => clearInterval(interval);
  }, [open, conversationId, activeThreadId]);

  // Listener for product inquiry triggers from AppleMallSection or PhoneDetailPage
  useEffect(() => {
    const handler = (e) => {
      const p = e.detail;
      setProduct(p);
      const newThreadId = p.id ? `${conversationId}_${p.id}` : conversationId;
      setActiveThreadId(newThreadId);
      setViewMode('chat');
      setOpen(true);
      fetchHistory(conversationId, newThreadId);
    };
    window.addEventListener('open-store-chat', handler);
    return () => window.removeEventListener('open-store-chat', handler);
  }, [conversationId]);

  useEffect(() => {
    if (open && viewMode === 'chat') {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs, open, viewMode]);

  const sendMessageToBackend = async (text, attachedProduct = null) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs(prev => [...prev, { id: Date.now(), text, own: true, time: now }]);

    const currentProd = attachedProduct || product;
    const effectiveThreadId = activeThreadId || (currentProd?.id ? `${conversationId}_${currentProd.id}` : conversationId);

    try {
      await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          threadId: effectiveThreadId,
          name: user?.name || 'Customer',
          email: user?.email || '',
          message: text,
          productContext: currentProd
        })
      });

      // Refresh threads list
      fetchThreads(conversationId);
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
    fetchHistory(conversationId, t._id);
  };

  const handleStartGeneralInquiry = () => {
    setProduct(null);
    setActiveThreadId(conversationId);
    setViewMode('chat');
    fetchHistory(conversationId, conversationId);
  };

  return (
    <div className="chat-widget" style={{ zIndex: 9999 }}>
      {open && (
        <div className="chat-window" style={{ width: 400, height: 570, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#0f172a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {viewMode === 'threads' ? (
                <button
                  onClick={() => setViewMode('chat')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  title="Back to current chat"
                >
                  <ArrowLeft size={18} color="#ffffff" />
                </button>
              ) : (
                <div className="chat-avatar" style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="#ffffff" />
                </div>
              )}
              
              <div className="chat-header-info">
                <div className="chat-header-name" style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  {viewMode === 'threads' ? 'Your Inquiries' : (product ? 'Product Consultation' : 'Live Store Support')}
                </div>
                <div className="chat-status" style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="chat-status-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Store Admin Online
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Toggle to view all product inquiries */}
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
                title="View All My Product Inquiries"
              >
                <span>Inquiries</span>
                {threads.length > 0 && (
                  <span style={{ background: '#0284c7', color: '#fff', borderRadius: 8, padding: '1px 5px', fontSize: 10 }}>
                    {threads.length}
                  </span>
                )}
              </button>

              <button className="chat-close" onClick={() => setOpen(false)} title="Close Chat" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* VIEW MODE: THREADS LIST (Customer's Product Inquiries) */}
          {viewMode === 'threads' ? (
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '4px 4px' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Your Product Questions
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
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <MessageSquare size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 6px' }}>No past inquiries yet</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                    Click "Ask Admin About This Product" on any phone to start an inquiry.
                  </p>
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
                            style={{ width: 44, height: 44, objectFit: 'contain', background: '#f8fafc', borderRadius: 8, padding: 2 }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare size={18} color="#0284c7" />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod?.name || 'General Inquiry'}
                            </div>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>
                              {new Date(t.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {prod?.finish && (
                            <span style={{ fontSize: 10, background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                              {prod.finish}
                            </span>
                          )}

                          <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 4 }}>
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
                <div style={{
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <img
                    src={product.image || product.mainImage}
                    alt={product.name}
                    style={{ width: 38, height: 38, objectFit: 'contain', background: '#ffffff', borderRadius: 6, padding: 2, border: '1px solid #e2e8f0' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      {product.finish && (
                        <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0284c7', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
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
                      fetchHistory(conversationId, conversationId);
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
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bot size={15} color="#059669" />
                      </div>
                    )}
                    <div>
                      <div className="chat-bubble">
                        {m.text}
                      </div>
                      <div className="chat-time" style={{ textAlign: m.own ? 'right' : 'left' }}>
                        {m.time} {m.own && '✓'}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {/* Product-Specific Quick Action Chips */}
              <div style={{ display: 'flex', gap: 6, padding: '6px 12px', overflowX: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                {(product ? [
                  `Is ${product.finish || 'this'} in stock now?`,
                  "Can I pay in monthly installments?",
                  "What warranty is included in Sri Lanka?",
                  "Can I pick this up in Colombo today?"
                ] : [
                  "Check stock in Colombo store",
                  "Repair cost estimate",
                  "PayHere installment options",
                  "Warranty terms"
                ]).map((tag, idx) => (
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
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#0284c7'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="chat-input-area" style={{ display: 'flex', padding: '10px 14px', background: '#ffffff', borderTop: '1px solid #e2e8f0', gap: 8 }}>
                <input
                  className="chat-input"
                  placeholder={product ? `Ask about ${product.name}...` : "Ask a store specialist anything..."}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
                />
                <button
                  className="chat-send-btn"
                  onClick={sendMsg}
                  title="Send Message"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: '#0284c7', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {/* Persistent Floating Toggle Button */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)} title="Chat with Store Specialist">
        {open ? <X size={22} /> : <MessageSquare size={24} />}
        {!open && unreadTotal > 0 && <span className="chat-unread">{unreadTotal}</span>}
      </button>
    </div>
  );
}
