import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Truck, Search, CheckCircle2, ArrowRight, Wrench, ShieldCheck, Clock } from 'lucide-react';

export default function RepairsHubPage() {
  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 1040 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
        <span
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
            marginBottom: 12
          }}
        >
          <Wrench size={13} />
          Certified Smartphone Service Lab
        </span>

        <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', fontFamily: 'Outfit, sans-serif', color: '#0f172a' }}>
          Professional Phone Repair & Diagnostics
        </h1>

        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Walk-in to our Colombo 03 flagship service centre with guaranteed 30-min express slot booking, or schedule an insured doorstep courier collection anywhere in Sri Lanka.
        </p>
      </div>

      {/* Two Booking Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
        {/* Walk-in Booking Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '32px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(2, 132, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              color: '#0284c7'
            }}
          >
            <Calendar size={26} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>
            Walk-In Service Appointment
          </h2>

          <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
            Choose a convenient 30-minute time slot. Average screen or battery turnaround is 35-45 minutes while you relax in our air-conditioned lounge with complimentary tea & coffee.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#334155' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#0284c7" /> Zero waiting time with priority booking pass
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#0284c7" /> 100% Genuine OEM Grade displays & calibrated batteries
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#0284c7" /> 90-Day Comprehensive Warranty certificate
            </li>
          </ul>

          <Link
            to="/repairs/book"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              borderRadius: 12,
              background: '#0284c7',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 13.5,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
            }}
          >
            <span>Book Express Walk-In Slot</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mail-in Courier Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '32px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              color: '#7c3aed'
            }}
          >
            <Truck size={26} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>
            Doorstep Courier Collection
          </h2>

          <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
            Living outside Colombo? We dispatch our courier partner to collect your device right from your home or office. An instant waybill reference number is issued immediately upon booking.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#334155' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#7c3aed" /> Doorstep pickup with tamper-evident safe packaging
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#7c3aed" /> One-click quotation approval before physical work begins
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#7c3aed" /> Insured return courier delivery back to your address
            </li>
          </ul>

          <Link
            to="/repairs/book"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              borderRadius: 12,
              background: '#7c3aed',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 13.5,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
            }}
          >
            <span>Request Doorstep Courier</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Live Tracker CTA Bar */}
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 18,
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
            Already have an ongoing repair ticket?
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Track stage-by-stage progress (e.g. REP-104) and approve cost estimates online.
          </div>
        </div>

        <Link
          to="/repairs/track"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            borderRadius: 10,
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0284c7',
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Search size={15} />
          <span>Open Live Repair Tracker</span>
        </Link>
      </div>
    </div>
  );
}
