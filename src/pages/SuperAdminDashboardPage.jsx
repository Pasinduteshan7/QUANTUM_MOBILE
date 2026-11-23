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
  Activity,
  Wrench,
  CreditCard,
  ShoppingBag,
  Clock,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSocket, joinAdminRoom } from '@/services/socket';
import SuperAdminLoginPortal from '@/components/SuperAdminLoginPortal';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import LiveStockCounter from '@/components/LiveStockCounter';
import AdminEmployeeManager from '@/components/AdminEmployeeManager';
import AdminRoleManager from '@/components/AdminRoleManager';
import { ecosystemService } from '@/services/ecosystemService';
import { ECOSYSTEM_DATA } from '@/data/ecosystemData';

const DEFAULT_ECOSYSTEMS_LIST = Object.entries(ECOSYSTEM_DATA).map(([slug, data]) => ({
  _id: slug,
  slug,
  name: data.name,
  brand: data.brand || slug.charAt(0).toUpperCase() + slug.slice(1),
  accentColor: data.accentColor,
  emblem: slug === 'apple' ? '' : slug === 'oneplus' ? '1+' : slug === 'xiaomi' ? 'mi' : '✦',
  ...data
}));

export default function SuperAdminDashboardPage() {
  const { user, isSuperAdmin } = useAuth();

  // If unauthenticated or not a super admin, render dedicated Super Admin Executive Gateway
  if (!user || !isSuperAdmin) {
    return <SuperAdminLoginPortal />;
  }

  return <SuperAdminDashboardContent />;
}

function SuperAdminDashboardContent() {
  const { user, isSuperAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('surveillance'); // 'surveillance' | 'staff' | 'audit' | 'settings'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Overview Data from backend
  const [overview, setOverview] = useState(null);

  // Live Stock & Inventory State (Super Admin Governance)
  const [products, setProducts] = useState([]);
  const [ecosystems, setEcosystems] = useState(DEFAULT_ECOSYSTEMS_LIST);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // Employee HR & Payroll Directory State
  const [employees, setEmployees] = useState([]);
  const [employeeStats, setEmployeeStats] = useState({ totalStaff: 0, activeStaff: 0, totalMonthlyPayroll: 0 });

  // Dynamic Admin Roles & RBAC State
  const [roles, setRoles] = useState([]);

  // Staff System Accounts State
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

  // Real-time search & filter states
  const [repairSearch, setRepairSearch] = useState('');
  const [posSearch, setPosSearch] = useState('');
  const [soldItemSearch, setSoldItemSearch] = useState('');

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
      const [overviewRes, staffRes, auditRes, productsRes, ecoRes, employeesRes, rolesRes] = await Promise.all([
        adminService.getSuperAdminOverview().catch(() => ({ data: null })),
        adminService.getStaff().catch(() => ({ data: [] })),
        adminService.getAuditLogs({ limit: 50 }).catch(() => ({ data: [] })),
        adminService.getAllProducts().catch(() => ({ data: [] })),
        ecosystemService.getAllEcosystems().catch(() => ({ data: [] })),
        adminService.getEmployees().catch(() => ({ data: { employees: [], stats: {} } })),
        adminService.getRoles().catch(() => ({ data: [] }))
      ]);

      if (overviewRes?.data) setOverview(overviewRes.data);
      if (staffRes?.data) setStaffList(staffRes.data);
      if (auditRes?.data) setAuditLogs(auditRes.data);
      if (productsRes?.data) setProducts(productsRes.data);

      if (ecoRes?.data && Array.isArray(ecoRes.data) && ecoRes.data.length > 0) {
        setEcosystems(ecoRes.data);
      } else {
        setEcosystems(DEFAULT_ECOSYSTEMS_LIST);
      }

      if (employeesRes?.data) {
        setEmployees(employeesRes.data.employees || []);
        if (employeesRes.data.stats) setEmployeeStats(employeesRes.data.stats);
      }

      if (rolesRes?.data) {
        setRoles(rolesRes.data);
      }
    } catch (err) {
      console.error('Super admin fetch failed:', err);
      toast.error('Failed to load Super Admin control data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Live WebSocket Push Synchronization for 360° Financial Surveillance & Inventory
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    joinAdminRoom();

    const handleNewOrder = (order) => {
      if (!order) return;
      toast.success(`💰 Super Admin Alert: New Retail Order LKR ${Number(order.totalPrice || 0).toLocaleString()}`, { icon: '🛍️' });
      setOverview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          grossVolume: (prev.grossVolume || 0) + Number(order.totalPrice || 0),
          recentOrders: [order, ...(prev.recentOrders || [])]
        };
      });
    };

    const handlePosSale = (sale) => {
      if (!sale) return;
      toast.success(`💳 Counter POS Sale Completed: LKR ${Number(sale.netTotal || 0).toLocaleString()}`, { icon: '🧾' });
      setOverview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          grossVolume: (prev.grossVolume || 0) + Number(sale.netTotal || 0),
          posSales: [sale, ...(prev.posSales || [])]
        };
      });
    };

    const handleNewBooking = (booking) => {
      if (!booking) return;
      toast.success(`🔧 New Cleanroom Booking: ${booking.deviceBrand} ${booking.deviceModel}`, { icon: '🔬' });
      setOverview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          recentRepairs: [booking, ...(prev.recentRepairs || [])]
        };
      });
    };

    const handleRepairPaid = (repair) => {
      if (!repair) return;
      setOverview(prev => {
        if (!prev) return prev;
        const payAmount = Number(repair.paymentAmount || repair.frozenCost || 0);
        return {
          ...prev,
          grossVolume: (prev.grossVolume || 0) + payAmount,
          recentRepairs: (prev.recentRepairs || []).map(r => (r.ticketId === repair.ticketId ? { ...r, ...repair } : r))
        };
      });
    };

    const handleStockUpdated = (productData) => {
      if (!productData?._id) return;
      setProducts(prev => prev.map(p => p._id === productData._id ? { ...p, stock: productData.stock } : p));
    };

    const handleBulkStockUpdated = (deductions) => {
      if (!Array.isArray(deductions)) return;
      setProducts(prev => {
        let list = [...prev];
        deductions.forEach(d => {
          const pid = d.productId || d.product || d._id;
          const qty = Number(d.quantity || d.qty || 1);
          list = list.map(p => p._id === pid ? { ...p, stock: Math.max(0, (p.stock || 0) - qty) } : p);
        });
        return list;
      });
    };

    const handleProductCreated = (newProd) => {
      if (!newProd) return;
      setProducts(prev => prev.some(p => p._id === newProd._id) ? prev : [newProd, ...prev]);
    };

    const handleProductUpdated = (updatedProd) => {
      if (!updatedProd) return;
      setProducts(prev => prev.map(p => p._id === updatedProd._id ? { ...p, ...updatedProd } : p));
    };

    const handleProductDeleted = (data) => {
      if (!data?._id) return;
      setProducts(prev => prev.filter(p => p._id !== data._id));
    };

    socket.on('order:created', handleNewOrder);
    socket.on('pos:saleCompleted', handlePosSale);
    socket.on('repair:booked', handleNewBooking);
    socket.on('repair:paid', handleRepairPaid);
    socket.on('inventory:stockUpdated', handleStockUpdated);
    socket.on('inventory:bulkStockUpdated', handleBulkStockUpdated);
    socket.on('product:created', handleProductCreated);
    socket.on('product:updated', handleProductUpdated);
    socket.on('product:deleted', handleProductDeleted);

    return () => {
      socket.off('order:created', handleNewOrder);
      socket.off('pos:saleCompleted', handlePosSale);
      socket.off('repair:booked', handleNewBooking);
      socket.off('repair:paid', handleRepairPaid);
      socket.off('inventory:stockUpdated', handleStockUpdated);
      socket.off('inventory:bulkStockUpdated', handleBulkStockUpdated);
      socket.off('product:created', handleProductCreated);
      socket.off('product:updated', handleProductUpdated);
      socket.off('product:deleted', handleProductDeleted);
    };
  }, []);

  // Stock Adjustment for Super Admin
  const handleStockAdjustment = async (productId, delta, absoluteStock = null) => {
    try {
      setUpdatingStockId(productId);
      const payload = absoluteStock !== null ? { stock: absoluteStock } : { delta };

      // Optimistic UI update
      setProducts(prev =>
        prev.map(p => {
          if (p._id === productId) {
            const newStock = absoluteStock !== null ? absoluteStock : Math.max(0, p.stock + delta);
            return { ...p, stock: newStock };
          }
          return p;
        })
      );

      const res = await adminService.updateProductStock(productId, payload);
      if (res?.data) {
        toast.success(`Inventory updated: ${res.data.name} is now ${res.data.stock} units`);
      }
    } catch (err) {
      console.error('Super Admin stock update failed:', err);
      toast.error('Failed to update stock');
      fetchSuperAdminData();
    } finally {
      setUpdatingStockId(null);
    }
  };

  // Delete Product Handler for Super Admin
  const handleDeleteProduct = async (productId, productName = 'Product') => {
    if (!window.confirm(`[Super Admin Action]\n\nAre you sure you want to permanently delete "${productName}" from the catalog? This will purge its live stock record and storefront listing.`)) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      toast.success(`Product "${productName}" permanently deleted!`, { icon: '🗑️' });
      fetchSuperAdminData();
    } catch (err) {
      console.error('Super Admin failed to delete product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product.');
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

  // Change Staff Role Live Handler
  const handleChangeStaffRole = async (staffId, newRole) => {
    try {
      await adminService.updateStaffRole(staffId, newRole);
      toast.success(`Role updated to ${newRole.toUpperCase()}!`, { icon: '🛡️' });
      fetchSuperAdminData();
    } catch (err) {
      console.error('Failed to change staff role:', err);
      toast.error(err.response?.data?.message || 'Failed to update staff role');
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

  // Smoothly scroll back to top of workspace when changing tabs
  useEffect(() => {
    const scrollContainer = document.getElementById('admin-main-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100%', background: '#f8fafc' }}>
      {/* LEFT VERTICAL SUPER ADMIN SIDEBAR */}
      <SuperAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBookingsCount={overview?.totalBookings || overview?.allRepairs?.length || 0}
        posSalesCount={overview?.totalPosSalesCount || overview?.allPosSales?.length || 0}
        soldItemsCount={overview?.soldItemsList?.length || 0}
        inventoryCount={products.length}
        employeesCount={employees.length}
        rolesCount={roles.length}
        staffCount={staffList.length}
      />

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, minWidth: 0, padding: '24px 32px', overflowY: 'auto' }}>
        {/* Clean Content Header (Title + Breadcrumb + Action buttons, zero wrapped pills!) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              Executive Console / {activeTab === 'surveillance' ? 'Financial Intelligence' : activeTab === 'bookings' ? 'Service Bookings' : activeTab === 'posSales' ? 'POS Sales' : activeTab === 'soldItems' ? 'Sold Units' : activeTab === 'inventory' ? 'Warehouse Stock' : activeTab === 'employees' ? 'Employees & Payroll' : activeTab === 'roles' ? 'Roles & Permissions' : 'Security Logins'}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              {activeTab === 'surveillance' ? 'Executive Financial Overview' : activeTab === 'bookings' ? 'Hardware Service Bookings' : activeTab === 'posSales' ? 'Cashier POS Counter Sales' : activeTab === 'soldItems' ? 'Sold Inventory Ledger' : activeTab === 'inventory' ? 'Warehouse Stock & Inventory' : activeTab === 'employees' ? 'Employee Roster & Payroll Directory' : activeTab === 'roles' ? 'Role-Based Access Control (RBAC)' : 'System Staff Logins & Security Audit'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              title="Real-time WebSocket active. Platform revenue, POS sales, and order streams update live without needing a page refresh."
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                borderRadius: 9,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 6px #22c55e',
                  display: 'inline-block'
                }}
              />
              Live Synced
            </span>

            <button
              type="button"
              onClick={fetchSuperAdminData}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 9,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 360 FINANCIAL SURVEILLANCE */}
        {activeTab === 'surveillance' && (
          <div>
            {/* 5 Real-Time Financial & Capital Valuation Cards (100% MongoDB) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
              {/* Consolidated Revenue */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Consolidated Revenue</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                      {formatLKR(overview?.totalRevenue || 0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontWeight: 700 }}>
                      Live All-Stream Total
                    </div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>

              {/* Cashier POS In-Store Sales */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cashier POS Sales</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#d97706', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                      {formatLKR(overview?.posRevenue || 0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {overview?.totalPosSalesCount || 0} counter sales logged
                    </div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} />
                  </div>
                </div>
              </div>

              {/* Online Market Revenue */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Online Market Orders</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#2563eb', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                      {formatLKR(overview?.onlineRevenue || 0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {overview?.totalOrdersCount || 0} customer orders
                    </div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={20} />
                  </div>
                </div>
              </div>

              {/* Device Repairs Revenue */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lab Device Repairs</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#7c3aed', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                      {formatLKR(overview?.repairPaidRevenue || 0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {overview?.totalBookings || 0} bookings ({overview?.activeRepairsCount || 0} on bench)
                    </div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wrench size={20} />
                  </div>
                </div>
              </div>

              {/* Inventory Valuation */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inventory Capital</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                      {formatLKR(overview?.inventoryValuation || 0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {overview?.totalStockUnits || 0} units in stock
                    </div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, marginBottom: 28 }}>
              {/* Payment Channel Breakdown (100% Real Audited Data) */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Payment Method Breakdown (Live MongoDB Data)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#6366f1' }}>Stripe Gateway (Online Orders + Lab Repairs)</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.stripeTotal || 0)}</span>
                    </div>
                    <div style={{ height: 7, background: '#eef2ff', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: overview?.totalRevenue ? `${Math.min(100, Math.round(((overview?.stripeTotal || 0) / overview.totalRevenue) * 100))}%` : '0%', background: '#6366f1', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#d97706' }}>In-Store Counter Cash & LankaQR</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR((overview?.posCashTotal || 0) + (overview?.posLankaQrTotal || 0))}</span>
                    </div>
                    <div style={{ height: 7, background: '#fffbeb', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: overview?.totalRevenue ? `${Math.min(100, Math.round((((overview?.posCashTotal || 0) + (overview?.posLankaQrTotal || 0)) / overview.totalRevenue) * 100))}%` : '0%', background: '#d97706', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>Direct Credit / Debit Card POS</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.posCardTotal || 0)}</span>
                    </div>
                    <div style={{ height: 7, background: '#ecfdf5', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: overview?.totalRevenue ? `${Math.min(100, Math.round(((overview?.posCardTotal || 0) / overview.totalRevenue) * 100))}%` : '0%', background: '#059669', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>PayHere Gateway (LKR Cards, Genie, Frimi)</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.payHereTotal || 0)}</span>
                    </div>
                    <div style={{ height: 7, background: '#eff6ff', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: overview?.totalRevenue ? `${Math.min(100, Math.round(((overview?.payHereTotal || 0) / overview.totalRevenue) * 100))}%` : '0%', background: '#2563eb', borderRadius: 4 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#7c3aed' }}>Cash on Doorstep Delivery (COD)</span>
                      <span style={{ fontWeight: 800 }}>{formatLKR(overview?.codTotal || 0)}</span>
                    </div>
                    <div style={{ height: 7, background: '#f5f3ff', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: overview?.totalRevenue ? `${Math.min(100, Math.round(((overview?.codTotal || 0) / overview.totalRevenue) * 100))}%` : '0%', background: '#7c3aed', borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Store Surveillance Governance */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  Live Store Surveillance Governance
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>TRCSL Compliance Enforced</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>All {products.length} catalog items and repair parts conform to TRCSL standards.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <ShieldCheck size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Active Staff Force: {staffList.length} Accounts</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{staffList.filter(s => s.role === 'admin').length} Admins, {staffList.filter(s => s.role === 'technician').length} Technicians active.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Low Stock Warning</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{overview?.lowStockItems || 0} items low in stock (≤ 5 units), {overview?.outOfStockItems || 0} out of stock.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIFIED REAL-TIME FINANCIAL TRANSACTIONS FEED (MongoDB Stream) */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                    Unified Financial Transactions Stream
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                    Live chronological incoming payments and bookings across Online Store, Galle Rd Cashier POS, and Lab Repair Bench.
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: 8 }}>
                  {overview?.unifiedTransactions?.length || 0} Logged Events
                </span>
              </div>

              {(!overview?.unifiedTransactions || overview.unifiedTransactions.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8', fontSize: 13 }}>
                  No transactions recorded yet in the database.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '10px 12px' }}>Event Ref</th>
                        <th style={{ padding: '10px 12px' }}>Channel / Type</th>
                        <th style={{ padding: '10px 12px' }}>Customer / Contact</th>
                        <th style={{ padding: '10px 12px' }}>Payment Method</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.unifiedTransactions.map((tx, idx) => {
                        const isPos = tx.type === 'POS_SALE';
                        const isRepair = tx.type === 'REPAIR_BOOKING';
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s ease' }}>
                            <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                              {tx.refNumber}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  background: isPos ? '#fffbeb' : isRepair ? '#f5f3ff' : '#eff6ff',
                                  color: isPos ? '#d97706' : isRepair ? '#7c3aed' : '#2563eb'
                                }}
                              >
                                {isPos ? '🏪 CASHIER POS' : isRepair ? '🔧 REPAIR LAB' : '🛒 ONLINE STORE'}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{tx.customer}</div>
                              <div style={{ fontSize: 11, color: '#64748b' }}>{tx.phone}</div>
                            </td>
                            <td style={{ padding: '12px', color: '#475569', fontWeight: 600 }}>
                              {tx.paymentMethod}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
                              {formatLKR(tx.amount)}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  background: tx.isPaid ? '#ecfdf5' : '#fef2f2',
                                  color: tx.isPaid ? '#059669' : '#dc2626'
                                }}
                              >
                                {tx.isPaid ? 'PAID / SETTLED' : (tx.status || 'PENDING')}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: 12 }}>
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: ALL BOOKINGS (REPAIRS & DIAGNOSTICS LAB) */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  All Device Repair Bookings ({overview?.allRepairs?.length || 0})
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  Real-time database records of all lab repair reservations, diagnostic stages, frozen price quotes, and Stripe payments.
                </p>
              </div>

              <div style={{ position: 'relative', width: 280 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  placeholder="Search ticket, model, customer..."
                  value={repairSearch}
                  onChange={(e) => setRepairSearch(e.target.value)}
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

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>TOTAL RESERVED</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{overview?.allRepairs?.length || 0}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>ACTIVE BENCH QUEUE</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#7c3aed' }}>
                  {(overview?.allRepairs || []).filter(r => ['Received', 'Diagnosing', 'Repairing', 'Quality Tested'].includes(r.status)).length}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>READY / DELIVERED</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
                  {(overview?.allRepairs || []).filter(r => ['Ready', 'Delivered'].includes(r.status)).length}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>STRIPE SETTLED REVENUE</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
                  {formatLKR(overview?.repairPaidRevenue || 0)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 12px' }}>Ticket ID</th>
                    <th style={{ padding: '10px 12px' }}>Device & Issue</th>
                    <th style={{ padding: '10px 12px' }}>Customer Contact</th>
                    <th style={{ padding: '10px 12px' }}>Service Mode</th>
                    <th style={{ padding: '10px 12px' }}>Bench Status</th>
                    <th style={{ padding: '10px 12px' }}>Price Quote</th>
                    <th style={{ padding: '10px 12px' }}>Payment Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.allRepairs || [])
                    .filter(r => {
                      if (!repairSearch) return true;
                      const q = repairSearch.toLowerCase();
                      return (
                        (r.ticketId && r.ticketId.toLowerCase().includes(q)) ||
                        (r.deviceModel && r.deviceModel.toLowerCase().includes(q)) ||
                        (r.customerName && r.customerName.toLowerCase().includes(q)) ||
                        (r.customerPhone && r.customerPhone.toLowerCase().includes(q))
                      );
                    })
                    .map((r) => (
                      <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px', fontWeight: 900, color: '#7c3aed', fontFamily: 'monospace' }}>
                          {r.ticketId}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{r.deviceBrand} {r.deviceModel}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{r.issueLabel}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.customerName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{r.customerPhone}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 700, background: r.serviceMode === 'walkin' ? '#eff6ff' : '#f0fdf4', color: r.serviceMode === 'walkin' ? '#2563eb' : '#16a34a' }}>
                            {r.serviceMode === 'walkin' ? 'Walk-In Lab' : 'Doorstep Courier'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 800, background: ['Delivered', 'Ready'].includes(r.status) ? '#ecfdf5' : '#fef3c7', color: ['Delivered', 'Ready'].includes(r.status) ? '#059669' : '#b45309' }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>
                          {r.frozenCost ? formatLKR(r.frozenCost) : (r.estimatedCost || 'Pending Quote')}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 800, background: r.isPaid ? '#ecfdf5' : '#fffbeb', color: r.isPaid ? '#059669' : '#d97706' }}>
                            {r.isPaid ? 'PAID (Stripe)' : 'UNPAID'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: 12 }}>
                          {r.appointmentDate || (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CASHIER IN-STORE POS SALES */}
        {activeTab === 'posSales' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  Cashier Counter In-Store Sales ({overview?.allPosSales?.length || 0})
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  Real-time Point-of-Sale billing receipts processed at the Galle Road Flagship Counter with instant stock deduction.
                </p>
              </div>

              <div style={{ position: 'relative', width: 280 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  placeholder="Search receipt, cashier, customer..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
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

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>TOTAL COUNTER RECEIPTS</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{overview?.allPosSales?.length || 0}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>TOTAL IN-STORE CASH</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#d97706' }}>
                  {formatLKR(overview?.posCashTotal || 0)}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>TOTAL CARD TERMINAL</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
                  {formatLKR(overview?.posCardTotal || 0)}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>TOTAL POS REVENUE</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
                  {formatLKR(overview?.posRevenue || 0)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 12px' }}>Receipt #</th>
                    <th style={{ padding: '10px 12px' }}>Cashier & Branch</th>
                    <th style={{ padding: '10px 12px' }}>Customer Contact</th>
                    <th style={{ padding: '10px 12px' }}>Items Purchased</th>
                    <th style={{ padding: '10px 12px' }}>Payment Method</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Net Total</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.allPosSales || [])
                    .filter(p => {
                      if (!posSearch) return true;
                      const q = posSearch.toLowerCase();
                      return (
                        (p.saleNumber && p.saleNumber.toLowerCase().includes(q)) ||
                        (p.cashierName && p.cashierName.toLowerCase().includes(q)) ||
                        (p.customerName && p.customerName.toLowerCase().includes(q))
                      );
                    })
                    .map((p) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px', fontWeight: 900, color: '#d97706', fontFamily: 'monospace' }}>
                          {p.saleNumber}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.cashierName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{p.branch}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.customerName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{p.customerPhone || 'Walk-in'}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {(p.items || []).map((it, idx) => (
                            <div key={idx} style={{ fontSize: 12, color: '#334155' }}>
                              <strong>{it.quantity}x</strong> {it.name}
                            </div>
                          ))}
                          {p.repairTicket?.ticketId && (
                            <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>
                              + Repair Ticket #{p.repairTicket.ticketId} ({p.repairTicket.deviceModel})
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 800, background: '#f1f5f9', color: '#0f172a' }}>
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
                          {formatLKR(p.netTotal)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: 12 }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SOLD ITEMS INTELLIGENCE */}
        {activeTab === 'soldItems' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  All Sold Items Intelligence ({overview?.soldItemsList?.length || 0})
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  Aggregated products sold across Online E-Commerce orders and Galle Rd Walk-in Cashier POS checkouts.
                </p>
              </div>

              <div style={{ position: 'relative', width: 280 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  placeholder="Search sold product..."
                  value={soldItemSearch}
                  onChange={(e) => setSoldItemSearch(e.target.value)}
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

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 12px' }}>Product</th>
                    <th style={{ padding: '10px 12px' }}>Sales Channel(s)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Units Sold</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Sales Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(!overview?.soldItemsList || overview.soldItemsList.length === 0) ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
                        No items sold yet.
                      </td>
                    </tr>
                  ) : (
                    overview.soldItemsList
                      .filter(it => {
                        if (!soldItemSearch) return true;
                        return it.name.toLowerCase().includes(soldItemSearch.toLowerCase());
                      })
                      .map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              {it.image ? (
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                />
                              ) : (
                                <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                  <Package size={20} />
                                </div>
                              )}
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>{it.name}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {(it.channels || []).map((ch, chIdx) => (
                                <span
                                  key={chIdx}
                                  style={{
                                    fontSize: 11,
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    fontWeight: 700,
                                    background: ch === 'Online Market' ? '#eff6ff' : '#fffbeb',
                                    color: ch === 'Online Market' ? '#2563eb' : '#d97706'
                                  }}
                                >
                                  {ch}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>
                            {formatLKR(it.unitPrice)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#7c3aed', fontSize: 16 }}>
                            {it.quantitySold} units
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
                            {formatLKR(it.totalRevenue)}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: LIVE STOCK & INVENTORY GOVERNANCE */}
        {activeTab === 'inventory' && (
          <LiveStockCounter
            products={products}
            ecosystems={ecosystems}
            onUpdateStock={handleStockAdjustment}
            updatingStockId={updatingStockId}
            onDeleteProduct={handleDeleteProduct}
            canAdjust={true}
          />
        )}

        {/* TAB: EMPLOYEES & PAYROLL DIRECTORY */}
        {activeTab === 'employees' && (
          <AdminEmployeeManager
            employees={employees}
            stats={employeeStats}
            onRefresh={fetchSuperAdminData}
          />
        )}

        {/* TAB: DYNAMIC ADMIN ROLES & RBAC */}
        {activeTab === 'roles' && (
          <AdminRoleManager
            roles={roles}
            onRefresh={fetchSuperAdminData}
          />
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
                          {isSelf ? (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 800,
                                padding: '4px 9px',
                                borderRadius: 6,
                                background: '#f3e8ff',
                                color: '#7c3aed'
                              }}
                            >
                              PLATFORM OWNER
                            </span>
                          ) : (
                            <select
                              value={s.role}
                              onChange={(e) => handleChangeStaffRole(s._id, e.target.value)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                background: '#f8fafc',
                                color: '#0f172a',
                                fontSize: 11.5,
                                fontWeight: 800,
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="admin">Store Admin (General)</option>
                              <option value="store">Store Admin (Colombo Flagship)</option>
                              <option value="tech">Senior Tech Lab Officer</option>
                              <option value="cashier">Counter Cashier (POS)</option>
                              <option value="logistics">Courier & Transit Officer</option>
                              {roles
                                .filter(r => !['store', 'tech', 'cashier', 'logistics'].includes(r.slug))
                                .map(r => (
                                  <option key={r.slug} value={r.slug}>
                                    {r.icon || '🛡️'} {r.name}
                                  </option>
                                ))}
                            </select>
                          )}
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
      </div>
    </div>
  );
}
