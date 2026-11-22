import React, { useEffect, useState, useRef } from 'react';
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
  CreditCard,
  Tag,
  Percent,
  Upload,
  Maximize2,
  Minimize2,
  Star,
  Award,
  MessageCircle,
  Eye,
  FileText,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewService } from '@/services/reviewService';
import AdminLoginPortal from '@/components/AdminLoginPortal';
import PosTerminal from '@/components/PosTerminal';
import LogisticsHubBoard from '@/components/LogisticsHubBoard';
import AdminEcosystemsManager from '@/components/AdminEcosystemsManager';
import LiveStockCounter from '@/components/LiveStockCounter';
import AdminProductForm from '@/components/AdminProductForm';
import AdminOperationsSidebar from '@/components/AdminOperationsSidebar';
import { ecosystemService } from '@/services/ecosystemService';
import { ECOSYSTEM_DATA } from '@/data/ecosystemData';
import { getSocket, joinAdminRoom } from '@/services/socket';

const DEFAULT_ECOSYSTEMS_LIST = Object.entries(ECOSYSTEM_DATA).map(([slug, data]) => ({
  _id: slug,
  slug,
  name: data.name,
  brand: data.brand || slug.charAt(0).toUpperCase() + slug.slice(1),
  accentColor: data.accentColor,
  emblem: slug === 'apple' ? '' : slug === 'oneplus' ? '1+' : slug === 'xiaomi' ? 'mi' : '✦',
  ...data
}));

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
    tabs: ['inventory', 'ecosystems', 'addProduct', 'chats', 'orders']
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
    tabs: ['repairs']
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
    tabs: ['pos', 'repairs']
  }
};



export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();

  // If unauthenticated or regular customer, render dedicated Admin Portal Login Gateway
  if (!user || !isAdmin) {
    return <AdminLoginPortal />;
  }

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  // Top level state
  const [activeRole, setActiveRole] = useState('store'); // 'store' | 'tech' | 'cashier'
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'addProduct' | 'chats' | 'orders' | 'repairs' | 'pos' | 'logistics'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [customRoles, setCustomRoles] = useState({});
  const allRolesMap = { ...DEMO_ROLES, ...customRoles };
  const currentRoleMeta = allRolesMap[activeRole] || DEMO_ROLES.store;

  const handleSwitchRole = (roleId) => {
    setActiveRole(roleId);
    const targetMeta = allRolesMap[roleId] || DEMO_ROLES.store;
    setActiveTab(targetMeta.defaultTab || 'inventory');
    toast.success(`Switched to ${targetMeta.label} view!`, { icon: targetMeta.icon });
  };

  // Inventory & Stock Counter State
  const [products, setProducts] = useState([]);
  const [ecosystems, setEcosystems] = useState(DEFAULT_ECOSYSTEMS_LIST);
  const [selectedEcosystem, setSelectedEcosystem] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'discounted' | 'low' | 'out' | 'in'
  const [inventorySearch, setInventorySearch] = useState('');
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // Add & Edit Product State
  const [editingProduct, setEditingProduct] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Customer Chat Hub State
  const [chats, setChats] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [chatFocusMode, setChatFocusMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll messages stream to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Ensure top alignment when switching to customer inquiries tab
  useEffect(() => {
    if (activeTab === 'chats') {
      const scrollEl = document.getElementById('admin-main-scroll-area');
      if (scrollEl) {
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // Orders & Courier Tracking State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [modalCourierPartner, setModalCourierPartner] = useState('Domex Express');
  const [modalWaybill, setModalWaybill] = useState('');
  const [modalDeliveryWindow, setModalDeliveryWindow] = useState('24–48 Hours across Sri Lanka');
  const [modalStatus, setModalStatus] = useState('SHIPPED');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

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

  // Reviews & Official Replies State
  const [adminReviews, setAdminReviews] = useState([]);
  const [adminReviewFilter, setAdminReviewFilter] = useState('ALL');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchAdminReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewService.getAllReviewsAdmin();
      setAdminReviews(data || []);
    } catch (err) {
      console.warn('Could not fetch admin reviews:', err.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyModalReview) return;
    setIsSubmittingReply(true);
    try {
      const updated = await reviewService.replyToReviewAdmin(replyModalReview._id, replyText);
      setAdminReviews(prev => prev.map(r => r._id === updated._id ? updated : r));
      toast.success('Official store reply published successfully!');
      setReplyModalReview(null);
      setReplyText('');
    } catch (err) {
      toast.error(err.message || 'Could not post store reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await reviewService.deleteReviewAdmin(reviewId);
      setAdminReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted from database.');
    } catch (err) {
      toast.error(err.message || 'Could not delete review.');
    }
  };

  // Initial Data Load
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, productsRes, repairsRes, ecoRes, rolesRes, ordersRes] = await Promise.all([
        adminService.getStats().catch(() => ({ data: null })),
        adminService.getAllProducts().catch(() => ({ data: [] })),
        adminService.getAllRepairs().catch(() => ({ data: [] })),
        ecosystemService.getAllEcosystems().catch(() => ({ data: [] })),
        adminService.getRoles().catch(() => ({ data: [] })),
        adminService.getAllOrders().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (productsRes?.data) setProducts(productsRes.data);
      if (ordersRes?.data && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
      if (ecoRes?.data && Array.isArray(ecoRes.data) && ecoRes.data.length > 0) {
        setEcosystems(ecoRes.data);
      } else {
        setEcosystems(DEFAULT_ECOSYSTEMS_LIST);
      }
      if (rolesRes?.data && Array.isArray(rolesRes.data)) {
        const dynamicMap = {};
        rolesRes.data.forEach(r => {
          dynamicMap[r.slug] = {
            id: r.slug,
            label: r.name,
            icon: r.icon || '🛡️',
            title: `${r.name} Operations Hub`,
            subtitle: r.description || `Specialized operations and privileges for ${r.name}`,
            badge: `${r.icon || '🛡️'} ACTIVE ROLE: ${r.name.toUpperCase()}`,
            badgeColor: r.badgeColor || '#0284c7',
            badgeBg: r.badgeBg || '#e0f2fe',
            officer: r.officerName || 'Designated Admin',
            defaultTab: r.allowedTabs?.[0] || 'inventory',
            tabs: r.allowedTabs || ['inventory']
          };
        });
        setCustomRoles(dynamicMap);
      }
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

  // Live WebSocket Listeners for real-time multi-department operational sync
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    joinAdminRoom();

    // 1. New Repair Booking
    const handleRepairBooked = (newBooking) => {
      console.log('⚡ [Admin WebSocket] New repair booked:', newBooking.ticketId);
      toast.success(`🔧 New Service Intake: ${newBooking.deviceBrand} ${newBooking.deviceModel} (${newBooking.ticketId})`, {
        icon: '📥',
        duration: 5000
      });
      setRepairs(prev => [newBooking, ...prev]);
      setRepairStats(prev => prev ? { ...prev, total: (prev.total || 0) + 1, active: (prev.active || 0) + 1, received: (prev.received || 0) + 1 } : null);
    };

    // 2. Repair Status / Notes / Payment update
    const handleRepairUpdated = (updated) => {
      setRepairs(prev => prev.map(r => (r._id === updated._id || r.ticketId === updated.ticketId) ? { ...r, ...updated } : r));
    };

    // 3. Product stock updated (from adjuster or other admin)
    const handleStockUpdated = (productData) => {
      setProducts(prev => prev.map(p => p._id === productData._id ? { ...p, stock: productData.stock } : p));
    };

    // 4. POS Sale / Bulk Stock Deduction
    const handleBulkStockUpdated = (deductions) => {
      if (!Array.isArray(deductions)) return;
      setProducts(prev => {
        let updatedList = [...prev];
        deductions.forEach(d => {
          const pid = d.productId || d.product || d._id;
          const qty = Number(d.quantity || d.qty || 1);
          updatedList = updatedList.map(p => p._id === pid ? { ...p, stock: Math.max(0, (p.stock || 0) - qty) } : p);
        });
        return updatedList;
      });
    };

    // 5. New Order Placed
    const handleOrderCreated = (newOrder) => {
      console.log('⚡ [Admin WebSocket] New order received:', newOrder._id);
      toast.success(`🛍️ New Retail Order Received! LKR ${Number(newOrder.totalPrice).toLocaleString()}`, {
        icon: '📦',
        duration: 5000
      });
      setOrders(prev => [newOrder, ...prev]);
      setStats(prev => prev ? { ...prev, totalOrders: (prev.totalOrders || 0) + 1, pendingOrders: (prev.pendingOrders || 0) + 1 } : null);
    };

    // 6. Live Chat Inquiry from customer
    const handleChatMessage = (msg) => {
      if (!msg.isStaff) {
        toast(`💬 Customer Inquiry from ${msg.senderName}: "${msg.message.slice(0, 35)}..."`, {
          icon: '💬',
          duration: 4000
        });
        setStats(prev => prev ? { ...prev, unreadChats: (prev.unreadChats || 0) + 1 } : null);
      }
    };

    // 7. Order Status & Courier Waybill Update (from another admin / payment webhook)
    const handleOrderStatusUpdated = (updatedOrder) => {
      if (!updatedOrder) return;
      setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o)));
    };

    // 8. Product Created, Updated, or Deleted (Catalog sync)
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

    // 9. Repair Deleted
    const handleRepairDeleted = (data) => {
      if (!data?.ticketId) return;
      setRepairs(prev => prev.filter(r => r.ticketId !== data.ticketId));
    };

    // 10. Verified Review Posted
    const handleReviewCreated = (review) => {
      if (!review) return;
      setAdminReviews(prev => [review, ...prev]);
      toast.success(`⭐ New Verified Review from ${review.userName} for ${review.productName}!`, { icon: '⭐' });
    };

    // 11. POS Walk-in Sale Completed
    const handlePosSaleCompleted = (sale) => {
      if (!sale) return;
      toast.success(`💳 Counter Sale #${sale.saleNumber || ''} completed! LKR ${Number(sale.netTotal || 0).toLocaleString()}`, { icon: '🧾' });
    };

    socket.on('repair:booked', handleRepairBooked);
    socket.on('repair:updated', handleRepairUpdated);
    socket.on('repair:paid', handleRepairUpdated);
    socket.on('repair:deleted', handleRepairDeleted);
    socket.on('inventory:stockUpdated', handleStockUpdated);
    socket.on('inventory:bulkStockUpdated', handleBulkStockUpdated);
    socket.on('order:created', handleOrderCreated);
    socket.on('order:statusUpdated', handleOrderStatusUpdated);
    socket.on('product:created', handleProductCreated);
    socket.on('product:updated', handleProductUpdated);
    socket.on('product:deleted', handleProductDeleted);
    socket.on('review:created', handleReviewCreated);
    socket.on('pos:saleCompleted', handlePosSaleCompleted);
    socket.on('chat:message', handleChatMessage);

    return () => {
      socket.off('repair:booked', handleRepairBooked);
      socket.off('repair:updated', handleRepairUpdated);
      socket.off('repair:paid', handleRepairUpdated);
      socket.off('repair:deleted', handleRepairDeleted);
      socket.off('inventory:stockUpdated', handleStockUpdated);
      socket.off('inventory:bulkStockUpdated', handleBulkStockUpdated);
      socket.off('order:created', handleOrderCreated);
      socket.off('order:statusUpdated', handleOrderStatusUpdated);
      socket.off('product:created', handleProductCreated);
      socket.off('product:updated', handleProductUpdated);
      socket.off('product:deleted', handleProductDeleted);
      socket.off('review:created', handleReviewCreated);
      socket.off('pos:saleCompleted', handlePosSaleCompleted);
      socket.off('chat:message', handleChatMessage);
    };
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
    } else if (activeTab === 'reviews') {
      fetchAdminReviews();
    }
  }, [activeTab]);

  // Smoothly scroll back to top of workspace when changing tabs or active demo role
  useEffect(() => {
    const scrollContainer = document.getElementById('admin-main-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, activeRole]);

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
      if (err?.response?.status === 401) {
        toast.error('Session expired or in Guest Mode. Please sign into your Admin account.');
      } else if (err?.response?.status === 403) {
        toast.error('Access restricted: Customer inquiries can only be answered by Store Admins.');
      } else {
        toast.error('Failed to send reply message.');
      }
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

  const handleUpdateOrderStatus = async (orderId, payload) => {
    try {
      await adminService.updateOrderStatus(orderId, payload);
      const label = typeof payload === 'string' ? payload : (payload.status || 'Updated');
      toast.success(`Order marked as ${label}`);
      loadOrders();
      const updatedStats = await adminService.getStats();
      if (updatedStats?.data) setStats(updatedStats.data);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const openDispatchModal = (order) => {
    setDispatchModalOrder(order);
    setModalCourierPartner(order.courierPartner || 'Domex Express');
    setModalWaybill(order.waybillNumber || '');
    setModalDeliveryWindow(order.estimatedDelivery || '24–48 Hours across Sri Lanka');
    setModalStatus(order.orderStatus === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED');
  };

  const handleAutoGenerateWaybill = (partner) => {
    const p = partner || modalCourierPartner;
    const prefix = p.includes('Koombiyo')
      ? 'KMB'
      : p.includes('Prompt')
      ? 'PRP'
      : p.includes('Pronto')
      ? 'PRN'
      : 'DOM';
    const num = Math.floor(100000 + Math.random() * 900000);
    setModalWaybill(`${prefix}-${num}`);
  };

  const handleSaveCourierDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    try {
      await handleUpdateOrderStatus(dispatchModalOrder._id, {
        status: modalStatus,
        courierPartner: modalCourierPartner,
        waybillNumber: modalWaybill.trim(),
        estimatedDelivery: modalDeliveryWindow
      });
      toast.success(`Courier tracking updated: ${modalCourierPartner} (${modalWaybill || 'Assigned'})`);
      setDispatchModalOrder(null);
    } catch (err) {
      toast.error('Failed to update courier tracking');
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

  // Edit product handler: opens structured form prefilled with product data
  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setActiveTab('addProduct');
    const scrollContainer = document.getElementById('admin-main-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelProductForm = () => {
    setEditingProduct(null);
    setActiveTab('inventory');
  };

  // Add / Update Product Submit Handler
  const handleSaveProduct = async (payload) => {
    try {
      setSubmittingProduct(true);
      if (editingProduct && (editingProduct._id || editingProduct.id)) {
        const prodId = editingProduct._id || editingProduct.id;
        await adminService.updateProduct(prodId, payload);
        toast.success(`Product "${payload.name}" updated successfully!`, { icon: '✨' });
      } else {
        await adminService.createProduct(payload);
        toast.success(`Product "${payload.name}" published to catalog!`, { icon: '🎉' });
      }
      setEditingProduct(null);
      setActiveTab('inventory');
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save product:', err);
      toast.error(err.response?.data?.message || 'Failed to save product to catalog.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (productId, productName = 'Product') => {
    if (!window.confirm(`Are you sure you want to permanently remove "${productName}" from the store catalog?\n\nThis will remove its storefront page, stock tracking, and POS catalog entry.`)) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      toast.success(`Removed "${productName}" from catalog!`, { icon: '🗑️' });
      if (editingProduct && (editingProduct._id === productId || editingProduct.id === productId)) {
        setEditingProduct(null);
        setActiveTab('inventory');
      }
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error(err.response?.data?.message || 'Failed to remove product from catalog.');
    }
  };

  // Filtered Products for Inventory Counting Table (Organized in price descending order)
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

    // 3. Stock & Discount Filter
    if (stockFilter === 'out' && p.stock > 0) return false;
    if (stockFilter === 'low' && (p.stock <= 0 || p.stock > 5)) return false;
    if (stockFilter === 'in' && p.stock <= 5) return false;
    if (stockFilter === 'discounted' && (!p.originalPrice || p.originalPrice <= p.price)) return false;

    // 4. Search Filter
    if (inventorySearch.trim()) {
      const term = inventorySearch.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    return true;
  }).sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

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
    <div style={{ display: 'flex', width: '100%', minHeight: '100%', background: '#f8fafc' }}>
      {/* LEFT VERTICAL OPERATIONS SIDEBAR */}
      <AdminOperationsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        onSwitchRole={handleSwitchRole}
        allRolesMap={allRolesMap}
        currentRoleMeta={currentRoleMeta}
        productsCount={products.length}
        ordersCount={orders.length}
        newOrdersCount={orders.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length}
        ecosystemsCount={ecosystems.length}
        unreadChatsCount={stats?.unreadChats || 0}
        activeRepairsCount={repairStats?.active || 0}
        reviewsCount={adminReviews.length}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        isSuperAdmin={isSuperAdmin}
      />

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, minWidth: 0, padding: activeTab === 'chats' ? (chatFocusMode ? '8px 16px' : '16px 24px') : '24px 32px', overflowY: 'auto' }}>
        {/* Clean Content Header (Title + Subtitle + Action buttons, zero wrapped pills!) */}
        {!chatFocusMode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                Operations / {activeTab === 'orders' ? 'Placed Orders' : activeTab === 'inventory' ? 'Inventory' : activeTab === 'addProduct' ? 'Product Editor' : activeTab === 'ecosystems' ? 'Brand Ecosystems' : activeTab === 'pos' ? 'POS Terminal' : activeTab === 'repairs' ? 'Repair Bench' : activeTab === 'chats' ? 'Live Inquiries' : activeTab === 'logistics' ? 'Courier Dispatch' : 'Reviews'}
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                {activeTab === 'orders' ? 'Placed Orders & Fulfillment Queue' : activeTab === 'inventory' ? 'Live Stock & Inventory Counter' : activeTab === 'addProduct' ? (editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product Listing') : activeTab === 'ecosystems' ? 'Brand Ecosystems & Cinematic Stages' : activeTab === 'pos' ? 'In-Store Counter POS Checkout' : activeTab === 'repairs' ? 'Active Device Repair Bench' : activeTab === 'chats' ? 'Real-Time Customer Consultations' : activeTab === 'logistics' ? 'Sri Lanka Courier Dispatch & Hub Routing' : 'Customer Reviews & Store Replies'}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={fetchDashboardData}
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

              {activeTab === 'inventory' && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab('addProduct');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 9,
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: LIVE STOCK & INVENTORY COUNTER */}
        {activeTab === 'inventory' && (
          <LiveStockCounter
            products={products}
            ecosystems={ecosystems}
            onUpdateStock={(productId, delta) => handleStockAdjustment(productId, delta)}
            updatingStockId={updatingStockId}
            onManageEcosystems={() => setActiveTab('ecosystems')}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            canAdjust={true}
          />
        )}

        {/* TAB: BRAND ECOSYSTEMS & CINEMATIC STAGES */}
        {activeTab === 'ecosystems' && (
          <AdminEcosystemsManager
            ecosystems={ecosystems}
            onRefresh={fetchDashboardData}
          />
        )}

        {/* TAB 2: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'addProduct' && (
          <AdminProductForm
            editingProduct={editingProduct}
            ecosystems={ecosystems}
            onSave={handleSaveProduct}
            onCancel={handleCancelProductForm}
            onDelete={editingProduct ? () => handleDeleteProduct(editingProduct._id || editingProduct.id, editingProduct.name) : null}
            submitting={submittingProduct}
          />
        )}

        {/* TAB 3: CUSTOMER LIVE CONSULTATION & CHAT HUB */}
        {activeTab === 'chats' && (
          <div
            id="chat-hub-container"
            style={{
              display: 'grid',
              gridTemplateColumns: '340px 1fr',
              gridTemplateRows: '1fr',
              gap: 0,
              height: chatFocusMode ? 'calc(100vh - 145px)' : 'calc(100vh - 275px)',
              minHeight: 460,
              maxHeight: chatFocusMode ? 'calc(100vh - 110px)' : 750,
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Left Thread List */}
            <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Customer Inquiries</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Live customer messages</div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatFocusMode(prev => !prev)}
                  title={chatFocusMode ? "Standard View" : "Fullscreen Chat Desk"}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: chatFocusMode ? '#0284c7' : '#ffffff',
                    color: chatFocusMode ? '#ffffff' : '#334155',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                >
                  {chatFocusMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  <span>{chatFocusMode ? 'Standard' : 'Focus'}</span>
                </button>
              </div>

              <div style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
              {selectedConversation ? (
                <>
                  {/* Thread Header with Product Preview */}
                  {(() => {
                    const activeThread = chats.find(c => c._id === selectedConversation);
                    const prod = activeThread?.productContext;
                    return (
                      <div style={{ padding: '12px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
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
                  <div style={{ flex: '1 1 0%', minHeight: 0, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Canned Quick Replies for Admin */}
                  <div style={{ display: 'flex', gap: 6, padding: '6px 14px', overflowX: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
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
                  <form onSubmit={handleSendReply} style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, background: '#ffffff', flexShrink: 0 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                  Customer Placed Orders & Fulfillment Queue
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                  Review placed orders, view itemized products, update statuses, and assign Sri Lankan courier waybills.
                </p>
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => {
                  const count = st === 'ALL' ? orders.length : orders.filter(o => o.orderStatus === st).length;
                  const isActive = orderFilter === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                        background: isActive ? '#e0f2fe' : '#ffffff',
                        color: isActive ? '#0284c7' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>{st}</span>
                      <span style={{ fontSize: 10.5, padding: '1px 5px', borderRadius: 6, background: isActive ? '#0284c7' : '#f1f5f9', color: isActive ? '#ffffff' : '#64748b' }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Order Reference</th>
                    <th style={{ padding: '12px 16px' }}>Customer & Destination</th>
                    <th style={{ padding: '12px 16px' }}>Items Summary</th>
                    <th style={{ padding: '12px 16px' }}>Grand Total</th>
                    <th style={{ padding: '12px 16px' }}>Payment</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Courier Dispatch</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(orderFilter === 'ALL' ? orders : orders.filter(o => o.orderStatus === orderFilter)).map(o => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#0284c7' }}>
                          #{o._id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                          {new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                          {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {o.shippingAddress?.city || 'Colombo'} {o.shippingAddress?.district ? `• ${o.shippingAddress.district}` : ''}
                        </div>
                        {o.shippingAddress?.phone && (
                          <div style={{ fontSize: 11.5, color: '#0284c7', marginTop: 2 }}>
                            📞 {o.shippingAddress.phone}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13 }}>
                        <div style={{ fontWeight: 700, color: '#334155' }}>
                          {o.orderItems?.length || 1} product(s)
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                          {o.orderItems?.[0]?.name || 'Flagship Device'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: 13, color: '#0f172a' }}>
                        {formatLKR(o.totalPrice)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: o.isPaid ? '#ecfdf5' : '#eff6ff', color: o.isPaid ? '#059669' : '#2563eb' }}>
                          {o.isPaid ? '✓ PAID' : 'PENDING'} ({o.paymentMethod || 'PAYHERE'})
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'SHIPPED' && !o.waybillNumber) {
                              openDispatchModal(o);
                            } else {
                              handleUpdateOrderStatus(o._id, val);
                            }
                          }}
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
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {o.waybillNumber ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Truck size={12} /> {o.courierPartner || 'Domex Express'}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'monospace', color: '#0284c7' }}>
                                {o.waybillNumber}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Unassigned</span>
                          )}

                          <button
                            type="button"
                            onClick={() => openDispatchModal(o)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: 6,
                              background: o.waybillNumber ? '#f8fafc' : '#eff6ff',
                              border: o.waybillNumber ? '1px solid #cbd5e1' : '1px solid #93c5fd',
                              color: o.waybillNumber ? '#475569' : '#1d4ed8',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="Configure Courier Logistics & Waybill"
                          >
                            <Truck size={12} />
                            <span>{o.waybillNumber ? 'Edit' : 'Dispatch'}</span>
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(o)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            background: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
                          }}
                        >
                          <Eye size={13} />
                          <span>View Order</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                        No customer orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Courier Dispatch & Tracking Modal */}
            {dispatchModalOrder && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: 20,
                  backdropFilter: 'blur(4px)'
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                    maxWidth: 500,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ background: '#0f172a', padding: '20px 24px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                        <Truck size={14} /> Courier Fulfillment Desk
                      </div>
                      <h3 style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 900 }}>
                        Dispatch Order #{dispatchModalOrder._id.slice(-6).toUpperCase()}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDispatchModalOrder(null)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer', padding: 4 }}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCourierDispatch} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12.5 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        Customer: {dispatchModalOrder.shippingAddress?.fullName || dispatchModalOrder.user?.name || 'Valued Customer'}
                      </div>
                      <div style={{ color: '#64748b', marginTop: 2 }}>
                        Address: {dispatchModalOrder.shippingAddress?.street}, {dispatchModalOrder.shippingAddress?.city} • Phone: {dispatchModalOrder.shippingAddress?.phone || 'On file'}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Select Courier Partner *
                      </label>
                      <select
                        value={modalCourierPartner}
                        onChange={(e) => {
                          setModalCourierPartner(e.target.value);
                          if (!modalWaybill || modalWaybill.includes('-')) {
                            handleAutoGenerateWaybill(e.target.value);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#0f172a'
                        }}
                      >
                        <option value="Domex Express">Domex Express (Island-wide 24-48h)</option>
                        <option value="Koombiyo Delivery">Koombiyo Delivery</option>
                        <option value="Prompt Xpress">Prompt Xpress</option>
                        <option value="Pronto Lanka">Pronto Lanka</option>
                        <option value="Certis Lanka">Certis Lanka Secure Courier</option>
                        <option value="Quantum Direct Courier">Quantum Direct Courier (Same-Day Colombo)</option>
                      </select>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 800, color: '#334155' }}>
                          Courier Waybill / Tracking Number *
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAutoGenerateWaybill()}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={modalWaybill}
                        onChange={(e) => setModalWaybill(e.target.value)}
                        placeholder="e.g. DOM-592811"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: 14,
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          color: '#0284c7'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Estimated Delivery Window
                      </label>
                      <input
                        type="text"
                        value={modalDeliveryWindow}
                        onChange={(e) => setModalDeliveryWindow(e.target.value)}
                        placeholder="e.g. 24–48 Hours across Sri Lanka"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: 13,
                          color: '#0f172a'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Update Order Fulfillment Status
                      </label>
                      <select
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: modalStatus === 'DELIVERED' ? '#ecfdf5' : '#eff6ff',
                          color: modalStatus === 'DELIVERED' ? '#059669' : '#2563eb',
                          fontSize: 13,
                          fontWeight: 800
                        }}
                      >
                        <option value="PROCESSING">PROCESSING (Preparing in warehouse)</option>
                        <option value="SHIPPED">SHIPPED (Handed over to courier)</option>
                        <option value="DELIVERED">DELIVERED (Package delivered)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => setDispatchModalOrder(null)}
                        style={{
                          flex: 1,
                          padding: 12,
                          borderRadius: 10,
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        style={{
                          flex: 2,
                          padding: 12,
                          borderRadius: 10,
                          background: '#0284c7',
                          border: 'none',
                          color: '#ffffff',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                        }}
                      >
                        Save & Update Website Tracking →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* COMPREHENSIVE ORDER DETAILS & INVOICE MODAL */}
            {selectedOrderDetails && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000,
                  padding: 16,
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                    maxWidth: 720,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}
                >
                  {/* Modal Header */}
                  <div
                    style={{
                      background: '#0f172a',
                      padding: '20px 24px',
                      color: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <ShoppingBag size={14} /> Official Customer Order Record
                      </div>
                      <h3 style={{ margin: '4px 0 0', fontSize: 19, fontWeight: 900 }}>
                        Order #{selectedOrderDetails._id.slice(-6).toUpperCase()}
                      </h3>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderDetails(null)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: 4 }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Top Status & Customer Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                          Customer & Delivery Contact
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                          {selectedOrderDetails.shippingAddress?.fullName || selectedOrderDetails.user?.name || 'Customer'}
                        </div>
                        <div style={{ fontSize: 12.5, color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                          📍 {selectedOrderDetails.shippingAddress?.street || 'Store Pickup'}<br />
                          {selectedOrderDetails.shippingAddress?.city}{selectedOrderDetails.shippingAddress?.district ? `, ${selectedOrderDetails.shippingAddress.district}` : ''} {selectedOrderDetails.shippingAddress?.postalCode || ''}
                        </div>
                        {selectedOrderDetails.shippingAddress?.phone && (
                          <div style={{ marginTop: 6, fontSize: 12, color: '#0284c7', fontWeight: 700 }}>
                            📞 {selectedOrderDetails.shippingAddress.phone}
                          </div>
                        )}
                      </div>

                      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                          Payment & Fulfillment Status
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                              background: selectedOrderDetails.orderStatus === 'DELIVERED' ? '#ecfdf5' : selectedOrderDetails.orderStatus === 'SHIPPED' ? '#eff6ff' : '#fffbeb',
                              color: selectedOrderDetails.orderStatus === 'DELIVERED' ? '#059669' : selectedOrderDetails.orderStatus === 'SHIPPED' ? '#2563eb' : '#d97706'
                            }}
                          >
                            Status: {selectedOrderDetails.orderStatus}
                          </span>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                              background: selectedOrderDetails.isPaid ? '#ecfdf5' : '#fef2f2',
                              color: selectedOrderDetails.isPaid ? '#059669' : '#dc2626'
                            }}
                          >
                            {selectedOrderDetails.isPaid ? 'PAID' : 'UNPAID'}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Gateway: <strong>{selectedOrderDetails.paymentMethod || 'PAYHERE'}</strong>
                        </div>
                        {selectedOrderDetails.paymentResult?.transactionId && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, fontFamily: 'monospace' }}>
                            TXN: {selectedOrderDetails.paymentResult.transactionId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Itemized Order Products */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 8 }}>
                        Itemized Products Purchased ({selectedOrderDetails.orderItems?.length || 0})
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11.5, textTransform: 'uppercase' }}>
                            <tr>
                              <th style={{ padding: '10px 14px' }}>Item</th>
                              <th style={{ padding: '10px 14px' }}>Variant</th>
                              <th style={{ padding: '10px 14px', textAlign: 'center' }}>Qty</th>
                              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Unit Price</th>
                              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrderDetails.orderItems?.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      style={{ width: 36, height: 36, objectFit: 'contain', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}
                                    />
                                  )}
                                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</span>
                                </td>
                                <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 12 }}>
                                  {item.color || item.finish || item.storage || 'Standard'}
                                </td>
                                <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>
                                  {item.quantity || item.qty || 1}
                                </td>
                                <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                                  {formatLKR(item.price || item.unitPrice || 0)}
                                </td>
                                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                  {formatLKR((item.price || item.unitPrice || 0) * (item.quantity || item.qty || 1))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Financial Summary & Courier Card */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {/* Courier Waybill Details */}
                      <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Truck size={14} /> Assigned Courier Logistics
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#14532d' }}>
                          {selectedOrderDetails.courierPartner || 'Domex Express'}
                        </div>
                        <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
                          Tracking Number: <strong>{selectedOrderDetails.waybillNumber || 'Not assigned yet'}</strong>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#166534', marginTop: 4 }}>
                          Estimated Delivery: {selectedOrderDetails.estimatedDelivery || '24–48 Hours across Sri Lanka'}
                        </div>
                        {selectedOrderDetails.waybillNumber && (
                          <button
                            type="button"
                            onClick={() => window.open(getCourierTrackingUrl(selectedOrderDetails.courierPartner, selectedOrderDetails.waybillNumber), '_blank')}
                            style={{
                              marginTop: 10,
                              padding: '5px 10px',
                              borderRadius: 8,
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <span>Open Live Courier Tracking</span>
                            <ExternalLink size={12} />
                          </button>
                        )}
                      </div>

                      {/* Totals Breakdown */}
                      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#64748b' }}>
                          <span>Items Subtotal:</span>
                          <span style={{ fontWeight: 600 }}>{formatLKR(selectedOrderDetails.itemsPrice || (selectedOrderDetails.totalPrice - (selectedOrderDetails.shippingPrice || 0)))}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#64748b' }}>
                          <span>Courier Delivery:</span>
                          <span style={{ fontWeight: 600 }}>{selectedOrderDetails.shippingPrice ? formatLKR(selectedOrderDetails.shippingPrice) : 'FREE'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 4 }}>
                          <span>Grand Total:</span>
                          <span style={{ color: '#0284c7' }}>{formatLKR(selectedOrderDetails.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 10,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Printer size={15} />
                      <span>Print Packing Invoice</span>
                    </button>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => {
                          const targetOrder = selectedOrderDetails;
                          setSelectedOrderDetails(null);
                          openDispatchModal(targetOrder);
                        }}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 10,
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Truck size={15} />
                        <span>Update Dispatch</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetails(null)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 10,
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

                            {r.isPaid ? (
                              <div style={{ marginTop: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '2px 7px', borderRadius: 5, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  💳 Stripe Paid
                                </span>
                              </div>
                            ) : r.frozenCost ? (
                              <div style={{ marginTop: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>
                                  ⏳ Awaiting Stripe
                                </span>
                              </div>
                            ) : null}
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

        {/* TAB 8: VERIFIED REVIEWS & OFFICIAL STORE REPLIES (NFR8) */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header & Stats Banner */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 6, marginBottom: 6, textTransform: 'uppercase' }}>
                    <ShieldCheck size={13} /> NFR8 Review Integrity & Moderation Desk
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
                    Verified Buyer & Repair Reviews
                  </h2>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                    Reviews verified against completed orders (Proof of Delivery) and finalized repair tickets in MongoDB.
                  </p>
                </div>

                <button
                  onClick={fetchAdminReviews}
                  disabled={loadingReviews}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={13} className={loadingReviews ? 'spin' : ''} />
                  Refresh Reviews
                </button>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Verified Reviews</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginTop: 4, fontFamily: 'Outfit' }}>
                    {adminReviews.length}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Average Rating</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#d97706', marginTop: 4, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={20} fill="#d97706" color="#d97706" />
                    {adminReviews.length > 0 
                      ? (adminReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / adminReviews.length).toFixed(1)
                      : '5.0'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Store Official Replies</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0284c7', marginTop: 4, fontFamily: 'Outfit' }}>
                    {adminReviews.filter(r => r.storeReply?.comment).length} / {adminReviews.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: `All Reviews (${adminReviews.length})` },
                { id: 'PRODUCT', label: `🛍️ Retail Orders (${adminReviews.filter(r => r.reviewType === 'PRODUCT').length})` },
                { id: 'REPAIR', label: `🔧 Device Repairs (${adminReviews.filter(r => r.reviewType === 'REPAIR').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAdminReviewFilter(f.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: 'none',
                    background: adminReviewFilter === f.id ? '#0f172a' : '#ffffff',
                    color: adminReviewFilter === f.id ? '#ffffff' : '#64748b',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Reviews Table / List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {adminReviews
                .filter(r => adminReviewFilter === 'ALL' || r.reviewType === adminReviewFilter)
                .map((rev) => {
                  const hasReply = Boolean(rev.storeReply?.comment);

                  return (
                    <div
                      key={rev._id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 16,
                        padding: 20,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      {/* Top Meta Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{rev.userName}</span>
                            <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                              ✓ Verified Buyer
                            </span>
                            <span style={{ fontSize: 11, background: rev.reviewType === 'PRODUCT' ? '#eff6ff' : '#f5f3ff', color: rev.reviewType === 'PRODUCT' ? '#0284c7' : '#7c3aed', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                              {rev.reviewType === 'PRODUCT' ? '🛍️ Retail Purchase' : '🔧 Lab Repair'}
                            </span>
                            {rev.orderRef && (
                              <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                                #{rev.orderRef}
                              </span>
                            )}
                            {rev.repairTicket && (
                              <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                                #{rev.repairTicket}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                            Customer: <strong>{rev.userEmail}</strong> &bull; Item / Device: <strong style={{ color: '#0f172a' }}>{rev.productName || rev.deviceModel}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
                            {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            title="Delete review"
                            style={{
                              background: '#fff',
                              border: '1px solid #fee2e2',
                              color: '#ef4444',
                              borderRadius: 6,
                              padding: '5px 8px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Stars & Comment */}
                      <div>
                        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                          {[1, 2, 3, 4, 5].map(st => (
                            <Star key={st} size={14} fill={st <= rev.rating ? '#d97706' : 'none'} color={st <= rev.rating ? '#d97706' : '#cbd5e1'} />
                          ))}
                        </div>
                        {rev.title && (
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                            {rev.title}
                          </div>
                        )}
                        <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                          &ldquo;{rev.comment}&rdquo;
                        </div>
                      </div>

                      {/* Official Store Reply Section */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                        {hasReply ? (
                          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 3 }}>
                                {rev.storeReply.repliedBy || 'Official Quantum Mobile Store Reply'} &bull; {new Date(rev.storeReply.repliedAt).toLocaleDateString()}
                              </div>
                              <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.45 }}>
                                {rev.storeReply.comment}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setReplyModalReview(rev);
                                setReplyText(rev.storeReply.comment);
                              }}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#0284c7',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              Edit Reply
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyModalReview(rev);
                              setReplyText('');
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#0284c7',
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <MessageCircle size={13} /> Post Official Store Reply
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {adminReviews.length === 0 && (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                  <Star size={36} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                  No customer reviews have been recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: POST OFFICIAL STORE REPLY */}
        {replyModalReview && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16
            }}
          >
            <form
              onSubmit={handlePostReply}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit' }}>
                  Official Store Reply
                </h3>
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 2 }}>
                  Replying to: <strong>{replyModalReview.userName}</strong> ({replyModalReview.productName || replyModalReview.deviceModel})
                </div>
                <div style={{ fontSize: 12.5, color: '#334155', fontStyle: 'italic' }}>
                  &ldquo;{replyModalReview.comment}&rdquo;
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                  Official Store Response
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Thank the customer, provide helpful device tips, or offer warranty assistance..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
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
                  disabled={isSubmittingReply}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    background: isSubmittingReply ? '#94a3b8' : '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: isSubmittingReply ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmittingReply ? 'Publishing...' : 'Publish Official Reply'}
                </button>
              </div>
            </form>
          </div>
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

                {/* Stripe Payment Status Banner */}
                {editingRepair.isPaid ? (
                  <div style={{ padding: '10px 14px', background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={14} color="#059669" /> Stripe Payment Cleared
                      </div>
                      <div style={{ fontSize: 11, color: '#047857', marginTop: 2 }}>
                        Tx: {editingRepair.stripePaymentIntentId || 'pi_verified'} • LKR {(editingRepair.paymentAmount || editingRepair.frozenCost || 0).toLocaleString()}
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: 4 }}>
                      PAID
                    </span>
                  </div>
                ) : editingRepair.frozenCost ? (
                  <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} color="#b45309" /> Customer Payment Pending
                    </div>
                    <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>
                      Quote of LKR {Number(editingRepair.frozenCost).toLocaleString()} visible on customer Repair Hub for Stripe payment.
                    </div>
                  </div>
                ) : null}

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
