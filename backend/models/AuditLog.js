import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userName: {
      type: String,
      default: 'System / Staff'
    },
    userRole: {
      type: String,
      default: 'admin'
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    target: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    level: {
      type: String,
      enum: ['info', 'success', 'warning', 'danger'],
      default: 'info'
    },
    ip: {
      type: String,
      default: '127.0.0.1'
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
