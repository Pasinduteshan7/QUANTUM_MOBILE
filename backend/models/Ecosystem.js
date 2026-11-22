import mongoose from 'mongoose';

const finishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String, required: true }
});

const specSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
});

const subCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '📱' }
});

const ecosystemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    accentColor: { type: String, default: '#0284c7' },
    badgeText: { type: String, default: 'FLAGSHIP ECOSYSTEM' },
    emblem: { type: String, default: '✦' },
    logoUrl: { type: String, default: '' },

    // Hero Banner Video & Visuals
    heroTitleMain: { type: String, required: true },
    heroTitleSub: { type: String, required: true },
    heroImage: { type: String, required: true },
    heroVideo: { type: String, default: '' },
    videoTitle: { type: String, default: 'Official Keynote Film' },
    videoDuration: { type: String, default: '0:45 • 4K HDR' },

    // Flagship Device Spotlight
    flagship: {
      name: { type: String, required: true },
      badge: { type: String, default: 'LATEST FLAGSHIP' },
      tagline: { type: String, default: '' },
      price: { type: Number, required: true, default: 0 },
      monthlyPrice: { type: String, default: '' },
      finishes: [finishSchema],
      specs: [specSchema]
    },

    // Subcategories for sticky filter
    subCategories: [subCategorySchema],

    // Bundle Offer
    bundle: {
      name: { type: String, default: '' },
      price: { type: Number, default: 0 },
      savings: { type: Number, default: 0 },
      image: { type: String, default: '' }
    },

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Ecosystem = mongoose.model('Ecosystem', ecosystemSchema);
export default Ecosystem;

