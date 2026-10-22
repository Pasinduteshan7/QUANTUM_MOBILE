import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, ShieldCheck } from 'lucide-react';
export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState([
        {
            id: 1,
            text: "Hello! Welcome to Quantum Mobile. How can our technicians assist your purchase or repair today?",
            own: false,
            time: "Just now"
        }
    ]);
    const endRef = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            const p = (e).detail;
            setProduct(p);
            setOpen(true);
            setMsgs(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: `Inquiry regarding ${p.name} (LKR ${Number(p.price).toLocaleString()}): Hi, could you please confirm stock availability and warranty terms in Colombo?`,
                    own: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setTimeout(() => {
                setMsgs(prev => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: `Yes! We have ${p.name} in stock at our Colombo 03 flagship store with full 1-Year Apple/Samsung authorized warranty. Same-day pickup and islandwide delivery available!`,
                        own: false,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
            }, 1000);
        };
        window.addEventListener('open-store-chat', handler);
        return () => window.removeEventListener('open-store-chat', handler);
    }, []);
    useEffect(() => {
        if (open) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [msgs, open]);
    const sendMsg = () => {
        if (!input.trim())
            return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMsgs(prev => [...prev, { id: Date.now(), text: input, own: true, time: now }]);
        const sentText = input;
        setInput('');
        setTimeout(() => {
            let reply = "Our Colombo store specialist is reviewing your inquiry. Typical response time is under 2 minutes!";
            const lower = sentText.toLowerCase();
            if (lower.includes('repair') || lower.includes('screen') || lower.includes('battery')) {
                reply = "For repairs: walk-in slots take 30-45 minutes with genuine OEM parts. You can book an appointment online under the 'Book Repair' tab!";
            }
            else if (lower.includes('pay') || lower.includes('card') || lower.includes('payhere')) {
                reply = "We accept PayHere online payments (Visa/Mastercard, FriMi, Genie, eZ Cash) and Cash on Delivery (COD) islandwide!";
            }
            else if (lower.includes('charger') || lower.includes('watt') || lower.includes('compatibility')) {
                reply = "Yes! All our Anker 65W GaN chargers support Power Delivery 3.0 up to 27W for iPhone 16 and 45W for Samsung S24 Ultra.";
            }
            setMsgs(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: reply,
                    own: false,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 900);
    };
    return (<div className="chat-widget" style={{ zIndex: 999 }}>
      {open && (<div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">
              <ShieldCheck size={18} color="#ffffff"/>
            </div>
            <div className="chat-header-info">
              <div className="chat-header-name">Store Support & Repair Desk</div>
              <div className="chat-status">
                <span className="chat-status-dot"/>
                Live Specialists Online
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} title="Close Chat">
              <X size={16}/>
            </button>
          </div>

          {/* Attached Product Preview */}
          {product && (<div className="chat-product-ref">
              <img src={product.image} alt={product.name} className="chat-product-ref-img"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="chat-product-ref-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                <div className="chat-product-ref-price">LKR {Number(product.price).toLocaleString()}</div>
              </div>
              <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Attached</span>
            </div>)}

          {/* Messages Feed */}
          <div className="chat-messages">
            {msgs.map(m => (<div key={m.id} className={`chat-msg${m.own ? ' own' : ''}`}>
                {!m.own && (<div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={15} color="#059669"/>
                  </div>)}
                <div>
                  <div className="chat-bubble">
                    {m.text}
                  </div>
                  <div className="chat-time" style={{ textAlign: m.own ? 'right' : 'left' }}>
                    {m.time} {m.own && '✓'}
                  </div>
                </div>
              </div>))}
            <div ref={endRef}/>
          </div>

          {/* Canned Quick Actions */}
          <div style={{ display: 'flex', gap: 6, padding: '6px 12px', overflowX: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            {[
                "Check stock in Colombo",
                "Repair cost estimate",
                "PayHere installment options",
                "Warranty terms"
            ].map((tag, idx) => (<button key={idx} onClick={() => setInput(tag)} style={{
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    padding: '4px 10px',
                    borderRadius: 14,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}>
                {tag}
              </button>))}
          </div>

          {/* Input Box */}
          <div className="chat-input-area">
            <input className="chat-input" placeholder="Ask a specialist anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}/>
            <button className="chat-send-btn" onClick={sendMsg} title="Send Message">
              <Send size={15}/>
            </button>
          </div>
        </div>)}

      {/* Persistent Toggle Button */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)} title="Chat with Store Specialist">
        {open ? <X size={22}/> : <MessageSquare size={24}/>}
        {!open && <span className="chat-unread">1</span>}
      </button>
    </div>);
}
