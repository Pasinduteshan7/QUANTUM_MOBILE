import React, { useState, useMemo } from 'react';
import { ShoppingCart, MessageCircle, X, Search, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ACCESSORY_CATEGORIES, ACCESSORY_PRODUCTS } from '../data/accessoriesCatalogData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function AccessoriesPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedItemIds, setAddedItemIds] = useState({});

  // Unique list of brands for optional secondary filter
  const brands = useMemo(() => {
    const set = new Set(ACCESSORY_PRODUCTS.map(p => p.brand));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return ACCESSORY_PRODUCTS.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      const matchQuery = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchQuery;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

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
            <span>ORIGINAL TECH ACCESORIES & GEAR</span>
          </div>

          <h1 style={{
            fontSize: 34,
            fontWeight: 900,
            margin: '0 0 12px',
            fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif'
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
        
        {/* 2. THE 6 CATEGORY TABS BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 10,
          padding: '24px 0 16px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: 28
        }}>
          {ACCESSORY_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  padding: '9px 18px',
                  borderRadius: 24,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 800 : 600,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <span style={{ fontSize: 16 }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <SlidersHorizontal size={14} />
            <span>Brand:</span>
          </span>
          {brands.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              style={{
                background: selectedBrand === b ? '#1e293b' : '#f1f5f9',
                color: selectedBrand === b ? '#ffffff' : '#475569',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748b' }}>
            Showing <strong>{filteredProducts.length}</strong> items
          </span>
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
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.07)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Category and Brand Tag */}
                  <div style={{
                    fontSize: 11,
                    color: '#64748b',
                    marginBottom: 6,
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{product.categoryLabel}</span>
                    <span style={{ color: '#0284c7', fontWeight: 800 }}>{product.brand}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0369a1',
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
                    background: '#f8fafc',
                    borderRadius: 10,
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
                        transition: 'transform 0.25s ease'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.opacity = '0.7';
                      }}
                    />

                    {product.discountPercent && (
                      <span style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 6,
                        background: '#16a34a',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 4
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
                    paddingTop: 8,
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color: '#dc2626',
                        lineHeight: 1.2
                      }}>
                        රු {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      {product.originalPrice && (
                        <div style={{
                          fontSize: 11,
                          color: '#94a3b8',
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
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: 'none',
                        background: isAdded ? '#0284c7' : '#f1f5f9',
                        color: isAdded ? '#ffffff' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                      onMouseEnter={e => {
                        if (!isAdded) {
                          e.currentTarget.style.background = '#0284c7';
                          e.currentTarget.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isAdded) {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.color = '#64748b';
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
