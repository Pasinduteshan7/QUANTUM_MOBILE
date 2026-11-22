import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle, X, Search, Check } from 'lucide-react';
import { ECOSYSTEM_CATALOGS } from '../data/otherEcosystemsCatalogData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function EcosystemBrandCatalog({ brandKey }) {
  const { addToCart } = useCart();
  const catalog = ECOSYSTEM_CATALOGS[brandKey];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedItemIds, setAddedItemIds] = useState({});

  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    if (!brandKey) return;
    fetch('http://localhost:5000/api/products?limit=1000')
      .then(r => r.json())
      .then(d => {
        const list = d.data?.products || d.data || [];
        const brandLower = brandKey.toLowerCase();
        const brandItems = list.filter(p => (p.brand || '').toLowerCase() === brandLower);
        const existingNames = new Set((catalog?.products || []).map(p => p.name.toLowerCase().trim()));
        const newItems = brandItems.filter(p => !existingNames.has(p.name.toLowerCase().trim())).map(p => ({
          id: p._id || p.id,
          category: (p.category || 'phones').toLowerCase(),
          categoryLabel: p.category || (catalog?.brandName || brandKey),
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice || Math.round(p.price * 1.1),
          discountPercent: p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
          availability: p.stock > 0 ? `${p.stock} in Stock` : 'Out of Stock',
          mainImage: p.mainImage || '/accessories.jpg',
          variants: p.finishes?.length ? p.finishes : [{ name: 'Standard Edition', image: p.mainImage || '/accessories.jpg', hex: '#1e293b' }],
          specs: p.specs?.length
            ? p.specs.map(s => typeof s === 'string' ? s : `${s.title}: ${s.desc}`)
            : (p.description ? p.description.split('\n').filter(Boolean) : ['Genuine Brand Product', '1 Year TRCSL Warranty'])
        }));
        setLiveProducts(newItems);
      })
      .catch(() => {});
  }, [brandKey]);

  if (!catalog) return null;

  const combinedProducts = [...liveProducts, ...(catalog.products || [])]
    .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

  // Filter products by category (organized in price descending order)
  const filteredProducts = (selectedCategory === 'all'
    ? combinedProducts
    : combinedProducts.filter(p => p.category === selectedCategory))
    .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

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
    <section
      id="brand-authorized-catalog"
      style={{
        padding: '36px 0 60px',
        background: '#fbfbfd',
        borderTop: '1px solid #e5e5ea',
        borderBottom: '1px solid #e5e5ea'
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: catalog.accentColor,
            textTransform: 'uppercase',
            marginBottom: 6
          }}>
            Official Verified Lineup
          </div>
          <h2 style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#1d1d1f',
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
            fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            {catalog.title}
          </h2>
          <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>
            {catalog.subtitle}
          </p>
        </div>

        {/* 1. CATEGORY TABS BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '2px solid #e5e5ea',
          paddingBottom: 4,
          marginBottom: 32
        }}>
          {catalog.categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `3px solid ${catalog.accentColor}` : '3px solid transparent',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 15,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? catalog.accentColor : '#515154',
                  transition: 'all 0.2s ease',
                  marginBottom: -2,
                  outline: 'none'
                }}
              >
                <span style={{ fontSize: 17 }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. PRODUCT CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
          gap: 20
        }}>
          {filteredProducts.map(product => {
            const isAdded = addedItemIds[product.id];
            return (
              <div
                key={product.id}
                onClick={() => handleOpenModal(product)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e8e8ed',
                  borderRadius: 14,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#c7c7cc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#e8e8ed';
                }}
              >
                {/* Category Label at Top */}
                <div style={{
                  fontSize: 11,
                  color: '#86868b',
                  marginBottom: 6,
                  fontWeight: 500
                }}>
                  {product.categoryLabel}
                </div>

                {/* Product Title */}
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0066cc',
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

                {/* Product Image Area with Discount Badge */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  marginBottom: 16,
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
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
                      bottom: 4,
                      left: 4,
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

                {/* Price Row and Cart Button */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid #f2f2f7'
                }}>
                  <div>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#dc2626',
                      lineHeight: 1.2
                    }}>
                      රු {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>

                    {product.originalPrice && (
                      <div style={{
                        fontSize: 11,
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
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      border: 'none',
                      background: isAdded ? '#0071e3' : '#f1f5f9',
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
                        e.currentTarget.style.background = '#0071e3';
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

      </div>

      {/* 3. QUICK-VIEW PRODUCT MODAL */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
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
            maxWidth: 920,
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            padding: '32px 36px',
            animation: 'fadeIn 0.2s ease'
          }}>
            
            {/* Red Discount Tag Top-Left */}
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

            {/* Close Button Top-Right */}
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

            {/* Modal Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 36,
              alignItems: 'center',
              marginTop: 10
            }}>
              
              {/* Left Column: Image + Variants */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10
                }}>
                  <img
                    src={currentVariant.image || selectedProduct.mainImage}
                    alt={selectedProduct.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
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
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }} title="High resolution preview">
                    <Search size={18} />
                  </div>
                </div>

                {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                  <div style={{ marginTop: 16, width: '100%', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
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
                            border: selectedVariantIdx === idx ? `2px solid ${catalog.accentColor}` : '1px solid #e5e5ea',
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
                  </div>
                )}
              </div>

              {/* Right Column: Specs, WhatsApp, Price, Quantity */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                  {selectedProduct.categoryLabel}
                </div>

                <h2 style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#1d1d1f',
                  margin: '0 0 8px',
                  lineHeight: 1.25,
                  fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  {selectedProduct.name}
                </h2>

                {currentVariant.name && currentVariant.name !== 'Standard' && (
                  <div style={{ fontSize: 13, color: '#515154', marginBottom: 10 }}>
                    Color Finish: <strong style={{ color: '#1d1d1f' }}>{currentVariant.name}</strong>
                  </div>
                )}

                <div style={{ fontSize: 13, marginBottom: 18 }}>
                  <span style={{ color: '#64748b' }}>Availability: </span>
                  <span style={{
                    color: selectedProduct.availability?.includes('backorder') ? '#d97706' : '#16a34a',
                    fontWeight: 700
                  }}>
                    {selectedProduct.availability}
                  </span>
                </div>

                {/* Specs List */}
                <ul style={{
                  margin: '0 0 20px',
                  paddingLeft: 18,
                  fontSize: 13.5,
                  color: '#475569',
                  lineHeight: 1.65
                }}>
                  {selectedProduct.specs?.map((spec, sIdx) => (
                    <li key={sIdx} style={{ marginBottom: 4 }}>
                      {spec}
                    </li>
                  ))}
                </ul>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/94770000000?text=${encodeURIComponent(`Hi Quantum Mobile! I have questions about ${selectedProduct.name} (${currentVariant.name}).`)}`}
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
                      background: catalog.accentColor || '#0071e3',
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
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
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

    </section>
  );
}
