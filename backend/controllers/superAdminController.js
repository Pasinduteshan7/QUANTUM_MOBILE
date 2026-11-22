import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import Repair from '../models/Repair.js';
import PosSale from '../models/PosSale.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Super Admin Executive Surveillance & 360 Overview
 * @route   GET /api/super-admin/overview
 * @access  Private / Super Admin
 */
export const getSuperAdminOverview = async (req, res, next) => {
  try {
    // 1. Fetch live MongoDB collections
    const [orders, posSales, repairs, products, staff, totalCustomers, recentAudits] = await Promise.all([
      Order.find().populate('user', 'name email phone').sort({ createdAt: -1 }),
      PosSale.find().sort({ createdAt: -1 }),
      Repair.find().populate('userId', 'name email phone').sort({ createdAt: -1 }),
      Product.find().sort({ createdAt: -1 }),
      User.find({ role: { $in: ['admin', 'technician', 'super_admin'] } }).select('-password').sort({ createdAt: -1 }),
      User.countDocuments({ role: 'customer' }),
      AuditLog.find().sort({ createdAt: -1 }).limit(15)
    ]);

    // 2. Financial Breakdown: Online Market
    const onlineOrdersNonCancelled = orders.filter(o => o.orderStatus !== 'CANCELLED');
    const onlineRevenue = onlineOrdersNonCancelled.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    const onlinePaidRevenue = onlineOrdersNonCancelled
      .filter(o => o.isPaid)
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    // 3. Financial Breakdown: In-Store Cashier POS
    const posSalesCompleted = posSales.filter(p => p.status === 'Completed');
    const posRevenue = posSalesCompleted.reduce((acc, p) => acc + (p.netTotal || 0), 0);

    // 4. Financial Breakdown: Device Repair Bookings
    const repairPaidRevenue = repairs
      .filter(r => r.isPaid)
      .reduce((acc, r) => acc + (r.paymentAmount || r.frozenCost || 0), 0);
    const activeRepairsCount = repairs.filter(r => ['Received', 'Diagnosing', 'Repairing', 'Quality Tested'].includes(r.status)).length;
    const completedRepairsCount = repairs.filter(r => ['Ready', 'Delivered'].includes(r.status)).length;

    // 5. Consolidated Total Revenue (Online + In-Store POS + Lab Repairs)
    const totalRevenue = onlineRevenue + posRevenue + repairPaidRevenue;

    // 6. Payment Channels Breakdown across all streams
    const stripeOrders = orders.filter(o => o.paymentMethod === 'Stripe' && o.orderStatus !== 'CANCELLED').reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    const stripeRepairs = repairs.filter(r => r.isPaid && r.paymentMethod === 'Stripe').reduce((acc, r) => acc + (r.paymentAmount || r.frozenCost || 0), 0);
    const stripeTotal = stripeOrders + stripeRepairs;

    const payHereTotal = orders.filter(o => o.paymentMethod === 'PayHere' && o.orderStatus !== 'CANCELLED').reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    const codTotal = orders.filter(o => (o.paymentMethod === 'COD' || o.paymentMethod === 'CashOnDelivery') && o.orderStatus !== 'CANCELLED').reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    
    const posCardTotal = posSalesCompleted.filter(p => p.paymentMethod === 'Card').reduce((acc, p) => acc + (p.netTotal || 0), 0);
    const posCashTotal = posSalesCompleted.filter(p => p.paymentMethod === 'Cash').reduce((acc, p) => acc + (p.netTotal || 0), 0);
    const posLankaQrTotal = posSalesCompleted.filter(p => p.paymentMethod === 'LankaQR').reduce((acc, p) => acc + (p.netTotal || 0), 0);

    // 7. Aggregation of ALL Sold Items (Online Market + Cashier POS)
    const soldItemsMap = {};

    // Online order items
    orders.forEach(o => {
      if (o.orderStatus === 'CANCELLED') return;
      (o.orderItems || []).forEach(it => {
        const key = it.name || 'Unnamed Product';
        if (!soldItemsMap[key]) {
          soldItemsMap[key] = {
            name: key,
            quantitySold: 0,
            totalRevenue: 0,
            image: it.image || '',
            channels: new Set(),
            unitPrice: it.price || 0
          };
        }
        soldItemsMap[key].quantitySold += (Number(it.quantity) || 1);
        soldItemsMap[key].totalRevenue += ((Number(it.price) || 0) * (Number(it.quantity) || 1));
        soldItemsMap[key].channels.add('Online Market');
      });
    });

    // In-store cashier POS items
    posSalesCompleted.forEach(p => {
      (p.items || []).forEach(it => {
        const key = it.name || 'Unnamed Product';
        if (!soldItemsMap[key]) {
          soldItemsMap[key] = {
            name: key,
            quantitySold: 0,
            totalRevenue: 0,
            image: it.image || '',
            channels: new Set(),
            unitPrice: it.price || 0
          };
        }
        soldItemsMap[key].quantitySold += (Number(it.quantity) || 1);
        soldItemsMap[key].totalRevenue += (Number(it.lineTotal) || ((Number(it.price) || 0) * (Number(it.quantity) || 1)));
        soldItemsMap[key].channels.add('Cashier POS');
      });
    });

    const soldItemsList = Object.values(soldItemsMap)
      .map(item => ({
        ...item,
        channels: Array.from(item.channels)
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold);

    // 8. Inventory & Valuation
    const inventoryValuation = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const outOfStockItems = products.filter(p => (p.stock || 0) <= 0).length;
    const lowStockItems = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;

    // 9. Unified Chronological Transactions Feed (Online Orders + POS Counter Sales + Repair Payments)
    const unifiedTransactions = [
      ...orders.map(o => ({
        type: 'ONLINE_ORDER',
        id: o._id,
        refNumber: `ORD-${o._id.toString().slice(-6).toUpperCase()}`,
        customer: o.shippingAddress?.fullName || o.user?.name || 'Online Customer',
        phone: o.shippingAddress?.phone || o.user?.phone || '—',
        amount: o.totalPrice || 0,
        paymentMethod: o.paymentMethod || 'Stripe',
        isPaid: o.isPaid,
        status: o.orderStatus,
        createdAt: o.createdAt
      })),
      ...posSales.map(p => ({
        type: 'POS_SALE',
        id: p._id,
        refNumber: p.saleNumber,
        customer: p.customerName || 'Walk-in Counter Customer',
        phone: p.customerPhone || '—',
        amount: p.netTotal || 0,
        paymentMethod: `POS: ${p.paymentMethod}`,
        isPaid: p.status === 'Completed',
        status: p.status,
        cashier: p.cashierName,
        createdAt: p.createdAt
      })),
      ...repairs.map(r => ({
        type: 'REPAIR_BOOKING',
        id: r._id,
        refNumber: r.ticketId,
        customer: r.customerName,
        phone: r.customerPhone,
        amount: r.paymentAmount || r.frozenCost || 0,
        paymentMethod: r.paymentMethod || (r.isPaid ? 'Stripe' : 'Pending Diagnosis'),
        isPaid: r.isPaid || false,
        status: r.status,
        device: `${r.deviceBrand} ${r.deviceModel}`,
        issue: r.issueLabel,
        createdAt: r.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return sendSuccess(res, 200, 'Super Admin overview loaded', {
      totalRevenue,
      onlineRevenue,
      onlinePaidRevenue,
      posRevenue,
      repairPaidRevenue,
      
      // Payment Breakdown
      stripeTotal,
      stripeOrders,
      stripeRepairs,
      payHereTotal,
      codTotal,
      posCardTotal,
      posCashTotal,
      posLankaQrTotal,

      // Inventory Metrics
      inventoryValuation,
      totalProducts: products.length,
      totalStockUnits,
      outOfStockItems,
      lowStockItems,

      // Bookings & Staff Counts
      totalBookings: repairs.length,
      activeRepairsCount,
      completedRepairsCount,
      totalOrdersCount: orders.length,
      totalPosSalesCount: posSales.length,
      staffCount: staff.length,
      totalCustomers,
      staff,
      recentAudits,

      // Detailed Lists
      soldItemsList,
      allRepairs: repairs,
      allPosSales: posSales,
      allOrders: orders,
      unifiedTransactions: unifiedTransactions.slice(0, 30)
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
 * @desc    Update Staff Member Role
 * @route   PUT /api/super-admin/staff/:id/role
 * @access  Private / Super Admin
 */
export const updateStaffRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return sendError(res, 400, 'Please provide the new role.');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'Staff member not found.');
    }

    if (user._id.toString() === req.user?._id?.toString()) {
      return sendError(res, 400, 'Cannot change your own Super Admin role.');
    }

    const oldRole = user.role;
    user.role = role.toLowerCase().trim();
    await user.save();

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'STAFF_ROLE_CHANGED',
      target: `${user.name} (${user.email}: ${oldRole} -> ${user.role})`,
      details: { staffId: user._id, oldRole, newRole: user.role },
      level: 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Updated ${user.name}'s role to ${user.role}`, user);
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
