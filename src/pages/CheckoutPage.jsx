import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
export default function CheckoutPage() {
    const { cartItems, grandTotal, formattedGrandTotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('payhere');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    // Form Fields
    const [name, setName] = useState('Kasun Mendis');
    const [phone, setPhone] = useState('+94 77 123 4567');
    const [email, setEmail] = useState('kasun@gmail.com');
    const [address, setAddress] = useState('45/A, Galle Road, Colombo 03');
    const [city, setCity] = useState('Colombo');
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!name || !address || !phone) {
            toast.error('Please complete all delivery fields');
            return;
        }
        const newOrderId = 'ORD-' + Math.floor(5000 + Math.random() * 900);
        setOrderId(newOrderId);
        setOrderPlaced(true);
        clearCart();
        toast.success(`Order ${newOrderId} placed successfully!`);
    };
    if (orderPlaced) {
        return (<div className="container" style={{ maxWidth: 640, paddingTop: 60, paddingBottom: 80, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(16,185,129,0.3)' }}>
          <CheckCircle2 size={40} color="#10b981"/>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, fontFamily: 'Outfit' }}>
          Payment & Order Confirmed!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>
          Thank you for shopping with Quantum Mobile. Your immutable invoice snapshot has been created.
        </p>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-cyan)', borderRadius: 20, padding: 28, textAlign: 'left', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Number</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>{orderId}</div>
            </div>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              {paymentMethod === 'payhere' ? 'PayHere Paid (LKR)' : 'Cash on Delivery (Pending)'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, fontSize: 13, marginBottom: 16 }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>CUSTOMER:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{name} ({phone})</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>DELIVERY ADDRESS:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{address}, {city}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>TOTAL AMOUNT:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{formattedGrandTotal || 'LKR 439,500'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>COURIER DISPATCH:</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>DOM-EX-449102 (Trackable)</span>
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0, 212, 255, 0.08)', fontSize: 12, color: 'var(--text-secondary)' }}>
            <strong>Verified Buyer Review:</strong> Once this order is marked Delivered by courier, you will unlock the Verified Buyer rating badge for this item!
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/orders" className="btn-primary">
            <span>View My Orders & Invoices</span>
            <ArrowRight size={16}/>
          </Link>
          <Link to="/" className="btn-outline">
            Back to Storefront
          </Link>
        </div>
      </div>);
    }
    return (<div className="container" style={{ maxWidth: 960, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--cyan)', textDecoration: 'none' }}>
          <ArrowLeft size={14}/> Back to Shopping Cart
        </Link>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, fontFamily: 'Outfit' }}>
        Checkout & Payment
      </h1>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Delivery & Payment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Delivery Address */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} color="#0284c7"/> Delivery Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Street Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>City / Area</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Postal Code</label>
                <input type="text" defaultValue="00300" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}/>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} color="#10b981"/> Payment Method (LKR)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label onClick={() => setPaymentMethod('payhere')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            borderRadius: 12,
            border: paymentMethod === 'payhere' ? '2px solid #0284c7' : '1px solid var(--border)',
            background: paymentMethod === 'payhere' ? 'rgba(0,212,255,0.08)' : 'var(--bg-input)',
            cursor: 'pointer'
        }}>
                <input type="radio" name="payment" checked={paymentMethod === 'payhere'} onChange={() => setPaymentMethod('payhere')}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>PayHere Online Sandbox (LKR)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Visa, Mastercard, FriMi, Genie, eZ Cash, Internet Banking
                  </div>
                </div>
                <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  INSTANT
                </span>
              </label>

              <label onClick={() => setPaymentMethod('cod')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            borderRadius: 12,
            border: paymentMethod === 'cod' ? '2px solid #0284c7' : '1px solid var(--border)',
            background: paymentMethod === 'cod' ? 'rgba(0,212,255,0.08)' : 'var(--bg-input)',
            cursor: 'pointer'
        }}>
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Pay cash upon courier doorstep delivery in Sri Lanka
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', fontFamily: 'Outfit' }}>Payment Overview</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Total</span>
              <span style={{ fontWeight: 700 }}>{formattedGrandTotal || 'LKR 439,500'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Courier Delivery</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Price Snapshot</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>Immutable</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Amount Due</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>{formattedGrandTotal || 'LKR 439,500'}</span>
          </div>

          <button type="submit" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0284c7, #0066ff)',
            color: '#040d1a',
            fontWeight: 800,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 18px rgba(0,212,255,0.35)'
        }}>
            <Lock size={15}/>
            <span>Place Order Now</span>
          </button>
        </div>
      </form>
    </div>);
}
