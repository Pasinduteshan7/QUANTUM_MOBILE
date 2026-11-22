import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, MessageCircle, X, Search, Check, Sparkles, SlidersHorizontal, ChevronDown, ArrowUpDown, RotateCcw, Headphones, Watch, Zap, Shield, Camera, Tv } from 'lucide-react';
import { ACCESSORY_CATEGORIES, ACCESSORY_PRODUCTS } from '../data/accessoriesCatalogData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const getCategoryIcon = (catId, size = 18) => {
  switch (catId) {
    case 'audio': return <Headphones size={size} color="#0071e3" />;
    case 'power': return <Zap size={size} color="#0071e3" />;
    case 'protection': return <Shield size={size} color="#0071e3" />;
    case 'smartwatches': return <Watch size={size} color="#0071e3" />;
    case 'creator': return <Camera size={size} color="#0071e3" />;
    case 'smart-home': return <Tv size={size} color="#0071e3" />;
    default: return <Sparkles size={size} color="#0071e3" />;
  }
};

export default function AccessoriesPage() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  const setSelectedCategory = (newCat) => {
    const next = new URLSearchParams(searchParams);
    if (!newCat || newCat === 'all') {
      next.delete('category');
    } else {
      next.set('category', newCat);
    }
    setSearchParams(next);
  };

  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-desc');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedItemIds, setAddedItemIds] = useState({});
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=1000')
      .then(r => r.json())
      .then(d => {
        const list = d.data?.products || d.data || [];
        const accItems = list.filter(p => (p.category || '').toLowerCase() !== 'phones');
        const existingNames = new Set(ACCESSORY_PRODUCTS.map(p => p.name.toLowerCase().trim()));
        const newItems = accItems.filter(p => !existingNames.has(p.name.toLowerCase().trim())).map(p => ({
          id: p._id || p.id,
          category: (p.category || 'accessories').toLowerCase(),
          categoryLabel: p.category || 'Accessories',
          brand: p.brand || 'Quantum',
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice || Math.round(p.price * 1.1),
          discountPercent: p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
          availability: p.stock > 0 ? `${p.stock} in Stock` : 'Out of Stock',
          mainImage: p.mainImage || '/accessories.jpg',
          variants: p.finishes?.length ? p.finishes : [{ name: 'Standard Edition', image: p.mainImage || '/accessories.jpg', hex: '#1e293b' }],
          specs: p.specs?.length
            ? p.specs.map(s => typeof s === 'string' ? s : `${s.title}: ${s.desc}`)
            : (p.description ? p.description.split('\n').filter(Boolean) : ['Genuine Sri Lanka Warranty'])
        }));
        setLiveProducts(newItems);
      })
      .catch(() => {});
  }, []);

  const allAccessoryProducts = useMemo(() => [...liveProducts, ...ACCESSORY_PRODUCTS], [liveProducts]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: allAccessoryProducts.length };
    allAccessoryProducts.forEach(p => {
      const cat = (p.category || '').toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allAccessoryProducts]);

  // Brand stats with accurate item counts
  const brandStats = useMemo(() => {
    const counts = {};
    allAccessoryProducts.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [allAccessoryProducts]);

  // Top 6 popular brands for prominent single-line chips
  const topBrands = useMemo(() => brandStats.slice(0, 6).map(b => b.name), [brandStats]);
  // Long-tail brands cleanly housed inside searchable dropdown
  const moreBrands = useMemo(() => brandStats.slice(6), [brandStats]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const list = allAccessoryProducts.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      const matchQuery = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchQuery;
    });

    if (sortBy === 'price-desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [allAccessoryProducts, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedVariantIdx(0);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleQuickAddToCart = async (e, product) => {
    e.stopPropagation();
    const variant = product.variants?.[0] || { name: 'Standard', image: product.mainImage };

    const success = await addToCart({
      id: `${product.id}-${variant.name}`,
      productId: product.id,
      name: `${product.name} - ${variant.name}`,
      price: product.price,
      unitPrice: product.price,
      quantity: 1,
      image: variant.image || product.mainImage,
      finishName: variant.name
    });

    if (success) {
      setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  const handleModalAddToCart = async () => {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants?.[selectedVariantIdx] || { name: 'Standard', image: selectedProduct.mainImage };

    const success = await addToCart({
      id: `${selectedProduct.id}-${variant.name}`,
      productId: selectedProduct.id,
      name: `${selectedProduct.name} (${variant.name})`,
      price: selectedProduct.price,
      unitPrice: selectedProduct.price,
      quantity: quantity,
      image: variant.image || selectedProduct.mainImage,
      finishName: variant.name
    });

    if (success) {
      handleCloseModal();
    }
  };

  const currentVariant = selectedProduct?.variants?.[selectedVariantIdx] || {
    name: 'Standard',
    image: selectedProduct?.mainImage
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* 1. HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '54px 20px 42px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.12)',
            color: '#38bdf8',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: 14
          }}>
            <Sparkles size={14} />
            <span>ORIGINAL TECH ACCESSORIES & GEAR</span>
          </div>

          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 12px',
            fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)'
          }}>
            Curated Ecosystem Accessories
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.5 }}>
            Upgrade your daily mobile setup with genuine audio, smartwatches, fast GaN chargers, military-grade cases, and DJI creator equipment.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: 480,
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search audio, chargers, smartwatches, DJI..."
              style={{
                width: '100%',
                padding: '12px 18px 12px 46px',
                borderRadius: 30,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                backdropFilter: 'blur(10px)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 14,
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. ACTIVE DEPARTMENT TITLE & CONTEXT */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 24,
          paddingBottom: 14,
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Accessories Hub / {ACCESSORY_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'All Accessories'}
            </div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#1d1d1f',
              margin: 0,
              fontFamily: 'Outfit, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span>{getCategoryIcon(selectedCategory, 22)}</span>
              <span>{ACCESSORY_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'All Accessories'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: '#f5f5f7', padding: '3px 10px', borderRadius: 20 }}>
                {filteredProducts.length} items
              </span>
            </h2>
          </div>
        </div>

        {/* 3. UNIFIED BRAND FILTER & CONTROLS TOOLBAR (Apple Frosted Glass) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 22,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '16px 22px',
          marginBottom: 28,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Top Row: Brand Chips + Sort */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingBottom: selectedBrand !== 'all' || searchQuery || selectedCategory !== 'all' ? 14 : 0,
            borderBottom: selectedBrand !== 'all' || searchQuery || selectedCategory !== 'all' ? '1px solid #f1f5f9' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
              <span style={{
                fontSize: 12,
                color: '#64748b',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginRight: 4
              }}>
                <SlidersHorizontal size={13} color="#0284c7" />
                <span>Brand:</span>
              </span>

              {/* All Brands Button */}
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                style={{
                  background: selectedBrand === 'all' ? '#0284c7' : '#f8fafc',
                  color: selectedBrand === 'all' ? '#ffffff' : '#475569',
                  border: selectedBrand === 'all' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  padding: '5px 13px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: selectedBrand === 'all' ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                All Brands
              </button>

              {/* Top 6 Popular Brands */}
              {topBrands.map(b => {
                const isSelected = selectedBrand === b;
                const stat = brandStats.find(s => s.name === b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(isSelected ? 'all' : b)}
                    style={{
                      background: isSelected ? '#0f172a' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 12.5,
                      fontWeight: isSelected ? 700 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <span>{b}</span>
                    {stat && (
                      <span style={{
                        fontSize: 10,
                        opacity: isSelected ? 0.9 : 0.6,
                        fontWeight: 700
                      }}>
                        {stat.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* "More Brands" Dropdown */}
              {moreBrands.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsBrandDropdownOpen(prev => !prev)}
                    style={{
                      background: moreBrands.some(mb => mb.name === selectedBrand) ? '#0f172a' : '#f8fafc',
                      color: moreBrands.some(mb => mb.name === selectedBrand) ? '#ffffff' : '#475569',
                      border: moreBrands.some(mb => mb.name === selectedBrand) ? '1px solid #0f172a' : '1px solid #cbd5e1',
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                  >
                    <span>
                      {moreBrands.some(mb => mb.name === selectedBrand) ? selectedBrand : `+${moreBrands.length} More Brands`}
                    </span>
                    <ChevronDown size={13} style={{ transform: isBrandDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                  </button>

                  {isBrandDropdownOpen && (
                    <>
                      <div
                        onClick={() => setIsBrandDropdownOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        zIndex: 100,
                        width: 240,
                        maxHeight: 280,
                        background: '#ffffff',
                        borderRadius: 14,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 12px 32px rgba(15,23,42,0.15)',
                        padding: 8,
                        overflowY: 'auto'
                      }}>
                      <div style={{ padding: '4px 8px 8px' }}>
                        <input
                          type="text"
                          placeholder="Search brand..."
                          value={brandSearchTerm}
                          onChange={e => setBrandSearchTerm(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            fontSize: 12,
                            outline: 'none'
                          }}
                        />
                      </div>
                      {moreBrands
                        .filter(mb => !brandSearchTerm || mb.name.toLowerCase().includes(brandSearchTerm.toLowerCase()))
                        .map(mb => (
                          <div
                            key={mb.name}
                            onClick={() => {
                              setSelectedBrand(mb.name);
                              setIsBrandDropdownOpen(false);
                              setBrandSearchTerm('');
                            }}
                            style={{
                              padding: '7px 10px',
                              borderRadius: 8,
                              fontSize: 12.5,
                              color: selectedBrand === mb.name ? '#0284c7' : '#334155',
                              fontWeight: selectedBrand === mb.name ? 700 : 500,
                              background: selectedBrand === mb.name ? '#e0f2fe' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{mb.name}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{mb.count}</span>
                          </div>
                        ))}
                    </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpDown size={12} />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Active Filter Pills & Results Count */}
          {(selectedBrand !== 'all' || searchQuery || selectedCategory !== 'all') ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12,
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Active Filter:
                </span>

                {selectedCategory !== 'all' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 14,
                    padding: '3px 9px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#334155'
                  }}>
                    <span>{ACCESSORY_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</span>
                    <X
                      size={12}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCategory('all')}
                    />
                  </span>
                )}

                {selectedBrand !== 'all' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: '#e0f2fe',
                    border: '1px solid #bae6fd',
                    borderRadius: 14,
                    padding: '3px 9px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: '#0369a1'
                  }}>
                    <span>Brand: {selectedBrand}</span>
                    <X
                      size={12}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedBrand('all')}
                    />
                  </span>
                )}

                {searchQuery && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: 14,
                    padding: '3px 9px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#92400e'
                  }}>
                    <span>"{searchQuery}"</span>
                    <X
                      size={12}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Clear all
                </button>
              </div>

              <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                Showing <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> items
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
              <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                Showing <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> accessories
              </span>
            </div>
          )}
        </div>

        {/* 3. PRODUCT CARDS GRID */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <p style={{ fontSize: 16 }}>No accessories match your current filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); setSearchQuery(''); }}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '8px 20px',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 22
          }}>
            {filteredProducts.map(product => {
              const isAdded = addedItemIds[product.id];
              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenModal(product)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 22,
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 44px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                  }}
                >
                  {/* Category and Brand Tag */}
                  <div style={{
                    fontSize: 11,
                    color: '#86868b',
                    marginBottom: 6,
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                    letterSpacing: '0.04em'
                  }}>
                    <span>{product.categoryLabel}</span>
                    <span style={{ color: '#0071e3', fontWeight: 800 }}>{product.brand}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: '#1d1d1f',
                    margin: '0 0 12px',
                    lineHeight: 1.35,
                    minHeight: 38,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h3>

                  {/* Image Container with Discount Tag */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 245, 247, 0.9) 0%, rgba(255, 255, 255, 0) 70%)',
                    borderRadius: 16,
                    marginBottom: 16,
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      style={{
                        maxHeight: '85%',
                        maxWidth: '85%',
                        objectFit: 'contain',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.opacity = '0.7';
                      }}
                    />

                    {product.discountPercent && (
                      <span style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 20
                      }}>
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Price Row & Cart Icon */}
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{
                        fontSize: 17,
                        fontWeight: 900,
                        color: '#1d1d1f',
                        lineHeight: 1.2
                      }}>
                        රු {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      {product.originalPrice && (
                        <div style={{
                          fontSize: 11.5,
                          color: '#86868b',
                          textDecoration: 'line-through',
                          marginTop: 2
                        }}>
                          රු {product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAddToCart(e, product)}
                      title="Add to cart"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        border: 'none',
                        background: isAdded ? '#0071e3' : '#f5f5f7',
                        color: isAdded ? '#ffffff' : '#1d1d1f',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        flexShrink: 0,
                        boxShadow: isAdded ? '0 4px 14px rgba(0, 113, 227, 0.35)' : 'none'
                      }}
                      onMouseEnter={e => {
                        if (!isAdded) {
                          e.currentTarget.style.background = '#0071e3';
                          e.currentTarget.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isAdded) {
                          e.currentTarget.style.background = '#f5f5f7';
                          e.currentTarget.style.color = '#1d1d1f';
                        }
                      }}
                    >
                      {isAdded ? <Check size={16} /> : <ShoppingCart size={15} />}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. QUICK-VIEW PRODUCT MODAL */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            maxWidth: 900,
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            padding: '32px 36px',
            animation: 'fadeIn 0.2s ease'
          }}>
            
            {/* Discount Badge */}
            {selectedProduct.discountPercent && (
              <span style={{
                position: 'absolute',
                top: 20,
                left: 20,
                background: '#dc2626',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 800,
                padding: '4px 9px',
                borderRadius: 4
              }}>
                -{selectedProduct.discountPercent}%
              </span>
            )}

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.color = '#1e293b';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 36,
              alignItems: 'center',
              marginTop: 10
            }}>
              
              {/* Left Column: Image and Thumbnails */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  borderRadius: 14,
                  padding: 14
                }}>
                  <img
                    src={currentVariant.image || selectedProduct.mainImage}
                    alt={selectedProduct.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.opacity = '0.7';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: '#94a3b8'
                  }} title="High resolution preview">
                    <Search size={18} />
                  </div>
                </div>

                {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 14,
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {selectedProduct.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariantIdx(idx)}
                        style={{
                          width: 52,
                          height: 52,
                          padding: 3,
                          borderRadius: 8,
                          background: '#ffffff',
                          border: selectedVariantIdx === idx ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          cursor: 'pointer'
                        }}
                        title={v.name}
                      >
                        <img
                          src={v.image}
                          alt={v.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Specs, WhatsApp, Price, Quantity */}
              <div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                  {selectedProduct.categoryLabel} • <strong style={{ color: '#0284c7' }}>{selectedProduct.brand}</strong>
                </div>

                <h2 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1e293b',
                  margin: '0 0 8px',
                  lineHeight: 1.3,
                  fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  {selectedProduct.name}
                </h2>

                <div style={{ fontSize: 13, marginBottom: 16 }}>
                  <span style={{ color: '#64748b' }}>Availability: </span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    {selectedProduct.availability}
                  </span>
                </div>

                {/* Specs List */}
                <ul style={{
                  margin: '0 0 20px',
                  paddingLeft: 18,
                  fontSize: 13.5,
                  color: '#475569',
                  lineHeight: 1.6
                }}>
                  {selectedProduct.specs?.map((spec, sIdx) => (
                    <li key={sIdx} style={{ marginBottom: 4 }}>
                      {spec}
                    </li>
                  ))}
                </ul>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/94770000000?text=${encodeURIComponent(`Hi Quantum Mobile! I have questions about ${selectedProduct.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#25D366',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: 24,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                    width: 'fit-content',
                    marginBottom: 20,
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <MessageCircle size={16} />
                  <span>Questions? Chat with us!</span>
                </a>

                {/* Pricing Area */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: '#dc2626' }}>
                    රු {selectedProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span style={{ fontSize: 15, color: '#94a3b8', textDecoration: 'line-through' }}>
                      රු {selectedProduct.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {/* Quantity + Add to Cart */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: 42
                  }}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{
                        background: '#f8fafc',
                        border: 'none',
                        width: 34,
                        height: '100%',
                        cursor: 'pointer',
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#64748b'
                      }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 14px', fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      style={{
                        background: '#f8fafc',
                        border: 'none',
                        width: 34,
                        height: '100%',
                        cursor: 'pointer',
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#64748b'
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    style={{
                      flex: 1,
                      height: 42,
                      background: '#0284c7',
                      border: 'none',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0369a1'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0284c7'}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to cart</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
