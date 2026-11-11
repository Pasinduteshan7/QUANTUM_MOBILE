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
  const adminRoles = [
    'admin',
    'store_admin',
    'tech_admin',
    'logistics_admin',
    'cashier_admin',
    'technician',
    'super_admin'
  ];
  if (req.user && adminRoles.includes(req.user.role)) {
    next();
  } else {
    return sendError(res, 403, 'Access denied. Administrator privileges required.');
  }
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
