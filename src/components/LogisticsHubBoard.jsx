import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatLKR } from '@/services/cartService';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';

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

export default function LogisticsHubBoard({ repairs = [], orders = [], onRefresh }) {
  const [activeHub, setActiveHub] = useState('all'); // 'all' | 'storeHub' | 'techLab'
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mailinRepairs = repairs.filter(r => r.serviceMode === 'mailin');

  // Filter repairs
  const filteredRepairs = mailinRepairs.filter(r => {
    const matchesSearch = !searchQuery ||
      r.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.waybillNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.returnWaybillNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deviceModel?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPartner = partnerFilter === 'all' || (r.courierPartner || 'Domex') === partnerFilter;
    const matchesHub =
      activeHub === 'all' ||
      (activeHub === 'techLab' && true) ||
      (activeHub === 'storeHub' && false);

    return matchesSearch && matchesPartner && matchesHub;
  });

  const handleUpdateStage = async (repairId, stageNum) => {
    try {
      await adminService.updateRepairStatus(repairId, { courierStage: Number(stageNum) });
      toast.success('Courier transit stage updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to update stage');
    }
  };

  const handleDispatchReturn = async (repairId, partner = 'Domex') => {
    try {
      const prefix = partner === 'Koombiyo' ? 'KMB' : partner === 'Prompt Xpress' ? 'PRP' : partner === 'Pronto' ? 'PRN' : 'DOM';
      const returnWaybill = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      await adminService.updateRepairStatus(repairId, {
        courierStage: 4,
        returnWaybillNumber: returnWaybill,
        status: 'Ready'
      });
      toast.success(`Return courier dispatched! Waybill #${returnWaybill}`, { icon: '🛵' });
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to dispatch return courier');
    }
  };

  return (
    <div>
      {/* HUB HEADER & COURIER METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        {/* Hub A Card */}
        <div
          onClick={() => setActiveHub('storeHub')}
          style={{
            background: activeHub === 'storeHub' ? '#eff6ff' : '#ffffff',
            borderRadius: 14,
            border: activeHub === 'storeHub' ? '2px solid #0284c7' : '1px solid #e2e8f0',
            padding: 16,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>HUB A: Store Warehouse</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>42 Galle Road, Colombo 03</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7' }}>
            {orders.length} Retail Parcels ({orders.filter(o => o.status === 'Processing').length} Pending Dispatch)
          </div>
        </div>

        {/* Hub B Card */}
        <div
          onClick={() => setActiveHub('techLab')}
          style={{
            background: activeHub === 'techLab' ? '#faf5ff' : '#ffffff',
            borderRadius: 14,
            border: activeHub === 'techLab' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
            padding: 16,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>HUB B: Central Tech Lab</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Level 2 Service Wing, Colombo 03</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>
            {mailinRepairs.length} Repair Parcels ({mailinRepairs.filter(r => (r.courierStage ?? 0) <= 2).length} Inward / {mailinRepairs.filter(r => (r.courierStage ?? 0) >= 3).length} Outward)
          </div>
        </div>

        {/* Sri Lanka Courier Breakdown */}
        <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6 }}>
            Sri Lanka Courier Partners
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Domex', 'Koombiyo', 'Prompt Xpress', 'Pronto'].map(p => (
              <span
                key={p}
                onClick={() => setPartnerFilter(partnerFilter === p ? 'all' : p)}
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: partnerFilter === p ? '#0f172a' : '#f1f5f9',
                  color: partnerFilter === p ? '#ffffff' : '#334155'
                }}
              >
                {p} ({mailinRepairs.filter(r => (r.courierPartner || 'Domex') === p).length})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Waybill #, Ticket #, Customer, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveHub('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              background: activeHub === 'all' ? '#0f172a' : '#f1f5f9',
              color: activeHub === 'all' ? '#ffffff' : '#475569'
            }}
          >
            All Consignments
          </button>
          <button
            onClick={() => setActiveHub('techLab')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              background: activeHub === 'techLab' ? '#7c3aed' : '#f1f5f9',
              color: activeHub === 'techLab' ? '#ffffff' : '#475569'
            }}
          >
            Tech Lab Parcels
          </button>
          <button
            onClick={() => setActiveHub('storeHub')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              background: activeHub === 'storeHub' ? '#0284c7' : '#f1f5f9',
              color: activeHub === 'storeHub' ? '#ffffff' : '#475569'
            }}
          >
            Retail Store Orders
          </button>
        </div>
      </div>

      {/* DISPATCH CONSIGNMENT TABLE */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '12px 16px' }}>Consignment ID</th>
              <th style={{ padding: '12px 16px' }}>Destination Hub</th>
              <th style={{ padding: '12px 16px' }}>Courier & Waybills</th>
              <th style={{ padding: '12px 16px' }}>Customer & Doorstep Address</th>
              <th style={{ padding: '12px 16px' }}>Transit Stage</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.map(r => {
              const partner = r.courierPartner || 'Domex';
              const isInward = (r.courierStage ?? 0) <= 2;
              return (
                <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>#{r.ticketId}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.deviceBrand} {r.deviceModel}</div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: isInward ? '#eff6ff' : '#faf5ff',
                        color: isInward ? '#0284c7' : '#7c3aed'
                      }}
                    >
                      {isInward ? '➔ INWARD: Central Tech Lab' : '⬅ OUTWARD: Customer Doorstep'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Truck size={12} /> {partner} Express
                    </div>
                    {r.waybillNumber && (
                      <div style={{ marginTop: 2 }}>
                        <a
                          href={getCourierTrackingUrl(partner, r.waybillNumber)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          Inward: #{r.waybillNumber} <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                    {r.returnWaybillNumber && (
                      <div style={{ marginTop: 2 }}>
                        <a
                          href={getCourierTrackingUrl(partner, r.returnWaybillNumber)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: '#059669', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          Return: #{r.returnWaybillNumber} <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px', maxWidth: 220 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.customerName}</div>
                    <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={11} /> {typeof r.address === 'object' ? `${r.address.addressLine1 || ''}, ${r.address.city || ''}` : (r.address || 'Sri Lanka Doorstep')}
                    </div>
                    {r.customerPhone && (
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>Tel: {r.customerPhone}</div>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={r.courierStage ?? 0}
                      onChange={(e) => handleUpdateStage(r._id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid #ddd6fe',
                        background: '#faf5ff',
                        color: '#6b21a8',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {COURIER_STAGES.map(cs => (
                        <option key={cs.id} value={cs.id}>{cs.label}</option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {(r.courierStage ?? 0) < 4 ? (
                      <button
                        onClick={() => handleDispatchReturn(r._id, partner)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          border: 'none',
                          background: '#7c3aed',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Truck size={12} /> Dispatch Return
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Check size={12} /> Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredRepairs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                  <Truck size={32} style={{ margin: '0 auto 8px', display: 'block', color: '#cbd5e1' }} />
                  No courier consignments found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
