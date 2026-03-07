import jwt from 'jsonwebtoken';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token non fourni'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'cathy-decor-secret-key'
    );

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

// Check if user is admin
export const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    });
  }
  next();
};

// Check if user is authenticated (editor or admin)
export const verifyEditor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Accès éditeur requis'
    });
  }
  next();
};

// Optional auth - doesn't fail if no token, but adds userId if present
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'cathy-decor-secret-key'
      );
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    }
  } catch (error) {
    // Silently fail - user is treated as anonymous
  }
  next();
};
