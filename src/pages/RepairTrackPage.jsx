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
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const WALKIN_STAGES = ['Received', 'Diagnosing', 'Repairing', 'Quality Tested', 'Ready'];

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

export default function RepairTrackPage() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if ticket query param is in URL (e.g. /repairs/track?ticket=REP-1041)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTicket = params.get('ticket');
    if (urlTicket) {
      setSearchQuery(urlTicket);
      fetchTicket(urlTicket);
    }
  }, []);

  const fetchTicket = async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`http://localhost:5000/api/repairs/track/${encodeURIComponent(queryStr.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        const mappedTicket = {
          id: d.ticketId,
          device: `${d.deviceBrand} ${d.deviceModel}`,
          issue: d.issueLabel,
          mode: d.serviceMode === 'walkin' ? 'Walk-in' : 'Mail-in',
          status: d.status,
          currentStage: typeof d.currentStage === 'number' ? d.currentStage : (d.status === 'Ready' ? 4 : d.status === 'Quality Tested' ? 3 : d.status === 'Repairing' ? 2 : d.status === 'Diagnosing' ? 1 : 0),
          diagnosticNotes: d.diagnosticNotes,
          assignedTechnician: d.assignedTechnician,
          estimatedCost: d.frozenCost || (typeof d.estimatedCost === 'number' ? d.estimatedCost : parseInt(String(d.estimatedCost).replace(/[^0-9]/g, '')) || 0),
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
        };
        setTickets([mappedTicket]);
        toast.success(`Found active ticket ${d.ticketId} in database!`);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTicket(searchQuery);
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
    <div className="container" style={{ maxWidth: 900, paddingTop: 36, paddingBottom: 80 }}>
      {/* Header */}
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

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ maxWidth: 480, margin: '0 auto 36px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: 14, color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by Ticket # (e.g. REP-1041) or phone..."
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

            {/* Diagnostic Notes */}
            {t.diagnosticNotes && (
              <div
                style={{
                  background: '#f8fafc',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
                  Certified Technician Diagnostic Report
                </div>
                <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                  {t.diagnosticNotes}
                </div>
              </div>
            )}

            {/* Estimate Approval Box */}
            <div
              style={{
                padding: '18px 20px',
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#166534', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.5 }}>
                  Quoted Cost Estimate (OEM Parts + Labour)
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>
                  LKR {t.estimatedCost.toLocaleString()}
                </div>
              </div>

              {t.estimateApproved === null ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => approveEstimate(t.id, true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: '#10b981',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 13,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Check size={16} /> Approve & Freeze Cost
                  </button>
                  <button
                    onClick={() => approveEstimate(t.id, false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#ffffff',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: 13,
                      border: '1px solid #fca5a5',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              ) : t.estimateApproved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 800, fontSize: 13 }}>
                  <CheckCircle2 size={18} color="#15803d" />
                  <span>Estimate Approved & Price Frozen</span>
                </div>
              ) : (
                <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 13 }}>
                  Estimate Rejected
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
              {hasSearched ? 'No Repair Ticket Found in Database' : 'Search Your Active Repair Ticket'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.5 }}>
              {hasSearched
                ? `We could not find any active repair ticket matching "${searchQuery}". Please verify your ticket number or the contact phone number used during booking.`
                : 'Enter your Ticket ID (e.g., REP-1041) or phone number above to inspect live bench diagnostics, technician notes, and current turnaround progress.'}
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
    </div>
  );
}
