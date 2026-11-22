import mongoose from 'mongoose';

const adminRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'Role slug identifier is required'],
      trim: true,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    icon: {
      type: String,
      default: '🛡️'
    },
    badgeColor: {
      type: String,
      default: '#0284c7'
    },
    badgeBg: {
      type: String,
      default: '#e0f2fe'
    },
    officerName: {
      type: String,
      default: 'Authorized Admin Officer'
    },
    department: {
      type: String,
      default: 'Operations'
    },
    isSystem: {
      type: Boolean,
      default: false
    },
    privileges: [
      {
        type: String,
        enum: [
          'inventory:view',
          'inventory:adjust',
          'ecosystems:manage',
          'products:create',
          'products:edit',
          'chats:view',
          'chats:reply',
          'orders:view',
          'orders:dispatch',
          'repairs:bench',
          'repairs:diagnose',
          'logistics:dispatch',
          'pos:terminal',
          'pos:refund',
          'finance:view',
          'employees:view'
        ]
      }
    ],
    allowedTabs: [
      {
        type: String,
        enum: ['inventory', 'ecosystems', 'addProduct', 'chats', 'orders', 'repairs', 'logistics', 'pos']
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('AdminRole', adminRoleSchema);

