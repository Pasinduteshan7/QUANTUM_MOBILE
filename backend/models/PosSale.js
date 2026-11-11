import mongoose from 'mongoose';

const posItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: 'General'
  },
  category: {
    type: String,
    default: 'Electronics'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  lineTotal: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  }
});

const posSaleSchema = new mongoose.Schema(
  {
    saleNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    cashierName: {
      type: String,
      default: 'Nimal Jayawardena (Counter 01)'
    },
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    branch: {
      type: String,
      default: 'Colombo 03 Flagship Store (42 Galle Road)'
    },
    customerName: {
      type: String,
      default: 'Walk-in Counter Customer'
    },
    customerPhone: {
      type: String,
      default: ''
    },
    items: [posItemSchema],
    repairTicket: {
      ticketId: { type: String, default: null },
      repairId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repair', default: null },
      deviceModel: { type: String, default: '' },
      issueLabel: { type: String, default: '' },
      repairAmount: { type: Number, default: 0 }
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    netTotal: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'LankaQR', 'Bank Transfer', 'Koko Pay', 'Mintpay'],
      default: 'Cash'
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0
    },
    changeGiven: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['Completed', 'Refunded', 'Void'],
      default: 'Completed'
    },
    receiptNotes: {
      type: String,
      default: '6-Month Comprehensive In-Store Warranty Included. Serial/IMEI logged.'
    }
  },
  {
    timestamps: true
  }
);

const PosSale = mongoose.model('PosSale', posSaleSchema);

export default PosSale;
