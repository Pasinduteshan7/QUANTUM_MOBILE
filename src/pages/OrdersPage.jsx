import React, { useState } from 'react';
import { Package, Truck, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
const mockOrders = [
    {
        id: 'ORD-5521',
        items: [
            { name: 'iPhone 16 Pro 256GB Black Titanium', qty: 1, price: 425000, image: '/iphone16pro.jpg' },
            { name: 'Anker 65W GaN Fast Charger', qty: 1, price: 14500, image: '/accessories.jpg' }
        ],
        total: 439500,
        paymentMethod: 'PayHere (LKR)',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        courierTracking: 'DOM-EX-449102',
        createdAt: '2024-11-12'
    },
    {
        id: 'ORD-5489',
        items: [
            { name: 'Galaxy S24 Ultra 512GB Titanium Gray', qty: 1, price: 449000, image: '/samsung_s24.jpg' }
        ],
        total: 449000,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        createdAt: '2024-11-18'
    }
];
export default function OrdersPage() {
    const [orders, setOrders] = useState(mockOrders);
    const [reviewModalItem, setReviewModalItem] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const submitReview = (e) => {
        e.preventDefault();
        toast.success(`Verified review submitted for ${reviewModalItem}!`);
        setReviewModalItem(null);
        setComment('');
    };
    return (<div className="container" style={{ maxWidth: 900, paddingTop: 40, paddingBottom: 80 }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit' }}>
          <Package size={28} color="#0284c7"/>
          My Orders & Price-Frozen Invoices (FR-C5)
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Track delivery dispatch, download immutable tax invoices, and post verified buyer reviews.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {orders.map(order => (<div key={order.id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: 18,
                border: '1px solid var(--border)',
                padding: 24,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
            {/* Order Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>{order.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Placed on {order.createdAt}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                background: order.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'
            }}>
                  {order.paymentStatus}
                </span>

                <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                background: order.orderStatus === 'Delivered' ? 'rgba(16,185,129,0.2)' : 'rgba(0,212,255,0.2)',
                color: order.orderStatus === 'Delivered' ? '#10b981' : '#0284c7'
            }}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {order.items.map((it, idx) => (<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={it.image} alt={it.name} style={{ width: 52, height: 52, objectFit: 'contain', background: 'var(--bg-input)', borderRadius: 8, padding: 4 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {it.qty} &bull; Price-frozen snapshot</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--cyan)', fontSize: 14 }}>LKR {it.price.toLocaleString()}</div>
                    {order.orderStatus === 'Delivered' && (<button onClick={() => setReviewModalItem(it.name)} style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#10b981',
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        marginTop: 4,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <Star size={11} fill="#10b981"/> Write Review
                      </button>)}
                  </div>
                </div>))}
            </div>

            {/* Courier Dispatch & Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 13, flexWrap: 'wrap', gap: 10 }}>
              {order.courierTracking ? (<div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 12 }}>
                  <Truck size={15}/>
                  <span>Courier Tracking: <strong>{order.courierTracking}</strong> (Delivered)</span>
                </div>) : (<div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cyan)', fontSize: 12 }}>
                  <Clock size={15}/>
                  <span>Preparing for courier dispatch from Colombo store</span>
                </div>)}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Amount:</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>
                  LKR {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>))}
      </div>

      {/* Write Review Modal */}
      {reviewModalItem && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <form onSubmit={submitReview} style={{ background: 'var(--bg-secondary)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', width: '100%', maxWidth: 520 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>Write Verified Review</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
              Item: <strong>{reviewModalItem}</strong> &bull; Order Delivered
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Star Rating
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(st => (<button type="button" key={st} onClick={() => setRating(st)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <Star size={24} fill={st <= rating ? '#f59e0b' : 'none'} color={st <= rating ? '#f59e0b' : 'var(--border)'}/>
                  </button>))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Your Review
              </label>
              <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your authentic feedback..." required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#040d1a',
                border: 'none',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer'
            }}>
                Submit Verified Review
              </button>
              <button type="button" onClick={() => setReviewModalItem(null)} style={{
                padding: '10px 16px',
                borderRadius: 8,
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
            }}>
                Cancel
              </button>
            </div>
          </form>
        </div>)}
    </div>);
}
