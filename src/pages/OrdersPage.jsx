import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Star, Clock, RefreshCw, ShoppingBag, ArrowRight, Copy, Check, Radio } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { reviewService } from '@/services/reviewService';
import { getSocket, joinUserRoom } from '@/services/socket';

const normalizeOrder = (order) => {
  if (!order) return null;
  const rawId = order._id ? order._id.toString() : (order.rawId || '');
  const shortId = order.id && order.id.startsWith('ORD-')
    ? order.id
    : ('ORD-' + (rawId ? rawId.slice(-6).toUpperCase() : Math.floor(1000 + Math.random() * 9000)));

  const rawUserId = order.user?._id || order.user || order.userId;
  const userId = rawUserId ? rawUserId.toString() : null;

  const rawStatus = (order.orderStatus || '').toUpperCase();
  const orderStatus = rawStatus === 'DELIVERED'
    ? 'Delivered'
    : rawStatus === 'SHIPPED'
      ? 'Shipped'
      : rawStatus === 'CANCELLED'
        ? 'Cancelled'
        : 'Processing';

  const waybillNumber = order.waybillNumber || '';
  const courierPartner = order.courierPartner || 'Domex Express';
  const courierTracking = waybillNumber || (rawStatus === 'SHIPPED' || rawStatus === 'DELIVERED' ? ('DOM-' + (rawId ? rawId.slice(-6).toUpperCase() : '882103')) : null);

  return {
    id: shortId,
    rawId,
    userId,
    items: (order.orderItems || order.items || []).map((it) => ({
      name: it.name,
      qty: it.quantity || it.qty || 1,
      price: Number(it.price || 0),
      image: it.image || '/accessories.jpg',
      productId: it.product ? (it.product._id || it.product) : (it.productId || null)
    })),
    total: Number(order.totalPrice || order.itemsPrice || order.total || 0),
    paymentMethod: order.paymentMethod === 'CashOnDelivery' ? 'COD' : order.paymentMethod || 'Stripe (LKR)',
    paymentStatus: order.isPaid || order.paymentStatus === 'Paid' ? 'Paid' : 'Pending',
    orderStatus,
    courierPartner,
    waybillNumber,
    estimatedDelivery: order.estimatedDelivery || '24–48 Hours across Sri Lanka',
    courierTracking,
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
};

const mockOrders = [
  {
    id: 'ORD-5521',
    rawId: 'mock-ord-5521',
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
    rawId: 'mock-ord-5489',
    items: [
      { name: 'Galaxy S24 Ultra 512GB Titanium Gray', qty: 1, price: 449000, image: '/samsung_s24.jpg' }
    ],
    total: 449000,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    courierTracking: null,
    createdAt: '2024-11-18'
  }
];

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    let cachedList = [];
    try {
      const stored = localStorage.getItem('quantum_customer_orders');
      if (stored) {
        cachedList = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not parse cached orders:', e);
    }

    // 1. Sync cached orders with live statuses from MongoDB (Public Status Sync)
    if (cachedList.length > 0) {
      try {
        const lookupRes = await fetch('http://localhost:5000/api/orders/lookup-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderIds: cachedList.map(c => c.id || c.rawId) })
        });
        const lookupData = await lookupRes.json();
        if (lookupData.success && Array.isArray(lookupData.data) && lookupData.data.length > 0) {
          const freshMap = new Map();
          lookupData.data.forEach(dbOrd => {
            const norm = normalizeOrder(dbOrd);
            if (norm) {
              freshMap.set(norm.id, norm);
              if (norm.rawId) freshMap.set(norm.rawId, norm);
            }
          });

          // Update cachedList with live database values
          cachedList = cachedList.map(cached => {
            const cleanId = (cached.id || '').toUpperCase();
            const fresh = freshMap.get(cleanId) || Array.from(freshMap.values()).find(f => cleanId.includes(f.rawId ? f.rawId.slice(-6).toUpperCase() : '___'));
            if (fresh) {
              return { ...cached, ...fresh, items: cached.items && cached.items.length > 0 ? cached.items : fresh.items };
            }
            return cached;
          });

          // Save fresh state back to localStorage
          localStorage.setItem('quantum_customer_orders', JSON.stringify(cachedList));
        }
      } catch (err) {
        console.warn('Live order status lookup failed:', err.message);
      }
    }

    let backendList = [];
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('quantum_token') : null);

    if (activeToken) {
      try {
        const res = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          backendList = data.data.map(normalizeOrder).filter(Boolean);
        }
      } catch (err) {
        console.warn('Backend fetch /api/orders/my-orders unavailable:', err.message);
      }
    }

    // Combine:
    // 1. Cached orders (from recent checkouts)
    // 2. Backend persisted orders
    // 3. Fallback mock historical orders
    const combinedMap = new Map();

    // 1. Put cached orders first
    cachedList.forEach((ord) => {
      const normalized = normalizeOrder(ord);
      if (normalized && normalized.id) combinedMap.set(normalized.id, normalized);
    });

    // 2. Put / update with backend orders
    backendList.forEach((ord) => {
      if (ord && ord.id) combinedMap.set(ord.id, ord);
    });

    // 3. Put mock orders as historical fallback if not already present
    mockOrders.forEach((ord) => {
      if (ord && ord.id && !combinedMap.has(ord.id)) {
        combinedMap.set(ord.id, ord);
      }
    });

    const finalOrders = Array.from(combinedMap.values());
    setOrders(finalOrders);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Real-time synchronization with Admin Operations Hub via Socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const currentUserId = user?._id || (typeof window !== 'undefined' ? localStorage.getItem('quantum_user_id') : null);
    if (currentUserId) {
      joinUserRoom(currentUserId);
    }

    const handleOrderUpdate = (rawOrder) => {
      if (!rawOrder) return;
      const updated = normalizeOrder(rawOrder);
      if (!updated) return;

      const orderOwnerId = updated.userId;

      setOrders((prev) => {
        // Match by raw Mongo ID, short ORD- id, or 6-char hex suffix
        const index = prev.findIndex(
          (o) =>
            (o.rawId && updated.rawId && o.rawId === updated.rawId) ||
            (o.id && o.id === updated.id) ||
            (o.id && updated.rawId && o.id.includes(updated.rawId.slice(-6).toUpperCase())) ||
            (updated.id && o.rawId && updated.id.includes(o.rawId.slice(-6).toUpperCase()))
        );

        if (index !== -1) {
          const next = [...prev];
          next[index] = {
            ...next[index],
            ...updated,
            orderStatus: updated.orderStatus,
            courierPartner: updated.courierPartner || next[index].courierPartner,
            waybillNumber: updated.waybillNumber || next[index].waybillNumber,
            courierTracking: updated.waybillNumber || updated.courierTracking || next[index].courierTracking,
            items: updated.items && updated.items.length > 0 ? updated.items : next[index].items
          };

          // Also update localStorage so cached orders stay permanently fresh
          try {
            const stored = JSON.parse(localStorage.getItem('quantum_customer_orders') || '[]');
            const updatedCache = stored.map((s) => {
              const matches =
                s.id === updated.id ||
                (s.id && updated.rawId && s.id.includes(updated.rawId.slice(-6).toUpperCase()));
              if (matches) {
                return {
                  ...s,
                  ...updated,
                  orderStatus: updated.orderStatus,
                  waybillNumber: updated.waybillNumber,
                  courierTracking: updated.waybillNumber || updated.courierTracking
                };
              }
              return s;
            });
            localStorage.setItem('quantum_customer_orders', JSON.stringify(updatedCache));
          } catch (e) {}

          const waybillNotice = updated.waybillNumber ? ` (Waybill: ${updated.waybillNumber})` : '';
          toast.success(
            `⚡ Live Update: Order ${updated.id} status changed to ${updated.orderStatus}${waybillNotice}!`,
            { duration: 5000, id: `order-live-${updated.id}` }
          );

          return next;
        } else if (orderOwnerId && currentUserId && orderOwnerId === currentUserId) {
          return [updated, ...prev];
        }
        return prev;
      });
    };

    const handleOrderCreated = (rawOrder) => {
      if (!rawOrder) return;
      const created = normalizeOrder(rawOrder);
      if (!created) return;

      const orderOwnerId = created.userId;
      if (currentUserId && orderOwnerId && currentUserId === orderOwnerId) {
        setOrders((prev) => {
          if (prev.some((o) => (o.rawId && created.rawId && o.rawId === created.rawId) || o.id === created.id)) {
            return prev;
          }
          return [created, ...prev];
        });
        toast.success(`🎉 Order ${created.id} confirmed and syncing live!`, { duration: 4000 });
      }
    };

    socket.on('order:statusUpdated', handleOrderUpdate);
    socket.on('order:myStatusUpdated', handleOrderUpdate);
    socket.on('order:created', handleOrderCreated);
    socket.on('order:myCreated', handleOrderCreated);

    return () => {
      socket.off('order:statusUpdated', handleOrderUpdate);
      socket.off('order:myStatusUpdated', handleOrderUpdate);
      socket.off('order:created', handleOrderCreated);
      socket.off('order:myCreated', handleOrderCreated);
    };
  }, [user?._id]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await reviewService.submitProductReview({
        productId: reviewModalItem?.productId || reviewModalItem?.id,
        rating,
        comment
      });
      toast.success(`Verified review submitted for ${reviewModalItem?.name || 'product'} and saved to database!`);
      setReviewModalItem(null);
      setComment('');
    } catch (err) {
      toast.error(err.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, paddingTop: 40, paddingBottom: 80 }}>
      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit' }}>
            <Package size={28} color="#0284c7" />
            My Orders & Invoices
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Track live courier dispatch, download official tax receipts, and post verified buyer reviews.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            title="Real-time WebSocket active. Order status, courier tracking, and invoice payments update live without needing a page refresh."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34, 197, 94, 0.08)',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
                display: 'inline-block'
              }}
            />
            Live Synced (No Refresh Needed)
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 14px',
              color: 'var(--text-primary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Refresh Orders'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 && !loading ? (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 18,
            border: '1px solid var(--border)',
            padding: 48,
            textAlign: 'center'
          }}
        >
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No orders placed yet</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            Browse our catalog and experience fast checkout with islandwide Colombo dispatch.
          </p>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0284c7',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none'
            }}
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 18,
                border: '1px solid var(--border)',
                padding: 24,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              {/* Order Top Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 14,
                  marginBottom: 16,
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>
                      {order.id}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Placed on {order.createdAt}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: order.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {order.paymentStatus}
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background:
                        order.orderStatus === 'Delivered'
                          ? 'rgba(16,185,129,0.2)'
                          : order.orderStatus === 'Cancelled'
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(0,212,255,0.2)',
                      color:
                        order.orderStatus === 'Delivered'
                          ? '#10b981'
                          : order.orderStatus === 'Cancelled'
                            ? '#ef4444'
                            : '#0284c7'
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {(order.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img
                      src={it.image || '/accessories.jpg'}
                      alt={it.name}
                      onError={(e) => { e.currentTarget.src = '/accessories.jpg'; }}
                      style={{
                        width: 52,
                        height: 52,
                        objectFit: 'contain',
                        background: 'var(--bg-input)',
                        borderRadius: 8,
                        padding: 4
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{it.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Qty: {it.qty} &bull; Price Protected
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--cyan)', fontSize: 14 }}>
                        LKR {Number(it.price || 0).toLocaleString()}
                      </div>
                      {order.orderStatus === 'Delivered' && (
                        <button
                          onClick={() => setReviewModalItem({
                            name: it.name,
                            productId: it.productId,
                            orderId: order.rawId,
                            orderRef: order.id
                          })}
                          style={{
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
                          }}
                        >
                          <Star size={11} fill="#10b981" /> Write Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dedicated Courier & Tracking Container */}
              <div
                style={{
                  background: order.orderStatus === 'Delivered'
                    ? 'rgba(16, 185, 129, 0.06)'
                    : order.orderStatus === 'Shipped' || order.waybillNumber
                    ? 'rgba(2, 132, 199, 0.06)'
                    : 'var(--bg-input)',
                  border: order.orderStatus === 'Delivered'
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : order.orderStatus === 'Shipped' || order.waybillNumber
                    ? '1px solid rgba(2, 132, 199, 0.25)'
                    : '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  marginBottom: 16
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: order.orderStatus === 'Delivered' ? '#10b981' : '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Truck size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {order.courierPartner || 'Domex Express'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {order.estimatedDelivery || '24–48 Hours across Sri Lanka'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: order.orderStatus === 'Delivered'
                        ? '#ecfdf5'
                        : order.orderStatus === 'Shipped'
                        ? '#eff6ff'
                        : '#fffbeb',
                      color: order.orderStatus === 'Delivered'
                        ? '#059669'
                        : order.orderStatus === 'Shipped'
                        ? '#2563eb'
                        : '#d97706',
                      border: order.orderStatus === 'Delivered'
                        ? '1px solid #a7f3d0'
                        : order.orderStatus === 'Shipped'
                        ? '1px solid #bfdbfe'
                        : '1px solid #fde68a'
                    }}
                  >
                    {order.orderStatus === 'Delivered'
                      ? '✓ DELIVERED TO DOORSTEP'
                      : order.orderStatus === 'Shipped'
                      ? '🚚 IN TRANSIT WITH COURIER'
                      : '⏳ PREPARING IN WAREHOUSE'}
                  </span>
                </div>

                {order.waybillNumber || order.courierTracking ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      marginTop: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Waybill / Tracking:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#0284c7', fontSize: 13.5 }}>
                        {order.waybillNumber || order.courierTracking}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(order.waybillNumber || order.courierTracking);
                        toast.success(`Waybill #${order.waybillNumber || order.courierTracking} copied!`, { icon: '📋' });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700
                      }}
                      title="Copy Waybill Number"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    Package is being inspected and prepared for courier handover from Colombo central fulfillment hub.
                  </div>
                )}
              </div>

              {/* Order Total & Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  fontSize: 13
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Amount:</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'Outfit' }}>
                    LKR {Number(order.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}
        >
          <form
            onSubmit={submitReview}
            style={{
              background: 'var(--bg-secondary)',
              padding: 28,
              borderRadius: 20,
              border: '1px solid var(--border)',
              width: '100%',
              maxWidth: 520
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>Write Verified Review</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
              Item: <strong>{typeof reviewModalItem === 'object' ? reviewModalItem.name : reviewModalItem}</strong> &bull; Order Delivered
            </p>

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  textTransform: 'uppercase'
                }}
              >
                Star Rating
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setRating(st)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Star
                      size={24}
                      fill={st <= rating ? '#f59e0b' : 'none'}
                      color={st <= rating ? '#f59e0b' : 'var(--border)'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  textTransform: 'uppercase'
                }}
              >
                Your Review
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your authentic feedback..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: 13
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
              </button>
              <button
                type="button"
                onClick={() => setReviewModalItem(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
