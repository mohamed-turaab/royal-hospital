import { ROLES } from '../config/roles.js';

/**
 * Middleware to ensure the authenticated user has one of the allowed roles.
 * Assumes req.user is populated by authentication middleware with a `role` field.
 */
export function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
