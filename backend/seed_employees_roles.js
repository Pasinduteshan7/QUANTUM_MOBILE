import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import AdminRole from './models/AdminRole.js';

dotenv.config();

const INITIAL_EMPLOYEES = [
  {
    fullName: 'Nuwan Perera',
    nic: '198814502391',
    phone: '+94 77 123 4567',
    email: 'nuwan.manager@quick.lk',
    residentialAddress: {
      street: '45/B, Station Road',
      city: 'Dehiwala',
      district: 'Colombo',
      postalCode: '10350'
    },
    designation: 'Store Manager',
    department: 'Executive & Management',
    associatedAdminRole: 'store',
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '1004882910',
      accountHolderName: 'K. A. Nuwan Perera',
      branchName: 'Kollupitiya Branch',
      branchCode: '012'
    },
    payroll: {
      basicSalaryLKR: 185000,
      allowancesLKR: 25000,
      epfNumber: 'EPF-CO-9921'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2022-03-01'),
    emergencyContact: {
      name: 'Anoma Perera',
      relationship: 'Spouse',
      phone: '+94 71 882 1102'
    }
  },
  {
    fullName: 'Nimal Jayawardena',
    nic: '199228901234',
    phone: '+94 76 991 2288',
    email: 'nimal.cashier@quick.lk',
    residentialAddress: {
      street: '12, Temple Road',
      city: 'Mount Lavinia',
      district: 'Colombo',
      postalCode: '10370'
    },
    designation: 'Cashier',
    department: 'Retail Sales & POS',
    associatedAdminRole: 'cashier',
    bankDetails: {
      bankName: 'Bank of Ceylon (BOC)',
      accountNumber: '8910472619',
      accountHolderName: 'P. Nimal Jayawardena',
      branchName: 'Mount Lavinia City Branch',
      branchCode: '045'
    },
    payroll: {
      basicSalaryLKR: 78000,
      allowancesLKR: 12000,
      epfNumber: 'EPF-CO-1048'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2023-01-15'),
    emergencyContact: {
      name: 'Sunil Jayawardena',
      relationship: 'Father',
      phone: '+94 77 334 1199'
    }
  },
  {
    fullName: 'Dilini Samaraweera',
    nic: '199658201948',
    phone: '+94 70 441 5566',
    email: 'dilini.support@quick.lk',
    residentialAddress: {
      street: '78/1, High Level Road',
      city: 'Nugegoda',
      district: 'Colombo',
      postalCode: '10250'
    },
    designation: 'Customer Support Executive',
    department: 'Customer Experience & Chat',
    associatedAdminRole: 'store',
    bankDetails: {
      bankName: 'Sampath Bank',
      accountNumber: '003299102910',
      accountHolderName: 'M. Dilini Samaraweera',
      branchName: 'Nugegoda Super Branch',
      branchCode: '088'
    },
    payroll: {
      basicSalaryLKR: 85000,
      allowancesLKR: 15000,
      epfNumber: 'EPF-CO-1129'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2023-06-10'),
    emergencyContact: {
      name: 'Kavindu Samaraweera',
      relationship: 'Brother',
      phone: '+94 77 990 1234'
    }
  },
  {
    fullName: 'Kasun Fernando',
    nic: '199014809211',
    phone: '+94 77 555 4321',
    email: 'kasun.tech@quick.lk',
    residentialAddress: {
      street: '15/3, Marine Drive',
      city: 'Bambalapitiya',
      district: 'Colombo',
      postalCode: '10400'
    },
    designation: 'Lead Hardware Technician',
    department: 'Hardware Lab & Repair',
    associatedAdminRole: 'tech',
    bankDetails: {
      bankName: 'Hatton National Bank (HNB)',
      accountNumber: '20491827401',
      accountHolderName: 'W. Kasun Fernando',
      branchName: 'Bambalapitiya Plaza Branch',
      branchCode: '018'
    },
    payroll: {
      basicSalaryLKR: 145000,
      allowancesLKR: 20000,
      epfNumber: 'EPF-CO-8812'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2021-11-01'),
    emergencyContact: {
      name: 'Chamari Fernando',
      relationship: 'Spouse',
      phone: '+94 71 223 9988'
    }
  },
  {
    fullName: 'Roshan Silva',
    nic: '199320194829',
    phone: '+94 71 888 9900',
    email: 'roshan.logistics@quick.lk',
    residentialAddress: {
      street: '90, Kandy Road',
      city: 'Kelaniya',
      district: 'Gampaha',
      postalCode: '11600'
    },
    designation: 'Logistics & Courier Officer',
    department: 'Logistics & Dispatch',
    associatedAdminRole: 'logistics',
    bankDetails: {
      bankName: "People's Bank",
      accountNumber: '174920194810',
      accountHolderName: 'S. Roshan Silva',
      branchName: 'Peliyagoda Hub Branch',
      branchCode: '092'
    },
    payroll: {
      basicSalaryLKR: 92000,
      allowancesLKR: 18000,
      epfNumber: 'EPF-CO-9481'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2022-08-20'),
    emergencyContact: {
      name: 'Nadeeka Silva',
      relationship: 'Spouse',
      phone: '+94 78 443 1290'
    }
  },
  {
    fullName: 'Sunil Shantha',
    nic: '197914802918',
    phone: '+94 72 334 5511',
    email: '',
    residentialAddress: {
      street: '22, Sri Saranankara Road',
      city: 'Kalubowila',
      district: 'Colombo',
      postalCode: '10350'
    },
    designation: 'Store Cleaner / Maintenance',
    department: 'Facility & Sanitation',
    associatedAdminRole: 'none',
    bankDetails: {
      bankName: 'Bank of Ceylon (BOC)',
      accountNumber: '4019284710',
      accountHolderName: 'H. Sunil Shantha',
      branchName: 'Kalubowila Branch',
      branchCode: '071'
    },
    payroll: {
      basicSalaryLKR: 58000,
      allowancesLKR: 8000,
      epfNumber: 'EPF-CO-7719'
    },
    employmentStatus: 'ACTIVE',
    dateOfJoining: new Date('2020-05-10'),
    emergencyContact: {
      name: 'Kamala Shantha',
      relationship: 'Spouse',
      phone: '+94 72 119 4488'
    }
  }
];

const seedEmployeesAndRoles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quantum_mobile';
    console.log(`[*] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[*] Clearing existing employees...');
    await Employee.deleteMany();

    console.log(`[*] Inserting ${INITIAL_EMPLOYEES.length} initial employees (Manager, Cashier, Support, Cleaner, Tech, Logistics)...`);
    const inserted = await Employee.insertMany(INITIAL_EMPLOYEES);
    console.log(`[OK] Successfully seeded ${inserted.length} employees with bank details!`);

    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Failed to seed employees:', err.message);
    process.exit(1);
  }
};

seedEmployeesAndRoles();

