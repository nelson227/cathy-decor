import multer from 'multer';
import path from 'path';

// Configure multer memory storage (files are stored in buffer, then uploaded to Cloudinary)
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seul les images (JPEG, PNG, GIF, WebP) sont autorisées'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  }
});

// Middleware for single file upload
export const uploadSingleImage = upload.single('image');

// Middleware for multiple file uploads
export const uploadMultipleImages = upload.array('images', 10); // Max 10 images

// Middleware for mixed uploads (one main image + multiple gallery images)
export const uploadMixedImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

// Validation middleware for uploads
export const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni'
    });
  }

  // Check file size
  if (req.file.size > 10 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'La taille du fichier dépasse 10MB'
    });
  }

  next();
};

// Validation middleware for JSON base64 uploads
export const validateImageUploadJSON = (req, res, next) => {
  // If it's FormData, multer will handle validation
  if (req.file) {
    return next();
  }

  // For JSON base64 upload
  if (!req.body.image || !req.body.image.startsWith('data:')) {
    return res.status(400).json({
      success: false,
      message: 'Image base64 invalide'
    });
  }

  // Estimate size from base64
  const base64Data = req.body.image.split(',')[1];
  const estimatedSize = (base64Data.length * 3) / 4; // Approximate size

  if (estimatedSize > 10 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'La taille du fichier dépasse 10MB'
    });
  }

  next();
};

// Validation middleware for multiple uploads
export const validateMultipleImageUploads = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni'
    });
  }

  // Check each file size
  for (const file of req.files) {
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: `Le fichier ${file.originalname} dépasse 10MB`
      });
    }
  }

  if (req.files.length > 10) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 10 fichiers autorisés'
    });
  }

  next();
};

// Error handler for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux (max 10MB)'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers'
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur upload fichier'
    });
  }

  next();
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  uploadMixedImages,
  validateImageUpload,
  validateMultipleImageUploads,
  handleMulterError
};
