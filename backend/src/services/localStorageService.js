import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
const UPLOAD_URL_BASE = '/uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Upload a file to local storage
 * @param {Buffer} fileBuffer - The file content
 * @param {string} folder - Subfolder (decorations, salles, etc.)
 * @param {string} filename - Original filename
 * @returns {Object} Upload result with url and path
 */
export const uploadFile = (fileBuffer, folder, filename) => {
  try {
    const folderPath = path.join(UPLOAD_DIR, folder);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const uniqueFilename = `${name}-${timestamp}${ext}`;
    
    // Full path to save file
    const filePath = path.join(folderPath, uniqueFilename);
    
    // Write file to disk
    fs.writeFileSync(filePath, fileBuffer);

    // Return URL and metadata
    return {
      success: true,
      url: `${UPLOAD_URL_BASE}/${folder}/${uniqueFilename}`,
      path: filePath,
      filename: uniqueFilename,
      size: fileBuffer.length,
      folder: folder
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload multiple files
 * @param {Array} files - Array of file objects with buffer and originalname
 * @param {string} folder - Destination folder
 * @returns {Array} Array of upload results
 */
export const uploadMultiple = (files, folder) => {
  try {
    return files.map(file => uploadFile(file.buffer, folder, file.originalname));
  } catch (error) {
    console.error('Batch upload error:', error);
    return [];
  }
};

/**
 * Delete a file from local storage
 * @param {string} filename - Filename or relative path
 * @returns {Object} Delete result
 */
export const deleteFile = (filename) => {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Prevent directory traversal
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return {
        success: false,
        error: 'Invalid file path'
      };
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return {
        success: true,
        message: 'File deleted successfully'
      };
    }

    return {
      success: false,
      error: 'File not found'
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get file info
 * @param {string} filename - Filename or relative path
 * @returns {Object} File info
 */
export const getFileInfo = (filename) => {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        success: true,
        url: `${UPLOAD_URL_BASE}/${filename}`,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    }

    return {
      success: false,
      error: 'File not found'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  uploadFile,
  uploadMultiple,
  deleteFile,
  getFileInfo,
  UPLOAD_DIR,
  UPLOAD_URL_BASE
};
