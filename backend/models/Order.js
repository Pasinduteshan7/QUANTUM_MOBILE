import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        selectedFinish: {
          name: String,
          hex: String,
          image: String
        },
        product: {
          type: mongoose.Schema.Types.Mixed,
          required: false
        }
      }
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, default: 'Colombo' },
      postalCode: { type: String, default: '' }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Stripe', 'PayHere', 'Card', 'COD', 'CashOnDelivery', 'BankTransfer'],
      default: 'Stripe'
    },
    paymentResult: {
      transactionId: { type: String },
      status: { type: String },
      updatedAt: { type: String }
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    },
    deliveredAt: {
      type: Date
    },
    courierPartner: {
      type: String,
      enum: ['Domex Express', 'Koombiyo Delivery', 'Prompt Xpress', 'Pronto Lanka', 'Certis Lanka', 'Quantum Direct Courier'],
      default: 'Domex Express'
    },
    waybillNumber: {
      type: String,
      default: ''
    },
    estimatedDelivery: {
      type: String,
      default: '24–48 Hours across Sri Lanka'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
