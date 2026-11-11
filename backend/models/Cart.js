import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  selectedFinish: {
    name: { type: String, default: 'Standard' },
    hex: { type: String, default: '#000000' },
    image: { type: String, default: '' }
  },
  image: {
    type: String,
    required: true
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // 1 active persistent cart per registered user
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save hook: Automatically recalculate totalItems and totalAmount
 */
cartSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
