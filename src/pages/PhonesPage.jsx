import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/mockData';
import { Smartphone, SlidersHorizontal } from 'lucide-react';
const brands = ['All', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'];
const storageFilters = ['All', '128GB', '256GB', '512GB'];
export default function PhonesPage() {
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedStorage, setSelectedStorage] = useState('All');
    const [sortBy, setSortBy] = useState('rating');
    const [priceRange, setPriceRange] = useState(500000);
    const phoneProducts = useMemo(() => {
        return products.filter(p => p.category === 'Phones');
    }, []);
    const filtered = useMemo(() => {
        return phoneProducts.filter(p => {
            const matchBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
            const matchStorage = selectedStorage === 'All' || (p.storage && p.storage.includes(selectedStorage));
            const matchPrice = p.price <= priceRange;
            return matchBrand && matchStorage && matchPrice;
        }).sort((a, b) => {
            if (sortBy === 'price_asc')
                return a.price - b.price;
            if (sortBy === 'price_desc')
                return b.price - a.price;
            if (sortBy === 'rating')
                return (b.avgRating || 0) - (a.avgRating || 0);
            return 0;
        });
    }, [phoneProducts, selectedBrand, selectedStorage, priceRange, sortBy]);
    return (<div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, background: 'rgba(2,132,199,0.1)', color: 'var(--cyan)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
              DIRECT IMPORTS &bull; TRCSL APPROVED
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Smartphone size={28} color="#0284c7"/>
            Flagship Smartphones
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
            Apple iPhone 16 series, Samsung Galaxy S24 Ultra, Google Pixel 9 Pro. Factory sealed with verified warranties.
          </p>
        </div>

        {/* Sort Selector */}
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
            <option value="rating">Top Rated (Verified Reviews)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Brand Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {brands.map(b => (<button key={b} onClick={() => setSelectedBrand(b)} style={{
                padding: '8px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedBrand === b ? '1px solid var(--cyan)' : '1px solid var(--border)',
                background: selectedBrand === b ? 'var(--gradient-cyan)' : '#ffffff',
                color: selectedBrand === b ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: selectedBrand === b ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
            }}>
            {b}
          </button>))}

        <div style={{ height: 28, width: 1, background: 'var(--border)', margin: 'auto 6px' }}/>

        {storageFilters.map(st => (<button key={st} onClick={() => setSelectedStorage(st)} style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: selectedStorage === st ? 'rgba(2,132,199,0.1)' : '#ffffff',
                color: selectedStorage === st ? 'var(--cyan)' : 'var(--text-secondary)'
            }}>
            {st}
          </button>))}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filtered.map(product => (<ProductCard key={product.id} product={product}/>))}
      </div>
    </div>);
}
