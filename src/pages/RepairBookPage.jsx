import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Smartphone,
  Battery,
  Zap,
  Droplets,
  Camera,
  Cpu,
  Calendar,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  Search,
  Check,
  PhoneCall,
  CreditCard,
  Activity,
  RotateCcw,
  Receipt,
  Lock,
  User,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';
import RepairTrackPage from './RepairTrackPage';

const BRANDS = [
  { id: 'Apple', name: 'Apple', emblem: '', tag: 'iPhone • iPad • Watch', color: '#0284c7' },
  { id: 'Samsung', name: 'Samsung', emblem: '✦', tag: 'Galaxy S • Z Fold • Buds', color: '#2563eb' },
  { id: 'Google', name: 'Google Pixel', emblem: 'G', tag: 'Pixel 9 • 8 • Fold', color: '#059669' },
  { id: 'OnePlus', name: 'OnePlus', emblem: '1+', tag: 'OP 13 • 12 • Nord', color: '#dc2626' },
  { id: 'Xiaomi', name: 'Xiaomi / Redmi', emblem: 'mi', tag: '14 Ultra • Poco', color: '#ea580c' },
  { id: 'Huawei', name: 'Huawei / Honor', emblem: '❖', tag: 'Pura 70 • Magic', color: '#7c3aed' },
  { id: 'Other', name: 'Other Brand', emblem: '📱', tag: 'Sony • Nothing • Asus', color: '#475569' }
];

const POPULAR_MODELS = {
  Apple: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 13', 'Apple Watch Ultra 2'],
  Samsung: ['Galaxy S25 Ultra', 'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy Z Fold 6', 'Galaxy Z Flip 6', 'Galaxy A55 5G'],
  Google: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8a', 'Pixel Fold'],
  OnePlus: ['OnePlus 13 5G', 'OnePlus 12', 'OnePlus 12R', 'OnePlus Open', 'OnePlus Nord 4'],
  Xiaomi: ['Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 13T Pro', 'Redmi Note 13 Pro+', 'POCO F6 Pro'],
  Huawei: ['Huawei Pura 70 Ultra', 'Huawei Mate 60 Pro', 'Honor Magic 6 Pro', 'Nova 12'],
  Other: ['Sony Xperia 1 VI', 'Nothing Phone (2)', 'Asus ROG Phone 8', 'Motorola Edge 50']
};

const ISSUES = [
  {
    id: 'screen',
    label: 'Cracked Screen / OLED Display',
    icon: Smartphone,
    desc: 'Broken outer glass, vertical green lines, black ink blotches or unresponsive touch digitizer.',
    turnaround: '35 Mins',
    est: 'LKR 12,500 – 45,000'
  },
  {
    id: 'battery',
    label: 'Battery Degradation / Swollen Cell',
    icon: Battery,
    desc: 'Battery drains rapidly under 80% health, sudden shutdowns, or phone back-cover lifting.',
    turnaround: '25 Mins',
    est: 'LKR 6,500 – 18,500'
  },
  {
    id: 'port',
    label: 'Charging Port & Microphone Fault',
    icon: Zap,
    desc: 'USB-C / Lightning cable feels loose, slow charging, or callers cannot hear your voice.',
    turnaround: '30 Mins',
    est: 'LKR 5,500 – 12,000'
  },
  {
    id: 'water',
    label: 'Liquid Ingress & Water Damage',
    icon: Droplets,
    desc: 'Ultrasonic chemical PCB wash, micro-corrosion removal, and motherboard circuit short-test.',
    turnaround: 'Same Day',
    est: 'LKR 14,000 – 28,000'
  },
  {
    id: 'camera',
    label: 'Camera Module & Lens Glass',
    icon: Camera,
    desc: 'Blurry focus, cracked sapphire lens glass, optical image stabilization (OIS) vibration jitter.',
    turnaround: '40 Mins',
    est: 'LKR 8,500 – 24,000'
  },
  {
    id: 'board',
    label: 'Motherboard IC & Micro-Soldering',
    icon: Cpu,
    desc: 'Dead device (no power), boot-loop restart, baseband network searching, audio IC failure.',
    turnaround: '1 – 2 Days',
    est: 'LKR 18,000 – 48,000'
  }
];

const TIME_SLOTS = [
  { time: '09:30 AM', period: 'Morning', available: true },
  { time: '10:15 AM', period: 'Morning', available: true },
  { time: '11:00 AM', period: 'Morning', available: true },
  { time: '11:45 AM', period: 'Morning', available: false },
  { time: '01:30 PM', period: 'Afternoon', available: true },
  { time: '02:15 PM', period: 'Afternoon', available: true },
  { time: '03:00 PM', period: 'Afternoon', available: false },
  { time: '03:45 PM', period: 'Afternoon', available: true },
  { time: '04:30 PM', period: 'Afternoon', available: true },
  { time: '05:15 PM', period: 'Evening', available: true }
];

export default function RepairBookPage() {
  const { user, token, openAuthModal } = useAuth();
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 16 Pro Max');
  const [issue, setIssue] = useState('screen');
  const [mode, setMode] = useState('walkin'); // 'walkin' | 'mailin'
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('10:15 AM');
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingTicketId, setBookingTicketId] = useState('');
  const [bookingWaybill, setBookingWaybill] = useState('');
  const [bookingCourier, setBookingCourier] = useState('Domex');

  // Dual-mode state: 'book' | 'track'
  const [activeModeTab, setActiveModeTab] = useState('book');
  const [activeTrackTicket, setActiveTrackTicket] = useState('');
  const [recentBookings, setRecentBookings] = useState([]);
  const [userBookedCount, setUserBookedCount] = useState(0);

  const currentBrandObj = BRANDS.find(b => b.id === brand) || BRANDS[0];
  const selectedIssueObj = ISSUES.find(i => i.id === issue) || ISSUES[0];

  // Auto-fill customer profile details when signed in
  useEffect(() => {
    if (user) {
      if (user.name && (!customerName || customerName === 'Valued Customer')) {
        setCustomerName(user.name);
      }
      if (!customerPhone) {
        setCustomerPhone(user.phone || '+94 71 987 6543');
      }
      if (user.email && !customerEmail) {
        setCustomerEmail(user.email);
      }
      if (user.shippingAddress && !address) {
        const addrStr = typeof user.shippingAddress === 'object'
          ? `${user.shippingAddress.street || user.shippingAddress.addressLine1 || ''}, ${user.shippingAddress.city || ''}`
          : String(user.shippingAddress);
        setAddress(addrStr || 'Colombo 03');
      }
    }
  }, [user]);

  // Load recent bookings & URL params on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qm_recent_repairs');
      if (stored) {
        setRecentBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read recent repairs from localStorage', e);
    }

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const ticketParam = params.get('ticket');
    if (tabParam === 'track' || ticketParam) {
      setActiveModeTab('track');
      if (ticketParam) {
        setActiveTrackTicket(ticketParam);
      }
    }
  }, []);

  // Sync customer's booked repair count from database
  useEffect(() => {
    if (!user) {
      setUserBookedCount(0);
      return;
    }
    const checkUserRepairs = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('http://localhost:5000/api/repairs/my-repairs', { headers });
        const d = await res.json();
        if (d.success && Array.isArray(d.data)) {
          setUserBookedCount(d.data.length);
        }
      } catch (e) {
        console.warn('Could not count user repairs', e);
      }
    };
    checkUserRepairs();
  }, [user, token]);

  // Fetch live occupied slots from backend whenever date changes
  useEffect(() => {
    const fetchOccupied = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/repairs/slots?date=${selectedDate}`);
        const data = await res.json();
        if (data.success && data.data?.occupiedSlots) {
          setOccupiedSlots(data.data.occupiedSlots);
        }
      } catch (err) {
        console.warn('Could not fetch occupied slots:', err);
      }
    };
    fetchOccupied();
  }, [selectedDate]);

  const handleConfirm = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) {
      toast('Please sign in or create an account to book your certified repair.', {
        icon: '🔒',
        duration: 4000
      });
      openAuthModal('Please sign in or create a customer account to confirm your device repair reservation and track lab diagnostics.');
      return;
    }

    const finalPhone = (customerPhone && customerPhone.trim()) || user.phone || '+94 71 987 6543';
    const finalName = (customerName && customerName.trim()) || user.name || 'Valued Customer';
    const finalEmail = (customerEmail && customerEmail.trim()) || user?.email || '';

    setSubmittingBooking(true);
    try {
      const res = await fetch('http://localhost:5000/api/repairs/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: finalName,
          customerPhone: finalPhone,
          customerEmail: finalEmail,
          userId: user._id || user.id || null,
          deviceBrand: brand,
          deviceModel: model,
          issueId: issue,
          issueLabel: selectedIssueObj.label,
          serviceMode: mode,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot,
          address: mode === 'mailin' ? (address || 'Colombo, Sri Lanka') : '',
          notes,
          estimatedCost: selectedIssueObj.est
        })
      });

      const data = await res.json();
      if (data.success && data.data?.ticketId) {
        const ticketId = data.data.ticketId;
        setBookingTicketId(ticketId);
        setBookingWaybill(data.data.waybillNumber || '');
        setBookingCourier(data.data.courierPartner || 'Domex');
        setConfirmed(true);

        // Store to localStorage so user can access it anytime alongside booking
        try {
          const newEntry = {
            ticketId,
            brand,
            model,
            issue: selectedIssueObj.label,
            date: selectedDate,
            slot: selectedSlot,
            mode,
            createdAt: new Date().toISOString()
          };
          const existing = JSON.parse(localStorage.getItem('qm_recent_repairs') || '[]');
          const updated = [newEntry, ...existing.filter(i => i.ticketId !== ticketId)].slice(0, 5);
          localStorage.setItem('qm_recent_repairs', JSON.stringify(updated));
          setRecentBookings(updated);
        } catch (storageErr) {
          console.warn('Could not store to localStorage:', storageErr);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success(`Service reservation confirmed! Ticket: ${ticketId}`, { icon: '🔧' });
      } else {
        toast.error(data.message || 'Could not complete booking. Please try another slot.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Connection error with workshop database.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  // SUCCESS CONFIRMATION RECEIPT VIEW
  if (confirmed) {
    return (
      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            padding: '36px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top highlight bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #0284c7, #10b981)' }} />

          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '2px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#059669',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
            }}
          >
            <CheckCircle2 size={38} />
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 800,
              color: '#059669',
              background: '#d1fae5',
              padding: '4px 12px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 10
            }}
          >
            Ticket Generated & Scheduled
          </span>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8, fontFamily: 'Outfit' }}>
            Repair Reservation Confirmed
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.5 }}>
            Your device service ticket is live in our Colombo workshop system. Our certified hardware technicians are pre-allocating genuine OEM parts for your device.
          </p>

          {/* Ticket Breakdown Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: 18,
              padding: '24px 28px',
              textAlign: 'left',
              marginBottom: 28
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Official Ticket ID
                </span>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0284c7', fontFamily: 'Outfit, sans-serif' }}>
                  {bookingTicketId}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: mode === 'walkin' ? '#eff6ff' : '#faf5ff',
                    color: mode === 'walkin' ? '#0284c7' : '#7c3aed',
                    border: mode === 'walkin' ? '1px solid #bfdbfe' : '1px solid #e9d5ff'
                  }}
                >
                  {mode === 'walkin' ? <Calendar size={14} /> : <Truck size={14} />}
                  <span>{mode === 'walkin' ? 'Colombo Lab Walk-In' : 'Doorstep Courier'}</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, fontSize: 13, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                  Selected Device
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {brand} {model}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                  Reported Issue
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0284c7' }}>
                  {selectedIssueObj.label}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                  Diagnostic Turnaround
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} /> {selectedIssueObj.turnaround}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                  {mode === 'walkin' ? 'Appointment Slot' : 'Courier Tracking & Waybill'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {mode === 'walkin' ? `${selectedDate} @ ${selectedSlot}` : `${bookingCourier} #${bookingWaybill || 'Assigned on Dispatch'}`}
                </span>
              </div>
            </div>

            {/* Price Estimate & Warranty Freeze */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Frozen Cost Estimate
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0284c7' }}>
                  {selectedIssueObj.est}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#059669', fontWeight: 700 }}>
                <ShieldCheck size={18} />
                <span>90-Day Comprehensive TRCSL Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <Link
              to={`/repairs/track?ticket=${bookingTicketId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                background: '#0284c7',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span>Track Ticket Full View</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => {
                setConfirmed(false);
                setStep(1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '12px 20px',
                borderRadius: 12,
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#334155',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              <span>Book Another Device Repair</span>
            </button>

            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 18px',
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Storefront</span>
            </Link>
          </div>

          {/* EMBEDDED REAL-TIME WORKSHOP BENCH & STRIPE CHECKOUT CONTAINER */}
          <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: 28, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                  Live Diagnostic Bench & Stripe Payment Station
                </h3>
              </div>
              <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: 20, fontWeight: 800 }}>
                🟢 Bench Active
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 0, marginBottom: 16 }}>
              Inspect real-time bench status, cleanroom technician findings, and complete online Stripe payment directly below:
            </p>

            <RepairTrackPage initialTicketId={bookingTicketId} hideHeader={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 940, paddingTop: 36, paddingBottom: 80 }}>
      {/* 1. HERO HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
            color: '#0284c7',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.2)',
            padding: '4px 14px',
            borderRadius: 20,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 12
          }}
        >
          <Wrench size={13} color="#0284c7" />
          <span>Certified Express Device Service Lab</span>
        </div>

        <h1 style={{ fontSize: 34, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', margin: '0 0 10px' }}>
          Book Certified Device Repair
        </h1>

        <p style={{ fontSize: 14.5, color: '#64748b', maxWidth: 620, margin: '0 auto 20px', lineHeight: 1.5 }}>
          Same-day screen & battery replacements at our Colombo 03 flagship lab, or schedule islandwide insured doorstep courier pickup.
        </p>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
            padding: '12px 20px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            maxWidth: 720,
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#334155' }}>
            <Clock size={16} color="#0284c7" />
            <span>35-Min Express Turnaround</span>
          </div>
          <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#334155' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>90-Day Parts Guarantee</span>
          </div>
          <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#334155' }}>
            <CheckCircle2 size={16} color="#0284c7" />
            <span>100% Genuine OEM Hardware</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL-MODE TAB SWITCHER: BOOKING WIZARD VS BOOKED REPAIRS & BENCH TRACKER */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
        <div
          style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: 5,
            borderRadius: 16,
            border: '1.5px solid #e2e8f0',
            gap: 6
          }}
        >
          <button
            type="button"
            onClick={() => setActiveModeTab('book')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 800,
              background: activeModeTab === 'book' ? '#ffffff' : 'transparent',
              color: activeModeTab === 'book' ? '#0284c7' : '#64748b',
              boxShadow: activeModeTab === 'book' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Wrench size={16} />
            <span>Book Certified Repair</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModeTab('track')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 800,
              background: activeModeTab === 'track' ? '#ffffff' : 'transparent',
              color: activeModeTab === 'track' ? '#0284c7' : '#64748b',
              boxShadow: activeModeTab === 'track' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={16} />
            <span>Booked Repairs & Live Bench</span>
            {(userBookedCount > 0 || recentBookings.length > 0) && (
              <span
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 20
                }}
              >
                {userBookedCount || recentBookings.length} Active
              </span>
            )}
          </button>
        </div>
      </div>

      {activeModeTab === 'track' ? (
        <div>
          <RepairTrackPage
            initialTicketId={activeTrackTicket || bookingTicketId}
            hideHeader={true}
          />
        </div>
      ) : (
        <>
          {/* Active ticket banner on Step 1 if customer has existing booking */}
          {recentBookings.length > 0 && (
            <div
              style={{
                background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)',
                border: '1.5px solid #bfdbfe',
                borderRadius: 14,
                padding: '12px 18px',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                    Active Repair in Workshop: <strong style={{ color: '#0284c7' }}>#{recentBookings[0].ticketId}</strong> ({recentBookings[0].brand} {recentBookings[0].model})
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>
                    Inspect live bench status, technician diagnostic findings, or pay service quote via Stripe.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTrackTicket(recentBookings[0].ticketId);
                  setActiveModeTab('track');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>Track Bench & Pay</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* 3. MODERN 4-STEP INTERACTIVE PROGRESS BAR */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 28,
              background: '#ffffff',
              padding: '12px',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            {[
              { num: 1, title: '1. Select Device', subtitle: 'Brand & Model' },
              { num: 2, title: '2. Select Issue', subtitle: 'Damage Diagnostic' },
              { num: 3, title: '3. Schedule Service', subtitle: 'Walk-In or Courier' },
              { num: 4, title: '4. Confirmation', subtitle: 'Summary & SMS' }
            ].map((s) => {
              const isDone = s.num < step;
              const isCurrent = s.num === step;

              return (
                <button
                  key={s.num}
                  type="button"
              disabled={s.num > step}
              onClick={() => setStep(s.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 12,
                background: isCurrent ? 'rgba(2, 132, 199, 0.08)' : isDone ? '#f0fdf4' : 'transparent',
                border: isCurrent ? '1.5px solid #0284c7' : isDone ? '1px solid #bbf7d0' : '1px solid transparent',
                cursor: s.num <= step ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 900,
                  flexShrink: 0,
                  background: isCurrent ? '#0284c7' : isDone ? '#10b981' : '#f1f5f9',
                  color: isCurrent || isDone ? '#ffffff' : '#64748b'
                }}
              >
                {isDone ? <Check size={14} /> : s.num}
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12.5, fontWeight: isCurrent ? 800 : 700, color: isCurrent ? '#0284c7' : isDone ? '#15803d' : '#475569', whiteSpace: 'nowrap' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {s.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN STEP CARD (Clean White with Gentle Shadow) */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 24,
          padding: '36px 36px',
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)'
        }}
      >
        {/* ================= STEP 1: SELECT YOUR DEVICE ================= */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit' }}>
                Step 1: Choose Your Device Brand
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
                Select your smartphone brand. Our workshop stocks OEM parts for all major ecosystems.
              </p>
            </div>

            {/* BRAND SELECTION GRID WITH LOGOS & CLEAR CONTRAST */}
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
                Device Manufacturer
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 10 }}>
                {BRANDS.map((b) => {
                  const isSelected = brand === b.id;

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBrand(b.id);
                        const firstModel = POPULAR_MODELS[b.id]?.[0] || '';
                        if (firstModel) setModel(firstModel);
                      }}
                      style={{
                        padding: '12px 10px',
                        borderRadius: 14,
                        border: isSelected ? `2px solid ${b.color}` : '1.5px solid #e2e8f0',
                        background: isSelected ? `${b.color}0d` : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? `0 4px 14px ${b.color}25` : '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#ffffff';
                        }
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: isSelected ? b.color : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 2
                        }}
                      >
                        <BrandLogo
                          brand={b.id || b.name}
                          size={b.id === 'Apple' ? 18 : b.id === 'Samsung' ? 22 : 18}
                          color={isSelected ? '#ffffff' : (b.id === 'Apple' ? '#0f172a' : null)}
                          monochrome={isSelected}
                        />
                      </div>

                      <span style={{ fontSize: 13, fontWeight: isSelected ? 800 : 700, color: isSelected ? b.color : '#0f172a' }}>
                        {b.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* POPULAR ONE-CLICK MODEL CHIPS */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Popular {currentBrandObj.name} Models (Click to Select)
                </label>
                <span style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>Quick Select</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(POPULAR_MODELS[brand] || []).map((m) => {
                  const isModelSelected = model === m;

                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: 12.5,
                        fontWeight: isModelSelected ? 800 : 600,
                        border: isModelSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                        background: isModelSelected ? '#0284c7' : '#f8fafc',
                        color: isModelSelected ? '#ffffff' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EXACT MODEL INPUT FIELD */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
                Exact Model Name or Code
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 15 }} />
                <input
                  type="text"
                  placeholder="e.g. iPhone 16 Pro Max, Galaxy S25 Ultra, Pixel 9 Pro XL"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 44px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 12,
                    color: '#0f172a',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginTop: 5 }}>
                Not sure? Check under Settings &gt; General &gt; About on your phone, or type any detail.
              </span>
            </div>

            {/* CONTINUE BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => {
                  if (!model.trim()) {
                    toast.error('Please specify your device model name.');
                    return;
                  }
                  setStep(2);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 12,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>Continue to Issue Diagnosis</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SELECT WHAT NEEDS REPAIR ================= */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit' }}>
                Step 2: What Needs Repair on Your {brand} {model}?
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
                Select the primary symptom. Our diagnostic team will inspect and freeze your exact quotation.
              </p>
            </div>

            {/* ISSUE CARDS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 30 }}>
              {ISSUES.map((iss) => {
                const IconComponent = iss.icon;
                const isSelected = issue === iss.id;

                return (
                  <div
                    key={iss.id}
                    onClick={() => setIssue(iss.id)}
                    style={{
                      padding: '18px 20px',
                      borderRadius: 16,
                      border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      background: isSelected ? 'rgba(2, 132, 199, 0.05)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      boxShadow: isSelected ? '0 6px 18px rgba(2, 132, 199, 0.12)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.background = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = '#ffffff';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: isSelected ? '#0284c7' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#0284c7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconComponent size={20} />
                      </div>

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isSelected ? '#e0f2fe' : '#f1f5f9',
                          color: isSelected ? '#0284c7' : '#64748b'
                        }}
                      >
                        ⚡ {iss.turnaround}
                      </span>
                    </div>

                    <div style={{ fontSize: 14.5, fontWeight: 800, color: isSelected ? '#0284c7' : '#0f172a', marginBottom: 6 }}>
                      {iss.label}
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                      {iss.desc}
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 800, color: '#059669', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                      Est: {iss.est}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BACK & NEXT BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '11px 20px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Device</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 12,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <span>Select Service Mode</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SERVICE MODE & SCHEDULE ================= */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit' }}>
                Step 3: Service Mode & Appointment Slot
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
                Choose whether you want to visit our Colombo 03 lab directly or have our insured courier pick up your device.
              </p>
            </div>

            {/* Sign-in notice banner if guest */}
            {!user && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: 14,
                  padding: '12px 18px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Lock size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                      Sign In Required to Confirm Service Reservation
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      Sign in or register to lock your priority lab slot, register OEM parts warranty, and track technician bench progress.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAuthModal('Please sign in or create an account to book your device repair reservation.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 9,
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <User size={14} />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}

            {/* TWO SERVICE MODES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 26 }}>
              {/* Walk-in */}
              <div
                onClick={() => setMode('walkin')}
                style={{
                  padding: '20px 22px',
                  borderRadius: 18,
                  border: mode === 'walkin' ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                  background: mode === 'walkin' ? 'rgba(2, 132, 199, 0.05)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: mode === 'walkin' ? '0 6px 18px rgba(2, 132, 199, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: mode === 'walkin' ? '#0284c7' : '#f1f5f9',
                      color: mode === 'walkin' ? '#ffffff' : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Walk-In Lab Appointment
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7' }}>
                      Flagship Centre, Colombo 03
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                  Book a dedicated 30-min window with our lead technician. Relax in our customer lounge while your device is serviced.
                </p>
              </div>

              {/* Mail-in Courier */}
              <div
                onClick={() => setMode('mailin')}
                style={{
                  padding: '20px 22px',
                  borderRadius: 18,
                  border: mode === 'mailin' ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                  background: mode === 'mailin' ? 'rgba(124, 58, 237, 0.05)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: mode === 'mailin' ? '0 6px 18px rgba(124, 58, 237, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: mode === 'mailin' ? '#7c3aed' : '#f1f5f9',
                      color: mode === 'mailin' ? '#ffffff' : '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Truck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      Doorstep Courier Pickup
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed' }}>
                      Islandwide Pickup & Return
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                  We dispatch our certified courier to pick up your phone directly from your doorstep with insured, tamper-evident transit.
                </p>
              </div>
            </div>

            {/* DETAILS ACCORDING TO SELECTED MODE */}
            {mode === 'walkin' ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: '22px 24px',
                  marginBottom: 28
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                  {/* Date Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                      Choose Appointment Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 6 }}>
                      Lab Hours: Mon – Sat (9:00 AM – 7:30 PM)
                    </span>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                      Available 30-Minute Time Slots
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: 8 }}>
                      {TIME_SLOTS.map((sl) => {
                        const isOccupied = occupiedSlots.includes(sl.time);
                        const isAvailable = sl.available && !isOccupied;
                        const isSlotSelected = selectedSlot === sl.time;

                        return (
                          <button
                            key={sl.time}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedSlot(sl.time)}
                            title={isOccupied ? "Time slot already reserved by another customer" : "Available 30-min window"}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              border: isSlotSelected ? '1.5px solid #0284c7' : isOccupied ? '1px dashed #fca5a5' : '1px solid #cbd5e1',
                              background: isSlotSelected ? '#0284c7' : isOccupied ? '#fef2f2' : '#ffffff',
                              color: isSlotSelected ? '#ffffff' : isOccupied ? '#ef4444' : '#0f172a',
                              cursor: isAvailable ? 'pointer' : 'not-allowed',
                              opacity: isAvailable ? 1 : 0.6,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div>{sl.time}</div>
                            {isOccupied && <span style={{ fontSize: 9, display: 'block', fontWeight: 800, color: '#dc2626' }}>Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: '22px 24px',
                  marginBottom: 28
                }}
              >
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Pickup Address (Islandwide Courier)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. No. 45, Galle Road, Colombo 03, Western Province (Include landmark/apartment details)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#0f172a',
                    outline: 'none',
                    lineHeight: 1.45
                  }}
                />
              </div>
            )}

            {/* BACK & REVIEW BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '11px 20px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Issue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (mode === 'mailin' && !address.trim()) {
                    toast.error('Please enter your pickup street address.');
                    return;
                  }
                  setStep(4);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 12,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <span>Review & Confirm Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Outfit' }}>
                Step 4: Contact Information & Reservation Review
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
                Please provide your contact details so our lab can send real-time SMS status updates and intake verification.
              </p>
            </div>

            {/* Account Status / Auth Banner */}
            {!user ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: 14,
                  padding: '14px 18px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Lock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 900, color: '#0f172a' }}>
                      Sign In Required to Confirm Service Reservation
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      An authenticated customer account is required to link this ticket to your profile and track lab bench diagnostics.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAuthModal('Please sign in or create an account to confirm your device repair reservation.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <User size={15} />
                  <span>Sign In / Create Account</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: 12,
                  padding: '10px 16px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <CheckCircle2 size={18} color="#059669" />
                <span style={{ fontSize: 13, color: '#065f46', fontWeight: 700 }}>
                  Verified customer account: <strong>{user.name}</strong> ({user.email}). Details auto-filled below.
                </span>
              </div>
            )}

            {/* CUSTOMER CONTACT FIELDS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                marginBottom: 26,
                background: '#f8fafc',
                padding: '20px 22px',
                borderRadius: 16,
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kasun Perera"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 13,
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                  Mobile Phone Number (For SMS Updates) *
                </label>
                <div style={{ position: 'relative' }}>
                  <PhoneCall size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="tel"
                    placeholder="e.g. +94 77 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: 13,
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                  Email Address (For Ticket, Tracking & Lab Receipt) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
                  <input
                    type="email"
                    placeholder="e.g. kasun@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: 13,
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                  Additional Diagnostic Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drop happened 2 days ago, touch works only on upper half, no passcode lock"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 13,
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* ORDER SUMMARY RECEIPT BOX */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                fontSize: 13
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                <span style={{ color: '#64748b' }}>Device Model</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{brand} {model}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                <span style={{ color: '#64748b' }}>Reported Problem</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>{selectedIssueObj.label}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                <span style={{ color: '#64748b' }}>Service Route</span>
                <span style={{ fontWeight: 800, color: mode === 'walkin' ? '#0284c7' : '#7c3aed' }}>
                  {mode === 'walkin' ? `Walk-In Slot: ${selectedDate} @ ${selectedSlot}` : `Mail-In Courier Pickup to ${address.split(',')[0] || 'Address'}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                <span style={{ color: '#64748b' }}>Estimated Price Band</span>
                <span style={{ fontWeight: 900, color: '#059669', fontSize: 14 }}>{selectedIssueObj.est}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
                <span style={{ color: '#64748b' }}>Inspection Fee</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>Free Diagnostic Intake ($0)</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '11px 20px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Schedule</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={submittingBooking}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 34px',
                  borderRadius: 12,
                  background: !user ? '#0284c7' : '#10b981',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 800,
                  border: 'none',
                  cursor: submittingBooking ? 'wait' : 'pointer',
                  boxShadow: !user ? '0 4px 16px rgba(2, 132, 199, 0.35)' : '0 4px 16px rgba(16, 185, 129, 0.35)',
                  transition: 'background 0.15s ease'
                }}
              >
                {!user ? <Lock size={17} /> : <CheckCircle2 size={18} />}
                <span>
                  {submittingBooking
                    ? 'Registering Ticket...'
                    : !user
                    ? 'Sign In & Confirm Reservation'
                    : 'Confirm Service Reservation'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )}
</div>
);
}
