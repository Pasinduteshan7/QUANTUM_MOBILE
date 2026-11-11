import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { formatLKR } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  ShoppingBag,
  Clock,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Minus,
  MessageSquare,
  Search,
  CheckCircle2,
  RefreshCw,
  Send,
  Layers,
  Truck,
  Wrench,
  Calendar,
  Phone,
  Check,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ExternalLink,
  Edit3,
  X,
  ShieldCheck,
  MapPin,
  Trash2,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLoginPortal from '@/components/AdminLoginPortal';
import PosTerminal from '@/components/PosTerminal';
import LogisticsHubBoard from '@/components/LogisticsHubBoard';

const COLOMBO_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
  '04:30 PM', '05:15 PM'
];

const COURIER_STAGES = [
  { id: 0, label: '📦 Pickup Scheduled' },
  { id: 1, label: '🚚 In Transit to Colombo Lab' },
  { id: 2, label: '🔬 Received at Lab & Diagnosing' },
  { id: 3, label: '🛠️ Repaired & Quality Tested' },
  { id: 4, label: '🛵 Return Courier Dispatched' },
  { id: 5, label: '✅ Delivered to Customer' }
];

const getCourierTrackingUrl = (partner, waybill) => {
  if (!waybill) return 'https://domex.lk/tracking';
  const p = (partner || '').toLowerCase();
  if (p.includes('koombiyo')) {
    return `https://koombiyodelivery.lk/tracking?tracking_id=${encodeURIComponent(waybill)}`;
  } else if (p.includes('prompt')) {
    return `https://promptxpress.lk/tracking?waybill=${encodeURIComponent(waybill)}`;
  } else if (p.includes('pronto')) {
    return `https://pronto.lk/tracking?consignment=${encodeURIComponent(waybill)}`;
  }
  return `https://domex.lk/tracking?wb=${encodeURIComponent(waybill)}`;
};

const DEMO_ROLES = {
  store: {
    id: 'store',
    label: 'Store Admin',
    icon: '🛍️',
    title: 'Store Admin Operations & Inventory Control',
    subtitle: 'Real-time stock counting, catalog publishing, retail order fulfillment, and online customer product inquiries.',
    badge: '🛍️ ACTIVE ROLE: STORE ADMIN (E-COMMERCE & INVENTORY)',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    officer: 'Nuwan Perera (Store Manager)',
    defaultTab: 'inventory',
    tabs: ['inventory', 'addProduct', 'chats', 'orders']
  },
  tech: {
    id: 'tech',
    label: 'Tech Admin',
    icon: '🔬',
    title: 'Hardware Diagnostic Lab & Repair Bench',
    subtitle: 'Active device bench queue, diagnostic findings, quote estimate freezing, technician notes, and repair chat.',
    badge: '🔬 ACTIVE ROLE: TECH ADMIN (LEAD HARDWARE TECHNICIAN)',
    badgeColor: '#7c3aed',
    badgeBg: '#f3e8ff',
    officer: 'Kasun Fernando (Senior Lab Technician)',
    defaultTab: 'repairs',
    tabs: ['repairs', 'chats']
  },
  logistics: {
    id: 'logistics',
    label: 'Logistics Admin',
    icon: '🚚',
    title: 'Sri Lanka Courier Logistics & Hub Routing',
    subtitle: 'Domex, Koombiyo, Prompt Xpress, and Pronto dispatching. Separate hub routing for Store Warehouse vs Colombo Tech Lab.',
    badge: '🚚 ACTIVE ROLE: LOGISTICS ADMIN (SRI LANKA COURIER DISPATCH)',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    officer: 'Roshan Silva (Logistics & Transit Officer)',
    defaultTab: 'logistics',
    tabs: ['logistics', 'orders', 'repairs']
  },
  cashier: {
    id: 'cashier',
    label: 'Cashier Admin (POS)',
    icon: '💳',
    title: 'In-Store Walk-in POS Terminal & Billing',
    subtitle: 'Point-of-Sale counter checkout, instant inventory auto-deduction, counter repair pickup & payment, thermal receipts.',
    badge: '💳 ACTIVE ROLE: CASHIER ADMIN (COUNTER POS & IN-STORE BILLING)',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    officer: 'Nimal Jayawardena (Counter Cashier - Galle Rd Hub)',
    defaultTab: 'pos',
    tabs: ['pos', 'repairs', 'inventory']
  }
};



export default function AdminDashboardPage() {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  // If unauthenticated or regular customer, render dedicated Admin Portal Login Gateway
  if (!user || !isAdmin) {
    return <AdminLoginPortal />;
  }

  // Top level state
  const [activeRole, setActiveRole] = useState('store'); // 'store' | 'tech' | 'logistics' | 'cashier'
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'addProduct' | 'chats' | 'orders' | 'repairs' | 'pos' | 'logistics'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentRoleMeta = DEMO_ROLES[activeRole] || DEMO_ROLES.store;

  const handleSwitchRole = (roleId) => {
    setActiveRole(roleId);
    setActiveTab(DEMO_ROLES[roleId].defaultTab);
    toast.success(`Switched to ${DEMO_ROLES[roleId].label} view!`, { icon: DEMO_ROLES[roleId].icon });
  };

  // Inventory & Stock Counter State
  const [products, setProducts] = useState([]);
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out' | 'in'
  const [inventorySearch, setInventorySearch] = useState('');
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Apple',
    category: 'Phones',
    price: '',
    originalPrice: '',
    stock: 10,
    mainImage: '',
    tagline: '',
    description: '',
    warranty: '1 Year Comprehensive TRCSL Sri Lanka Warranty'
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Customer Chat Hub State
  const [chats, setChats] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Device Repairs & Workshop Hub State
  const [repairs, setRepairs] = useState([]);
  const [repairStats, setRepairStats] = useState(null);
  const [repairFilter, setRepairFilter] = useState('all');
  const [repairModeFilter, setRepairModeFilter] = useState('all');
  const [repairSearch, setRepairSearch] = useState('');
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [occupiedSlotsData, setOccupiedSlotsData] = useState([]);
  const [occupiedBookings, setOccupiedBookings] = useState([]);
  const [loadingRepairs, setLoadingRepairs] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [savingRepairNotes, setSavingRepairNotes] = useState(false);

  // Initial Data Load
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, productsRes, repairsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProducts(),
        adminService.getAllRepairs().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (productsRes?.data) setProducts(productsRes.data);
      if (repairsRes?.data) {
        const list = Array.isArray(repairsRes.data) ? repairsRes.data : (repairsRes.data.repairs || []);
        const repairStatsObj = repairsRes.stats || repairsRes.data?.stats || null;
        setRepairs(list);
        if (repairStatsObj) setRepairStats(repairStatsObj);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Could not load dashboard data from backend server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch Chats, Orders, or Repairs when corresponding tab is activated
  useEffect(() => {
    if (activeTab === 'chats') {
      loadChats();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'repairs') {
      loadRepairs();
      loadOccupiedSlots(scheduleDate);
    }
  }, [activeTab]);

  const loadChats = async () => {
    try {
      const res = await adminService.getChats();
      if (res?.data) {
        setChats(res.data);
        if (res.data.length > 0 && !selectedConversation) {
          selectConversation(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const selectConversation = async (convId) => {
    setSelectedConversation(convId);
    try {
      const res = await adminService.getConversationMessages(convId);
      if (res?.data) {
        setConversationMessages(res.data);
        // Refresh stats to update unread badge count
        const updatedStats = await adminService.getStats();
        if (updatedStats?.data) setStats(updatedStats.data);
      }
    } catch (err) {
      console.error('Failed to load messages for thread:', err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedConversation) return;

    try {
      setSendingReply(true);
      const selectedThread = chats.find(c => c._id === selectedConversation);
      const res = await adminService.replyChat({
        conversationId: selectedThread?.conversationId || selectedConversation,
        threadId: selectedThread?.threadId || selectedConversation,
        message: replyMessage.trim()
      });

      if (res?.data) {
        setConversationMessages(prev => [...prev, res.data]);
        setReplyMessage('');
        toast.success('Reply sent to customer!');
        loadChats();
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
      toast.error('Failed to send reply message.');
    } finally {
      setSendingReply(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await adminService.getAllOrders();
      if (res?.data) setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
      const updatedStats = await adminService.getStats();
      if (updatedStats?.data) setStats(updatedStats.data);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  // ---- Device Repairs & Workshop Handlers ----
  const loadRepairs = async () => {
    try {
      setLoadingRepairs(true);
      const res = await adminService.getAllRepairs();
      if (res?.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.repairs || []);
        const repairStatsObj = res.stats || res.data?.stats || null;
        setRepairs(list);
        if (repairStatsObj) setRepairStats(repairStatsObj);
      }
    } catch (err) {
      console.error('Failed to load repairs:', err);
      toast.error('Could not load repair tickets');
    } finally {
      setLoadingRepairs(false);
    }
  };

  const loadOccupiedSlots = async (targetDate) => {
    try {
      const res = await adminService.getOccupiedSlots(targetDate);
      if (res?.data) {
        const slots = Array.isArray(res.data) ? res.data : (res.data.occupiedSlots || []);
        const bookings = res.repairs || res.data?.details || [];
        setOccupiedSlotsData(slots);
        setOccupiedBookings(bookings);
      }
    } catch (err) {
      console.error('Failed to load occupied slots:', err);
    }
  };

  const handleDateChange = (newDate) => {
    setScheduleDate(newDate);
    loadOccupiedSlots(newDate);
  };

  const handleUpdateRepairStatus = async (repairId, newStatus) => {
    try {
      const res = await adminService.updateRepairStatus(repairId, { status: newStatus });
      if (res?.data) {
        toast.success(`Repair #${res.data.ticketId} set to "${newStatus}"`);
        loadRepairs();
        loadOccupiedSlots(scheduleDate);
      }
    } catch (err) {
      console.error('Failed to update repair status:', err);
      toast.error('Could not update repair status');
    }
  };

  const handleUpdateCourierStage = async (repairId, newCourierStage) => {
    try {
      const res = await adminService.updateRepairStatus(repairId, { courierStage: Number(newCourierStage) });
      if (res?.data) {
        toast.success(`Mail-in repair #${res.data.ticketId} courier stage updated!`);
        loadRepairs();
      }
    } catch (err) {
      console.error('Failed to update courier stage:', err);
      toast.error('Could not update courier stage');
    }
  };

  const handleDispatchReturnCourier = async (repairId, courierPartner = 'Domex') => {
    try {
      const prefix = courierPartner === 'Koombiyo' ? 'KMB' : courierPartner === 'Prompt Xpress' ? 'PRP' : courierPartner === 'Pronto' ? 'PRN' : 'DOM';
      const returnWaybill = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await adminService.updateRepairStatus(repairId, {
        courierStage: 4, // Return Dispatched
        returnWaybillNumber: returnWaybill,
        status: 'Ready'
      });
      if (res?.data) {
        toast.success(`Return courier dispatched! Return Waybill #${returnWaybill}`, { icon: '🛵' });
        loadRepairs();
      }
    } catch (err) {
      toast.error('Failed to dispatch return courier');
    }
  };

  const handleSaveRepairNotes = async (e) => {
    e.preventDefault();
    if (!editingRepair) return;
    try {
      setSavingRepairNotes(true);
      await adminService.updateRepairStatus(editingRepair._id, {
        status: editingRepair.status,
        diagnosticNotes: editingRepair.diagnosticNotes,
        assignedTechnician: editingRepair.assignedTechnician,
        frozenCost: editingRepair.frozenCost ? Number(editingRepair.frozenCost) : undefined,
        courierPartner: editingRepair.courierPartner,
        waybillNumber: editingRepair.waybillNumber,
        returnWaybillNumber: editingRepair.returnWaybillNumber,
        courierStage: editingRepair.courierStage !== undefined ? Number(editingRepair.courierStage) : undefined,
        courierNotes: editingRepair.courierNotes
      });
      toast.success(`Updated record for #${editingRepair.ticketId}`);
      setEditingRepair(null);
      loadRepairs();
    } catch (err) {
      console.error('Failed to save repair notes:', err);
      toast.error('Failed to save technician notes');
    } finally {
      setSavingRepairNotes(false);
    }
  };

  const handleDeleteRepair = async (repairId, ticketId) => {
    if (!window.confirm(`Are you sure you want to remove repair ticket ${ticketId}?`)) return;
    try {
      await adminService.deleteRepair(repairId);
      toast.success(`Ticket ${ticketId} deleted`);
      loadRepairs();
      loadOccupiedSlots(scheduleDate);
    } catch (err) {
      toast.error('Failed to delete repair');
    }
  };

  // Quick Stock Adjustment (+1 / -1 / Direct count)
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
        toast.success(`Stock updated: ${res.data.name} is now ${res.data.stock} units`);
        // Refresh summary metrics
        const updatedStats = await adminService.getStats();
        if (updatedStats?.data) setStats(updatedStats.data);
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
      toast.error('Error updating stock count.');
      fetchDashboardData();
    } finally {
      setUpdatingStockId(null);
    }
  };

  // Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.mainImage) {
      toast.error('Please fill in Product Name, Price, and Main Image URL.');
      return;
    }

    try {
      setSubmittingProduct(true);
      const res = await adminService.createProduct({
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock)
      });

      if (res?.data) {
        toast.success(`Product "${res.data.name}" added to catalog!`);
        setFormData({
          name: '',
          brand: 'Apple',
          category: 'Phones',
          price: '',
          originalPrice: '',
          stock: 10,
          mainImage: '',
          tagline: '',
          description: '',
          warranty: '1 Year Comprehensive TRCSL Sri Lanka Warranty'
        });
        setActiveTab('inventory');
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      toast.error('Failed to create product.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Filtered Products for Inventory Counting Table
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase());

    if (!matchesSearch) return false;
    if (stockFilter === 'out') return p.stock <= 0;
    if (stockFilter === 'low') return p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'in') return p.stock > 5;
    return true;
  });

  // Filtered Repairs for Workshop Hub Table
  const filteredRepairs = repairs.filter(r => {
    const term = repairSearch.toLowerCase();
    const matchesSearch =
      !term ||
      r.ticketId?.toLowerCase().includes(term) ||
      r.customerName?.toLowerCase().includes(term) ||
      (r.customerPhone && r.customerPhone.includes(term)) ||
      r.deviceModel?.toLowerCase().includes(term) ||
      (r.issueLabel && r.issueLabel.toLowerCase().includes(term));

    if (!matchesSearch) return false;
    if (repairFilter !== 'all' && r.status !== repairFilter) return false;
    if (repairModeFilter !== 'all' && r.serviceMode !== repairModeFilter) return false;
    return true;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', padding: '24px 0 64px' }}>
      <div className="container">
        {/* PILOT DEMO 4-IN-1 ROLE SWITCHER BAR */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '2px solid #e2e8f0',
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pilot Demo: 4-in-1 Role Switcher
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Active Identity: <strong style={{ color: '#0f172a' }}>{currentRoleMeta.officer}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.values(DEMO_ROLES).map(r => {
              const isCurrent = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSwitchRole(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: isCurrent ? `2px solid ${r.badgeColor}` : '1px solid #cbd5e1',
                    background: isCurrent ? r.badgeBg : '#ffffff',
                    color: isCurrent ? r.badgeColor : '#475569',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isCurrent ? `0 2px 8px ${r.badgeColor}33` : 'none'
                  }}
                >
                  <span>{r.icon}</span>
                  {r.label}
                  {isCurrent && <Check size={13} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                background: currentRoleMeta.badgeBg,
                color: currentRoleMeta.badgeColor,
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={13} />
              {currentRoleMeta.badge}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
              {currentRoleMeta.title}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 720 }}>
              {currentRoleMeta.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={fetchDashboardData}
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
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh Data
            </button>

            {isSuperAdmin && (
              <a
                href="/super-admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                }}
              >
                Super Admin Console
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>

        {/* 5 Real-Time Operational KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                {stats?.totalStockUnits ?? products.reduce((acc, p) => acc + (p.stock || 0), 0)}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Units in Stock</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#d97706', fontFamily: 'Outfit, sans-serif' }}>
                {stats?.lowStockCount ?? products.filter(p => p.stock > 0 && p.stock <= 5).length}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Low Stock Alert (≤ 5)</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#dc2626', fontFamily: 'Outfit, sans-serif' }}>
                {stats?.outOfStockCount ?? products.filter(p => p.stock <= 0).length}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Out of Stock (0 units)</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#16a34a', fontFamily: 'Outfit, sans-serif' }}>
                {stats?.unreadChats ?? 2}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Customer Live Chats</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed', fontFamily: 'Outfit, sans-serif' }}>
                {stats?.pendingOrders ?? 0}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Pending Dispatch</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={22} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#b45309', fontFamily: 'Outfit, sans-serif' }}>
                {repairStats?.active ?? repairs.filter(r => ['Received', 'Diagnosing', 'Repairing', 'Quality Tested'].includes(r.status)).length}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Active Lab Repairs</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flexWrap: 'wrap' }}>
            {/* IN-STORE POS TERMINAL (CASHIER) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('pos')) && (
              <button
                onClick={() => setActiveTab('pos')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'pos' ? '#d97706' : '#ffffff',
                  color: activeTab === 'pos' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'pos' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none'
                }}
              >
                <CreditCard size={16} />
                In-Store Counter POS Terminal
              </button>
            )}

            {/* LIVE STOCK & INVENTORY COUNTER (STORE) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('inventory')) && (
              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'inventory' ? '#0284c7' : '#ffffff',
                  color: activeTab === 'inventory' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'inventory' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <Package size={16} />
                Live Stock & Inventory Counter ({products.length})
              </button>
            )}

            {/* ADD NEW PRODUCT (STORE) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('addProduct')) && (
              <button
                onClick={() => setActiveTab('addProduct')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'addProduct' ? '#0284c7' : '#ffffff',
                  color: activeTab === 'addProduct' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'addProduct' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <Plus size={16} />
                Add New Product
              </button>
            )}

            {/* CUSTOMER CONSULTATION / CHAT (STORE / TECH) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('chats')) && (
              <button
                onClick={() => setActiveTab('chats')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'chats' ? '#0284c7' : '#ffffff',
                  color: activeTab === 'chats' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'chats' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <MessageSquare size={16} />
                Customer Inquiries & Consultations
                {stats?.unreadChats > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10 }}>
                    {stats.unreadChats}
                  </span>
                )}
              </button>
            )}

            {/* DEVICE REPAIRS & BENCH (TECH / LOGISTICS / CASHIER) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('repairs')) && (
              <button
                onClick={() => setActiveTab('repairs')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'repairs' ? '#7c3aed' : '#ffffff',
                  color: activeTab === 'repairs' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'repairs' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
                }}
              >
                <Wrench size={16} />
                Device Repairs & Bench ({repairs.length})
                {repairStats?.active > 0 && (
                  <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 800 }}>
                    {repairStats.active}
                  </span>
                )}
              </button>
            )}

            {/* SRI LANKA COURIER DISPATCH & HUB ROUTING (LOGISTICS) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('logistics')) && (
              <button
                onClick={() => setActiveTab('logistics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'logistics' ? '#059669' : '#ffffff',
                  color: activeTab === 'logistics' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'logistics' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none'
                }}
              >
                <Truck size={16} />
                Sri Lanka Courier Dispatch & Hub Routing
              </button>
            )}

            {/* ORDER PROCESSING (STORE / LOGISTICS) */}
            {(showAllTabs || currentRoleMeta.tabs.includes('orders')) && (
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'orders' ? '#0284c7' : '#ffffff',
                  color: activeTab === 'orders' ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'orders' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <ShoppingBag size={16} />
                Retail Orders ({orders.length})
              </button>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowAllTabs(!showAllTabs)}
              style={{
                background: 'none',
                border: '1px dashed #cbd5e1',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 11,
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              {showAllTabs ? 'Hide Other Tabs' : 'View All Tabs'}
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE STOCK & INVENTORY COUNTER */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'low', label: 'Low Stock (≤ 5)', count: stats?.lowStockCount },
                  { id: 'out', label: 'Out of Stock (0)', count: stats?.outOfStockCount },
                  { id: 'in', label: 'Healthy Stock (> 5)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStockFilter(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: stockFilter === tab.id ? '#0284c7' : '#e2e8f0',
                      background: stockFilter === tab.id ? '#f0f9ff' : '#ffffff',
                      color: stockFilter === tab.id ? '#0284c7' : '#64748b',
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
                  placeholder="Filter by name, brand, category..."
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
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Quick Adjuster</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const isLow = p.stock > 0 && p.stock <= 5;
                    const isOut = p.stock <= 0;
                    return (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                        {/* Product Info */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={p.mainImage || '/iphone16pro.jpg'}
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

                        {/* Price */}
                        <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                          {formatLKR(p.price)}
                        </td>

                        {/* Stock Counter Badge */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '5px 12px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 800,
                              background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#ecfdf5',
                              color: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669',
                              border: `1px solid ${isOut ? '#fecaca' : isLow ? '#fde68a' : '#a7f3d0'}`
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669' }} />
                            {isOut ? '0 (Out of Stock)' : `${p.stock} units left`}
                          </span>
                        </td>

                        {/* Quick Stock Controls (+ / - / restock) */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <button
                              onClick={() => handleStockAdjustment(p._id, -1)}
                              disabled={p.stock <= 0 || updatingStockId === p._id}
                              title="Decrease stock by 1"
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: p.stock <= 0 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Minus size={13} />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => handleStockAdjustment(p._id, null, parseInt(e.target.value) || 0)}
                              style={{
                                width: 48,
                                height: 28,
                                textAlign: 'center',
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#0f172a'
                              }}
                            />

                            <button
                              onClick={() => handleStockAdjustment(p._id, +1)}
                              disabled={updatingStockId === p._id}
                              title="Increase stock by 1"
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <Plus size={13} />
                            </button>

                            <button
                              onClick={() => handleStockAdjustment(p._id, +10)}
                              disabled={updatingStockId === p._id}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 6,
                                border: '1px solid #bae6fd',
                                background: '#f0f9ff',
                                color: '#0284c7',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              +10 Restock
                            </button>
                          </div>
                        </td>

                        {/* Stock Value */}
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontSize: 13, color: '#334155' }}>
                          {formatLKR(p.price * (p.stock || 0))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <Package size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>No matching products found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD PRODUCT FORM */}
        {activeTab === 'addProduct' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 32, maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>
              Add New Product to Store Catalog
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>
              Add a new smartphone, wearable, audio device, or accessory. New items instantly sync with the storefront and inventory tracker.
            </p>

            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 16 Pro 256GB / Galaxy Buds3 Pro"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Ecosystem Brand *
                </label>
                <select
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Anker">Anker</option>
                  <option value="Belkin">Belkin</option>
                  <option value="Spigen">Spigen</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                >
                  <option value="Phones">Phones</option>
                  <option value="Watch">Watch / Wearables</option>
                  <option value="Audio">Audio / Earbuds</option>
                  <option value="Chargers">Chargers & Power</option>
                  <option value="Cases">Cases & Protection</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 425000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Initial Stock Count *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 15"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Main Image Path / URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/iphone16pro.jpg or full image URL"
                  value={formData.mainImage}
                  onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hello, Apple Intelligence."
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide detailed hardware specifications, warranty terms, and features..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#0284c7',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  {submittingProduct ? 'Saving to Database...' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CUSTOMER LIVE CONSULTATION & CHAT HUB */}
        {activeTab === 'chats' && (
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, height: 600, background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            {/* Left Thread List */}
            <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Customer Inquiries</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Live customer messages from storefront</div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {chats.map(c => {
                  const isSelected = selectedConversation === c._id;
                  const prod = c.productContext;
                  return (
                    <div
                      key={c._id}
                      onClick={() => selectConversation(c._id)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: isSelected ? '#f0f9ff' : '#ffffff',
                        borderLeft: isSelected ? '4px solid #0284c7' : '4px solid transparent',
                        transition: 'background 0.15s ease',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center'
                      }}
                    >
                      {prod?.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: 44, height: 44, objectFit: 'contain', background: '#f8fafc', borderRadius: 8, padding: 2, border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MessageSquare size={18} color="#0284c7" />
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.customerName}
                          </div>
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {c.unreadCount > 0 && (
                              <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 8, fontWeight: 800 }}>
                                {c.unreadCount} NEW
                              </span>
                            )}
                            <span style={{
                              fontSize: 10,
                              padding: '1px 6px',
                              borderRadius: 4,
                              fontWeight: 700,
                              background: c.isStaffReply ? '#dcfce7' : '#fef3c7',
                              color: c.isStaffReply ? '#15803d' : '#b45309'
                            }}>
                              {c.isStaffReply ? 'Answered' : 'Awaiting Reply'}
                            </span>
                          </div>
                        </div>

                        {prod && (
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                            {prod.name} {prod.finish && `(${prod.finish})`}
                          </div>
                        )}

                        <div style={{ fontSize: 12, color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {c.lastMessage}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {chats.length === 0 && (
                  <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                    <MessageSquare size={32} style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 13 }}>No active customer threads.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Conversation View */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {selectedConversation ? (
                <>
                  {/* Thread Header with Product Preview */}
                  {(() => {
                    const activeThread = chats.find(c => c._id === selectedConversation);
                    const prod = activeThread?.productContext;
                    return (
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                            {activeThread?.customerName || 'Customer Thread'}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            {activeThread?.customerEmail || 'Storefront Inquiry'} • {activeThread?.lastMessageTime ? new Date(activeThread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>

                        {prod && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                            {prod.image && (
                              <img src={prod.image} alt={prod.name} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                            )}
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                                {prod.name}
                              </div>
                              <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
                                {prod.finish && <span style={{ color: '#64748b' }}>{prod.finish}</span>}
                                <span style={{ color: '#0284c7', fontWeight: 800 }}>
                                  {formatLKR(prod.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Messages Stream */}
                  <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {conversationMessages.map((m, idx) => {
                      const isMe = m.isStaff;
                      return (
                        <div
                          key={idx}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                            {m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div
                            style={{
                              padding: '10px 14px',
                              borderRadius: 14,
                              fontSize: 13,
                              lineHeight: 1.5,
                              background: isMe ? '#0284c7' : '#f1f5f9',
                              color: isMe ? '#ffffff' : '#0f172a',
                              borderBottomRightRadius: isMe ? 2 : 14,
                              borderBottomLeftRadius: isMe ? 14 : 2
                            }}
                          >
                            {m.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Canned Quick Replies for Admin */}
                  <div style={{ display: 'flex', gap: 6, padding: '6px 14px', overflowX: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    {[
                      "Yes, this model is currently in stock at our Colombo branch.",
                      "Includes 1-Year official Apple warranty + 6-month Quantum Care guarantee.",
                      "Installment plans available up to 24 months with zero interest.",
                      "Free islandwide delivery within 24-48 hours with door-step card payment."
                    ].map((canned, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyMessage(canned)}
                        style={{
                          fontSize: 11,
                          whiteSpace: 'nowrap',
                          padding: '4px 10px',
                          borderRadius: 12,
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {canned.slice(0, 30)}...
                      </button>
                    ))}
                  </div>

                  {/* Reply Input Bar */}
                  <form onSubmit={handleSendReply} style={{ padding: 14, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, background: '#ffffff' }}>
                    <input
                      type="text"
                      placeholder="Type your reply to customer..."
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                      style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyMessage.trim()}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: 'none',
                        background: '#0284c7',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Send size={15} />
                      {sendingReply ? 'Sending...' : 'Reply'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                  Select an inquiry thread from the left to view and chat.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 16px', fontFamily: 'Outfit, sans-serif' }}>
              Customer Orders & Packaging Queue
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Items</th>
                    <th style={{ padding: '12px 16px' }}>Total Amount</th>
                    <th style={{ padding: '12px 16px' }}>Payment</th>
                    <th style={{ padding: '12px 16px' }}>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: 13, color: '#0284c7' }}>
                        #{o._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{o.shippingAddress?.city || 'Colombo'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>
                        {o.orderItems?.length || 1} item(s)
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: 13 }}>
                        {formatLKR(o.totalPrice)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eff6ff', color: '#2563eb' }}>
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            border: '1px solid #cbd5e1',
                            background: o.orderStatus === 'DELIVERED' ? '#ecfdf5' : o.orderStatus === 'SHIPPED' ? '#eff6ff' : '#fffbeb',
                            color: o.orderStatus === 'DELIVERED' ? '#059669' : o.orderStatus === 'SHIPPED' ? '#2563eb' : '#d97706',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DEVICE REPAIRS & OCCUPIED TIMESLOTS WORKSHOP HUB */}
        {activeTab === 'repairs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Top Operational Status Banner */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#ecfdf5', color: '#059669', borderRadius: 6, fontSize: 11, fontWeight: 800, marginBottom: 6 }}>
                    <ShieldCheck size={12} />
                    COLOMBO CLEANROOM LAB & WORKSHOP DISPATCH
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                    Device Repairs & Time Slot Master Schedule
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                    View live customer repair intakes, manage technician stages, and monitor occupied Colombo lab appointment slots in real-time.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="/repairs/book"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    <Plus size={14} />
                    New Customer Intake Booking
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => { loadRepairs(); loadOccupiedSlots(scheduleDate); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={13} style={{ animation: loadingRepairs ? 'spin 1s linear infinite' : 'none' }} />
                    Refresh Schedule
                  </button>
                </div>
              </div>

              {/* 5 Repair Status Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Tickets</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>{repairs.length}</div>
                </div>
                <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: 12, border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Active on Bench</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#b45309', fontFamily: 'Outfit, sans-serif' }}>
                    {repairStats?.active ?? repairs.filter(r => ['Received', 'Diagnosing', 'Repairing', 'Quality Tested'].includes(r.status)).length}
                  </div>
                </div>
                <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: 12, border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Walk-in Bookings</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0284c7', fontFamily: 'Outfit, sans-serif' }}>
                    {repairStats?.walkins ?? repairs.filter(r => r.serviceMode === 'walkin').length}
                  </div>
                </div>
                <div style={{ background: '#faf5ff', padding: '12px 16px', borderRadius: 12, border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>Mail-in Couriers</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#7c3aed', fontFamily: 'Outfit, sans-serif' }}>
                    {repairStats?.mailins ?? repairs.filter(r => r.serviceMode === 'mailin').length}
                  </div>
                </div>
                <div style={{ background: '#ecfdf5', padding: '12px 16px', borderRadius: 12, border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Ready for Pickup</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
                    {repairStats?.ready ?? repairs.filter(r => r.status === 'Ready').length}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION A: OCCUPIED TIMESLOTS & CALENDAR SCHEDULE */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={18} style={{ color: '#0284c7' }} />
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                      Colombo Lab Bench Schedule & Occupied Timeslots
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                    Select a date to inspect all 30-minute workshop appointment slots and see booked customer arrivals.
                  </p>
                </div>

                {/* Date Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc'
                    }}
                  />
                  <button
                    onClick={() => handleDateChange(new Date().toISOString().split('T')[0])}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      background: scheduleDate === new Date().toISOString().split('T')[0] ? '#0284c7' : '#ffffff',
                      color: scheduleDate === new Date().toISOString().split('T')[0] ? '#ffffff' : '#475569',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                      handleDateChange(tomorrow);
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tomorrow
                  </button>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: 8 }}>
                    {occupiedSlotsData.length} of {COLOMBO_SLOTS.length} Slots Occupied
                  </span>
                </div>
              </div>

              {/* 10 Time Slots Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {COLOMBO_SLOTS.map((slot) => {
                  const isOccupied = occupiedSlotsData.includes(slot);
                  const booking = occupiedBookings.find(b => b.timeSlot === slot) ||
                    repairs.find(r => r.appointmentDate === scheduleDate && r.timeSlot === slot);

                  return (
                    <div
                      key={slot}
                      style={{
                        borderRadius: 12,
                        border: isOccupied ? '2px solid #fca5a5' : '1px dashed #cbd5e1',
                        background: isOccupied ? '#fef2f2' : '#ffffff',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 10,
                        transition: 'all 0.2s ease',
                        boxShadow: isOccupied ? '0 2px 8px rgba(239, 68, 68, 0.08)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 13, color: isOccupied ? '#991b1b' : '#334155' }}>
                          <Clock size={13} style={{ color: isOccupied ? '#ef4444' : '#64748b' }} />
                          {slot}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: isOccupied ? '#fee2e2' : '#ecfdf5',
                            color: isOccupied ? '#b91c1c' : '#047857',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </div>

                      {isOccupied && booking ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#ffffff', padding: 10, borderRadius: 8, border: '1px solid #fecaca' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>#{booking.ticketId}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569' }}>
                              {booking.status}
                            </span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 12, color: '#0f172a' }}>{booking.customerName}</div>
                          <a
                            href={`tel:${booking.customerPhone}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}
                          >
                            <Phone size={10} />
                            {booking.customerPhone}
                          </a>
                          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                            {booking.deviceModel}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {booking.issueLabel}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 0' }}>
                          <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Open for Reservation</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            Clients can book this slot on /repairs/book
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION B: REPAIR TICKETS TABLE & LIVE STATUS STEPS */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                    Master Repair Tickets & Bench Progress ({filteredRepairs.length})
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                    Update live technician diagnostic notes, progress statuses from bench to dispatch, and inspect frozen cost estimates.
                  </p>
                </div>

                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Search */}
                  <div style={{ position: 'relative', minWidth: 220 }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search ticket, name, phone, model..."
                      value={repairSearch}
                      onChange={(e) => setRepairSearch(e.target.value)}
                      style={{
                        padding: '8px 12px 8px 32px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Mode Selector */}
                  <select
                    value={repairModeFilter}
                    onChange={(e) => setRepairModeFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      fontWeight: 700,
                      background: '#f8fafc',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Service Modes</option>
                    <option value="walkin">Walk-in Colombo Lab</option>
                    <option value="mailin">Mail-in Islandwide Courier</option>
                  </select>
                </div>
              </div>

              {/* Status Pills */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
                {[
                  { id: 'all', label: `All (${repairs.length})` },
                  { id: 'Received', label: `Received (${repairs.filter(r => r.status === 'Received').length})` },
                  { id: 'Diagnosing', label: `Diagnosing (${repairs.filter(r => r.status === 'Diagnosing').length})` },
                  { id: 'Repairing', label: `Repairing (${repairs.filter(r => r.status === 'Repairing').length})` },
                  { id: 'Quality Tested', label: `Tested (${repairs.filter(r => r.status === 'Quality Tested').length})` },
                  { id: 'Ready', label: `Ready (${repairs.filter(r => r.status === 'Ready').length})` },
                  { id: 'Delivered', label: `Delivered (${repairs.filter(r => r.status === 'Delivered').length})` },
                  { id: 'Cancelled', label: `Cancelled (${repairs.filter(r => r.status === 'Cancelled').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRepairFilter(tab.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid',
                      borderColor: repairFilter === tab.id ? '#0284c7' : '#e2e8f0',
                      background: repairFilter === tab.id ? '#f0f9ff' : '#ffffff',
                      color: repairFilter === tab.id ? '#0284c7' : '#64748b',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Repairs Master Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '12px 14px' }}>Ticket ID</th>
                      <th style={{ padding: '12px 14px' }}>Customer Contact</th>
                      <th style={{ padding: '12px 14px' }}>Device & Issue</th>
                      <th style={{ padding: '12px 14px' }}>Service Mode & Time</th>
                      <th style={{ padding: '12px 14px' }}>Estimate / Cost</th>
                      <th style={{ padding: '12px 14px' }}>Bench Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepairs.map((r) => {
                      const isWalkin = r.serviceMode === 'walkin';

                      return (
                        <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                          {/* Ticket ID */}
                          <td style={{ padding: '14px 14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <a
                                href={`/repairs/track?ticket=${r.ticketId}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontWeight: 900,
                                  fontSize: 13,
                                  color: '#0284c7',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                #{r.ticketId}
                                <ExternalLink size={11} />
                              </a>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                {new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td style={{ padding: '14px 14px' }}>
                            <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{r.customerName}</div>
                            <a
                              href={`tel:${r.customerPhone}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}
                            >
                              <Phone size={11} />
                              {r.customerPhone}
                            </a>
                            {r.address && (
                              <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                <MapPin size={10} />
                                {r.address.city || r.address.addressLine1 || 'Colombo Lab Pickup'}
                              </div>
                            )}
                          </td>

                          {/* Device & Issue */}
                          <td style={{ padding: '14px 14px', maxWidth: 240 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 10, fontWeight: 800, background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: 4 }}>
                                {r.deviceBrand}
                              </span>
                              <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{r.deviceModel}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{r.issueLabel}</div>
                            {r.notes && (
                              <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>
                                "{r.notes}"
                              </div>
                            )}
                          </td>

                          {/* Mode & Schedule */}
                          <td style={{ padding: '14px 14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  background: isWalkin ? '#e0f2fe' : '#f3e8ff',
                                  color: isWalkin ? '#0369a1' : '#6b21a8',
                                  width: 'fit-content'
                                }}
                              >
                                {isWalkin ? 'Walk-in Colombo Lab' : 'Islandwide Mail-in'}
                              </span>
                              {isWalkin ? (
                                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>
                                  {r.appointmentDate} at <span style={{ color: '#0284c7' }}>{r.timeSlot}</span>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Truck size={12} /> {r.courierPartner || 'Domex'}
                                  </div>
                                  {r.waybillNumber && (
                                    <a
                                      href={getCourierTrackingUrl(r.courierPartner, r.waybillNumber)}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: '#0284c7',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 2
                                      }}
                                      title="Open Courier Portal"
                                    >
                                      Inward: #{r.waybillNumber} <ExternalLink size={10} />
                                    </a>
                                  )}
                                  {r.returnWaybillNumber && (
                                    <a
                                      href={getCourierTrackingUrl(r.courierPartner, r.returnWaybillNumber)}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: '#059669',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 2
                                      }}
                                      title="Open Return Courier Tracking"
                                    >
                                      Return: #{r.returnWaybillNumber} <ExternalLink size={10} />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Cost */}
                          <td style={{ padding: '14px 14px' }}>
                            <div style={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>
                              {formatLKR(r.frozenCost || r.estimatedCost || 0)}
                            </div>
                            {r.frozenCost ? (
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: 4 }}>
                                Frozen / Final
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, color: '#94a3b8' }}>Estimated</span>
                            )}
                          </td>

                          {/* Bench Status (Interactive live selector) */}
                          <td style={{ padding: '14px 14px' }}>
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateRepairStatus(r._id, e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 800,
                                border: '1px solid #cbd5e1',
                                background:
                                  r.status === 'Ready' ? '#ecfdf5' :
                                  r.status === 'Repairing' ? '#fffbeb' :
                                  r.status === 'Diagnosing' ? '#eff6ff' :
                                  r.status === 'Quality Tested' ? '#e0f2fe' :
                                  r.status === 'Delivered' ? '#f8fafc' : '#ffffff',
                                color:
                                  r.status === 'Ready' ? '#059669' :
                                  r.status === 'Repairing' ? '#b45309' :
                                  r.status === 'Diagnosing' ? '#2563eb' :
                                  r.status === 'Quality Tested' ? '#0284c7' :
                                  r.status === 'Delivered' ? '#64748b' : '#0f172a',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Received">📥 Received at Lab</option>
                              <option value="Diagnosing">🔬 Diagnosing</option>
                              <option value="Repairing">🛠️ Repairing</option>
                              <option value="Quality Tested">✨ Quality Tested</option>
                              <option value="Ready">✅ Ready for Pickup / Return</option>
                              <option value="Delivered">📦 Delivered / Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>

                            {!isWalkin && (
                              <div style={{ marginTop: 8, padding: '6px 8px', background: '#faf5ff', borderRadius: 8, border: '1px solid #ede9fe' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#6b21a8', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Truck size={11} /> Courier Stage:
                                </div>
                                <select
                                  value={r.courierStage ?? 0}
                                  onChange={(e) => handleUpdateCourierStage(r._id, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '4px 6px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    border: '1px solid #ddd6fe',
                                    background: '#ffffff',
                                    color: '#6b21a8',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {COURIER_STAGES.map((cs) => (
                                    <option key={cs.id} value={cs.id}>
                                      {cs.label}
                                    </option>
                                  ))}
                                </select>

                                {(r.courierStage ?? 0) < 4 ? (
                                  <button
                                    onClick={() => handleDispatchReturnCourier(r._id, r.courierPartner || 'Domex')}
                                    title="Auto-generate return waybill and mark return dispatched"
                                    style={{
                                      marginTop: 6,
                                      width: '100%',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      border: 'none',
                                      background: '#7c3aed',
                                      color: '#ffffff',
                                      fontSize: 10,
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <Truck size={11} /> Dispatch Return Courier
                                  </button>
                                ) : (
                                  <div style={{ fontSize: 10, color: '#059669', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Check size={11} /> Return Dispatched
                                  </div>
                                )}
                              </div>
                            )}

                            {r.assignedTechnician && (
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                                Tech: <strong>{r.assignedTechnician}</strong>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                onClick={() => setEditingRepair({ ...r })}
                                title="Edit Diagnostic Notes & Quote"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 8,
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#0284c7',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit3 size={12} />
                                Notes
                              </button>
                              <button
                                onClick={() => handleDeleteRepair(r._id, r.ticketId)}
                                title="Delete Ticket"
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: 8,
                                  border: '1px solid #fee2e2',
                                  background: '#fff',
                                  color: '#ef4444',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredRepairs.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                          <Wrench size={32} style={{ margin: '0 auto 8px', display: 'block', color: '#cbd5e1' }} />
                          No repair tickets match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: IN-STORE POS TERMINAL (CASHIER ADMIN) */}
        {activeTab === 'pos' && (
          <PosTerminal
            products={products}
            repairs={repairs}
            onSaleCompleted={fetchDashboardData}
          />
        )}

        {/* TAB 7: SRI LANKA COURIER DISPATCH & HUB ROUTING (LOGISTICS ADMIN) */}
        {activeTab === 'logistics' && (
          <LogisticsHubBoard
            repairs={repairs}
            orders={orders}
            onRefresh={fetchDashboardData}
          />
        )}

        {/* MODAL: DIAGNOSTIC BENCH REPORT & NOTES */}
        {editingRepair && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 24,
                width: '100%',
                maxWidth: 520,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                    Diagnostic Report & Bench Record
                  </h3>
                  <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800 }}>
                    Ticket #{editingRepair.ticketId} — {editingRepair.deviceBrand} {editingRepair.deviceModel}
                  </div>
                </div>
                <button
                  onClick={() => setEditingRepair(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveRepairNotes} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Assigned Technician
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Technician Kasun Fernando"
                    value={editingRepair.assignedTechnician || ''}
                    onChange={(e) => setEditingRepair({ ...editingRepair, assignedTechnician: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Diagnostic Findings & Bench Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe diagnostic findings, parts replaced, calibration results, or notes for the customer..."
                    value={editingRepair.diagnosticNotes || ''}
                    onChange={(e) => setEditingRepair({ ...editingRepair, diagnosticNotes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Frozen Final Agreed Cost (LKR)
                  </label>
                  <input
                    type="number"
                    placeholder={`Original Estimate: ${editingRepair.estimatedCost || 0}`}
                    value={editingRepair.frozenCost || ''}
                    onChange={(e) => setEditingRepair({ ...editingRepair, frozenCost: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                    Leaving this locked protects the customer with Quantum Mobile's Frozen Estimate Guarantee.
                  </span>
                </div>

                {editingRepair.serviceMode === 'mailin' && (
                  <div style={{ padding: '12px', background: '#faf5ff', borderRadius: 10, border: '1px solid #ede9fe', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={14} /> Sri Lanka Courier Logistics (Pilot Mode)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                          Courier Partner
                        </label>
                        <select
                          value={editingRepair.courierPartner || 'Domex'}
                          onChange={(e) => setEditingRepair({ ...editingRepair, courierPartner: e.target.value })}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                        >
                          <option value="Domex">Domex Express</option>
                          <option value="Koombiyo">Koombiyo Delivery</option>
                          <option value="Prompt Xpress">Prompt Xpress</option>
                          <option value="Pronto">Pronto Lanka</option>
                          <option value="Certis Lanka">Certis Lanka</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                          Courier Stage
                        </label>
                        <select
                          value={editingRepair.courierStage ?? 0}
                          onChange={(e) => setEditingRepair({ ...editingRepair, courierStage: Number(e.target.value) })}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                        >
                          {COURIER_STAGES.map((cs) => (
                            <option key={cs.id} value={cs.id}>{cs.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                          Inward Pickup Waybill #
                        </label>
                        <input
                          type="text"
                          value={editingRepair.waybillNumber || ''}
                          placeholder="e.g. DOM-782103"
                          onChange={(e) => setEditingRepair({ ...editingRepair, waybillNumber: e.target.value })}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>
                            Return Waybill #
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const partner = editingRepair.courierPartner || 'Domex';
                              const prefix = (partner === 'Koombiyo') ? 'KMB' : (partner === 'Prompt Xpress') ? 'PRP' : (partner === 'Pronto') ? 'PRN' : 'DOM';
                              setEditingRepair({
                                ...editingRepair,
                                returnWaybillNumber: `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`,
                                courierStage: 4,
                                status: 'Ready'
                              });
                            }}
                            style={{ fontSize: 10, color: '#7c3aed', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Auto-Gen
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editingRepair.returnWaybillNumber || ''}
                          placeholder="e.g. DOM-801243"
                          onChange={(e) => setEditingRepair({ ...editingRepair, returnWaybillNumber: e.target.value })}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Courier Instructions / Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fragile OLED display parcel, call customer before delivery"
                        value={editingRepair.courierNotes || ''}
                        onChange={(e) => setEditingRepair({ ...editingRepair, courierNotes: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEditingRepair(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingRepairNotes}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    {savingRepairNotes ? 'Saving...' : 'Save & Update Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
