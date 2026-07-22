import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET || 'your_hospital_management_jwt_secret';
    const decoded = jwt.verify(token, secret);
    
    req.id = decoded.userId || decoded.id;
    req.role = decoded.role;

    // Load req.user from DB for route/controller backwards compatibility
    req.user = await User.findById(req.id).select('-password');
    if (!req.user) {
      req.user = { id: req.id, role: req.role };
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export const protect = isAuthenticated;

export const authorize = (...roles) => {
  return (req, res, next) => {
    const role = req.role || req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        message: `Role (${role || 'none'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

export default isAuthenticated;
