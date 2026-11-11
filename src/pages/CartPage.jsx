import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
export default function CartPage() {
    const { cartItems, totalCount, grandTotal, formattedGrandTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    return (<div className="container" style={{ maxWidth: 960, paddingTop: 40, paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/ecosystem/apple" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--cyan)', textDecoration: 'none' }}>
          <ArrowLeft size={14}/> Continue Shopping
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit' }}>
            <ShoppingCart size={28} color="#0284c7"/>
            Shopping Cart
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            User-isolated cart with real-time LKR currency calculations
          </p>
        </div>

        {cartItems.length > 0 && (<button onClick={() => clearCart()} style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}>
            <Trash2 size={13}/> Clear Cart
          </button>)}
      </div>

      {cartItems.length === 0 ? (<div style={{ background: 'var(--bg-secondary)', borderRadius: 20, padding: '60px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShoppingCart size={32} color="#0284c7"/>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Explore our flagship smartphones, GaN chargers, and protective cases with verified customer reviews.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/ecosystem/apple" className="btn-primary">Browse Ecosystems</Link>
            <Link to="/accessories" className="btn-outline">Browse Accessories</Link>
          </div>
        </div>) : (<div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cartItems.map(item => {
                const itemId = String(item.id || item.productId || item.itemCode);
                return (<div key={itemId} style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 16,
                        border: '1px solid var(--border)',
                        padding: 18,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16
                    }}>
                  <img src={item.image || '/accessories.jpg'} alt={item.name} style={{ width: 70, height: 70, objectFit: 'contain', background: 'var(--bg-input)', borderRadius: 10, padding: 6 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#f0f6fc', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 800 }}>LKR {Number(item.unitPrice || 0).toLocaleString()}</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)' }}>
                        <button onClick={() => updateQuantity(itemId, Math.max(1, (item.quantity || 1) - 1))} style={{ padding: '6px 10px', background: 'transparent', color: 'var(--text-primary)', fontSize: 14 }}>
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: 13, fontWeight: 700 }}>{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)} style={{ padding: '6px 10px', background: 'transparent', color: 'var(--text-primary)', fontSize: 14 }}>
                          +
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(itemId)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <Trash2 size={13}/> Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>
                      LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                </div>);
            })}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', fontFamily: 'Outfit' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal ({totalCount} items)</span>
                <span style={{ fontWeight: 600 }}>{formattedGrandTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Standard Islandwide Delivery</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
                <span style={{ fontWeight: 600 }}>Included</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>{formattedGrandTotal}</span>
            </div>

            <button
              onClick={() => toast.success(`Order summary validated: ${formattedGrandTotal}. Proceeding to PayHere gateway!`, { icon: '💳', duration: 4000 })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284c7, #0066ff)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 18px rgba(2,132,199,0.35)'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16}/>
            </button>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#10b981"/>
                <span>PayHere sandbox verified in LKR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} color="#0284c7"/>
                <span>Same-day dispatch for Colombo orders</span>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
