import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  CreditCard,
  Banknote,
  QrCode,
  Zap,
  Wrench,
  Package,
  ShoppingBag,
  X,
  AlertCircle
} from 'lucide-react';
import { formatLKR } from '@/services/cartService';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';

export default function PosTerminal({ products = [], repairs = [], onSaleCompleted }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState(null);

  // Billing & Tender state
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash' | 'Card' | 'LankaQR' | 'Koko Pay'
  const [amountPaid, setAmountPaid] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Thermal Receipt Modal
  const [completedSale, setCompletedSale] = useState(null);

  // Filter products (Organized in price descending order)
  const categories = ['All', 'Phones', 'Accessories', 'Chargers', 'Audio', 'Protection'];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

  // Ready repairs that can be collected at the counter
  const readyRepairs = repairs.filter(r => ['Ready', 'Quality Tested'].includes(r.status));

  // Add product to POS bill
  const handleAddToCart = (product) => {
    if ((product.stock || 0) <= 0) {
      toast.error('Item is out of stock in physical store!');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} units available in store stock.`);
          return prev;
        }
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          quantity: 1,
          lineTotal: product.price,
          image: product.mainImage || (product.images && product.images[0]) || ''
        }
      ];
    });
  };

  const handleUpdateQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, lineTotal: newQty * item.price }
              : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Add repair ticket to bill
  const handleAttachRepair = (repair) => {
    setSelectedRepair({
      ticketId: repair.ticketId,
      repairId: repair._id,
      deviceModel: `${repair.deviceBrand} ${repair.deviceModel}`,
      issueLabel: repair.issueLabel,
      repairAmount: repair.frozenCost || (typeof repair.estimatedCost === 'number' ? repair.estimatedCost : 15000)
    });
    toast.success(`Attached Repair Ticket #${repair.ticketId} to counter bill`);
  };

  const handleRemoveRepair = () => {
    setSelectedRepair(null);
  };

  // Calculations
  const productsSubtotal = cart.reduce((acc, item) => acc + item.lineTotal, 0);
  const repairAmount = selectedRepair?.repairAmount || 0;
  const subtotal = productsSubtotal + repairAmount;
  const netTotal = Math.max(0, subtotal - (Number(discount) || 0));
  const changeDue = paymentMethod === 'Cash' ? Math.max(0, (Number(amountPaid) || 0) - netTotal) : 0;

  // Auto-fill exact amount paid if not cash
  useEffect(() => {
    if (paymentMethod !== 'Cash') {
      setAmountPaid(netTotal.toString());
    }
  }, [paymentMethod, netTotal]);

  // Complete Walk-in POS Sale
  const handleCompleteSale = async () => {
    if (cart.length === 0 && !selectedRepair) {
      toast.error('Add at least one product or repair ticket to the counter bill.');
      return;
    }

    if (paymentMethod === 'Cash' && (Number(amountPaid) || 0) < netTotal) {
      toast.error(`Cash received (LKR ${amountPaid || 0}) is less than total bill (LKR ${netTotal})!`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        items: cart,
        repairTicket: selectedRepair,
        subtotal,
        discount: Number(discount) || 0,
        netTotal,
        paymentMethod,
        amountPaid: Number(amountPaid) || netTotal,
        customerName: customerName.trim() || 'Walk-in Customer',
        customerPhone: customerPhone.trim(),
        cashierName: 'Nimal Jayawardena (Counter 01)',
        receiptNotes: '6-Month Comprehensive In-Store Warranty Included. Serial/IMEI logged.'
      };

      const res = await adminService.createPosSale(payload);
      if (res?.data) {
        toast.success(`Sale #${res.data.saleNumber} completed! Stock deducted live in MongoDB.`, { icon: '🧾' });
        setCompletedSale(res.data);
        // Clear cart
        setCart([]);
        setSelectedRepair(null);
        setDiscount(0);
        setAmountPaid('');
        if (onSaleCompleted) onSaleCompleted();
      }
    } catch (err) {
      console.error('POS Checkout failed:', err);
      toast.error(err.response?.data?.message || 'Failed to complete POS transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, alignItems: 'start' }}>
      {/* LEFT: PRODUCTS CATALOG & READY REPAIRS SELECTOR */}
      <div>
        {/* Header & Category Filters */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Scan barcode or type product name, model (iPhone, S25, Charger)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedCategory === cat ? '#0284c7' : '#f1f5f9',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Repair Pickup Banner (If there are ready repairs) */}
        {readyRepairs.length > 0 && !selectedRepair && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wrench size={15} /> {readyRepairs.length} Repaired Devices Ready for Counter Pickup
              </div>
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Click to bill & release phone</span>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {readyRepairs.map(r => (
                <button
                  key={r._id}
                  onClick={() => handleAttachRepair(r)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #a7f3d0',
                    borderRadius: 10,
                    padding: '8px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    minWidth: 190,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>
                    #{r.ticketId} — {r.deviceModel}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Cust: {r.customerName}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', marginTop: 3 }}>
                    Frozen Quote: {formatLKR(r.frozenCost || r.estimatedCost || 0)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 14 }}>
          {filteredProducts.map(product => {
            const inStock = (product.stock || 0) > 0;
            const isLow = inStock && product.stock <= 5;
            return (
              <div
                key={product._id}
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: 110, background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' }}>
                    {product.mainImage || (product.images && product.images[0]) ? (
                      <img
                        src={product.mainImage || product.images[0]}
                        alt={product.name}
                        style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                      />
                    ) : (
                      <ShoppingBag size={28} style={{ color: '#cbd5e1' }} />
                    )}

                    <span
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: inStock ? (isLow ? '#fffbeb' : '#ecfdf5') : '#fef2f2',
                        color: inStock ? (isLow ? '#b45309' : '#059669') : '#dc2626'
                      }}
                    >
                      {inStock ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                    {product.brand}
                  </div>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: '2px 0 6px', lineHeight: 1.3, height: 32, overflow: 'hidden' }}>
                    {product.name}
                  </h4>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
                    {formatLKR(product.price)}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!inStock}
                    style={{
                      width: '100%',
                      padding: '7px 0',
                      borderRadius: 8,
                      border: 'none',
                      background: inStock ? '#0284c7' : '#e2e8f0',
                      color: inStock ? '#ffffff' : '#94a3b8',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Plus size={13} /> Add to Bill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: CURRENT COUNTER BILL & TENDER DRAWER */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
              Counter Sale Bill
            </h3>
            <span style={{ fontSize: 11, color: '#64748b' }}>Cashier: Nimal (Counter 01)</span>
          </div>
          {(cart.length > 0 || selectedRepair) && (
            <button
              onClick={() => { setCart([]); setSelectedRepair(null); }}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              Clear Bill
            </button>
          )}
        </div>

        {/* Bill Items */}
        <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ maxWidth: 180 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {formatLKR(item.price)} each
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => handleUpdateQty(item.productId, -1)}
                  style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={11} />
                </button>
                <span style={{ fontSize: 12, fontWeight: 800, minWidth: 16, textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQty(item.productId, 1)}
                  style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={11} />
                </button>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2, marginLeft: 4 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Attached Repair Ticket */}
          {selectedRepair && (
            <div style={{ padding: '8px 10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#065f46' }}>
                  🔧 Repair #{selectedRepair.ticketId}
                </div>
                <div style={{ fontSize: 10, color: '#047857' }}>
                  {selectedRepair.deviceModel} ({selectedRepair.issueLabel})
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#065f46' }}>
                  {formatLKR(selectedRepair.repairAmount)}
                </span>
                <button
                  onClick={handleRemoveRepair}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {cart.length === 0 && !selectedRepair && (
            <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8', fontSize: 12 }}>
              <ShoppingBag size={28} style={{ margin: '0 auto 6px', display: 'block', color: '#cbd5e1' }} />
              No items on counter bill. Click products on left or attach a repair.
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
                Phone Number (for SMS)
              </label>
              <input
                type="text"
                placeholder="077XXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#475569', marginBottom: 6 }}>
            PAYMENT TENDER METHOD:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            {[
              { id: 'Cash', label: 'Cash', icon: Banknote },
              { id: 'Card', label: 'Card POS', icon: CreditCard },
              { id: 'LankaQR', label: 'LankaQR', icon: QrCode },
              { id: 'Koko Pay', label: 'Koko Pay', icon: Zap }
            ].map(m => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: 8,
                    border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#0284c7' : '#475569',
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <Icon size={14} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bill Breakdown & Net Total */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            <span>Subtotal:</span>
            <span>{formatLKR(subtotal)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
            <span>Discount (LKR):</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              style={{ width: 80, padding: '2px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 11, textAlign: 'right' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: 6, marginBottom: 6 }}>
            <span>Net Total:</span>
            <span style={{ color: '#0284c7' }}>{formatLKR(netTotal)}</span>
          </div>

          {paymentMethod === 'Cash' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Cash Received:</span>
                <input
                  type="number"
                  placeholder={netTotal.toString()}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  style={{ width: 100, padding: '3px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 800, textAlign: 'right' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#059669' }}>
                <span>Change to Return:</span>
                <span>{formatLKR(changeDue)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Complete Sale Button */}
        <button
          onClick={handleCompleteSale}
          disabled={submitting || (cart.length === 0 && !selectedRepair)}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 800,
            cursor: (cart.length === 0 && !selectedRepair) || submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}
        >
          <Printer size={16} />
          {submitting ? 'Processing Bill...' : `Complete Sale & Print Receipt (${formatLKR(netTotal)})`}
        </button>
      </div>

      {/* MODAL: PRINTABLE THERMAL RECEIPT */}
      {completedSale && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              border: '1px solid #e2e8f0',
              fontFamily: "'Courier New', Courier, monospace"
            }}
          >
            {/* Receipt Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #94a3b8', paddingBottom: 12, marginBottom: 12 }}>
              <h2 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                QUANTUM MOBILE
              </h2>
              <div style={{ fontSize: 11, color: '#475569' }}>
                42 Galle Road, Colombo 03, Sri Lanka
              </div>
              <div style={{ fontSize: 10, color: '#64748b' }}>Tel: +94 11 234 5678 | VAT Reg: 10482910-7000</div>
              <div style={{ fontSize: 11, fontWeight: 800, marginTop: 6, color: '#0284c7' }}>
                BILL #{completedSale.saleNumber}
              </div>
              <div style={{ fontSize: 10, color: '#64748b' }}>
                {new Date(completedSale.createdAt).toLocaleString('en-GB')}
              </div>
            </div>

            {/* Cashier & Customer Info */}
            <div style={{ fontSize: 11, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>Cashier: Nimal</span>
              <span>Cust: {completedSale.customerName}</span>
            </div>

            {/* Line items */}
            <div style={{ borderBottom: '1px dashed #94a3b8', paddingBottom: 10, marginBottom: 10 }}>
              {completedSale.items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span>{it.quantity}x {it.name}</span>
                  <span>{formatLKR(it.lineTotal)}</span>
                </div>
              ))}

              {completedSale.repairTicket?.ticketId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#065f46', marginBottom: 4 }}>
                  <span>Repair #{completedSale.repairTicket.ticketId} ({completedSale.repairTicket.deviceModel})</span>
                  <span>{formatLKR(completedSale.repairTicket.repairAmount)}</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{ fontSize: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span>Subtotal:</span>
                <span>{formatLKR(completedSale.subtotal)}</span>
              </div>
              {completedSale.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Discount:</span>
                  <span>-{formatLKR(completedSale.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                <span>NET TOTAL:</span>
                <span>{formatLKR(completedSale.netTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
                <span>Method ({completedSale.paymentMethod}):</span>
                <span>{formatLKR(completedSale.amountPaid)}</span>
              </div>
              {completedSale.changeGiven > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: '#059669' }}>
                  <span>Change Given:</span>
                  <span>{formatLKR(completedSale.changeGiven)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', borderTop: '1px dashed #94a3b8', paddingTop: 10, fontSize: 10, color: '#64748b' }}>
              <div>{completedSale.receiptNotes}</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>*** THANK YOU FOR VISITING QUICK / QUANTUM MOBILE ***</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setCompletedSale(null)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Bill
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: 'none',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Printer size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
