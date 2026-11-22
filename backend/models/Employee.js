import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide employee full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    nic: {
      type: String,
      required: [true, 'Please provide Sri Lankan National Identity Card (NIC) number'],
      trim: true,
      uppercase: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact telephone number'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ''
    },
    residentialAddress: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      district: { type: String, default: 'Colombo' },
      postalCode: { type: String, default: '' }
    },
    designation: {
      type: String,
      required: [true, 'Employee designation / job role is required'],
      enum: [
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
      ],
      default: 'Cashier'
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Executive & Management',
        'Retail Sales & POS',
        'Customer Experience & Chat',
        'Hardware Lab & Repair',
        'Logistics & Dispatch',
        'Facility & Sanitation'
      ],
      default: 'Retail Sales & POS'
    },
    associatedAdminRole: {
      type: String,
      default: 'none' // 'store', 'tech', 'logistics', 'cashier', 'none', or custom role slug
    },
    bankDetails: {
      bankName: {
        type: String,
        required: [true, 'Bank name is required for payroll transfer'],
        enum: [
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
        ],
        default: 'Commercial Bank of Ceylon'
      },
      accountNumber: {
        type: String,
        required: [true, 'Bank account number is required'],
        trim: true
      },
      accountHolderName: {
        type: String,
        required: [true, 'Account holder / beneficiary name is required'],
        trim: true
      },
      branchName: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true
      },
      branchCode: {
        type: String,
        default: '',
        trim: true
      }
    },
    payroll: {
      basicSalaryLKR: {
        type: Number,
        required: [true, 'Basic monthly salary in LKR is required'],
        min: 0,
        default: 50000
      },
      allowancesLKR: {
        type: Number,
        default: 0,
        min: 0
      },
      epfNumber: {
        type: String,
        default: '',
        trim: true
      }
    },
    employmentStatus: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'PROBATION', 'RESIGNED', 'TERMINATED'],
      default: 'ACTIVE'
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: 'Family' },
      phone: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Employee', employeeSchema);

