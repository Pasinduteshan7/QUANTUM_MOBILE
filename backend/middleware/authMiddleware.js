import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Authentication Middleware: Enforces that the user is logged in
 * (Spring Boot Spring Security / JwtAuthenticationFilter equivalent)
 * 
 * Protects cart, checkout, profile and order management.
 * Public browsing does NOT use this middleware.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return sendError(res, 401, 'User account no longer exists. Please log in again.');
      }

      if (req.user.isActive === false) {
        return sendError(res, 403, 'Your account has been deactivated. Please contact the store owner.');
      }

      next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return sendError(res, 401, 'Session expired or invalid token. Please log in to continue.');
    }
  }

  if (!token) {
    return sendError(res, 401, 'Authentication required. Please log in to proceed.');
  }
};

/**
 * Admin Role Middleware (Allows any specialized Admin and Super Admin)
 */
export const admin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required. Please log in to proceed.');
  }

  const role = String(req.user.role || '').toLowerCase().trim();
  const allowedRoles = [
    'admin',
    'super_admin',
    'store_admin',
    'tech_admin',
    'logistics_admin',
    'cashier_admin',
    'technician',
    'store',
    'tech',
    'cashier',
    'logistics',
    'role_admin',
    'role_super_admin'
  ];

  if (allowedRoles.includes(role) || role.includes('admin') || role.includes('tech') || role.includes('manager')) {
    return next();
  }

  return sendError(res, 403, `Access denied for role '${req.user.role}'. Administrator privileges required.`);
};

/**
 * Flexible Role Authorization Middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }
    const userRole = req.user.role;
    const allowed = roles.includes(userRole) || 
      (roles.includes('admin') && ['admin', 'store_admin', 'super_admin'].includes(userRole));
    if (!allowed) {
      return sendError(res, 403, `Access denied for role '${userRole}'.`);
    }
    next();
  };
};

/**
 * Super Admin Role Middleware (Strictly platform owner)
 */
export const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    return sendError(res, 403, 'Access denied. Super Administrator (Store Owner) privileges required.');
  }
};

/**
 * Fine-Grained Dynamic RBAC Privilege Middleware
 * Validates whether the active authenticated admin's role has the requested privilege granted by Super Admin
 */
export const requirePrivilege = (privilege) => {
  return async (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    const roleSlug = String(req.user.role || '').toLowerCase().trim();

    // Super Admin platform owner always possesses all permissions
    if (roleSlug === 'super_admin' || roleSlug === 'role_super_admin') {
      return next();
    }

    try {
      const AdminRole = (await import('../models/AdminRole.js')).default;
      const roleDoc = await AdminRole.findOne({ slug: roleSlug });

      if (roleDoc) {
        if (roleDoc.privileges && roleDoc.privileges.includes(privilege)) {
          return next();
        }
        return sendError(res, 403, `Access denied: Role '${roleDoc.name}' does not have the '${privilege}' privilege granted.`);
      }

      // Default store admin fallback
      if (['admin', 'store_admin', 'store'].includes(roleSlug)) {
        return next();
      }

      return sendError(res, 403, `Access denied: Insufficient privileges for action '${privilege}'.`);
    } catch (err) {
      return next();
    }
  };
};
