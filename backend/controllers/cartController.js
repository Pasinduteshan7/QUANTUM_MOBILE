import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get current user's persistent cart
 * @route   GET /api/cart
 * @access  Private (Requires Logged-In User)
 */
export const getUserCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price mainImage stock brand');

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    return sendSuccess(res, 200, 'User cart retrieved', cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to user cart (ENFORCES USER LOGIN)
 * @route   POST /api/cart/add
 * @access  Private (Requires Logged-In User)
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedFinish, customName, customPrice, customImage } = req.body;

    if (!productId) {
      return sendError(res, 400, 'Product ID is required to add to cart.');
    }

    let product = null;
    // Check if productId is a valid MongoDB ObjectId or custom bundle code
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }

    const itemPrice = customPrice !== undefined ? customPrice : product ? product.price : 0;
    const itemName = customName || (product ? product.name : 'Device');
    const itemImage = customImage || (product ? product.mainImage : '');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const finishName = selectedFinish?.name || 'Standard';

    // Check if exact product with same color finish already exists in user cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product?.toString() === productId &&
        (item.selectedFinish?.name || 'Standard') === finishName
    );

    if (existingIndex > -1) {
      // Increment quantity
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      // Push new cart item
      cart.items.push({
        product: product ? product._id : null,
        name: itemName,
        price: itemPrice,
        quantity: Number(quantity),
        selectedFinish: selectedFinish || { name: 'Standard', hex: '#000000', image: itemImage },
        image: itemImage
      });
    }

    await cart.save();

    return sendSuccess(res, 200, `Added ${itemName} to your cart!`, cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity of specific cart item
 * @route   PUT /api/cart/item/:itemId
 * @access  Private (Requires Logged-In User)
 */
export const updateCartItemQty = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity === undefined || quantity < 1) {
      return sendError(res, 400, 'Quantity must be at least 1.');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found.');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return sendError(res, 404, 'Item not found in your cart.');
    }

    item.quantity = Number(quantity);
    await cart.save();

    return sendSuccess(res, 200, 'Cart item quantity updated', cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove single item from cart
 * @route   DELETE /api/cart/item/:itemId
 * @access  Private (Requires Logged-In User)
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found.');
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    return sendSuccess(res, 200, 'Item removed from cart', cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private (Requires Logged-In User)
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return sendSuccess(res, 200, 'Cart cleared successfully', { totalItems: 0, totalAmount: 0, items: [] });
  } catch (error) {
    next(error);
  }
};
