import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewType: {
      type: String,
      enum: ['PRODUCT', 'REPAIR'],
      default: 'PRODUCT',
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    userEmail: {
      type: String,
      required: true,
      trim: true
    },
    // For Product Reviews
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      index: true
    },
    productName: {
      type: String,
      default: '',
      trim: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
      index: true
    },
    orderRef: {
      type: String,
      default: '',
      trim: true
    },
    // For Repair Reviews
    repairTicket: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    deviceModel: {
      type: String,
      default: '',
      trim: true
    },
    // Rating & Content
    rating: {
      type: Number,
      required: [true, 'Rating (1-5) is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5']
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: true
    },
    // Official Store Reply (by Admin / Super Admin)
    storeReply: {
      comment: {
        type: String,
        default: null
      },
      repliedAt: {
        type: Date,
        default: null
      },
      repliedBy: {
        type: String,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes to prevent duplicate spam
reviewSchema.index({ user: 1, product: 1 }, { unique: true, partialFilterExpression: { product: { $type: 'objectId' } } });
reviewSchema.index({ user: 1, repairTicket: 1 }, { unique: true, partialFilterExpression: { repairTicket: { $type: 'string', $gt: '' } } });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

