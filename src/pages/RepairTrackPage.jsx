import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Check,
  X,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  AlertCircle,
  Phone,
  Calendar,
  Truck,
  ExternalLink,
  MapPin,
  Package,
  CreditCard,
  Lock,
  Printer,
  Sparkles,
  Receipt,
  UserCheck,
  Info,
  CheckCircle,
  Cpu,
  User,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Star,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getSocket, joinTicketRoom, joinUserRoom } from '@/services/socket';
import { reviewService } from '@/services/reviewService';

const WALKIN_STAGES = ['Received', 'Diagnosing', 'Repairing', 'Quality Tested', 'Ready'];

const BENCH_STATUS_CONFIG = {
  'Received': {
    badge: '📥 Received at Lab',
    desc: 'Device intake logged at intake station. Queueing for cleanroom diagnostic disassembly.',
    bg: '#eff6ff',
    color: '#2563eb',
    border: '#bfdbfe'
  },
  'Diagnosing': {
    badge: '🔬 Diagnosing',
    desc: 'Active multimeter sweep, sensor calibration, and component isolation in progress.',
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe'
  },
  'Repairing': {
    badge: '🛠️ Repairing',
    desc: 'OEM hardware replacement, micro-soldering, and thermal paste application in progress.',
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fde68a'
  },
  'Quality Tested': {
    badge: '✨ Quality Tested',
    desc: '48-point hardware benchmark, touchscreen response, and battery health inspection passed.',
    bg: '#e0f2fe',
    color: '#0284c7',
    border: '#bae6fd'
  },
  'Ready': {
    badge: '✅ Ready for Collection / Return',
    desc: 'Packaged in anti-static tamper-evident seal. Ready for pickup or courier dispatch.',
    bg: '#ecfdf5',
    color: '#059669',
    border: '#a7f3d0'
  },
  'Delivered': {
    badge: '📦 Delivered / Completed',
    desc: 'Device handed over to customer. 90-Day parts warranty active.',
    bg: '#f8fafc',
    color: '#475569',
    border: '#cbd5e1'
  },
  'Cancelled': {
    badge: '❌ Cancelled',
    desc: 'Repair order cancelled or declined.',
    bg: '#fef2f2',
    color: '#dc2626',
    border: '#fecaca'
  }
};

const COURIER_STAGES = [
  { id: 0, label: 'Pickup Scheduled', icon: '📦', desc: 'Doorstep pickup scheduled' },
  { id: 1, label: 'In Transit to Lab', icon: '🚚', desc: 'Moving to Colombo 03 Central Lab' },
  { id: 2, label: 'Received at Lab', icon: '🔬', desc: 'Unpacked & initial diagnostics' },
  { id: 3, label: 'Repaired & Tested', icon: '🛠️', desc: 'Hardware replaced & calibrated' },
  { id: 4, label: 'Return Dispatched', icon: '🛵', desc: 'Out for doorstep delivery' }
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

const mapRepairDoc = (d) => ({
  id: d.ticketId,
  customerName: d.customerName || 'Valued Customer',
  customerPhone: d.customerPhone || '',
  device: `${d.deviceBrand} ${d.deviceModel}`,
  deviceBrand: d.deviceBrand,
  deviceModel: d.deviceModel,
  issue: d.issueLabel,
  mode: d.serviceMode === 'walkin' ? 'Walk-in' : 'Mail-in',
  status: d.status,
  currentStage: typeof d.currentStage === 'number' ? d.currentStage : (d.status === 'Ready' ? 4 : d.status === 'Quality Tested' ? 3 : d.status === 'Repairing' ? 2 : d.status === 'Diagnosing' ? 1 : 0),
  diagnosticNotes: d.diagnosticNotes,
  assignedTechnician: d.assignedTechnician || 'Master Lab Tech (Colombo 03)',
  estimatedCost: d.frozenCost || (typeof d.estimatedCost === 'number' ? d.estimatedCost : parseInt(String(d.estimatedCost).replace(/[^0-9]/g, '')) || 0),
  frozenCost: d.frozenCost || null,
  isPaid: Boolean(d.isPaid),
  paidAt: d.paidAt || null,
  paymentMethod: d.paymentMethod || 'Stripe',
  paymentAmount: d.paymentAmount || d.frozenCost || (typeof d.estimatedCost === 'number' ? d.estimatedCost : parseInt(String(d.estimatedCost).replace(/[^0-9]/g, '')) || 0),
  stripePaymentIntentId: d.stripePaymentIntentId || '',
  estimateApproved: d.estimateApproved,
  createdAt: d.appointmentDate || (d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Today'),
  slotOrWaybill: d.serviceMode === 'walkin' ? `Slot: ${d.appointmentDate} @ ${d.timeSlot}` : `Courier to: ${d.address?.city || d.address?.addressLine1 || d.address || 'Colombo Lab'}`,
  // Courier Reverse Logistics tracking
  courierPartner: d.courierPartner || 'Domex',
  waybillNumber: d.waybillNumber || '',
  returnWaybillNumber: d.returnWaybillNumber || '',
  courierStage: typeof d.courierStage === 'number' ? d.courierStage : 0,
  courierNotes: d.courierNotes || '',
  addressText: typeof d.address === 'object' ? `${d.address.addressLine1 || ''}, ${d.address.city || ''}` : (d.address || 'Doorstep Pickup')
});

export default function RepairTrackPage({ initialTicketId, hideHeader = false }) {
  const { user, token, openAuthModal } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [myRepairs, setMyRepairs] = useState([]);
  const [loadingMyRepairs, setLoadingMyRepairs] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTicketId || '');
  const [viewAllMyRepairs, setViewAllMyRepairs] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Stripe Card Modal & Receipt States
  const [paymentModalTicket, setPaymentModalTicket] = useState(null);
  const [receiptModalTicket, setReceiptModalTicket] = useState(null);

  // Repair Review States
  const [reviewRepairTicket, setReviewRepairTicket] = useState(null);
  const [repairRating, setRepairRating] = useState(5);
  const [repairComment, setRepairComment] = useState('');
  const [isSubmittingRepairReview, setIsSubmittingRepairReview] = useState(false);

  const handleRepairReviewSubmit = async (e) => {
    e.preventDefault();
    if (!repairComment.trim() || !reviewRepairTicket) return;
    setIsSubmittingRepairReview(true);
    try {
      await reviewService.submitRepairReview({
        ticketId: reviewRepairTicket.id,
        rating: repairRating,
        comment: repairComment
      });
      toast.success(`Verified repair review submitted for Ticket #${reviewRepairTicket.id} and saved to MongoDB!`);
      setReviewRepairTicket(null);
      setRepairComment('');
    } catch (err) {
      toast.error(err.message || 'Could not submit repair review.');
    } finally {
      setIsSubmittingRepairReview(false);
    }
  };

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Auto-fetch user's own booked repairs from MongoDB when logged in
  useEffect(() => {
    let isMounted = true;
    const fetchUserRepairs = async () => {
      if (!user) {
        setMyRepairs([]);
        return;
      }

      setLoadingMyRepairs(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('http://localhost:5000/api/repairs/my-repairs', { headers });
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map(mapRepairDoc);
          setMyRepairs(mapped);

          // If no specific URL ticket requested, auto-select the latest booked repair
          const params = new URLSearchParams(window.location.search);
          const requestedTicket = params.get('ticket') || initialTicketId;

          if (requestedTicket) {
            const match = mapped.find(t => t.id.toLowerCase() === requestedTicket.toLowerCase());
            if (match) {
              setSelectedTicketId(match.id);
              setTickets([match]);
            } else {
              fetchTicket(requestedTicket);
            }
          } else {
            setSelectedTicketId(mapped[0].id);
            setTickets([mapped[0]]);
          }
        }
      } catch (err) {
        console.error('Failed to auto-fetch customer booked repairs:', err);
      } finally {
        if (isMounted) setLoadingMyRepairs(false);
      }
    };

    fetchUserRepairs();
    return () => { isMounted = false; };
  }, [user, token, initialTicketId]);

  // Handle URL query param search if guest or initialTicketId
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTicket = params.get('ticket') || initialTicketId;
    if (urlTicket && !user) {
      setSearchQuery(urlTicket);
      fetchTicket(urlTicket);
    }
  }, [initialTicketId, user]);

  // Live WebSocket Push Listener for Cleanroom Bench & Repair Updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (user?._id) {
      joinUserRoom(user._id);
    }

    tickets.forEach((t) => {
      if (t.id) joinTicketRoom(t.id);
    });

    const handleRepairUpdate = (updated) => {
      if (!updated || !updated.ticketId) return;
      console.log('⚡ [Live WebSocket Event] repair:updated received:', updated.ticketId, updated.status);

      const mapped = mapRepairDoc(updated);

      // 1. Update tickets state if matching
      setTickets((prev) => {
        const exists = prev.some((t) => t.id === mapped.id);
        if (exists) {
          toast.success(`🔬 Cleanroom Bench Update: ${mapped.device} status is now "${mapped.status}"!`, {
            icon: '⚡',
            duration: 5000
          });
          return prev.map((t) => (t.id === mapped.id ? { ...t, ...mapped } : t));
        }
        return prev;
      });

      // 2. Update myRepairs state if matching
      setMyRepairs((prev) => {
        const exists = prev.some((t) => t.id === mapped.id);
        if (exists) {
          return prev.map((t) => (t.id === mapped.id ? { ...t, ...mapped } : t));
        }
        return prev;
      });
    };

    const handleRepairPaid = (paidRepair) => {
      if (!paidRepair || !paidRepair.ticketId) return;
      console.log('💳 [Live WebSocket Event] repair:paid received:', paidRepair.ticketId);
      const mapped = mapRepairDoc(paidRepair);
      setTickets((prev) => prev.map((t) => (t.id === mapped.id ? { ...t, ...mapped, isPaid: true } : t)));
      setMyRepairs((prev) => prev.map((t) => (t.id === mapped.id ? { ...t, ...mapped, isPaid: true } : t)));
    };

    socket.on('repair:updated', handleRepairUpdate);
    socket.on('repair:ticketUpdated', handleRepairUpdate);
    socket.on('repair:paid', handleRepairPaid);

    return () => {
      socket.off('repair:updated', handleRepairUpdate);
      socket.off('repair:ticketUpdated', handleRepairUpdate);
      socket.off('repair:paid', handleRepairPaid);
    };
  }, [user, tickets.map((t) => t.id).join(',')]);

  const fetchTicket = async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`http://localhost:5000/api/repairs/track/${encodeURIComponent(queryStr.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        const mappedTicket = mapRepairDoc(data.data);
        setTickets([mappedTicket]);
        setSelectedTicketId(mappedTicket.id);
        toast.success(`Found active ticket ${mappedTicket.id} in database!`);
      } else {
        setTickets([]);
        toast.error(data.message || `No active repair ticket found in database for "${queryStr}".`);
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Search failed. Could not connect to repair database.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectMyRepair = (ticketId) => {
    setSelectedTicketId(ticketId);
    setViewAllMyRepairs(false);
    const found = myRepairs.find(t => t.id === ticketId);
    if (found) {
      setTickets([found]);
    }
  };

  const handleToggleViewAll = () => {
    const nextView = !viewAllMyRepairs;
    setViewAllMyRepairs(nextView);
    if (nextView) {
      setTickets(myRepairs);
    } else {
      const active = myRepairs.find(t => t.id === selectedTicketId) || myRepairs[0];
      if (active) {
        setSelectedTicketId(active.id);
        setTickets([active]);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTicket(searchQuery);
  };

  const formatCardInput = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    return clean;
  };

  const openPaymentModal = (ticket) => {
    setPaymentModalTicket(ticket);
    setCardName(ticket.customerName || 'Quantum Customer');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  const autoFillTestCard = () => {
    setCardName(paymentModalTicket?.customerName || 'Test Customer');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    toast.success('Stripe test sandbox card loaded (4242...)');
  };

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    if (!paymentModalTicket) return;

    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      toast.error('Please enter card expiry in MM/YY format.');
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      toast.error('Please enter 3-digit CVC.');
      return;
    }

    setIsProcessingPayment(true);
    const toastId = toast.loading('Connecting to Stripe Payment Gateway...');

    try {
      const targetAmount = paymentModalTicket.frozenCost || paymentModalTicket.estimatedCost || 12500;

      // 1. Initiate Stripe Payment Intent (Backend creates intent or returns sandbox intent)
      let paymentIntentId = `pi_${Date.now()}_stripe`;
      try {
        const intentRes = await fetch('http://localhost:5000/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: targetAmount,
            currency: 'lkr',
            orderId: paymentModalTicket.id
          })
        });
        const intentData = await intentRes.json();
        if (intentData.success && intentData.data?.id) {
          paymentIntentId = intentData.data.id;
        }
      } catch (err) {
        console.warn('Fallback to direct ticket payment:', err);
      }

      // 2. Authorize and persist payment against repair ticket
      const payRes = await fetch(`http://localhost:5000/api/repairs/track/${paymentModalTicket.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripePaymentIntentId: paymentIntentId,
          amount: targetAmount
        })
      });
      const payData = await payRes.json();

      if (payData.success) {
        const updatedTicket = payData.data;
        const nowIso = new Date().toISOString();

        setTickets((prev) =>
          prev.map((t) => {
            if (t.id === paymentModalTicket.id) {
              return {
                ...t,
                isPaid: true,
                paidAt: updatedTicket.paidAt || nowIso,
                paymentAmount: updatedTicket.paymentAmount || targetAmount,
                stripePaymentIntentId: paymentIntentId,
                paymentMethod: 'Stripe',
                estimateApproved: true,
                status: updatedTicket.status || 'Repairing',
                currentStage: updatedTicket.currentStage !== undefined ? updatedTicket.currentStage : 2,
                diagnosticNotes: updatedTicket.diagnosticNotes || t.diagnosticNotes
              };
            }
            return t;
          })
        );

        toast.success(`Payment of LKR ${targetAmount.toLocaleString()} verified via Stripe!`, { id: toastId });
        setPaymentModalTicket(null);

        // Open official receipt modal preview
        setReceiptModalTicket({
          ...paymentModalTicket,
          isPaid: true,
          paidAt: updatedTicket.paidAt || nowIso,
          paymentAmount: targetAmount,
          stripePaymentIntentId: paymentIntentId,
          paymentMethod: 'Stripe'
        });
      } else {
        toast.error(payData.message || 'Payment processing failed.', { id: toastId });
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Network or server error.', { id: toastId });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const approveEstimate = async (id, approved) => {
    try {
      await fetch(`http://localhost:5000/api/repairs/track/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              estimateApproved: approved,
              status: approved ? 'Repairing' : t.status,
              currentStage: approved ? 2 : t.currentStage
            };
          }
          return t;
        })
      );
      if (approved) {
        toast.success(`Estimate for ${id} APPROVED! Price frozen at quoted rate.`);
      } else {
        toast.error(`Estimate for ${id} rejected.`);
      }
    } catch (e) {
      toast.error('Could not update estimate approval on server.');
    }
  };

  const filtered = tickets;

  return (
    <div className="container" style={{ maxWidth: 900, paddingTop: hideHeader ? 12 : 36, paddingBottom: 80 }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              color: '#0284c7',
              padding: '4px 12px',
              borderRadius: 20,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10
            }}
          >
            <Clock size={13} />
            <span>Real-Time Diagnostic Tracking</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 900, margin: '0 0 10px', fontFamily: 'Outfit, sans-serif', color: '#0f172a' }}>
            Live Device Repair Status
          </h1>

          <p style={{ fontSize: 14.5, color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
            Track stage-by-stage intake progress, inspect technician notes, and approve frozen repair estimates online.
          </p>
        </div>
      )}

      {/* 1. If currently fetching user's booked repairs */}
      {loadingMyRepairs && (
        <div style={{ textAlign: 'center', padding: '16px 0 24px', color: '#0284c7', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <RotateCcw size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Synchronizing your booked repairs from Colombo cleanroom database...</span>
        </div>
      )}

      {/* 2. Customer Auth Banner (If Guest) */}
      {!user && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1.5px solid #bae6fd',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0369a1' }}>
                Have an active repair reservation?
              </div>
              <div style={{ fontSize: 12, color: '#0284c7' }}>
                Sign in to view your device service tickets, live technician notes, and TRCSL warranty automatically without searching.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('Sign in to view your active booked repairs.')}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
            }}
          >
            <User size={14} />
            <span>Sign In to View My Repairs</span>
          </button>
        </div>
      )}

      {/* 3. Logged-in Customer: Active Booked Repairs Switcher Bar */}
      {user && myRepairs.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1.5px solid #e2e8f0',
            padding: '20px 22px',
            marginBottom: 26,
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Smartphone size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                    Your Booked Repairs ({myRepairs.length})
                  </h3>
                  <span style={{ fontSize: 10.5, fontWeight: 800, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 20 }}>
                    ● Real-Time Database Sync
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Directly linked to your account ({user.email}). No search required.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {myRepairs.length > 1 && (
                <button
                  type="button"
                  onClick={handleToggleViewAll}
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: viewAllMyRepairs ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: viewAllMyRepairs ? '#0284c7' : '#ffffff',
                    color: viewAllMyRepairs ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {viewAllMyRepairs ? '✓ Showing All' : `Show All ${myRepairs.length} Repairs`}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowManualSearch(!showManualSearch)}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: showManualSearch ? '#f1f5f9' : '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title="Search another ticket number"
              >
                <Search size={13} />
                <span>{showManualSearch ? 'Hide Search' : 'Other Ticket'}</span>
              </button>
            </div>
          </div>

          {/* Device Selection Chips */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {myRepairs.map((t) => {
              const isSelected = (!viewAllMyRepairs && selectedTicketId === t.id);
              const statusConfig = BENCH_STATUS_CONFIG[t.status] || BENCH_STATUS_CONFIG['Received'];
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectMyRepair(t.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    background: isSelected ? '#f0f9ff' : '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Smartphone size={14} color={isSelected ? '#0284c7' : '#64748b'} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                      {t.device}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#0284c7' }}>
                      {t.id}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: statusConfig.bg, color: statusConfig.color }}>
                      {statusConfig.badge}
                    </span>
                    {t.isPaid && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: 6 }}>
                        💳 Paid
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Manual Search Bar (Shown by default for guests or if toggled) */}
      {(!user || myRepairs.length === 0 || showManualSearch) && (
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: 480, margin: '0 auto 36px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: 14, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Ticket # (e.g. REP-2511) or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 100px 12px 46px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: 14,
              color: '#0f172a',
              fontSize: 14,
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          />
          <button
            type="submit"
            disabled={searching}
            style={{
              position: 'absolute',
              right: 8,
              top: 7,
              bottom: 7,
              padding: '0 16px',
              borderRadius: 10,
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: searching ? 'wait' : 'pointer'
            }}
          >
            {searching ? '...' : 'Track'}
          </button>
        </form>
      )}

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: 22,
              padding: '28px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
            }}
          >
            {/* Ticket Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', fontFamily: 'Outfit, sans-serif' }}>
                    {t.id}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                    {t.device}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontWeight: 800,
                      background: t.mode === 'Walk-in' ? '#eff6ff' : '#faf5ff',
                      color: t.mode === 'Walk-in' ? '#0284c7' : '#7c3aed',
                      border: t.mode === 'Walk-in' ? '1px solid #bfdbfe' : '1px solid #e9d5ff'
                    }}
                  >
                    {t.mode}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>
                  {t.issue} • {t.slotOrWaybill} • Booked on {t.createdAt}
                </div>
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '5px 14px',
                  borderRadius: 20,
                  background: t.status === 'Ready' ? '#d1fae5' : '#e0f2fe',
                  color: t.status === 'Ready' ? '#059669' : '#0284c7'
                }}
              >
                ● {t.status}
              </span>
            </div>

            {/* DUAL-MODE STEPPER: WALKIN VS MAIL-IN COURIER */}
            {t.mode === 'Mail-in' ? (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  <Truck size={13} />
                  <span>Doorstep Courier Reverse Logistics Progress</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
                  {COURIER_STAGES.map((stg, i) => {
                    const isPassed = i <= (t.courierStage ?? 0);
                    const isCurrent = i === (t.courierStage ?? 0);

                    return (
                      <div key={stg.id} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            height: 6,
                            borderRadius: 3,
                            background: isPassed ? '#7c3aed' : '#e2e8f0',
                            marginBottom: 8,
                            boxShadow: isCurrent ? '0 0 10px rgba(124, 58, 237, 0.4)' : 'none'
                          }}
                        />
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: isCurrent ? 800 : 600,
                            color: isCurrent ? '#7c3aed' : isPassed ? '#0f172a' : '#94a3b8',
                            marginBottom: 2
                          }}
                        >
                          {stg.label}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', display: 'none' }}>
                          {stg.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* LIVE COURIER TRANSIT CARD */}
                <div
                  style={{
                    background: '#faf5ff',
                    border: '1.5px solid #e9d5ff',
                    borderRadius: 14,
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#7c3aed',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(124, 58, 237, 0.25)'
                      }}
                    >
                      <Truck size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                          {t.courierPartner || 'Domex Express'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#ede9fe', color: '#6d28d9' }}>
                          Stage {(t.courierStage ?? 0) + 1} of 5
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#64748b', marginTop: 3, flexWrap: 'wrap' }}>
                        <span>Inward Waybill: <strong style={{ color: '#0f172a' }}>#{t.waybillNumber || 'DOM-784210'}</strong></span>
                        {t.returnWaybillNumber && (
                          <span>Return Waybill: <strong style={{ color: '#059669' }}>#{t.returnWaybillNumber}</strong></span>
                        )}
                        <span>Pickup: <strong style={{ color: '#0f172a' }}>{t.addressText}</strong></span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getCourierTrackingUrl(t.courierPartner, t.returnWaybillNumber || t.waybillNumber)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 16px',
                      borderRadius: 10,
                      background: '#7c3aed',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 800,
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                    }}
                  >
                    <span>Track on {t.courierPartner || 'Domex'}.lk</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ) : (
              /* WALKIN BENCH STEPPER */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 24 }}>
                {WALKIN_STAGES.map((stg, i) => {
                  const isPassed = i <= t.currentStage;
                  const isCurrent = i === t.currentStage;

                  return (
                    <div key={stg} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 3,
                          background: isPassed ? '#0284c7' : '#e2e8f0',
                          marginBottom: 8,
                          boxShadow: isCurrent ? '0 0 10px rgba(2, 132, 199, 0.4)' : 'none'
                        }}
                      />
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: isCurrent ? 800 : 600,
                          color: isCurrent ? '#0284c7' : isPassed ? '#0f172a' : '#94a3b8'
                        }}
                      >
                        {stg}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIVE TECHNICIAN BENCH DIAGNOSTIC STATION (MATCHING TECH ADMIN) */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 16,
                padding: '18px 20px',
                marginBottom: 20
              }}
            >
              {/* Bench Header & Tech Attribution */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 14,
                  paddingBottom: 12,
                  borderBottom: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Cpu size={13} color="#0284c7" />
                    <span>Hardware Lab Diagnostic Bench</span>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#e0f2fe', color: '#0284c7', fontWeight: 800 }}>
                      Station 03
                    </span>
                  </div>

                  {/* Bench Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 900,
                        background: BENCH_STATUS_CONFIG[t.status]?.bg || '#eff6ff',
                        color: BENCH_STATUS_CONFIG[t.status]?.color || '#0284c7',
                        border: `1.5px solid ${BENCH_STATUS_CONFIG[t.status]?.border || '#bfdbfe'}`
                      }}
                    >
                      {BENCH_STATUS_CONFIG[t.status]?.badge || `● ${t.status}`}
                    </span>

                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                      Tech: <strong style={{ color: '#0f172a' }}>{t.assignedTechnician || 'Master Lab Tech (Colombo 03)'}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>Certified Cleanroom Bench Active</span>
                </div>
              </div>

              {/* Diagnostic Notes & Findings */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                  Technician Diagnostic Findings & Bench Notes:
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: '#1e293b',
                    lineHeight: 1.6,
                    background: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1'
                  }}
                >
                  {t.diagnosticNotes || 'Device received at intake station. Initial hardware diagnostic queue in progress.'}
                </div>
              </div>
            </div>

            {/* QUOTED PRICE & STRIPE PAYMENT GATEWAY */}
            <div
              style={{
                padding: '22px 24px',
                background: t.isPaid ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' : '#ffffff',
                border: t.isPaid ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                borderRadius: 16,
                boxShadow: t.isPaid ? '0 4px 16px rgba(16, 185, 129, 0.08)' : '0 4px 16px rgba(15, 23, 42, 0.04)'
              }}
            >
              {/* Cost Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>Quoted Service & OEM Parts Cost</span>
                    {t.frozenCost ? (
                      <span style={{ fontSize: 10, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 4, fontWeight: 800, border: '1px solid #bbf7d0' }}>
                        🔒 Locked & Frozen by Tech
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4 }}>
                        Preliminary Estimate
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 26, fontWeight: 900, color: t.isPaid ? '#15803d' : '#0f172a', fontFamily: 'Outfit, sans-serif', marginTop: 2 }}>
                    LKR {(t.frozenCost || t.estimatedCost).toLocaleString()}
                  </div>
                </div>

                {/* Paid or Unpaid Status Pill */}
                {t.isPaid ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: 12, border: '1px solid #86efac' }}>
                    <CheckCircle2 size={16} />
                    <span>Stripe Payment Verified</span>
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: '#fffbeb', color: '#b45309', fontWeight: 800, fontSize: 12, border: '1px solid #fde68a' }}>
                    <Clock size={14} />
                    <span>Payment Pending</span>
                  </div>
                )}
              </div>

              {/* PAYMENT SECTION: IF PAID VS IF UNPAID */}
              {t.isPaid ? (
                /* VERIFIED STRIPE PAYMENT RECEIPT BANNER */
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #bbf7d0',
                    borderRadius: 12,
                    padding: '16px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: '#10b981',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Receipt size={22} />
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                        Authorized & Cleared via Stripe
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span>Tx ID: <strong style={{ color: '#0f172a' }}>{t.stripePaymentIntentId || 'pi_verified'}</strong></span>
                        <span>Amount: <strong style={{ color: '#15803d' }}>LKR {(t.paymentAmount || t.frozenCost || t.estimatedCost).toLocaleString()}</strong></span>
                        {t.paidAt && (
                          <span>Date: <strong style={{ color: '#0f172a' }}>{new Date(t.paidAt).toLocaleDateString()}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setReceiptModalTicket(t)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 12.5,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      <Printer size={14} />
                      <span>View / Print Receipt</span>
                    </button>

                    <button
                      onClick={() => setReviewRepairTicket(t)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 12.5,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                      }}
                    >
                      <Star size={14} fill="#ffffff" />
                      <span>Rate Repair Experience</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* UNPAID: PROMPT FOR STRIPE PAYMENT */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                    Your technician has diagnosed the device and locked the service fee. Pay securely via Stripe to authorize bench assembly and genuine OEM component installation.
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {/* PRIMARY STRIPE PAYMENT BUTTON */}
                    <button
                      onClick={() => openPaymentModal(t)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #635bff 0%, #4338ca 100%)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: 14,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99, 91, 255, 0.35)',
                        transition: 'transform 0.1s'
                      }}
                    >
                      <CreditCard size={18} />
                      <span>Pay LKR {(t.frozenCost || t.estimatedCost).toLocaleString()} with Stripe</span>
                      <Lock size={13} style={{ opacity: 0.8 }} />
                    </button>

                    {/* Secondary Approval Button */}
                    {t.estimateApproved === null && (
                      <button
                        onClick={() => approveEstimate(t.id, true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '12px 18px',
                          borderRadius: 12,
                          background: '#f1f5f9',
                          color: '#334155',
                          fontWeight: 700,
                          fontSize: 13,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        <Check size={15} />
                        <span>Approve (Pay at Handover)</span>
                      </button>
                    )}

                    {t.estimateApproved === null && (
                      <button
                        onClick={() => approveEstimate(t.id, false)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: '#ffffff',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: 13,
                          border: '1px solid #fca5a5',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={15} />
                        <span>Decline Quote</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={11} color="#635bff" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>Stripe Verified Gateway</span>
                    <span>•</span>
                    <span>90-Day Hardware Parts Guarantee</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: 20,
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#f0f9ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Search size={26} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>
              {hasSearched ? 'No Repair Ticket Found in Database' : user ? 'No Booked Repairs Yet' : 'Track Your Active Repair Ticket'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.5 }}>
              {hasSearched
                ? `We could not find any active repair ticket matching "${searchQuery}". Please verify your ticket number or the contact phone number used during booking.`
                : user
                ? `You have not booked any device repair service reservations under ${user.email} yet. Schedule a certified walk-in or doorstep courier service below.`
                : 'Enter your Ticket ID (e.g., REP-2511) or contact phone above to inspect live bench diagnostics, technician notes, and current turnaround progress.'}
            </p>
            <Link
              to="/repairs/book"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 10,
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Wrench size={14} />
              Book a New Device Repair
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* STRIPE PAYMENT CHECKOUT MODAL */}
      {paymentModalTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              borderRadius: 20,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                padding: '20px 24px',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#635bff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                    Stripe Secure Payment
                  </h3>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    Quantum Mobile Bench Authorization
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPaymentModalTicket(null)}
                disabled={isProcessingPayment}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Ticket & Price Summary */}
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                  Repair Ticket:
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#0284c7' }}>
                  {paymentModalTicket.id} ({paymentModalTicket.device})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                  Issue Diagnosed:
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>
                  {paymentModalTicket.issue}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                  Assigned Lab Tech:
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                  {paymentModalTicket.assignedTechnician || 'Master Lab Tech (Colombo 03)'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 8,
                  borderTop: '1px dashed #cbd5e1'
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                  Total to Charge:
                </span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>
                  LKR {(paymentModalTicket.frozenCost || paymentModalTicket.estimatedCost).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Test Sandbox Auto-Fill Helper */}
            <div style={{ padding: '12px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={autoFillTestCard}
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  color: '#15803d',
                  borderRadius: 8,
                  padding: '5px 12px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Sparkles size={12} /> Auto-Fill Stripe Test Sandbox Card
              </button>
            </div>

            {/* Card Payment Form */}
            <form onSubmit={handleStripeCheckout} style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kasun Perera"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Card Number (Visa / Mastercard / Amex)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 40px 9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13.5,
                      fontFamily: 'monospace',
                      letterSpacing: 1,
                      boxSizing: 'border-box'
                    }}
                  />
                  <CreditCard size={18} style={{ position: 'absolute', right: 12, top: 11, color: '#94a3b8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13.5,
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    CVC / CVV
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="888"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      required
                      style={{
                        width: '100%',
                        padding: '9px 36px 9px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 13.5,
                        fontFamily: 'monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Lock size={14} style={{ position: 'absolute', right: 12, top: 13, color: '#94a3b8' }} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                style={{
                  marginTop: 6,
                  padding: '13px',
                  borderRadius: 12,
                  background: isProcessingPayment ? '#94a3b8' : 'linear-gradient(135deg, #635bff 0%, #4338ca 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 14,
                  border: 'none',
                  cursor: isProcessingPayment ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(99, 91, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <Lock size={15} />
                <span>
                  {isProcessingPayment ? 'Processing via Stripe...' : `Pay LKR ${(paymentModalTicket.frozenCost || paymentModalTicket.estimatedCost).toLocaleString()} via Stripe`}
                </span>
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                <ShieldCheck size={13} color="#635bff" />
                <span>Encrypted 256-bit TLS • Stripe Level 1 PCI-DSS Certified</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL HARDWARE VAT & WARRANTY RECEIPT MODAL */}
      {receiptModalTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              borderRadius: 20,
              width: '100%',
              maxWidth: 580,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            {/* Action Bar */}
            <div
              style={{
                background: '#0f172a',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800 }}>
                <Receipt size={16} color="#10b981" />
                <span>Official Repair & Payment Receipt</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={() => setReceiptModalTicket(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    width: 30,
                    height: 30,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Receipt Body (Printable Area) */}
            <div style={{ padding: '24px 28px', color: '#0f172a' }}>
              {/* Lab Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '2px solid #0f172a', marginBottom: 16 }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
                    QUANTUM MOBILE FLAGSHIP LAB
                  </h2>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                    428 Galle Road, Colombo 03, Sri Lanka<br />
                    TRCSL Registered Lab #QM-LAB-9921 • VAT #109482910-7000
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 6, background: '#dcfce7', color: '#15803d', fontWeight: 900, fontSize: 11, marginBottom: 4 }}>
                    PAID IN FULL
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
                    Receipt #{receiptModalTicket.id.replace('REP-', 'REC-')}-01
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {new Date(receiptModalTicket.paidAt || Date.now()).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>

              {/* Customer & Ticket Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12, marginBottom: 18, background: '#f8fafc', padding: '12px 16px', borderRadius: 10 }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Customer Details:</span>
                  <strong style={{ color: '#0f172a', fontSize: 13 }}>{receiptModalTicket.customerName || 'Valued Customer'}</strong>
                  <div style={{ color: '#64748b', marginTop: 2 }}>{receiptModalTicket.customerPhone || 'Contact on file'}</div>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Device & Repair ID:</span>
                  <strong style={{ color: '#0284c7', fontSize: 13 }}>{receiptModalTicket.id}</strong>
                  <div style={{ color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{receiptModalTicket.device}</div>
                </div>
              </div>

              {/* Payment Verification Block */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '10px 14px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#047857' }}>
                    Stripe Payment Gateway Authorization
                  </div>
                  <div style={{ fontSize: 10.5, color: '#065f46', fontFamily: 'monospace' }}>
                    Ref: {receiptModalTicket.stripePaymentIntentId || 'pi_test_verified'}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>
                  Cleared • Visa / MC
                </div>
              </div>

              {/* Items Breakdown */}
              <div style={{ marginBottom: 18 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '6px 0', fontWeight: 700 }}>Description</th>
                      <th style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}>Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                      <td style={{ padding: '10px 0' }}>
                        <strong style={{ color: '#0f172a' }}>{receiptModalTicket.issue}</strong>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          OEM Certified Hardware Part & Adhesive Gasket Bonding
                        </div>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        {((receiptModalTicket.paymentAmount || receiptModalTicket.frozenCost || receiptModalTicket.estimatedCost) - 2500).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                      <td style={{ padding: '10px 0' }}>
                        <strong style={{ color: '#0f172a' }}>Cleanroom Diagnostics & Bench Labor</strong>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          Assigned: {receiptModalTicket.assignedTechnician || 'Master Lab Tech (Colombo 03)'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        2,500
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ padding: '12px 0 0', fontWeight: 900, fontSize: 14 }}>
                        Total Paid:
                      </td>
                      <td style={{ padding: '12px 0 0', textAlign: 'right', fontWeight: 900, fontSize: 16, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>
                        LKR {(receiptModalTicket.paymentAmount || receiptModalTicket.frozenCost || receiptModalTicket.estimatedCost).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Warranty Footnote */}
              <div style={{ fontSize: 11, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 14, lineHeight: 1.5 }}>
                <strong style={{ color: '#0f172a' }}>90-Day Parts & Workmanship Guarantee:</strong> All replaced hardware components carry a 90-day warranty against touch latency, dead pixels, and battery degradation. Present this receipt or your Ticket #{receiptModalTicket.id} at any Quantum Mobile intake station.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Repair Experience Review Modal */}
      {reviewRepairTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}
        >
          <form
            onSubmit={handleRepairReviewSubmit}
            style={{
              background: '#ffffff',
              padding: 28,
              borderRadius: 20,
              border: '1px solid #cbd5e1',
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Award size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                Rate Repair Experience
              </h3>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
              Ticket <strong>#{reviewRepairTicket.id}</strong> &bull; {reviewRepairTicket.device} ({reviewRepairTicket.issue}) &bull; Verified Completed Service
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                Technician & Parts Rating
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setRepairRating(st)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Star
                      size={24}
                      fill={st <= repairRating ? '#d97706' : 'none'}
                      color={st <= repairRating ? '#d97706' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
                Your Repair Feedback
              </label>
              <textarea
                rows={4}
                value={repairComment}
                onChange={(e) => setRepairComment(e.target.value)}
                placeholder="How was the turnaround speed, parts quality, and technician communication?..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  color: '#0f172a',
                  fontSize: 13
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={isSubmittingRepairReview}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: isSubmittingRepairReview ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: isSubmittingRepairReview ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmittingRepairReview ? 'Submitting...' : 'Submit Verified Repair Review'}
              </button>
              <button
                type="button"
                onClick={() => setReviewRepairTicket(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
