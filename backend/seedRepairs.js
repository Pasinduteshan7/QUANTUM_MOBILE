import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Repair from './models/Repair.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const sampleRepairs = [
  {
    ticketId: 'REP-1041',
    customerName: 'Kasun Perera',
    customerPhone: '+94 71 987 6543',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 16 Pro Max',
    issueId: 'screen',
    issueLabel: 'Cracked Screen / OLED Display',
    serviceMode: 'walkin',
    appointmentDate: new Date().toISOString().split('T')[0], // Today!
    timeSlot: '10:15 AM',
    notes: 'Dropped face down on concrete. Digitizer touch dead on bottom half.',
    estimatedCost: 'LKR 38,500 – 45,000',
    frozenCost: 42000,
    status: 'Diagnosing',
    currentStage: 1,
    diagnosticNotes: 'OEM Super Retina XDR OLED assembly matched. Preparing precision heat bed separation.',
    estimateApproved: true,
    assignedTechnician: 'Senior Master Tech (Bench 1)'
  },
  {
    ticketId: 'REP-1042',
    customerName: 'Nimali Senanayake',
    customerPhone: '+94 77 444 8899',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy S25 Ultra',
    issueId: 'battery',
    issueLabel: 'Battery Degradation / Swollen Cell',
    serviceMode: 'walkin',
    appointmentDate: new Date().toISOString().split('T')[0], // Today!
    timeSlot: '01:30 PM',
    notes: 'Phone turns off suddenly at 25% battery.',
    estimatedCost: 'LKR 14,000 – 18,500',
    frozenCost: 16500,
    status: 'Repairing',
    currentStage: 2,
    diagnosticNotes: 'Old battery cell expanded to 110% thickness. OEM 5,000mAh battery unit calibrated and installed.',
    estimateApproved: true,
    assignedTechnician: 'Lead Hardware Specialist (Bench 3)'
  },
  {
    ticketId: 'REP-1043',
    customerName: 'Dhanushka Silva',
    customerPhone: '+94 78 555 1234',
    deviceBrand: 'Google',
    deviceModel: 'Pixel 9 Pro XL',
    issueId: 'water',
    issueLabel: 'Liquid Ingress & Water Damage',
    serviceMode: 'mailin',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '11:00 AM',
    address: 'No. 88, Galle Road, Mount Lavinia, Western Province',
    notes: 'Fell in pool. Red liquid contact indicator tripped.',
    estimatedCost: 'LKR 18,000 – 28,000',
    frozenCost: 22000,
    status: 'Received',
    currentStage: 0,
    diagnosticNotes: 'Courier delivery verified. Device placed in drying chamber for ultrasonic PCB decontamination.',
    estimateApproved: null,
    assignedTechnician: 'Board Micro-soldering Tech'
  },
  {
    ticketId: 'REP-1044',
    customerName: 'Roshan Fernando',
    customerPhone: '+94 76 333 9988',
    deviceBrand: 'OnePlus',
    deviceModel: 'OnePlus 13 5G',
    issueId: 'port',
    issueLabel: 'Charging Port & Microphone Fault',
    serviceMode: 'walkin',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '03:45 PM',
    notes: 'SuperVOOC charging intermittently disconnecting.',
    estimatedCost: 'LKR 7,500 – 12,000',
    frozenCost: 8500,
    status: 'Ready',
    currentStage: 4,
    diagnosticNotes: 'Type-C dock sub-board replaced. 100W fast charging tested successfully for 45 mins. Ready for collection.',
    estimateApproved: true,
    assignedTechnician: 'Tech Lab Colombo'
  }
];

async function seed() {
  try {
    await connectDB();
    await Repair.deleteMany();
    await Repair.insertMany(sampleRepairs);
    console.log('✅ Successfully seeded sample device repairs with live timeslots!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
