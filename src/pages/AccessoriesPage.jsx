import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Headphones, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
const accessoryProducts = [
    {
        id: 'acc-1',
        name: 'Anker 65W GaN Fast Charger',
        brand: 'Anker',
        category: 'Chargers',
        price: 14500,
        originalPrice: 18000,
        avgRating: 4.9,
        reviewCount: 112,
        image: '/accessories.jpg',
        specs: '65W Dual USB-C + USB-A, GaNPrime technology, fold-flat pins, supports laptops',
        badge: 'BESTSELLER'
    },
    {
        id: 'acc-2',
        name: 'Spigen Ultra Hybrid MagSafe Case',
        brand: 'Spigen',
        category: 'Cases',
        price: 6800,
        originalPrice: 8500,
        avgRating: 4.8,
        reviewCount: 89,
        image: '/accessories.jpg',
        specs: 'Air Cushion military drop protection, anti-yellowing back, strong N52 magnets',
        badge: 'HOT'
    },
    {
        id: 'acc-3',
        name: 'Belkin UltraGlass 2 Screen Protector',
        brand: 'Belkin',
        category: 'Screen',
        price: 4500,
        originalPrice: 5500,
        avgRating: 4.7,
        reviewCount: 64,
        image: '/accessories.jpg',
        specs: '0.29mm ultra-thin double ion-exchange glass, antimicrobial, alignment tray included',
        badge: null
    },
    {
        id: 'acc-4',
        name: 'Apple MagSafe 25W Charger (1m)',
        brand: 'Apple',
        category: 'Chargers',
        price: 18500,
        originalPrice: 21000,
        avgRating: 4.9,
        reviewCount: 145,
        image: '/accessories.jpg',
        specs: 'Up to 25W fast magnetic wireless charging for iPhone 16 series, braided cable',
        badge: 'APPLE OEM'
    },
    {
        id: 'acc-5',
        name: 'Sony WF-1000XM5 Noise Cancelling TWS',
        brand: 'Sony',
        category: 'Audio',
        price: 89000,
        originalPrice: 99000,
        avgRating: 4.9,
        reviewCount: 78,
        image: '/accessories.jpg',
        specs: 'Industry-leading noise cancellation, LDAC Hi-Res Audio, 24-hr battery, multipoint',
        badge: 'HI-RES'
    },
    {
        id: 'acc-6',
        name: 'Samsung 45W Power Adapter with Cable',
        brand: 'Samsung',
        category: 'Chargers',
        price: 12500,
        originalPrice: 15000,
        avgRating: 4.8,
        reviewCount: 92,
        image: '/accessories.jpg',
        specs: 'Super Fast Charging 2.0 (PPS), 5A Type-C to Type-C cable included, S24 Ultra ready',
        badge: 'SAMSUNG'
    },
    {
        id: 'acc-7',
        name: 'Spigen Tough Armor Heavy Duty Case',
        brand: 'Spigen',
        category: 'Cases',
        price: 7500,
        originalPrice: 9000,
        avgRating: 4.6,
        reviewCount: 53,
        image: '/accessories.jpg',
        specs: 'Dual-layer shock absorbent TPU + polycarbonate, reinforced kickstand',
        badge: null
    },
    {
        id: 'acc-8',
        name: 'Apple AirPods Pro (2nd Gen) USB-C',
        brand: 'Apple',
        category: 'Audio',
        price: 84000,
        originalPrice: 92000,
        avgRating: 4.9,
        reviewCount: 210,
        image: '/accessories.jpg',
        specs: 'H2 chip, 2x active noise cancellation, Adaptive Audio, USB-C MagSafe case',
        badge: 'GENNEXT'
    }
];
export default function AccessoriesPage() {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const filtered = useMemo(() => {
        return accessoryProducts.filter(p => {
            const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
            const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
            return matchCat && matchBrand;
        }).sort((a, b) => {
            if (sortBy === 'price_asc')
                return a.price - b.price;
            if (sortBy === 'price_desc')
                return b.price - a.price;
            if (sortBy === 'rating')
                return (b.avgRating || 0) - (a.avgRating || 0);
            return 0;
        });
    }, [selectedCategory, selectedBrand, sortBy]);
    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            productId: product.id,
            itemCode: product.id,
            name: product.name,
            price: product.price,
            unitPrice: product.price,
            quantity: 1,
            image: product.image
        });
        toast.success(`Added ${product.name} to cart!`);
    };
    return (<div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, background: 'rgba(2,132,199,0.1)', color: 'var(--cyan)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
              100% GENUINE & COMPATIBLE
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Headphones size={28} color="#0284c7"/>
            Accessories & Chargers
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
            High-speed GaN chargers, military-grade cases, tempered protectors & audio. Verified compatibility with iPhone 16 and S24 series.
          </p>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SlidersHorizontal size={15} color="var(--text-muted)"/>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: '8px 14px',
            borderRadius: 8,
            background: '#ffffff',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: 13
        }}>
            <option value="featured">Featured First</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', 'Chargers', 'Cases', 'Screen', 'Audio'].map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '8px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCategory === cat ? '1px solid var(--cyan)' : '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--gradient-cyan)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
            }}>
            {cat}
          </button>))}

        <div style={{ height: 28, width: 1, background: 'var(--border)', margin: 'auto 6px' }}/>

        {['All', 'Anker', 'Apple', 'Spigen', 'Belkin', 'Sony', 'Samsung'].map(br => (<button key={br} onClick={() => setSelectedBrand(br)} style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: selectedBrand === br ? 'rgba(2,132,199,0.1)' : '#ffffff',
                color: selectedBrand === br ? 'var(--cyan)' : 'var(--text-secondary)'
            }}>
            {br}
          </button>))}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filtered.map(prod => (<ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart}/>))}
      </div>
    </div>);
}
