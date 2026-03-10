import express from 'express';
import {
  uploadSingleImage,
  uploadMultipleImages,
  validateImageUpload,
  validateMultipleImageUploads,
  handleMulterError
} from '../middleware/upload.js';
import {
  uploadFile,
  uploadMultiple,
  deleteFile,
  getFileInfo
} from '../services/localStorageService.js';
import { uploadImage, uploadMultipleImages as uploadToCloudinary, deleteImage } from '../services/cloudinaryService.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

/**
 * POST /api/upload/single/:folder
 * Upload single image to Cloudinary (production) or local storage (dev)
 * Protected: Admin only
 */
router.post(
  '/single/:folder',
  verifyToken,
  verifyAdmin,
  uploadSingleImage,
  validateImageUpload,
  handleMulterError,
  async (req, res) => {
    try {
      const { folder } = req.params;
      const { originalname, buffer } = req.file;

      // Validate folder - add 'produits' as valid folder
      const validFolders = ['decorations', 'salles', 'testimonials', 'products', 'produits'];
      if (!validFolders.includes(folder)) {
        return res.status(400).json({
          success: false,
          message: 'Dossier invalide. Utilisez: ' + validFolders.join(', ')
        });
      }

      let result;

      // Use Cloudinary in production, local storage in development
      if (isCloudinaryConfigured()) {
        console.log('📤 Uploading to Cloudinary...');
        const cloudinaryResult = await uploadImage(buffer, folder);
        result = {
          success: true,
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          size: cloudinaryResult.bytes,
          folder: folder
        };
      } else {
        console.log('📤 Uploading to local storage...');
        result = uploadFile(buffer, folder, originalname);
      }

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload: ' + (result.error || 'Unknown error')
        });
      }

      res.json({
        success: true,
        data: {
          url: result.url,
          fileName: originalname,
          size: result.size,
          folder: result.folder
        },
        url: result.url, // Also return url at root level for compatibility
        message: 'Image uploadée avec succès'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload: ' + error.message
      });
    }
  }
);

/**
 * POST /api/upload/multiple/:folder
 * Upload multiple images to Cloudinary (production) or local storage (dev)
 * Protected: Admin only
 */
router.post(
  '/multiple/:folder',
  verifyToken,
  verifyAdmin,
  uploadMultipleImages,
  validateMultipleImageUploads,
  handleMulterError,
  async (req, res) => {
    try {
      const { folder } = req.params;

      // Validate folder
      const validFolders = ['decorations', 'salles', 'testimonials', 'products', 'produits'];
      if (!validFolders.includes(folder)) {
        return res.status(400).json({
          success: false,
          message: 'Dossier invalide. Utilisez: ' + validFolders.join(', ')
        });
      }

      let uploadedFiles;

      // Use Cloudinary in production, local storage in development
      if (isCloudinaryConfigured()) {
        console.log('📤 Uploading multiple to Cloudinary...');
        const buffers = req.files.map(f => f.buffer);
        const cloudinaryResults = await uploadToCloudinary(buffers, folder);
        uploadedFiles = cloudinaryResults.map((r, i) => ({
          success: true,
          url: r.secure_url,
          filename: req.files[i].originalname,
          size: r.bytes,
          folder: folder
        }));
      } else {
        console.log('📤 Uploading multiple to local storage...');
        uploadedFiles = uploadMultiple(req.files, folder);
      }

      const successFiles = uploadedFiles.filter(r => r.success);

      res.json({
        success: true,
        data: successFiles.map(r => ({
          url: r.url,
          fileName: r.filename,
          size: r.size,
          folder: r.folder
        })),
        count: successFiles.length,
        message: `${successFiles.length} image(s) uploadée(s) avec succès`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload: ' + error.message
      });
    }
  }
);

/**
 * DELETE /api/upload/file/:path
 * Delete image from local storage
 * Protected: Admin only
 */
router.delete('/file/:path(*)', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const filePath = req.params.path;

    // Delete from local storage
    const result = deleteFile(filePath);

    if (result.success) {
      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Impossible de supprimer l\'image'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression: ' + error.message
    });
  }
});

/**
 * GET /api/upload/info/:path
 * Get file info
 * Public endpoint
 */
router.get('/info/:path(*)', (req, res) => {
  try {
    const filePath = req.params.path;
    const info = getFileInfo(filePath);

    if (info.success) {
      res.json({
        success: true,
        data: info
      });
    } else {
      res.status(404).json({
        success: false,
        message: info.error
      });
    }
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur: ' + error.message
    });
  }
});

/**
 * GET /api/upload/health
 * Check upload service status
 * Public endpoint
 */
router.get('/health', (req, res) => {
  try {
    res.json({
      success: true,
      storage: 'local',
      message: 'Stockage local configuré'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur: ' + error.message
    });
  }
});

export default router;
