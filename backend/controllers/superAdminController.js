import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Super Admin Executive Surveillance & 360 Overview
 * @route   GET /api/super-admin/overview
 * @access  Private / Super Admin
 */
export const getSuperAdminOverview = async (req, res, next) => {
  try {
    // 1. Total & Monthly Revenue
    const orders = await Order.find({ orderStatus: { $ne: 'CANCELLED' } });
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    // Revenue by Payment Method
    const payHereTotal = orders.filter(o => o.paymentMethod === 'PayHere').reduce((acc, o) => acc + o.totalPrice, 0);
    const codTotal = orders.filter(o => o.paymentMethod === 'COD').reduce((acc, o) => acc + o.totalPrice, 0);
    const cardTotal = orders.filter(o => o.paymentMethod === 'Card').reduce((acc, o) => acc + o.totalPrice, 0);

    // 2. Products & Inventory Valuation
    const products = await Product.find();
    const inventoryValuation = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
    const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const outOfStockItems = products.filter(p => p.stock <= 0).length;

    // 3. Staff Count & Stats
    const staff = await User.find({ role: { $in: ['admin', 'technician', 'super_admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Recent Audit Logs (Watching all admin changes)
    const recentAudits = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, 200, 'Super Admin overview loaded', {
      totalRevenue,
      payHereTotal,
      codTotal,
      cardTotal,
      inventoryValuation,
      totalProducts: products.length,
      totalStockUnits,
      outOfStockItems,
      staffCount: staff.length,
      totalCustomers,
      staff,
      recentAudits
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Staff Members (Admins & Technicians)
 * @route   GET /api/super-admin/staff
 * @access  Private / Super Admin
 */
export const getStaffMembers = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'technician', 'super_admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Staff retrieved', staff);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Super Admin Create New Admin or Staff Account
 * @route   POST /api/super-admin/staff
 * @access  Private / Super Admin
 */
export const createStaffMember = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User with this email already exists.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      phone: phone || '',
      isActive: true
    });

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Owner',
      userRole: 'super_admin',
      action: 'STAFF_CREATED',
      target: `${user.name} (${user.email} as ${user.role})`,
      details: { staffId: user._id, role: user.role },
      level: 'success',
      ip: req.ip
    });

    return sendSuccess(res, 201, 'Staff member created successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Staff Active Status (Deactivate / Reactivate)
 * @route   PUT /api/super-admin/staff/:id/status
 * @access  Private / Super Admin
 */
export const toggleStaffStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, 'Staff member not found.');
    }

    if (user._id.toString() === req.user?._id?.toString()) {
      return sendError(res, 400, 'Cannot deactivate your own Super Admin account.');
    }

    user.isActive = isActive;
    await user.save();

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Owner',
      userRole: 'super_admin',
      action: isActive ? 'STAFF_REACTIVATED' : 'STAFF_DEACTIVATED',
      target: `${user.name} (${user.email} -> ${isActive ? 'ACTIVE' : 'DEACTIVATED'})`,
      details: { staffId: user._id, isActive },
      level: isActive ? 'info' : 'danger',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Staff account ${isActive ? 'activated' : 'deactivated'}`, user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Staff Member
 * @route   DELETE /api/super-admin/staff/:id
 * @access  Private / Super Admin
 */
export const deleteStaffMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'Staff member not found.');
    }

    if (user._id.toString() === req.user?._id?.toString()) {
      return sendError(res, 400, 'Cannot delete your own account.');
    }

    await User.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Owner',
      userRole: 'super_admin',
      action: 'STAFF_DELETED',
      target: `${user.name} (${user.email})`,
      details: { staffId: user._id },
      level: 'danger',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Staff member removed');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Immutable Audit Logs Stream
 * @route   GET /api/super-admin/audit-logs
 * @access  Private / Super Admin
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, level, limit = 50 } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }
    if (level) {
      query.level = level;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    return sendSuccess(res, 200, 'Audit logs retrieved', logs);
  } catch (error) {
    next(error);
  }
};
