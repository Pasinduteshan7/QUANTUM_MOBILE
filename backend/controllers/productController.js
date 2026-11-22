import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitProductCreated, emitProductUpdated, emitProductDeleted } from '../socket.js';

/**
 * @desc    Get all products with filtering, search, sorting and pagination
 * @route   GET /api/products
 * @access  Public (Anyone can browse)
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      brand,
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 100
    } = req.query;

    const query = {};

    // Filter by Brand (e.g. Apple, Samsung, Google)
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Filter by Category (e.g. Phones, Watch, Audio)
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Text Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting (Default: price descending order as requested)
    let sortOption = { price: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1, createdAt: -1 };
    if (sort === 'price_desc') sortOption = { price: -1, createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1, price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    return sendSuccess(res, 200, 'Products retrieved successfully', {
      products,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public (Anyone can browse)
 */
export const getProductById = async (req, res, next) => {
  try {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ itemCode: req.params.id }, { slug: req.params.id }]
      });
    }
    if (!product) {
      return sendError(res, 404, 'Product not found.');
    }
    return sendSuccess(res, 200, 'Product details retrieved', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products by Ecosystem Brand (e.g. apple, samsung, google)
 * @route   GET /api/products/brand/:brand
 * @access  Public (Anyone can browse)
 */
export const getProductsByBrand = async (req, res, next) => {
  try {
    const brandParam = req.params.brand;
    const products = await Product.find({
      brand: { $regex: new RegExp(`^${brandParam}$`, 'i') }
    }).sort({ price: -1 });

    return sendSuccess(res, 200, `Products for brand ${brandParam} retrieved`, products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured products for homepage hero slides
 * @route   GET /api/products/featured
 * @access  Public (Anyone can browse)
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ featured: true }).limit(8);
    return sendSuccess(res, 200, 'Featured products retrieved', featured);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private / Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    emitProductCreated(product);
    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing product
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    emitProductUpdated(product);
    return sendSuccess(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }
    emitProductDeleted(req.params.id);
    return sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
