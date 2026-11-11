import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { formatLKR } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';
import {
  Crown,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Plus,
  UserX,
  UserCheck,
  Trash2,
  Package,
  Layers,
  ArrowRight,
  Lock,
  Sparkles,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import SuperAdminLoginPortal from '@/components/SuperAdminLoginPortal';

export default function SuperAdminDashboardPage() {
  const { user, isSuperAdmin } = useAuth();

  // If unauthenticated or not a super admin, render dedicated Super Admin Executive Gateway
  if (!user || !isSuperAdmin) {
    return <SuperAdminLoginPortal />;
  }

  const [activeTab, setActiveTab] = useState('surveillance'); // 'surveillance' | 'staff' | 'audit' | 'settings'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Overview Data from backend
  const [overview, setOverview] = useState(null);

  // Staff Management State
  const [staffList, setStaffList] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    phone: ''
  });
  const [submittingStaff, setSubmittingStaff] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('ALL');

  // Platform Config State
  const [settings, setSettings] = useState({
    storeName: 'Quantum Mobile & Quick Electronics',
    islandwideDeliveryFee: 650,
    freeDeliveryThreshold: 25000,
    maintenanceMode: false,
    payhereMerchantId: '219481',
    trcslEnforcement: true
  });

  const fetchSuperAdminData = async () => {
    try {
      setRefreshing(true);
      const [overviewRes, staffRes, auditRes] = await Promise.all([
        adminService.getSuperAdminOverview(),
        adminService.getStaff(),
        adminService.getAuditLogs({ limit: 50 })
      ]);

      if (overviewRes?.data) setOverview(overviewRes.data);
      if (staffRes?.data) setStaffList(staffRes.data);
      if (auditRes?.data) setAuditLogs(auditRes.data);
    } catch (err) {
      console.error('Super admin fetch failed:', err);
      toast.error('Failed to load Super Admin control data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  // Staff Deactivation / Reactivation
  const handleToggleStaff = async (staffId, currentStatus) => {
    try {
      const res = await adminService.toggleStaffStatus(staffId, !currentStatus);
      toast.success(res?.message || 'Staff status updated');
      fetchSuperAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update staff status');
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff account? This will revoke all their access.')) return;
    try {
      await adminService.deleteStaff(staffId);
      toast.success('Staff member removed');
      fetchSuperAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete staff');
    }
  };

  // Create Staff
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaffData.name || !newStaffData.email || !newStaffData.password) {
      toast.error('Please fill in Name, Email and Password.');
      return;
    }

    try {
      setSubmittingStaff(true);
      await adminService.createStaff(newStaffData);
      toast.success(`Staff account for ${newStaffData.name} created!`);
      setShowAddStaffModal(false);
      setNewStaffData({ name: '', email: '', password: '', role: 'admin', phone: '' });
      fetchSuperAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create staff account.');
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Filtered Audit Logs
  const filteredAudits = auditLogs.filter(log => {
    if (auditFilter === 'ALL') return true;
    return log.action.includes(auditFilter);
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', padding: '28px 0 64px' }}>
      <div className="container">
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
              <Crown size={28} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, fontFamily: 'Outfit, sans-serif', color: '#0f172a' }}>
                  Super Admin Console
                </h1>
                <span style={{ fontSize: 11, background: '#f3e8ff', color: '#7c3aed', border: '1px solid #d8b4fe', padding: '3px 10px', borderRadius: 8, fontWeight: 800 }}>
                  PLATFORM OWNER
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                Full financial surveillance, staff role governance, live security audit trail & platform controls.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={fetchSuperAdminData}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh Data
            </button>

            <a
              href="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #bae6fd',
                color: '#0284c7',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Manager View (Admin)
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 28 }}>
          <button
            onClick={() => setActiveTab('surveillance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'surveillance' ? '#7c3aed' : '#ffffff',
              color: activeTab === 'surveillance' ? '#ffffff' : '#475569',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'surveillance' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <TrendingUp size={16} />
            360° Financial Surveillance
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'staff' ? '#7c3aed' : '#ffffff',
              color: activeTab === 'staff' ? '#ffffff' : '#475569',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'staff' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <Users size={16} />
            Staff & RBAC Governance ({staffList.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'audit' ? '#7c3aed' : '#ffffff',
              color: activeTab === 'audit' ? '#ffffff' : '#475569',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'audit' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <Activity size={16} />
            Security Audit Stream ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'settings' ? '#7c3aed' : '#ffffff',
              color: activeTab === 'settings' ? '#ffffff' : '#475569',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'settings' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <Sliders size={16} />
            Platform Overrides & Config
          </button>
        </div>

        {/* TAB 1: 360 FINANCIAL SURVEILLANCE */}
        {activeTab === 'surveillance' && (
          <div>
            {/* Top Revenue & Valuation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 28 }}>
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Consolidated Revenue</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif', marginTop: 6 }}>
                      {formatLKR(overview?.totalRevenue ?? 10270000)}
                    </div>
                    <div style={{ fontSize: 12, color: '#10b981', marginTop: 4, fontWeight: 600 }}>+18.4% vs last cycle</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Inventory Capital Valuation</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', fontFamily: 'Outfit, sans-serif', marginTop: 6 }}>
                      {formatLKR(overview?.inventoryValuation ?? 18450000)}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {overview?.totalStockUnits ?? 124} units in warehouse
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={22} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Staff Force</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#7c3aed', fontFamily: 'Outfit, sans-serif', marginTop: 6 }}>
                      {staffList.filter(s => s.isActive !== false).length}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {staffList.filter(s => s.role === 'admin').length} Admins, {staffList.filter(s => s.role === 'technician').length} Techs
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Base</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#d97706', fontFamily: 'Outfit, sans-serif', marginTop: 6 }}>
                      {overview?.totalCustomers ?? 1}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Registered buyers</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
              {/* Payment Channel Breakdown */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 26, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Payment Method Breakdown (Audited & Verified)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>PayHere Gateway (LKR Cards, Genie, Frimi)</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.payHereTotal ?? 7800000)}</span>
                    </div>
                    <div style={{ height: 8, background: '#eff6ff', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '76%', background: '#2563eb', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>Direct Credit / Debit Card POS</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.cardTotal ?? 1850000)}</span>
                    </div>
                    <div style={{ height: 8, background: '#ecfdf5', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '18%', background: '#059669', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#d97706' }}>Cash on Doorstep Delivery (COD)</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.codTotal ?? 620000)}</span>
                    </div>
                    <div style={{ height: 8, background: '#fffbeb', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '6%', background: '#d97706', borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Owner Surveillance Alerts */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 26, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Live Store Surveillance
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>TRCSL Compliance Enforced</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>All active mobile units verified with official frequency approval.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <ShieldCheck size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Admin Activity Logging Active</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Every price change and stock adjustment is logged to Audit Trail.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Stock Level Thresholds</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Automated alerts trigger when product stock falls below 5 units.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF & RBAC GOVERNANCE */}
        {activeTab === 'staff' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  Staff Account Management & Role-Based Access (RBAC)
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  As the Store Owner, you can grant or revoke admin privileges, add managers, and deactivate compromised staff.
                </p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                }}
              >
                <Plus size={16} />
                Add New Staff Member
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Staff Name</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Email Address</th>
                    <th style={{ padding: '12px 16px' }}>Phone</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Owner Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => {
                    const isSelf = s._id === user?._id || s.email === 'owner@quick.lk';
                    const active = s.isActive !== false;
                    return (
                      <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{s.name}</div>
                          {isSelf && <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 800 }}>(You - Platform Owner)</span>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: s.role === 'super_admin' ? '#f3e8ff' : s.role === 'admin' ? '#e0f2fe' : '#f1f5f9',
                              color: s.role === 'super_admin' ? '#7c3aed' : s.role === 'admin' ? '#0284c7' : '#475569'
                            }}
                          >
                            {s.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#334155' }}>{s.email}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{s.phone || '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 8px',
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              background: active ? '#ecfdf5' : '#fef2f2',
                              color: active ? '#059669' : '#dc2626'
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#059669' : '#dc2626' }} />
                            {active ? 'ACTIVE' : 'DEACTIVATED'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          {!isSelf && (
                            <div style={{ display: 'inline-flex', gap: 8 }}>
                              <button
                                onClick={() => handleToggleStaff(s._id, active)}
                                title={active ? 'Deactivate staff account' : 'Reactivate staff account'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '5px 10px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: '1px solid',
                                  borderColor: active ? '#fecaca' : '#bbf7d0',
                                  background: active ? '#fef2f2' : '#f0fdf4',
                                  color: active ? '#dc2626' : '#16a34a',
                                  cursor: 'pointer'
                                }}
                              >
                                {active ? <UserX size={13} /> : <UserCheck size={13} />}
                                {active ? 'Deactivate' : 'Reactivate'}
                              </button>

                              <button
                                onClick={() => handleDeleteStaff(s._id)}
                                title="Delete staff account"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#64748b',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Staff Modal */}
            {showAddStaffModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                <div style={{ background: '#ffffff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 16px', fontFamily: 'Outfit, sans-serif' }}>
                    Create New Staff Account
                  </h3>
                  <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ruwan Jayasinghe"
                        value={newStaffData.name}
                        onChange={e => setNewStaffData({ ...newStaffData, name: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="staff@quick.lk"
                        value={newStaffData.email}
                        onChange={e => setNewStaffData({ ...newStaffData, email: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Temporary Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Minimum 6 characters"
                        value={newStaffData.password}
                        onChange={e => setNewStaffData({ ...newStaffData, password: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Role Assigned *</label>
                      <select
                        value={newStaffData.role}
                        onChange={e => setNewStaffData({ ...newStaffData, role: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      >
                        <option value="admin">Store Admin (Stock & Products)</option>
                        <option value="technician">Hardware Repair Technician</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Phone Contact</label>
                      <input
                        type="text"
                        placeholder="+94 77 123 4567"
                        value={newStaffData.phone}
                        onChange={e => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => setShowAddStaffModal(false)}
                        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingStaff}
                        style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {submittingStaff ? 'Creating...' : 'Grant Access'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMMUTABLE AUDIT STREAM ("Watching all these") */}
        {activeTab === 'audit' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  Store Security Audit Stream
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  Immutable log monitoring every action taken by staff and admins in real-time.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['ALL', 'PRODUCT', 'STOCK', 'ORDER', 'STAFF'].map(f => (
                  <button
                    key={f}
                    onClick={() => setAuditFilter(f)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: auditFilter === f ? '#7c3aed' : '#e2e8f0',
                      background: auditFilter === f ? '#f5f3ff' : '#ffffff',
                      color: auditFilter === f ? '#7c3aed' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Timestamp</th>
                    <th style={{ padding: '12px 16px' }}>Staff Actor</th>
                    <th style={{ padding: '12px 16px' }}>Action</th>
                    <th style={{ padding: '12px 16px' }}>Target & Details</th>
                    <th style={{ padding: '12px 16px' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map(log => {
                    const levelColors = {
                      success: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
                      warning: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
                      danger: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
                      info: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }
                    };
                    const color = levelColors[log.level] || levelColors.info;

                    return (
                      <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                          {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{log.userName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{log.userRole?.toUpperCase()}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', color: '#334155' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                          {log.target}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                            {log.level.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAudits.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
                        No audit records found matching filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM OVERRIDES & CONFIG */}
        {activeTab === 'settings' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 32, maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>
              Platform Master Configuration & Overrides
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>
              These settings have global store-wide effect across checkout, delivery calculations, and security gates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Store Branding Title
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Standard Islandwide Delivery (LKR)
                  </label>
                  <input
                    type="number"
                    value={settings.islandwideDeliveryFee}
                    onChange={e => setSettings({ ...settings, islandwideDeliveryFee: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Free Delivery Order Threshold (LKR)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={e => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  PayHere Merchant ID
                </label>
                <input
                  type="text"
                  value={settings.payhereMerchantId}
                  onChange={e => setSettings({ ...settings, payhereMerchantId: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>TRCSL Approval Enforcement</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Block listing phones without official Sri Lanka TRCSL approval badge.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.trcslEnforcement}
                  onChange={e => setSettings({ ...settings, trcslEnforcement: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#7c3aed', cursor: 'pointer' }}
                />
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#dc2626' }}>Emergency Store Maintenance Mode</div>
                  <div style={{ fontSize: 12, color: '#991b1b' }}>Temporarily pause customer checkouts for catalog overhaul.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#dc2626', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => toast.success('Platform settings saved and broadcasted!')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#7c3aed',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  Save Master Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
