import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const specializedAdmins = [
  {
    name: 'Nuwan Perera (Store Manager)',
    email: 'store@quick.lk',
    password: 'password123',
    role: 'store_admin',
    department: 'Retail E-Commerce & Inventory',
    phone: '+94 77 123 4567'
  },
  {
    name: 'Kasun Fernando (Lead Hardware Tech)',
    email: 'tech@quick.lk',
    password: 'password123',
    role: 'tech_admin',
    department: 'Hardware Diagnostic Lab Bench',
    phone: '+94 77 234 5678'
  },
  {
    name: 'Roshan Silva (Logistics Coordinator)',
    email: 'logistics@quick.lk',
    password: 'password123',
    role: 'logistics_admin',
    department: 'Sri Lanka Courier Logistics Hub',
    phone: '+94 77 345 6789'
  },
  {
    name: 'Nimal Jayawardena (Counter Cashier)',
    email: 'cashier@quick.lk',
    password: 'password123',
    role: 'cashier_admin',
    department: 'Counter POS & In-Store Billing',
    phone: '+94 77 456 7890'
  }
];

const seedRoles = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding specialized admin roles...');

    for (const admin of specializedAdmins) {
      const existing = await User.findOne({ email: admin.email });
      if (!existing) {
        await User.create(admin);
        console.log(`+ Created account: ${admin.email} (${admin.role})`);
      } else {
        existing.name = admin.name;
        existing.role = admin.role;
        existing.department = admin.department;
        await existing.save();
        console.log(`~ Updated account: ${admin.email} (${admin.role})`);
      }
    }

    console.log('All 4 specialized admin accounts successfully synced!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed roles:', err);
    process.exit(1);
  }
};

seedRoles();
