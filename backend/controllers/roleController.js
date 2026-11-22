import AdminRole from '../models/AdminRole.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const SYSTEM_DEFAULT_ROLES = [
  {
    name: 'Store Admin',
    slug: 'store',
    description: 'Catalog publishing, live stock counts, order fulfillment, and dedicated customer consultations.',
    icon: '🛍️',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    officerName: 'Nuwan Perera (Store Manager)',
    department: 'Retail & E-Commerce',
    isSystem: true,
    privileges: [
      'inventory:view',
      'inventory:adjust',
      'ecosystems:manage',
      'products:create',
      'products:edit',
      'chats:view',
      'chats:reply',
      'orders:view',
      'orders:dispatch'
    ],
    allowedTabs: ['inventory', 'ecosystems', 'addProduct', 'chats', 'orders']
  },
  {
    name: 'Tech Admin',
    slug: 'tech',
    description: 'Hardware bench diagnostics, repair stage tracking, and technician findings.',
    icon: '🔬',
    badgeColor: '#7c3aed',
    badgeBg: '#f3e8ff',
    officerName: 'Kasun Fernando (Senior Lab Technician)',
    department: 'Hardware Lab',
    isSystem: true,
    privileges: ['repairs:bench', 'repairs:diagnose'],
    allowedTabs: ['repairs']
  },
  {
    name: 'Logistics Admin',
    slug: 'logistics',
    description: 'Sri Lanka courier dispatch, Domex/Koombiyo/Pronto waybills, and hub transit routing.',
    icon: '🚚',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    officerName: 'Roshan Silva (Logistics & Transit Officer)',
    department: 'Logistics & Dispatch',
    isSystem: true,
    privileges: ['logistics:dispatch', 'orders:view', 'repairs:bench'],
    allowedTabs: ['logistics', 'orders', 'repairs']
  },
  {
    name: 'Cashier Admin (POS)',
    slug: 'cashier',
    description: 'Counter walk-in checkout, cash/card payment receipting, and repair pickup desk.',
    icon: '💳',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    officerName: 'Nimal Jayawardena (Counter Cashier - Galle Rd Hub)',
    department: 'Retail Counter POS',
    isSystem: true,
    privileges: ['pos:terminal', 'pos:refund', 'repairs:bench'],
    allowedTabs: ['pos', 'repairs']
  }
];

// Helper to auto-derive allowedTabs from privileges
const deriveTabsFromPrivileges = (privileges = []) => {
  const tabs = new Set();
  if (privileges.includes('inventory:view') || privileges.includes('inventory:adjust')) tabs.add('inventory');
  if (privileges.includes('ecosystems:manage')) tabs.add('ecosystems');
  if (privileges.includes('products:create') || privileges.includes('products:edit')) tabs.add('addProduct');
  if (privileges.includes('chats:view') || privileges.includes('chats:reply')) tabs.add('chats');
  if (privileges.includes('orders:view') || privileges.includes('orders:dispatch')) tabs.add('orders');
  if (privileges.includes('repairs:bench') || privileges.includes('repairs:diagnose')) tabs.add('repairs');
  if (privileges.includes('logistics:dispatch')) tabs.add('logistics');
  if (privileges.includes('pos:terminal') || privileges.includes('pos:refund')) tabs.add('pos');
  return Array.from(tabs);
};

/**
 * @desc    Get all admin roles (System Defaults + Custom Roles)
 * @route   GET /api/super-admin/roles
 * @access  Private / Super Admin or Admin (for role switcher)
 */
export const getAllRoles = async (req, res, next) => {
  try {
    let roles = await AdminRole.find().sort({ isSystem: -1, createdAt: 1 });

    // Auto-seed default system roles if collection is empty
    if (roles.length === 0) {
      await AdminRole.insertMany(SYSTEM_DEFAULT_ROLES);
      roles = await AdminRole.find().sort({ isSystem: -1, createdAt: 1 });
    }

    return sendSuccess(res, 200, 'Admin roles loaded successfully', roles);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new custom admin role with selected privileges
 * @route   POST /api/super-admin/roles
 * @access  Private / Super Admin
 */
export const createRole = async (req, res, next) => {
  try {
    const { name, slug, description, icon, badgeColor, officerName, department, privileges } = req.body;

    if (!name) {
      return sendError(res, 400, 'Role name is required.');
    }

    const formattedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_');

    const existing = await AdminRole.findOne({
      $or: [{ name: name.trim() }, { slug: formattedSlug }]
    });

    if (existing) {
      return sendError(res, 400, `A role with name "${name}" or slug "${formattedSlug}" already exists.`);
    }

    const selectedPrivileges = Array.isArray(privileges) ? privileges : [];
    const allowedTabs = deriveTabsFromPrivileges(selectedPrivileges);

    const newRole = await AdminRole.create({
      name: name.trim(),
      slug: formattedSlug,
      description: description || '',
      icon: icon || '🛡️',
      badgeColor: badgeColor || '#0284c7',
      badgeBg: `${badgeColor || '#0284c7'}18`,
      officerName: officerName || 'Designated Admin',
      department: department || 'Custom Operations',
      isSystem: false,
      privileges: selectedPrivileges,
      allowedTabs
    });

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'ROLE_CREATED',
      target: `${newRole.name} (${newRole.slug})`,
      details: { privileges: newRole.privileges, tabs: newRole.allowedTabs },
      level: 'success',
      ip: req.ip
    });

    return sendSuccess(res, 201, `Custom role "${newRole.name}" created successfully`, newRole);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update custom admin role
 * @route   PUT /api/super-admin/roles/:id
 * @access  Private / Super Admin
 */
export const updateRole = async (req, res, next) => {
  try {
    const role = await AdminRole.findById(req.params.id);
    if (!role) {
      return sendError(res, 404, 'Admin role not found');
    }

    const { name, description, icon, badgeColor, officerName, department, privileges } = req.body;

    if (name) role.name = name.trim();
    if (description !== undefined) role.description = description;
    if (icon) role.icon = icon;
    if (badgeColor) {
      role.badgeColor = badgeColor;
      role.badgeBg = `${badgeColor}18`;
    }
    if (officerName) role.officerName = officerName;
    if (department) role.department = department;

    if (Array.isArray(privileges)) {
      role.privileges = privileges;
      role.allowedTabs = deriveTabsFromPrivileges(privileges);
    }

    await role.save();

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'ROLE_UPDATED',
      target: `${role.name} (${role.slug})`,
      details: { privileges: role.privileges, tabs: role.allowedTabs },
      level: 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Role "${role.name}" updated successfully`, role);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete custom admin role (System core roles protected)
 * @route   DELETE /api/super-admin/roles/:id
 * @access  Private / Super Admin
 */
export const deleteRole = async (req, res, next) => {
  try {
    const role = await AdminRole.findById(req.params.id);
    if (!role) {
      return sendError(res, 404, 'Admin role not found');
    }

    if (role.isSystem) {
      return sendError(res, 403, 'System default roles (Store, Tech, Logistics, Cashier) cannot be deleted.');
    }

    await AdminRole.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'ROLE_DELETED',
      target: `${role.name} (${role.slug})`,
      details: { roleId: role._id },
      level: 'danger',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Custom role "${role.name}" deleted successfully`);
  } catch (error) {
    next(error);
  }
};

