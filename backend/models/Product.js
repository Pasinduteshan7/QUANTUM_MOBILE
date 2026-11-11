import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required (e.g. Apple, Samsung, Google, OnePlus, Xiaomi)'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g. Phones, Watch, Audio, Chargers, Cases, Accessories)'],
      index: true
    },
    modelCode: {
      type: String,
      trim: true
    },
    tagline: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price in LKR is required'],
      min: [0, 'Price must be positive']
    },
    originalPrice: {
      type: Number,
      default: null
    },
    stock: {
      type: Number,
      required: [true, 'Available stock count is required'],
      default: 10,
      min: [0, 'Stock cannot be negative']
    },
    images: {
      type: [String],
      default: []
    },
    mainImage: {
      type: String,
      required: [true, 'Primary display image is required']
    },
    finishes: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        image: { type: String, required: true }
      }
    ],
    specs: [
      {
        title: { type: String, required: true },
        desc: { type: String, required: true }
      }
    ],
    badge: {
      type: String,
      default: null
    },
    featured: {
      type: Boolean,
      default: false
    },
    trcslApproved: {
      type: Boolean,
      default: true
    },
    warranty: {
      type: String,
      default: '1 Year Comprehensive TRCSL Sri Lanka Warranty'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Full text search index on name, brand, category and description
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
