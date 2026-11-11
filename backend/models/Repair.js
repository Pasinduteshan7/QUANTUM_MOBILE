import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true
    },
    deviceBrand: {
      type: String,
      required: true,
      enum: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Other']
    },
    deviceModel: {
      type: String,
      required: true,
      trim: true
    },
    issueId: {
      type: String,
      required: true
    },
    issueLabel: {
      type: String,
      required: true
    },
    serviceMode: {
      type: String,
      enum: ['walkin', 'mailin'],
      default: 'walkin'
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    timeSlot: {
      type: String, // e.g. "10:15 AM"
      default: '10:15 AM'
    },
    address: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    estimatedCost: {
      type: String,
      default: 'LKR 12,500 – 45,000'
    },
    frozenCost: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['Received', 'Diagnosing', 'Repairing', 'Quality Tested', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Received',
      index: true
    },
    currentStage: {
      type: Number,
      default: 0 // 0: Received, 1: Diagnosing, 2: Repairing, 3: Quality Tested, 4: Ready
    },
    diagnosticNotes: {
      type: String,
      default: 'Device received at intake station. Initial hardware diagnostic queue.'
    },
    estimateApproved: {
      type: Boolean,
      default: null
    },
    assignedTechnician: {
      type: String,
      default: 'Master Lab Tech (Colombo 03)'
    },
    // Courier Reverse Logistics Tracking (For Mail-in Repairs)
    courierPartner: {
      type: String,
      enum: ['Domex', 'Koombiyo', 'Prompt Xpress', 'Pronto', 'Certis Lanka', 'Other'],
      default: 'Domex'
    },
    waybillNumber: {
      type: String,
      default: ''
    },
    returnWaybillNumber: {
      type: String,
      default: ''
    },
    courierStage: {
      type: Number,
      default: 0 // 0: Pickup Scheduled, 1: In Transit to Lab, 2: Received at Lab, 3: Repaired & Tested, 4: Return Dispatched, 5: Delivered
    },
    courierNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Repair = mongoose.model('Repair', repairSchema);

export default Repair;
