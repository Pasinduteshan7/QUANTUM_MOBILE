import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Smartphone,
  Save,
  X
} from 'lucide-react';
import { formatLKR } from '@/services/cartService';
import { ecosystemService } from '@/services/ecosystemService';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

const DEFAULT_ECOSYSTEM_FORM = {
  name: '',
  brand: '',
  slug: '',
  tagline: '',
  headline: '',
  description: '',
  accentColor: '#0284c7',
  badgeText: 'FLAGSHIP ECOSYSTEM • DIALOG 5G',
  emblem: '✦',
  logoUrl: '',
  heroTitleMain: '',
  heroTitleSub: '',
  heroImage: '/accessories.jpg',
  heroVideo: '',
  videoTitle: 'Official Keynote Film',
  videoDuration: '0:45 • 4K HDR',
  flagship: {
    name: '',
    badge: 'LATEST FLAGSHIP',
    tagline: '',
    price: 250000,
    monthlyPrice: 'LKR 10,416/mo. for 24 mos.',
    finishes: [
      { name: 'Standard Black', hex: '#1e293b', image: '/accessories.jpg' },
      { name: 'Titanium Silver', hex: '#d1d5db', image: '/accessories.jpg' }
    ],
    specs: [
      { title: 'Display', desc: '120Hz ProMotion AMOLED HDR' },
      { title: 'Camera', desc: '50MP OIS Flagship Triple Camera' },
      { title: 'Processor & AI', desc: 'Next-Gen 3nm Flagship Silicon' },
      { title: 'Battery', desc: '5000mAh with Super Fast Charging' }
    ]
  },
  subCategories: [
    { id: 'phones', label: 'Phones', icon: '📱' },
    { id: 'watch', label: 'Watch / Wearables', icon: '⌚' },
    { id: 'audio', label: 'Audio & Buds', icon: '🎧' },
    { id: 'chargers', label: 'Fast Chargers', icon: '⚡' },
    { id: 'cases', label: 'Cases & Protection', icon: '🛡️' }
  ],
  bundle: {
    name: 'Ecosystem Starter Trio',
    price: 320000,
    savings: 35000,
    image: '/accessories.jpg'
  }
};

export default function AdminEcosystemsManager({ ecosystems = [], onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('identity'); // 'identity' | 'hero' | 'flagship' | 'categories'
  const [formData, setFormData] = useState(DEFAULT_ECOSYSTEM_FORM);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_ECOSYSTEM_FORM);
    setActiveModalTab('identity');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (eco) => {
    setEditingId(eco._id);
    setFormData({
      ...DEFAULT_ECOSYSTEM_FORM,
      ...eco,
      flagship: {
        ...DEFAULT_ECOSYSTEM_FORM.flagship,
        ...(eco.flagship || {})
      },
      subCategories: eco.subCategories?.length ? eco.subCategories : DEFAULT_ECOSYSTEM_FORM.subCategories,
      bundle: {
        ...DEFAULT_ECOSYSTEM_FORM.bundle,
        ...(eco.bundle || {})
      }
    });
    setActiveModalTab('identity');
    setModalOpen(true);
  };

  // Handle Video / Image File Upload (Hybrid handler)
  const handleFileUpload = async (e, fieldTarget) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const res = await ecosystemService.uploadMedia(file);
      if (res?.data?.url) {
        if (fieldTarget === 'heroVideo') {
          setFormData(prev => ({ ...prev, heroVideo: res.data.url }));
          toast.success('Hero video uploaded successfully!', { icon: '🎬' });
        } else if (fieldTarget === 'heroImage') {
          setFormData(prev => ({ ...prev, heroImage: res.data.url }));
          toast.success('Hero image uploaded successfully!', { icon: '🖼️' });
        } else if (fieldTarget === 'logoUrl') {
          setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
          toast.success('Logo uploaded successfully!', { icon: '✨' });
        }
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error(err.response?.data?.message || 'File upload failed. Ensure file is within size limits.');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Save Ecosystem
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand) {
      toast.error('Brand name and ecosystem name are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        slug: (formData.slug || formData.brand).toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
      };

      if (editingId) {
        await ecosystemService.updateEcosystem(editingId, payload);
        toast.success(`Ecosystem '${payload.name}' updated!`, { icon: '✅' });
      } else {
        await ecosystemService.createEcosystem(payload);
        toast.success(`Ecosystem '${payload.name}' created!`, { icon: '🎉' });
      }

      setModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Save ecosystem error:', err);
      toast.error(err.response?.data?.message || 'Failed to save brand ecosystem.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Ecosystem
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'? This will remove its landing page.`)) {
      return;
    }

    try {
      await ecosystemService.deleteEcosystem(id);
      toast.success(`Ecosystem '${name}' deleted.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to delete ecosystem.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner & Action */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            <Layers size={16} /> Dynamic Ecosystem Architecture
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>
            Brand Ecosystems & Cinematic Stages
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 720 }}>
            Manage official brand universes (Apple, Samsung, Google, Nothing, Sony, etc.). Customize cinematic hero keynote videos, flagship spotlights, and sub-category shopping filters.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}
        >
          <Plus size={16} /> Add New Brand Ecosystem
        </button>
      </div>

      {/* Ecosystems Cards Grid */}
      {ecosystems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: 16, border: '1px dashed #cbd5e1' }}>
          <Layers size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: '#334155' }}>No Brand Ecosystems Configured</h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>Create custom flagship stages or restart backend to load Apple, Samsung, Google, OnePlus, and Xiaomi.</p>
          <button onClick={handleOpenCreate} style={{ padding: '8px 16px', borderRadius: 10, background: '#0284c7', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            + Create First Ecosystem
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {ecosystems.map((eco) => {
            const hasVideo = !!eco.heroVideo;
            return (
              <div
                key={eco._id || eco.slug}
                style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  border: '1px solid #e2e8f0',
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
              {/* Brand Accent Top Stripe */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: eco.accentColor || '#0284c7'
                }}
              />

              <div>
                {/* Header: Emblem + Name + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${eco.accentColor}18`,
                        color: eco.accentColor || '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 900,
                        border: `1px solid ${eco.accentColor}33`
                      }}
                    >
                      <BrandLogo brand={eco.brand || eco.slug} size={22} color={eco.accentColor} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                        {eco.name}
                      </h3>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                        /ecosystem/{eco.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: hasVideo ? '#ecfdf5' : '#f8fafc',
                      color: hasVideo ? '#059669' : '#64748b',
                      border: hasVideo ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Video size={11} /> {hasVideo ? 'Hero Video Ready' : 'Cover Image'}
                  </span>
                </div>

                {/* Hero Banner Snapshot */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: eco.accentColor || '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                    {eco.heroTitleMain || eco.brand}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    {eco.heroTitleSub || eco.tagline}
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: '#64748b', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {eco.description || 'Full hardware ecosystem connected seamlessly.'}
                  </p>
                </div>

                {/* Flagship Device Pill */}
                {eco.flagship && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: '#f1f5f9',
                      fontSize: 12,
                      marginBottom: 16
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Smartphone size={14} color="#0284c7" />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{eco.flagship.name || 'Flagship Phone'}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0284c7' }}>
                      {formatLKR(eco.flagship.price || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 14,
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <a
                  href={`/ecosystem/${eco.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#0284c7',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={13} /> View Live Storefront
                </a>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleOpenEdit(eco)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(eco._id, eco.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#dc2626',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* CREATE / EDIT ECOSYSTEM MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 780,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                  {editingId ? `Edit ${formData.name}` : 'Create New Brand Ecosystem'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                  Configure identity, cinematic hero keynote video, and flagship device spotlight.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '0 24px' }}>
              {[
                { id: 'identity', label: '1. Identity & Emblem' },
                { id: 'hero', label: '2. Hero Banner & Video' },
                { id: 'flagship', label: '3. Flagship Spotlight' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveModalTab(t.id)}
                  style={{
                    padding: '12px 18px',
                    border: 'none',
                    background: 'none',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: activeModalTab === t.id ? '#0284c7' : '#64748b',
                    borderBottom: activeModalTab === t.id ? '2px solid #0284c7' : '2px solid transparent'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 24, flex: 1 }}>
              {/* TAB 1: IDENTITY */}
              {activeModalTab === 'identity' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nothing, Sony, Honor"
                      value={formData.brand}
                      onChange={e => setFormData({
                        ...formData,
                        brand: e.target.value,
                        name: formData.name || `${e.target.value} Ecosystem`,
                        slug: formData.slug || e.target.value.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
                      })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Ecosystem Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony Xperia Universe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      URL Slug / Identifier *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. nothing, sony, honor"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Brand Emblem / Icon Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ✦, , G, 1+, N, S"
                      value={formData.emblem}
                      onChange={e => setFormData({ ...formData, emblem: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Brand Accent Color (Hex)
                    </label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                        style={{ width: 42, height: 38, padding: 2, borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                        style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Keynote / Launch Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NOTHING OS 3.0 • DIALOG 5G"
                      value={formData.badgeText}
                      onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Tagline / Sub-Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Glyph Innovation. Engineered to Work Together Seamlessly."
                      value={formData.tagline}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HERO BANNER & VIDEO */}
              {activeModalTab === 'hero' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Hero Banner Main Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Phone (3) Pro / Xperia 1 VI"
                        value={formData.heroTitleMain}
                        onChange={e => setFormData({ ...formData, heroTitleMain: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Hero Banner Punchline / Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pure Glyph Innovation."
                        value={formData.heroTitleSub}
                        onChange={e => setFormData({ ...formData, heroTitleSub: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* HYBRID HERO VIDEO INPUT */}
                  <div style={{ background: '#f8fafc', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#0f172a', fontWeight: 800, fontSize: 13 }}>
                      <Video size={16} color="#0284c7" /> Cinematic Hero Keynote Video (Hybrid Option)
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>
                      Upload an MP4 / WebM video file directly from your computer, OR paste a hosted video URL / local path.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <input
                        type="text"
                        placeholder="e.g. /hero banner/nothing.mp4 or https://cdn.com/video.mp4"
                        value={formData.heroVideo}
                        onChange={e => setFormData({ ...formData, heroVideo: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '9px 14px',
                          borderRadius: 8,
                          background: '#0284c7',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: uploadingMedia ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Upload size={14} />
                        {uploadingMedia ? 'Uploading...' : 'Browse MP4'}
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/mov,video/*"
                          disabled={uploadingMedia}
                          onChange={e => handleFileUpload(e, 'heroVideo')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {formData.heroVideo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#059669', fontWeight: 700 }}>
                        <CheckCircle2 size={15} /> Active Video Source: {formData.heroVideo}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Video Title Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Phone 3 Pro — Official Film"
                        value={formData.videoTitle}
                        onChange={e => setFormData({ ...formData, videoTitle: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Video Duration / Quality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0:45 • 4K Dolby Vision"
                        value={formData.videoDuration}
                        onChange={e => setFormData({ ...formData, videoDuration: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* Fallback Cover Image */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Fallback Hero Cover Image URL / Path
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="e.g. /accessories.jpg or image URL"
                        value={formData.heroImage}
                        onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                        style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '9px 14px',
                          borderRadius: 8,
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'heroImage')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FLAGSHIP SPOTLIGHT */}
              {activeModalTab === 'flagship' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Flagship Model Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nothing Phone (3) Pro Max"
                        value={formData.flagship?.name || ''}
                        onChange={e => setFormData({
                          ...formData,
                          flagship: { ...formData.flagship, name: e.target.value }
                        })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Flagship Badge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LATEST FLAGSHIP"
                        value={formData.flagship?.badge || ''}
                        onChange={e => setFormData({
                          ...formData,
                          flagship: { ...formData.flagship, badge: e.target.value }
                        })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Starting Price (LKR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="e.g. 295000"
                        value={formData.flagship?.price || 0}
                        onChange={e => setFormData({
                          ...formData,
                          flagship: { ...formData.flagship, price: Number(e.target.value) }
                        })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Monthly Installment Preview
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LKR 12,291/mo. for 24 mos."
                        value={formData.flagship?.monthlyPrice || ''}
                        onChange={e => setFormData({
                          ...formData,
                          flagship: { ...formData.flagship, monthlyPrice: e.target.value }
                        })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                      Flagship Pitch & Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Snapdragon 8 Elite. Glyph Matrix & True 50MP Sony Optics."
                      value={formData.flagship?.tagline || ''}
                      onChange={e => setFormData({
                        ...formData,
                        flagship: { ...formData.flagship, tagline: e.target.value }
                      })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Submit Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '9px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Save size={15} />
                  {submitting ? 'Saving...' : editingId ? 'Update Ecosystem' : 'Publish Brand Ecosystem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

