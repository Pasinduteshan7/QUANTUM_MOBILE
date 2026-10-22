import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare, ShieldCheck, Truck, CheckCircle2, ArrowLeft, Check, Award } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
const mockProduct = {
    id: 'p1',
    name: 'Apple iPhone 16 Pro',
    brand: 'Apple',
    basePrice: 425000,
    originalPrice: 460000,
    image: '/iphone16pro.jpg',
    badge: 'FLAGSHIP',
    inStock: true,
    stockCount: 8,
    warranty: '1-Year Apple GenNext Warranty + 6-Mo Quantum Care',
    specs: [
        { label: 'Processor', value: 'Apple A18 Pro (3nm) with 6-core GPU & Neural Engine' },
        { label: 'Display', value: '6.3-inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits' },
        { label: 'Camera System', value: '48MP Fusion + 48MP Ultra-wide + 12MP 5x Telephoto' },
        { label: 'Chassis', value: 'Grade 5 Titanium frame with micro-blasted finish' },
        { label: 'Battery & Charging', value: 'Up to 27W wired PD, 25W MagSafe, all-day battery' },
        { label: 'Connectivity', value: 'USB-C 3.0 (10Gbps), Wi-Fi 7, Dual eSIM / Nano-SIM' },
    ],
    variants: {
        storage: [
            { size: '128GB', extra: -35000 },
            { size: '256GB', extra: 0 },
            { size: '512GB', extra: 55000 },
            { size: '1TB', extra: 110000 },
        ],
        colors: [
            { name: 'Black Titanium', hex: '#2b2b2b' },
            { name: 'Natural Titanium', hex: '#99958e' },
            { name: 'White Titanium', hex: '#e3e4e5' },
            { name: 'Desert Titanium', hex: '#c5b098' },
        ]
    }
};
const initialReviews = [
    {
        id: 'r1',
        user: 'Kasun Mendis',
        rating: 5,
        comment: 'Arrived sealed and fast dispatch. The titanium frame feels incredibly premium. Camera system is the best I have used.',
        date: '18 Oct 2024',
        isVerifiedBuyer: true,
        storeReply: 'Thank you, Kasun! Enjoy your new iPhone 16 Pro! Let us know if you need any accessory recommendations.'
    },
    {
        id: 'r2',
        user: 'Dilini Perera',
        rating: 5,
        comment: 'Battery life is amazing - easily gets through a full day with heavy usage. ProRes video is incredible for content creation.',
        date: '22 Oct 2024',
        isVerifiedBuyer: true,
        storeReply: null
    },
    {
        id: 'r3',
        user: 'Ruwan Senanayake',
        rating: 4,
        comment: 'Great phone overall. The Camera Control button takes a few days to get used to, but ProMotion is buttery smooth.',
        date: '24 Oct 2024',
        isVerifiedBuyer: true,
        storeReply: 'Thanks for the review Ruwan! Tip: You can adjust the Camera Control sensitivity in iOS Settings!'
    }
];
export default function ProductDetailPage() {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [selectedStorage, setSelectedStorage] = useState('256GB');
    const [selectedColor, setSelectedColor] = useState('Black Titanium');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState(initialReviews);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const currentStorageExtra = mockProduct.variants.storage.find(s => s.size === selectedStorage)?.extra || 0;
    const currentPrice = mockProduct.basePrice + currentStorageExtra;
    const handleAddToCart = () => {
        addToCart({
            id: `${mockProduct.id}-${selectedStorage}-${selectedColor}`,
            productId: mockProduct.id,
            itemCode: mockProduct.id,
            name: `${mockProduct.name} (${selectedStorage}, ${selectedColor})`,
            price: currentPrice,
            unitPrice: currentPrice,
            quantity,
            image: mockProduct.image
        });
        toast.success(`Added ${quantity}x ${mockProduct.name} to cart!`);
    };
    const openChat = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-store-chat', {
                detail: {
                    name: `${mockProduct.name} (${selectedStorage}, ${selectedColor})`,
                    price: currentPrice,
                    image: mockProduct.image
                }
            }));
        }
    };
    const handleAddReview = (e) => {
        e.preventDefault();
        if (!newComment.trim())
            return;
        const newRev = {
            id: 'rev-' + Date.now(),
            user: user?.name || 'Verified Customer',
            rating: newRating,
            comment: newComment,
            date: 'Just now',
            isVerifiedBuyer: true,
            storeReply: null
        };
        setReviews([newRev, ...reviews]);
        toast.success('Your verified review has been posted successfully!');
        setNewComment('');
        setShowReviewModal(false);
    };
    return (<div style={{ background: '#ffffff', minHeight: 'calc(100vh - 72px)', padding: '28px 0 64px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link to="/phones" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>
            <ArrowLeft size={14}/> Back to Catalog
          </Link>
        </div>

        {/* Main Showcase Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 36, marginBottom: 48 }}>
          {/* Left: Product Images Showcase */}
          <div style={{ background: '#f8fafc', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 440 }}>
            <span style={{ alignSelf: 'flex-start', background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
              {mockProduct.badge}
            </span>
            <img src={mockProduct.image} alt={mockProduct.name} style={{ maxWidth: '85%', maxHeight: 340, objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.1))', margin: '20px 0' }}/>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {[1, 2, 3].map(th => (<div key={th} style={{
                width: 54,
                height: 54,
                borderRadius: 10,
                background: '#ffffff',
                border: th === 1 ? '2px solid #0284c7' : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}>
                  <img src={mockProduct.image} alt="thumbnail" style={{ width: 38, height: 38, objectFit: 'contain' }}/>
                </div>))}
            </div>
          </div>

          {/* Right: Specs, Variants & Actions */}
          <div>
            <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {mockProduct.brand}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: '4px 0 10px', fontFamily: 'Outfit, sans-serif', color: '#0f172a' }}>
              {mockProduct.name}
            </h1>

            {/* Rating Summary Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fffbeb', color: '#d97706', padding: '4px 8px', borderRadius: 6, fontWeight: 800, fontSize: 13, border: '1px solid #fde68a' }}>
                <Star size={14} fill="#d97706"/>
                <span>4.8</span>
              </div>
              <a href="#reviews" style={{ fontSize: 13, color: '#64748b', textDecoration: 'underline' }}>
                ({reviews.length} Verified Buyer Reviews)
              </a>
              <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12}/> TRCSL Approved
              </span>
            </div>

            {/* Price Snapshot */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                LKR {currentPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: 16, color: '#94a3b8', textDecoration: 'line-through' }}>
                LKR {(mockProduct.originalPrice + currentStorageExtra).toLocaleString()}
              </span>
              <span style={{ fontSize: 11, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                SAVE LKR 35,000
              </span>
            </div>

            {/* Storage Variant Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                Select Storage Capacity
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {mockProduct.variants.storage.map(st => (<button key={st.size} onClick={() => setSelectedStorage(st.size)} style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: selectedStorage === st.size ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedStorage === st.size ? '#f0f9ff' : '#ffffff',
                color: selectedStorage === st.size ? '#0284c7' : '#0f172a',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer'
            }}>
                    {st.size}
                  </button>))}
              </div>
            </div>

            {/* Color Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                Finish: <strong style={{ color: '#0f172a' }}>{selectedColor}</strong>
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {mockProduct.variants.colors.map(col => (<button key={col.name} onClick={() => setSelectedColor(col.name)} title={col.name} style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: col.hex,
                border: selectedColor === col.name ? '3px solid #0284c7' : '2px solid #cbd5e1',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                    {selectedColor === col.name && <Check size={14} color="#fff" strokeWidth={3}/>}
                  </button>))}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10 }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 14px', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
                  -
                </button>
                <span style={{ padding: '0 8px', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '10px 14px', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} style={{
            flex: 1,
            padding: '12px 24px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(2,132,199,0.3)'
        }}>
                <ShoppingCart size={18}/> Add to Cart
              </button>

              <button onClick={openChat} style={{
            padding: '12px 18px',
            borderRadius: 10,
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }}>
                <MessageSquare size={16}/> Ask Specialist
              </button>
            </div>

            {/* Assurances */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                <Truck size={16} color="#059669"/>
                <span>Islandwide Courier / Colombo Pickup</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                <ShieldCheck size={16} color="#0284c7"/>
                <span>{mockProduct.warranty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div style={{ background: '#ffffff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 48, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 18px', fontFamily: 'Outfit', color: '#0f172a' }}>
            Technical Specifications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {mockProduct.specs.map((sp, i) => (<div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '12px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>{sp.label}</span>
                <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, marginTop: 4 }}>{sp.value}</span>
              </div>))}
          </div>
        </div>

        {/* Verified Reviews Section (Section 8.8 Wireframe) */}
        <div id="reviews" style={{ background: '#ffffff', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, fontFamily: 'Outfit', color: '#0f172a' }}>
                  Verified Buyer Reviews
                </h2>
                <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 6, fontWeight: 800 }}>
                  DELIVERY REQUIRED
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                Only customers with a confirmed, delivered order can submit ratings (NFR8 Review Integrity).
              </p>
            </div>

            <button onClick={() => setShowReviewModal(true)} style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(5,150,105,0.25)'
        }}>
              <Award size={16}/> Write a Verified Review
            </button>
          </div>

          {/* Rating Breakdown Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 22, background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#d97706', fontFamily: 'Outfit', lineHeight: 1 }}>4.8</div>
              <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '6px 0 2px' }}>
                {[1, 2, 3, 4, 5].map(st => (<Star key={st} size={15} fill="#d97706" color="#d97706"/>))}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Based on {reviews.length} reviews</div>
            </div>

            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
            { star: 5, pct: 85 },
            { star: 4, pct: 15 },
            { star: 3, pct: 0 },
            { star: 2, pct: 0 },
            { star: 1, pct: 0 },
        ].map(r => (<div key={r.star} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ width: 44, color: '#475569', fontWeight: 600 }}>{r.star} stars</span>
                  <div style={{ flex: 1, height: 7, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${r.pct}%`, height: '100%', background: '#d97706', borderRadius: 4 }}/>
                  </div>
                  <span style={{ width: 30, color: '#64748b', textAlign: 'right' }}>{r.pct}%</span>
                </div>))}
            </div>
          </div>

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map(rev => (<div key={rev.id} style={{ padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{rev.user}</span>
                    {rev.isVerifiedBuyer && (<span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12}/> Verified Buyer
                      </span>)}
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{rev.date}</span>
                </div>

                <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map(st => (<Star key={st} size={14} fill={st <= rev.rating ? '#d97706' : 'none'} color={st <= rev.rating ? '#d97706' : '#cbd5e1'}/>))}
                </div>

                <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.55 }}>
                  &ldquo;{rev.comment}&rdquo;
                </div>

                {/* Official Store Reply (Section 8.8) */}
                {rev.storeReply && (<div style={{ marginTop: 14, padding: '12px 16px', background: '#f0f9ff', borderRadius: 10, borderLeft: '3px solid #0284c7' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', marginBottom: 3, textTransform: 'uppercase' }}>
                      Official Quantum Mobile Store Reply:
                    </div>
                    <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.45 }}>
                      {rev.storeReply}
                    </div>
                  </div>)}
              </div>))}
          </div>
        </div>

        {/* Write Review Modal */}
        {showReviewModal && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <form onSubmit={handleAddReview} style={{ background: '#ffffff', padding: 28, borderRadius: 20, border: '1px solid #cbd5e1', width: '100%', maxWidth: 520, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Write a Verified Buyer Review</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
                Order #ORD-5521 (Delivered on 14 Nov 2024) verified. Your review will display the Verified Buyer badge.
              </p>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                  Your Star Rating
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(st => (<button type="button" key={st} onClick={() => setNewRating(st)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <Star size={24} fill={st <= newRating ? '#d97706' : 'none'} color={st <= newRating ? '#d97706' : '#cbd5e1'}/>
                    </button>))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                  Your Review
                </label>
                <textarea rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your experience regarding build quality, battery life, camera performance..." required style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, color: '#0f172a', fontSize: 13 }}/>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer'
            }}>
                  Submit Verified Review
                </button>
                <button type="button" onClick={() => setShowReviewModal(false)} style={{
                padding: '10px 16px',
                borderRadius: 8,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                cursor: 'pointer'
            }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>)}
      </div>
    </div>);
}
