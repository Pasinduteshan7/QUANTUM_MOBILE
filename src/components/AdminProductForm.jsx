import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Sparkles,
  Package,
  Layers,
  Palette,
  Box,
  FileText,
  Sliders,
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import { ecosystemService } from '@/services/ecosystemService';
import toast from 'react-hot-toast';

const PRESET_FINISH_COLORS = [
  { name: 'Night Sky / Black', hex: '#111827' },
  { name: 'Star White / Silver', hex: '#f8fafc' },
  { name: 'Natural Titanium', hex: '#9ca3af' },
  { name: 'Deep Burgundy', hex: '#5b142b' },
  { name: 'Titanium Blue', hex: '#1e3a5f' },
  { name: 'Cosmic Orange', hex: '#ea580c' },
  { name: 'Desert Sand / Gold', hex: '#d4af37' },
  { name: 'Emerald Green', hex: '#065f46' }
];

const PRESET_STORAGE = ['128GB', '256GB', '512GB', '1TB', '2TB'];

const DEFAULT_FORM_DATA = {
  name: '',
  brand: 'Apple',
  category: 'Phones',
  price: '',
  originalPrice: '',
  stock: 10,
  mainImage: '',
  tagline: '',
  description: '',
  warranty: '1 Year Comprehensive TRCSL Sri Lanka Warranty',
  trcslApproved: true,
  finishes: [
    { name: 'Night Sky', hex: '#111827', image: '' },
    { name: 'Star White', hex: '#f8fafc', image: '' }
  ],
  highlights: [
    'Dual Super Retina XDR Displays: Unfold a brilliant 7.6-inch anti-reflective matte inner screen, or stay productive on the go with the 5.4-inch 120Hz outer cover display.',
    'Next-Gen A20 Pro Power: Engineered on a 2nm process with 12GB RAM and vapor chamber cooling for blazing-fast performance and Apple Intelligence features.',
    '48MP Dual Fusion Camera System: Capture stunning detail in any light with 48MP Main and Ultra Wide lenses, plus a 12MP Center Stage cover camera and seamless under-display inner camera for FaceTime.',
    'All-Day Dual Battery: High-density 4,883 mAh battery delivers up to 44 hours of video playback and recharges up to 50% in just 20 minutes.',
    'Ultra-Durable & Sleek: Measures just 5.2mm thin when unfolded, featuring IP68 water and dust resistance, side-mounted Touch ID, and Dual eSIM support.'
  ],
  inTheBox: [
    'Device (Pre-installed OS)',
    'USB-C Woven Charge Cable (1m)',
    'Documentation & SIM Tray Tool'
  ],
  storageOptions: ['256GB', '512GB', '1TB', '2TB']
};

export default function AdminProductForm({
  editingProduct = null,
  ecosystems = [],
  onSave,
  onCancel,
  onDelete = null,
  submitting = false
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingFinishIdx, setUploadingFinishIdx] = useState(null);
  const [pasteHighlightText, setPasteHighlightText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);

  // Sync form data when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        brand: editingProduct.brand || 'Apple',
        category: editingProduct.category || 'Phones',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 10,
        mainImage: editingProduct.mainImage || '',
        tagline: editingProduct.tagline || '',
        description: editingProduct.description || '',
        warranty: editingProduct.warranty || '1 Year Comprehensive TRCSL Sri Lanka Warranty',
        trcslApproved: editingProduct.trcslApproved !== undefined ? editingProduct.trcslApproved : true,
        finishes: editingProduct.finishes?.length
          ? editingProduct.finishes
          : DEFAULT_FORM_DATA.finishes,
        highlights: editingProduct.highlights?.length
          ? editingProduct.highlights
          : DEFAULT_FORM_DATA.highlights,
        inTheBox: editingProduct.inTheBox?.length
          ? editingProduct.inTheBox
          : DEFAULT_FORM_DATA.inTheBox,
        storageOptions: editingProduct.storageOptions?.length
          ? editingProduct.storageOptions
          : DEFAULT_FORM_DATA.storageOptions
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [editingProduct]);

  // Main Image Upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingMain(true);
      const res = await ecosystemService.uploadMedia(file);
      if (res?.data?.url) {
        setFormData(prev => ({ ...prev, mainImage: res.data.url }));
        toast.success('Main product photo uploaded!', { icon: '🖼️' });
      }
    } catch (err) {
      toast.error('Failed to upload image. Ensure it is within 100MB.');
    } finally {
      setUploadingMain(false);
    }
  };

  // Color Variant Image Upload
  const handleFinishImageUpload = async (file, finishIdx) => {
    if (!file) return;
    try {
      setUploadingFinishIdx(finishIdx);
      const res = await ecosystemService.uploadMedia(file);
      if (res?.data?.url) {
        setFormData(prev => {
          const nextFinishes = [...prev.finishes];
          nextFinishes[finishIdx].image = res.data.url;
          return { ...prev, finishes: nextFinishes };
        });
        toast.success(`Photo for variant "${formData.finishes[finishIdx].name}" uploaded!`, { icon: '🎨' });
      }
    } catch (err) {
      toast.error('Failed to upload variant image');
    } finally {
      setUploadingFinishIdx(null);
    }
  };

  // Add / Remove Finish
  const handleAddFinish = () => {
    setFormData(prev => ({
      ...prev,
      finishes: [
        ...prev.finishes,
        { name: 'Custom Color', hex: '#334155', image: prev.mainImage || '' }
      ]
    }));
  };

  const handleRemoveFinish = (idx) => {
    setFormData(prev => ({
      ...prev,
      finishes: prev.finishes.filter((_, i) => i !== idx)
    }));
  };

  // Add / Remove Highlight
  const handleAddHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const handleUpdateHighlight = (idx, text) => {
    setFormData(prev => {
      const next = [...prev.highlights];
      next[idx] = text;
      return { ...prev, highlights: next };
    });
  };

  const handleRemoveHighlight = (idx) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }));
  };

  // Smart Parse Highlight Bullets
  const handleParseBullets = () => {
    if (!pasteHighlightText.trim()) return;
    const lines = pasteHighlightText
      .split('\n')
      .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    if (lines.length > 0) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights.filter(Boolean), ...lines]
      }));
      setPasteHighlightText('');
      setShowPasteBox(false);
      toast.success(`Added ${lines.length} key highlight points!`, { icon: '✨' });
    }
  };

  // Add / Remove Box Item
  const handleAddBoxItem = () => {
    setFormData(prev => ({
      ...prev,
      inTheBox: [...prev.inTheBox, '']
    }));
  };

  const handleUpdateBoxItem = (idx, val) => {
    setFormData(prev => {
      const next = [...prev.inTheBox];
      next[idx] = val;
      return { ...prev, inTheBox: next };
    });
  };

  const handleRemoveBoxItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      inTheBox: prev.inTheBox.filter((_, i) => i !== idx)
    }));
  };

  // Toggle Storage Option
  const handleToggleStorage = (size) => {
    setFormData(prev => {
      const exists = prev.storageOptions.includes(size);
      const next = exists
        ? prev.storageOptions.filter(s => s !== size)
        : [...prev.storageOptions, size];
      return { ...prev, storageOptions: next };
    });
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.mainImage) {
      toast.error('Product name, price, and primary image are required.');
      return;
    }

    // Auto-generate rich description from structured containers if description is empty or updated
    const highlightsText = formData.highlights.filter(Boolean).map(h => `• ${h}`).join('\n');
    const boxText = formData.inTheBox.filter(Boolean).map(b => `• ${b}`).join('\n');
    const colorsText = formData.finishes.map(f => f.name).join(', ');
    const storageText = formData.storageOptions.join(' | ');

    const compiledDescription = `Key Highlights:\n${highlightsText}\n\nIn the Box:\n${boxText}\n\nAvailable Configurations:\n• Colors: ${colorsText}\n• Storage: ${storageText}`;

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stock),
      description: formData.description?.trim() ? formData.description : compiledDescription,
      finishes: formData.finishes.filter(f => f.name.trim()),
      highlights: formData.highlights.filter(Boolean),
      inTheBox: formData.inTheBox.filter(Boolean),
      storageOptions: formData.storageOptions
    };

    onSave(payload);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: 32, maxWidth: 940, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Store Catalog'}
            </h2>
            {editingProduct && (
              <span style={{ fontSize: 11, background: '#eff6ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                EDIT MODE
              </span>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: '6px 0 0' }}>
            Structured device publishing with multiple color variant photos, highlights, packaging contents, and storage tiers.
          </p>
        </div>

        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} /> Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* CONTAINER 0: BASIC PRODUCT IDENTIFIERS */}
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} color="#0284c7" /> Basic Catalog Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone Duo 256GB / Galaxy S26 Ultra"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Brand Ecosystem *
              </label>
              <select
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              >
                {ecosystems.map(eco => (
                  <option key={eco._id || eco.slug} value={eco.brand || eco.name}>
                    {eco.emblem ? `${eco.emblem} ` : ''}{eco.brand || eco.name}
                  </option>
                ))}
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Google">Google</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Anker">Anker</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              >
                <option value="Phones">📱 Phones</option>
                <option value="Watch">⌚ Watch / Wearables</option>
                <option value="Audio">🎧 Audio & Earbuds</option>
                <option value="Chargers">⚡ Chargers & Power</option>
                <option value="Cases">🛡️ Cases & Protection</option>
                <option value="Accessories">✨ Accessories</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Selling Price (LKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 800000"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5, fontWeight: 800 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Original / List Price (LKR) (Optional for Discount Tag)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 809000 (shows strikethrough)"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Initial Stock Count *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>

            {/* Primary Main Image with File Upload */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Primary Main Image *
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  required
                  placeholder="/iphone16pro.jpg or URL"
                  value={formData.mainImage}
                  onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: uploadingMain ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={13} />
                  {uploadingMain ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingMain}
                    onChange={handleMainImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Tagline / Banner Hook
              </label>
              <input
                type="text"
                placeholder="e.g. Experience a whole new way to iPhone."
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>
          </div>
        </div>

        {/* CONTAINER 1: COLOR VARIANTS & SPECIFIC PHOTOS (USER REQUESTED) */}
        <div style={{ background: '#ffffff', padding: 22, borderRadius: 14, border: '2px solid #bae6fd', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0369a1', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Palette size={18} color="#0284c7" /> Color Variants & Photos
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                Add different color variant photos and appropriate colors. When customers click each color, this exact photo will show!
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFinish}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: '#0284c7',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={13} /> Add Color Variant
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {formData.finishes.map((finish, fIdx) => {
              const isUploadingThis = uploadingFinishIdx === fIdx;

              return (
                <div
                  key={fIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 180px 100px 1fr 40px',
                    gap: 12,
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {/* Swatch Preview Circle */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: finish.hex || '#1e293b',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      flexShrink: 0
                    }}
                    title={finish.name}
                  />

                  {/* Color Name */}
                  <input
                    type="text"
                    required
                    placeholder="Color Name (e.g. Night Sky)"
                    value={finish.name}
                    onChange={(e) => {
                      const next = [...formData.finishes];
                      next[fIdx].name = e.target.value;
                      setFormData({ ...formData, finishes: next });
                    }}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }}
                  />

                  {/* Color Hex Picker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={finish.hex?.startsWith('#') && finish.hex.length === 7 ? finish.hex : '#111827'}
                      onChange={(e) => {
                        const next = [...formData.finishes];
                        next[fIdx].hex = e.target.value;
                        setFormData({ ...formData, finishes: next });
                      }}
                      style={{ width: 28, height: 28, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="#111827"
                      value={finish.hex}
                      onChange={(e) => {
                        const next = [...formData.finishes];
                        next[fIdx].hex = e.target.value;
                        setFormData({ ...formData, finishes: next });
                      }}
                      style={{ width: 68, padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'monospace' }}
                    />
                  </div>

                  {/* Variant-Specific Photo Input + Upload Button */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {finish.image ? (
                      <img
                        src={finish.image}
                        alt={finish.name}
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: '#fff', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8' }}>
                        No Pic
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Variant photo URL"
                      value={finish.image}
                      onChange={(e) => {
                        const next = [...formData.finishes];
                        next[fIdx].image = e.target.value;
                        setFormData({ ...formData, finishes: next });
                      }}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, background: '#fff' }}
                    />

                    <label
                      style={{
                        padding: '7px 12px',
                        borderRadius: 8,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: isUploadingThis ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Upload size={12} />
                      {isUploadingThis ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingThis}
                        onChange={(e) => handleFinishImageUpload(e.target.files?.[0], fIdx)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Remove Finish */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFinish(fIdx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                    title="Remove variant"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTAINER 2: KEY HIGHLIGHTS (USER REQUESTED) */}
        <div style={{ background: '#ffffff', padding: 22, borderRadius: 14, border: '2px solid #ddd6fe', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#6d28d9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#7c3aed" /> Key Highlights
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                Key headline specifications and feature bullet points (Display, Processor, Cameras, Battery, Unibody).
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowPasteBox(!showPasteBox)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  color: '#7c3aed',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {showPasteBox ? 'Hide Paste Box' : '📋 Paste & Parse Bullets'}
              </button>
              <button
                type="button"
                onClick={handleAddHighlight}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} /> Add Bullet
              </button>
            </div>
          </div>

          {/* Quick Paste Modal / Drawer */}
          {showPasteBox && (
            <div style={{ background: '#faf5ff', padding: 14, borderRadius: 10, border: '1px dashed #c084fc', marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#6d28d9', marginBottom: 6 }}>
                Paste bullet points here (each line starting with • will become its own highlight point):
              </label>
              <textarea
                rows={4}
                value={pasteHighlightText}
                onChange={e => setPasteHighlightText(e.target.value)}
                placeholder="• Dual Super Retina XDR Displays: Unfold a brilliant 7.6-inch...&#10;• Next-Gen A20 Pro Power: Engineered on a 2nm process..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d8b4fe', fontSize: 12.5, fontFamily: 'sans-serif' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleParseBullets}
                  style={{ padding: '6px 14px', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  Insert Parsed Highlights
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {formData.highlights.map((h, hIdx) => (
              <div key={hIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 16, color: '#7c3aed', flexShrink: 0 }}>•</span>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen A20 Pro Power: Engineered on a 2nm process with 12GB RAM..."
                  value={h}
                  onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(hIdx)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CONTAINER 3: AVAILABLE CONFIGURATIONS & STORAGE (USER REQUESTED) */}
        <div style={{ background: '#ffffff', padding: 22, borderRadius: 14, border: '2px solid #fed7aa', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#c2410c', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="#ea580c" /> Available Configurations & Storage Tiers
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b' }}>
            Select the storage memory options available for this device (e.g. 256GB, 512GB, 1TB, 2TB).
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PRESET_STORAGE.map(size => {
              const isSelected = formData.storageOptions.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleToggleStorage(size)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: isSelected ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: isSelected ? '#fff7ed' : '#ffffff',
                    color: isSelected ? '#c2410c' : '#475569',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {isSelected && <Check size={14} color="#ea580c" />}
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTAINER 4: IN THE BOX / PACKAGING (USER REQUESTED) */}
        <div style={{ background: '#ffffff', padding: 22, borderRadius: 14, border: '2px solid #bbf7d0', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#15803d', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Box size={18} color="#16a34a" /> In the Box (Retail Package Contents)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                Items included inside the factory-sealed retail box.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBoxItem}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: '#16a34a',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={13} /> Add Box Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {formData.inTheBox.map((item, bIdx) => (
              <div key={bIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#16a34a', flexShrink: 0 }}>📦</span>
                <input
                  type="text"
                  placeholder="e.g. USB-C Woven Charge Cable (1m)"
                  value={item}
                  onChange={(e) => handleUpdateBoxItem(bIdx, e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBoxItem(bIdx)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CONTAINER 5: WARRANTY & LEGAL SPECIFICATIONS */}
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Warranty Coverage
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
              <input
                type="checkbox"
                id="trcslCheck"
                checked={formData.trcslApproved}
                onChange={e => setFormData({ ...formData, trcslApproved: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <label htmlFor="trcslCheck" style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                TRCSL Approved (Official Telecommunications Regulatory Commission of Sri Lanka)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
          <div>
            {editingProduct && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '11px 18px',
                  borderRadius: 10,
                  border: '1px solid #fecdd3',
                  background: '#fff1f2',
                  color: '#e11d48',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
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
                <Trash2 size={16} />
                Delete Product
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {editingProduct && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '11px 20px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 10,
                background: editingProduct
                  ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                  : 'linear-gradient(135deg, #0284c7, #0066ff)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 800,
                border: 'none',
                cursor: submitting ? 'wait' : 'pointer',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)'
              }}
            >
              <CheckCircle2 size={16} />
              {submitting ? 'Saving to Database...' : editingProduct ? 'Update Product Details' : 'Save & Publish Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

