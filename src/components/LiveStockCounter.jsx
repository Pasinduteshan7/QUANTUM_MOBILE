import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  PackageCheck,
  TrendingUp,
  Percent,
  RefreshCw,
  Edit3,
  Trash2
} from 'lucide-react';
import { formatLKR } from '@/services/cartService';
import BrandLogo from './BrandLogo';

export default function LiveStockCounter({
  products = [],
  ecosystems = [],
  onUpdateStock,
  updatingStockId = null,
  onManageEcosystems = null,
  canAdjust = true,
  onEditProduct = null,
  onDeleteProduct = null
}) {
  const [selectedEcosystem, setSelectedEcosystem] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'discounted' | 'low' | 'out' | 'in'
  const [inventorySearch, setInventorySearch] = useState('');

  // Calculate live stats
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) <= 0).length;
  const discountedCount = products.filter(p => p.originalPrice && p.originalPrice > p.price).length;
  const totalValuation = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

  // Filter products (Organized in price descending order)
  const filteredProducts = products.filter(p => {
    // 1. Ecosystem / Brand Filter
    if (selectedEcosystem !== 'all') {
      const brandLower = (p.brand || '').toLowerCase();
      if (brandLower !== selectedEcosystem.toLowerCase()) return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      const catLower = (p.category || '').toLowerCase();
      if (catLower !== selectedCategory.toLowerCase()) return false;
    }

    // 3. Stock Level Filter
    if (stockFilter === 'discounted' && (!p.originalPrice || p.originalPrice <= p.price)) return false;
    if (stockFilter === 'low' && (p.stock <= 0 || p.stock > 5)) return false;
    if (stockFilter === 'out' && p.stock > 0) return false;
    if (stockFilter === 'in' && p.stock <= 5) return false;

    // 4. Search Filter
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchBrand = (p.brand || '').toLowerCase().includes(q);
      const matchCat = (p.category || '').toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) return false;
    }

    return true;
  }).sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

  return (
    <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
      {/* Live Inventory Executive KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Units in Stock</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>{totalUnits.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fef2f2', padding: 14, borderRadius: 12, border: '1px solid #fecaca' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Low Stock Alert (≤ 5)</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#dc2626', fontFamily: 'Outfit, sans-serif' }}>{lowStockCount}</div>
        </div>
        <div style={{ background: '#fffbeb', padding: 14, borderRadius: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Out of Stock (0 units)</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#d97706', fontFamily: 'Outfit, sans-serif' }}>{outOfStockCount}</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Total Stock Valuation</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#16a34a', fontFamily: 'Outfit, sans-serif' }}>{formatLKR(totalValuation)}</div>
        </div>
      </div>

      {/* TIER 1: BRAND ECOSYSTEM FILTER BAR */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={13} color="#0284c7" /> Browse By Brand Ecosystem:
          </span>
          {onManageEcosystems && (
            <button
              type="button"
              onClick={onManageEcosystems}
              style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={13} /> Manage Ecosystems
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <button
            onClick={() => setSelectedEcosystem('all')}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              border: '1px solid',
              borderColor: selectedEcosystem === 'all' ? '#0284c7' : '#cbd5e1',
              background: selectedEcosystem === 'all' ? '#0284c7' : '#ffffff',
              color: selectedEcosystem === 'all' ? '#ffffff' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            All Brands ({products.length})
          </button>

          {ecosystems.map((eco) => {
            const isSelected = selectedEcosystem.toLowerCase() === (eco.brand || eco.slug).toLowerCase();
            const count = products.filter(p => (p.brand || '').toLowerCase() === (eco.brand || eco.slug).toLowerCase()).length;
            return (
              <button
                key={eco._id || eco.slug}
                onClick={() => setSelectedEcosystem(eco.brand || eco.slug)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: '1px solid',
                  borderColor: isSelected ? (eco.accentColor || '#0284c7') : '#cbd5e1',
                  background: isSelected ? (eco.accentColor || '#0284c7') : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <BrandLogo
                    brand={eco.brand || eco.slug}
                    size={15}
                    color={isSelected ? '#ffffff' : null}
                    monochrome={isSelected}
                  />
                </span>
                <span>{eco.brand || eco.name}</span>
                <span style={{ fontSize: 11, opacity: 0.85, background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9', padding: '1px 6px', borderRadius: 6 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TIER 2: CATEGORY SELECTOR BAR */}
      <div style={{ marginBottom: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Filter Category Lineup:
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'Phones', label: '📱 Phones' },
            { id: 'Watch', label: '⌚ Watch / Wearables' },
            { id: 'Audio', label: '🎧 Audio & Earbuds' },
            { id: 'Chargers', label: '⚡ Chargers & Power' },
            { id: 'Cases', label: '🛡️ Cases & Protection' },
            { id: 'Accessories', label: '✨ Accessories' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11.5,
                fontWeight: 700,
                border: 'none',
                background: selectedCategory === cat.id ? '#1e293b' : '#f1f5f9',
                color: selectedCategory === cat.id ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TIER 3: STOCK & DISCOUNT STATUS + SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'discounted', label: '⚡ On Sale / Discounted', count: discountedCount },
            { id: 'low', label: 'Low Stock (≤ 5)', count: lowStockCount },
            { id: 'out', label: 'Out of Stock (0)', count: outOfStockCount },
            { id: 'in', label: 'Healthy Stock (> 5)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: '1px solid',
                borderColor: stockFilter === tab.id ? (tab.id === 'discounted' ? '#ef4444' : '#0284c7') : '#e2e8f0',
                background: stockFilter === tab.id ? (tab.id === 'discounted' ? '#fef2f2' : '#f0f9ff') : '#ffffff',
                color: stockFilter === tab.id ? (tab.id === 'discounted' ? '#dc2626' : '#0284c7') : '#64748b',
                cursor: 'pointer'
              }}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by model, brand, category..."
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Inventory Table with Live Stock Counter Buttons */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Product</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Unit Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Live Stock Count</th>
              {canAdjust && <th style={{ padding: '12px 16px', textAlign: 'center' }}>Quick Adjuster</th>}
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Stock Value</th>
              {(onEditProduct || onDeleteProduct) && <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const isLow = p.stock > 0 && p.stock <= 5;
              const isOut = p.stock <= 0;
              const isUpdating = updatingStockId === p._id;

              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                  {/* Product Info */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={p.mainImage || '/accessories.jpg'}
                        alt={p.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: 6 }}>
                      {p.category}
                    </span>
                  </td>

                  {/* Price & Discounts */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>
                      {formatLKR(p.price)}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>
                          {formatLKR(p.originalPrice)}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '1px 5px', borderRadius: 4 }}>
                          -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Live Stock Counter Badge */}
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 800,
                        background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#f0fdf4',
                        color: isOut ? '#dc2626' : isLow ? '#d97706' : '#16a34a',
                        border: `1px solid ${isOut ? '#fecaca' : isLow ? '#fde68a' : '#bbf7d0'}`
                      }}
                    >
                      {isOut ? 'Out of Stock' : `${p.stock} units left`}
                    </span>
                  </td>

                  {/* Quick Adjuster Buttons */}
                  {canAdjust && (
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          disabled={p.stock <= 0 || isUpdating}
                          onClick={() => onUpdateStock && onUpdateStock(p._id, -1)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: p.stock <= 0 || isUpdating ? 'not-allowed' : 'pointer',
                            opacity: p.stock <= 0 || isUpdating ? 0.5 : 1
                          }}
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onUpdateStock && onUpdateStock(p._id, 5)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #bae6fd',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: isUpdating ? 'wait' : 'pointer'
                          }}
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onUpdateStock && onUpdateStock(p._id, 10)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #bbf7d0',
                            background: '#f0fdf4',
                            color: '#16a34a',
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: isUpdating ? 'wait' : 'pointer'
                          }}
                        >
                          +10 Restock
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Stock Value */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>
                      {formatLKR(p.price * (p.stock || 0))}
                    </div>
                  </td>

                  {/* Actions (Edit & Delete) */}
                  {(onEditProduct || onDeleteProduct) && (
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {onEditProduct && (
                          <button
                            type="button"
                            onClick={() => onEditProduct(p)}
                            title="Edit product details"
                            style={{
                              padding: '5px 12px',
                              borderRadius: 8,
                              background: '#f0f9ff',
                              border: '1px solid #bae6fd',
                              color: '#0284c7',
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                        )}

                        {onDeleteProduct && (
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p._id || p.id, p.name)}
                            title="Remove product from catalog"
                            style={{
                              padding: '5px 10px',
                              borderRadius: 8,
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#e11d48';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#fff1f2';
                              e.currentTarget.style.color = '#e11d48';
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={(canAdjust ? 6 : 5) + ((onEditProduct || onDeleteProduct) ? 1 : 0)} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No inventory products match your active ecosystem, category, or search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

