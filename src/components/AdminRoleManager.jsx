import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Lock,
  Layers,
  CheckSquare,
  Square,
  Sparkles,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';

const AVAILABLE_PRIVILEGES = [
  { id: 'inventory:view', label: 'View Live Stock Counter', group: 'Inventory & Catalog', tab: 'inventory' },
  { id: 'inventory:adjust', label: 'Quick Stock Adjuster & Restock', group: 'Inventory & Catalog', tab: 'inventory' },
  { id: 'ecosystems:manage', label: 'Manage Brand Ecosystems & Videos', group: 'Inventory & Catalog', tab: 'ecosystems' },
  { id: 'products:create', label: 'Publish New Catalog Products', group: 'Inventory & Catalog', tab: 'addProduct' },
  { id: 'products:edit', label: 'Modify Product Pricing & Specs', group: 'Inventory & Catalog', tab: 'addProduct' },

  { id: 'chats:view', label: 'View Customer Inquiries & Chats', group: 'Customer Experience', tab: 'chats' },
  { id: 'chats:reply', label: 'Reply to Customer Consultations', group: 'Customer Experience', tab: 'chats' },

  { id: 'orders:view', label: 'View Retail Orders & Invoices', group: 'Orders & Fulfillment', tab: 'orders' },
  { id: 'orders:dispatch', label: 'Update Order Dispatch Status', group: 'Orders & Fulfillment', tab: 'orders' },

  { id: 'repairs:bench', label: 'Hardware Diagnostic Lab Bench', group: 'Repairs & Technical', tab: 'repairs' },
  { id: 'repairs:diagnose', label: 'Technician Findings & Quotes', group: 'Repairs & Technical', tab: 'repairs' },

  { id: 'logistics:dispatch', label: 'Sri Lanka Courier Waybills (Domex/Pronto)', group: 'Logistics', tab: 'logistics' },
  { id: 'pos:terminal', label: 'In-Store Walk-in POS Billing', group: 'Retail POS', tab: 'pos' },
  { id: 'finance:view', label: '360° Financial & Revenue Auditing', group: 'Financials', tab: 'surveillance' }
];

const PRESET_ICONS = ['🛡️', '🎧', '🛍️', '🔬', '🚚', '💳', '📊', '⚡', '🌟', '💼', '📦', '🔧'];
const PRESET_COLORS = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#2563eb'];

const DEFAULT_ROLE_FORM = {
  name: '',
  slug: '',
  description: '',
  icon: '🎧',
  badgeColor: '#0284c7',
  officerName: 'Assigned Lead',
  department: 'Operations',
  privileges: ['chats:view', 'chats:reply']
};

export default function AdminRoleManager({ roles = [], onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_ROLE_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_ROLE_FORM);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (role) => {
    setEditingId(role._id);
    setFormData({
      name: role.name || '',
      slug: role.slug || '',
      description: role.description || '',
      icon: role.icon || '🛡️',
      badgeColor: role.badgeColor || '#0284c7',
      officerName: role.officerName || 'Assigned Lead',
      department: role.department || 'Operations',
      privileges: role.privileges || []
    });
    setModalOpen(true);
  };

  // Toggle Privilege
  const handleTogglePrivilege = (privId) => {
    setFormData(prev => {
      const exists = prev.privileges.includes(privId);
      const newPrivs = exists
        ? prev.privileges.filter(p => p !== privId)
        : [...prev.privileges, privId];
      return { ...prev, privileges: newPrivs };
    });
  };

  // Submit Role
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Role name is required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await adminService.updateRole(editingId, formData);
        toast.success(`Role "${formData.name}" updated!`, { icon: '✅' });
      } else {
        await adminService.createRole(formData);
        toast.success(`Custom role "${formData.name}" successfully created!`, { icon: '🎉' });
      }
      setModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save role configuration.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Custom Role
  const handleDelete = async (roleId, roleName, isSystem) => {
    if (isSystem) {
      toast.error('System default roles are protected and cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete custom role "${roleName}"?`)) return;

    try {
      await adminService.deleteRole(roleId);
      toast.success(`Role "${roleName}" deleted.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  // Compute Unlocked Tabs
  const unlockedTabs = Array.from(
    new Set(
      formData.privileges
        .map(pId => AVAILABLE_PRIVILEGES.find(ap => ap.id === pId)?.tab)
        .filter(Boolean)
    )
  );

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
            Dynamic Admin Roles & Privileges (RBAC)
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Manage the 4 core system operational roles and configure dynamic custom roles with granular permission checklists.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
          }}
        >
          <Plus size={15} /> Create New Admin Role
        </button>
      </div>

      {/* Role Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
        {roles.map((r) => {
          return (
            <div
              key={r._id || r.slug}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: r.badgeColor || '#0284c7'
                }}
              />

              <div>
                {/* Header: Icon + Name + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${r.badgeColor || '#0284c7'}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        border: `1px solid ${r.badgeColor || '#0284c7'}33`
                      }}
                    >
                      {r.icon || '🛡️'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                        {r.name}
                      </h3>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                        Key: <code style={{ color: '#0284c7' }}>{r.slug}</code>
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: r.isSystem ? '#f1f5f9' : '#faf5ff',
                      color: r.isSystem ? '#475569' : '#7c3aed',
                      border: r.isSystem ? '1px solid #cbd5e1' : '1px solid #e9d5ff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {r.isSystem ? <Lock size={10} /> : <Sparkles size={10} />}
                    {r.isSystem ? 'CORE SYSTEM' : 'CUSTOM ROLE'}
                  </span>
                </div>

                <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
                  {r.description || 'Specialized role privileges and responsibilities.'}
                </p>

                <div style={{ fontSize: 11.5, color: '#334155', fontWeight: 700, marginBottom: 8 }}>
                  Officer: <span style={{ color: '#0f172a' }}>{r.officerName || 'Designated Staff'}</span>
                </div>

                {/* Allowed Dashboard Tabs */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Accessible Workspace Tabs:
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(r.allowedTabs || []).map(tab => (
                      <span
                        key={tab}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          color: '#334155'
                        }}
                      >
                        {tab}
                      </span>
                    ))}
                    {(r.allowedTabs || []).length === 0 && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>None configured</span>
                    )}
                  </div>
                </div>

                {/* Granted Privileges Count */}
                <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 14 }}>
                  <strong>{(r.privileges || []).length}</strong> privileges active
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                <button
                  onClick={() => handleOpenEdit(r)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Edit size={12} /> Edit
                </button>

                {!r.isSystem && (
                  <button
                    onClick={() => handleDelete(r._id, r.name, r.isSystem)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Delete role"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT ROLE MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #cbd5e1',
              padding: 24
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                  {editingId ? 'Edit Admin Role Privileges' : 'Create Custom Admin Role & Permissions'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                  Configure granular capability checklist and assign default workspace tabs.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Role Name & Slug */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Customer Support Lead"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Role Key / Slug *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. role_support_lead"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Description & Operational Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Managing customer inquiries, live chat responses, and support tickets."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                {/* Icon & Color Preset Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Role Icon
                    </label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {PRESET_ICONS.map(ic => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: ic })}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: formData.icon === ic ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                            background: formData.icon === ic ? '#f5f3ff' : '#ffffff',
                            fontSize: 16,
                            cursor: 'pointer'
                          }}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Accent Color
                    </label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({ ...formData, badgeColor: c })}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            border: formData.badgeColor === c ? '3px solid #0f172a' : 'none',
                            background: c,
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Officer Name & Department */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Assigned Officer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dilini Samaraweera"
                      value={formData.officerName}
                      onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Customer Support"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Granular Privileges Checklist */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      Granted Privileges Checklist ({formData.privileges.length})
                    </label>
                    <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>
                      Unlocks: {unlockedTabs.join(', ') || 'No tabs'}
                    </span>
                  </div>

                  <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {AVAILABLE_PRIVILEGES.map(p => {
                      const isChecked = formData.privileges.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleTogglePrivilege(p.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: isChecked ? '#ffffff' : 'transparent',
                            border: isChecked ? '1px solid #cbd5e1' : '1px solid transparent',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent onClick
                            style={{ cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 12.5, fontWeight: isChecked ? 700 : 500, color: isChecked ? '#0f172a' : '#475569' }}>
                              {p.label}
                            </span>
                            <span style={{ fontSize: 10.5, color: '#94a3b8', marginLeft: 8 }}>
                              ({p.group})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
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
                    padding: '9px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: submitting ? 'wait' : 'pointer',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  {submitting ? 'Saving Role...' : editingId ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

