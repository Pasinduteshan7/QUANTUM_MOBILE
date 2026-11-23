import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Landmark,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Briefcase
} from 'lucide-react';
import { formatLKR } from '@/services/cartService';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';

const SRI_LANKAN_BANKS = [
  'Commercial Bank of Ceylon',
  'Bank of Ceylon (BOC)',
  'Sampath Bank',
  'Hatton National Bank (HNB)',
  "People's Bank",
  'Nations Trust Bank (NTB)',
  'Seylan Bank',
  'DFCC Bank',
  'Standard Chartered Bank',
  'Pan Asia Bank'
];

const DESIGNATIONS = [
  'Store Manager',
  'Assistant Manager',
  'Cashier',
  'Customer Support Executive',
  'Store Cleaner / Maintenance',
  'Lead Hardware Technician',
  'Junior Technician',
  'Logistics & Courier Officer',
  'Security Officer',
  'Inventory Auditor',
  'Other'
];

const DEPARTMENTS = [
  'Executive & Management',
  'Retail Sales & POS',
  'Customer Experience & Chat',
  'Hardware Lab & Repair',
  'Logistics & Dispatch',
  'Facility & Sanitation'
];

const DEFAULT_EMPLOYEE_FORM = {
  fullName: '',
  nic: '',
  phone: '',
  email: '',
  residentialAddress: {
    street: '',
    city: 'Colombo',
    district: 'Colombo',
    postalCode: ''
  },
  designation: 'Cashier',
  department: 'Retail Sales & POS',
  associatedAdminRole: 'none',
  bankDetails: {
    bankName: 'Commercial Bank of Ceylon',
    accountNumber: '',
    accountHolderName: '',
    branchName: '',
    branchCode: ''
  },
  payroll: {
    basicSalaryLKR: 65000,
    allowancesLKR: 10000,
    epfNumber: ''
  },
  employmentStatus: 'ACTIVE',
  emergencyContact: {
    name: '',
    relationship: 'Family',
    phone: ''
  }
};

export default function AdminEmployeeManager({
  employees = [],
  stats = { totalStaff: 0, activeStaff: 0, totalMonthlyPayroll: 0 },
  onRefresh
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [revealedBankId, setRevealedBankId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_EMPLOYEE_FORM);
  const [activeModalTab, setActiveModalTab] = useState('personal'); // 'personal' | 'role' | 'bank'
  const [submitting, setSubmitting] = useState(false);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_EMPLOYEE_FORM);
    setActiveModalTab('personal');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      fullName: emp.fullName || '',
      nic: emp.nic || '',
      phone: emp.phone || '',
      email: emp.email || '',
      residentialAddress: {
        street: emp.residentialAddress?.street || '',
        city: emp.residentialAddress?.city || 'Colombo',
        district: emp.residentialAddress?.district || 'Colombo',
        postalCode: emp.residentialAddress?.postalCode || ''
      },
      designation: emp.designation || 'Cashier',
      department: emp.department || 'Retail Sales & POS',
      associatedAdminRole: emp.associatedAdminRole || 'none',
      bankDetails: {
        bankName: emp.bankDetails?.bankName || 'Commercial Bank of Ceylon',
        accountNumber: emp.bankDetails?.accountNumber || '',
        accountHolderName: emp.bankDetails?.accountHolderName || '',
        branchName: emp.bankDetails?.branchName || '',
        branchCode: emp.bankDetails?.branchCode || ''
      },
      payroll: {
        basicSalaryLKR: emp.payroll?.basicSalaryLKR || 60000,
        allowancesLKR: emp.payroll?.allowancesLKR || 0,
        epfNumber: emp.payroll?.epfNumber || ''
      },
      employmentStatus: emp.employmentStatus || 'ACTIVE',
      emergencyContact: {
        name: emp.emergencyContact?.name || '',
        relationship: emp.emergencyContact?.relationship || 'Family',
        phone: emp.emergencyContact?.phone || ''
      }
    });
    setActiveModalTab('personal');
    setModalOpen(true);
  };

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nic || !formData.phone) {
      toast.error('Please enter full name, NIC, and contact telephone.');
      return;
    }
    if (!formData.bankDetails.accountNumber || !formData.bankDetails.accountHolderName) {
      toast.error('Please enter complete bank account details.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await adminService.updateEmployee(editingId, formData);
        toast.success(`Employee profile for ${formData.fullName} updated!`, { icon: '✅' });
      } else {
        await adminService.createEmployee(formData);
        toast.success(`Employee ${formData.fullName} successfully registered!`, { icon: '🎉' });
      }
      setModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Status Change
  const handleStatusChange = async (empId, newStatus) => {
    try {
      await adminService.updateEmployeeStatus(empId, newStatus);
      toast.success(`Employment status updated to ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change status');
    }
  };

  // Delete Employee
  const handleDelete = async (empId, empName) => {
    if (!window.confirm(`Are you sure you want to remove the employee record for ${empName}? This cannot be undone.`)) return;
    try {
      await adminService.deleteEmployee(empId);
      toast.success(`Employee ${empName} removed from records.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee record');
    }
  };

  // Filtered List
  const filteredEmployees = employees.filter((emp) => {
    if (deptFilter !== 'ALL' && emp.department !== deptFilter) return false;
    if (statusFilter !== 'ALL' && emp.employmentStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (emp.fullName || '').toLowerCase().includes(q);
      const matchNic = (emp.nic || '').toLowerCase().includes(q);
      const matchPhone = (emp.phone || '').toLowerCase().includes(q);
      const matchCity = (emp.residentialAddress?.city || '').toLowerCase().includes(q);
      const matchBank = (emp.bankDetails?.bankName || '').toLowerCase().includes(q);
      const matchRole = (emp.designation || '').toLowerCase().includes(q);
      if (!matchName && !matchNic && !matchPhone && !matchCity && !matchBank && !matchRole) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Executive Workforce KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Workforce</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                {stats.totalStaff || employees.length} Staff
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 700, marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} /> Managers, Techs, Support, Cashiers & Cleaners
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active On-Duty</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#16a34a', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                {stats.activeStaff || employees.filter(e => e.employmentStatus === 'ACTIVE').length} Active
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>
            {employees.filter(e => e.employmentStatus === 'ON_LEAVE').length} currently on leave
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Monthly Payroll Liability</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#7c3aed', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                {formatLKR(stats.totalMonthlyPayroll || 741000)}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="#7c3aed" />
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, marginTop: 10 }}>
            Automated direct bank routing
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search & Register Button */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 18, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, NIC, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#334155',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#334155',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Staff</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
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
          <Plus size={15} /> Add New Employee
        </button>
      </div>

      {/* Employee Directory Table */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 18px' }}>Employee & NIC</th>
                <th style={{ padding: '14px 18px' }}>Designation & Dept</th>
                <th style={{ padding: '14px 18px' }}>Contact & Address</th>
                <th style={{ padding: '14px 18px' }}>Bank Account & Payroll</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const isRevealed = revealedBankId === emp._id;
                const bankAcc = emp.bankDetails?.accountNumber || '';
                const maskedAcc = bankAcc.length > 4 ? `••••••••${bankAcc.slice(-4)}` : bankAcc;

                return (
                  <tr key={emp._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    {/* Employee & NIC */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: 14
                          }}
                        >
                          {emp.fullName?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{emp.fullName}</div>
                          <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                              NIC: {emp.nic}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Dept */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{emp.designation}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{emp.department}</div>
                      {emp.associatedAdminRole && emp.associatedAdminRole !== 'none' && (
                        <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 800, marginTop: 4, display: 'inline-block' }}>
                          Role: {emp.associatedAdminRole.toUpperCase()}
                        </span>
                      )}
                    </td>

                    {/* Contact & Address */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={13} color="#0284c7" />
                        {emp.phone}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <MapPin size={13} color="#94a3b8" />
                        {emp.residentialAddress?.street}, {emp.residentialAddress?.city}
                      </div>
                    </td>

                    {/* Bank Details & Payroll */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', minWidth: 220 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{emp.bankDetails?.bankName}</span>
                          <button
                            type="button"
                            onClick={() => setRevealedBankId(isRevealed ? null : emp._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}
                            title={isRevealed ? 'Hide account number' : 'Show full account number'}
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#334155', marginTop: 2, fontWeight: 700 }}>
                          Acc: {isRevealed ? bankAcc : maskedAcc}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {emp.bankDetails?.branchName} • {formatLKR(emp.payroll?.basicSalaryLKR || 0)}/mo
                        </div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <select
                        value={emp.employmentStatus}
                        onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          background:
                            emp.employmentStatus === 'ACTIVE'
                              ? '#dcfce7'
                              : emp.employmentStatus === 'ON_LEAVE'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            emp.employmentStatus === 'ACTIVE'
                              ? '#15803d'
                              : emp.employmentStatus === 'ON_LEAVE'
                              ? '#b45309'
                              : '#b91c1c'
                        }}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="ON_LEAVE">ON LEAVE</option>
                        <option value="PROBATION">PROBATION</option>
                        <option value="RESIGNED">RESIGNED</option>
                        <option value="TERMINATED">TERMINATED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11.5,
                            fontWeight: 700
                          }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id, emp.fullName)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: 6,
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            cursor: 'pointer'
                          }}
                          title="Remove employee record"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
                    No employee records match the active search or department filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT EMPLOYEE MODAL */}
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
              maxWidth: 680,
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
                  {editingId ? 'Edit Employee Profile' : 'Register New Employee & Bank Account'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                  HR personnel record, National Identity Card, residential address, and payroll bank details.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              {[
                { id: 'personal', label: '1. Personal & NIC Info' },
                { id: 'role', label: '2. Job Position & Role' },
                { id: 'bank', label: '3. Bank & Payroll' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModalTab(tab.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 800,
                    border: 'none',
                    background: activeModalTab === tab.id ? '#7c3aed' : '#f1f5f9',
                    color: activeModalTab === tab.id ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* TAB 1: PERSONAL & CONTACT */}
              {activeModalTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nuwan Perera"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        National Identity Card (NIC) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 198814502391 or 921482019V"
                        value={formData.nic}
                        onChange={(e) => setFormData({ ...formData, nic: e.target.value.toUpperCase() })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Telephone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+94 77 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="employee@quick.lk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Residential Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45/B, Galle Road"
                      value={formData.residentialAddress.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          residentialAddress: { ...formData.residentialAddress, street: e.target.value }
                        })
                      }
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.residentialAddress.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            residentialAddress: { ...formData.residentialAddress, city: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        District
                      </label>
                      <input
                        type="text"
                        value={formData.residentialAddress.district}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            residentialAddress: { ...formData.residentialAddress, district: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.residentialAddress.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            residentialAddress: { ...formData.residentialAddress, postalCode: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: JOB ROLE & POSITION */}
              {activeModalTab === 'role' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Job Title / Designation *
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    >
                      {DESIGNATIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Operating Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Link to Admin System Role (Optional)
                    </label>
                    <select
                      value={formData.associatedAdminRole}
                      onChange={(e) => setFormData({ ...formData, associatedAdminRole: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    >
                      <option value="none">None (Field / Non-system staff)</option>
                      <option value="store">Store Admin (Inventory & E-Commerce)</option>
                      <option value="tech">Tech Admin (Hardware Bench)</option>
                      <option value="logistics">Logistics Admin (Courier Dispatch)</option>
                      <option value="cashier">Cashier Admin (POS Terminal)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Emergency Contact Person & Phone
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="Contact Name (e.g. Spouse/Parent)"
                        value={formData.emergencyContact.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                          })
                        }
                        style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={formData.emergencyContact.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                          })
                        }
                        style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BANK ACCOUNT & PAYROLL */}
              {activeModalTab === 'bank' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Landmark size={15} /> Direct Bank Transfer Profile
                    </div>
                    <div style={{ fontSize: 11.5, color: '#6d28d9', marginTop: 2 }}>
                      Monthly salary and allowances are disbursed directly into this verified Sri Lankan bank account.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Select Bank *
                    </label>
                    <select
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                        })
                      }
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    >
                      {SRI_LANKAN_BANKS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1004882910"
                        value={formData.bankDetails.accountNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Account Holder / Beneficiary Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. K. A. Nuwan Perera"
                        value={formData.bankDetails.accountHolderName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kollupitiya Super Branch"
                        value={formData.bankDetails.branchName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankDetails: { ...formData.bankDetails, branchName: e.target.value }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Basic Monthly Salary (LKR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="85000"
                        value={formData.payroll.basicSalaryLKR}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            payroll: { ...formData.payroll, basicSalaryLKR: Number(e.target.value) }
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 800 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
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
                  {submitting ? 'Saving Profile...' : editingId ? 'Update Employee' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

