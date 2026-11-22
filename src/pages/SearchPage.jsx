import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { Search } from 'lucide-react';
function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('price_desc');
    useEffect(() => {
        const doSearch = async () => {
            setLoading(true);
            try {
                const res = await productService.getProducts({
                    search: query,
                    sort: sortBy
                });
                setProducts(res.products);
            }
            catch (err) {
                console.error('Search error:', err);
            }
            finally {
                setLoading(false);
            }
        };
        doSearch();
    }, [query, sortBy]);
    return (<div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={24} color="#0284c7"/>
          <span>Search Results for &ldquo;{query}&rdquo;</span>
        </h1>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            background: 'var(--bg-secondary)',
            color: '#f0f6fc',
            border: '1px solid var(--border)',
            padding: '8px 14px',
            borderRadius: 8,
            fontSize: 13
        }}>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (<div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          Searching catalog...
        </div>) : products.length === 0 ? (<div style={{ padding: 60, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>No items found matching &ldquo;{query}&rdquo;.</p>
        </div>) : (<div className="product-grid">
          {products.map((p) => (<ProductCard key={p.id || p.itemCode} product={p}/>))}
        </div>)}
    </div>);
}
export default function SearchPage() {
    return (<Suspense fallback={<div className="container" style={{ padding: 60, color: 'var(--text-muted)' }}>Loading search...</div>}>
      <SearchResults />
    </Suspense>);
}
