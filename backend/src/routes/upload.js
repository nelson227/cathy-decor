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
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/upload/single/:folder
 * Upload single image to local storage
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

      // Validate folder
      const validFolders = ['decorations', 'salles', 'testimonials', 'products'];
      if (!validFolders.includes(folder)) {
        return res.status(400).json({
          success: false,
          message: 'Dossier invalide. Utilisez: ' + validFolders.join(', ')
        });
      }

      // Upload to local storage
      const result = uploadFile(buffer, folder, originalname);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload: ' + result.error
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
 * Upload multiple images to local storage
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
      const validFolders = ['decorations', 'salles', 'testimonials', 'products'];
      if (!validFolders.includes(folder)) {
        return res.status(400).json({
          success: false,
          message: 'Dossier invalide. Utilisez: ' + validFolders.join(', ')
        });
      }

      // Upload all files to local storage
      const uploadedFiles = uploadMultiple(req.files, folder);

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
