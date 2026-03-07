import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer from multer
 * @param {string} folder - Cloudinary folder (decorations, salles, etc)
 * @param {string} publicId - Custom public ID
 * @returns {Object} Upload result with secure_url
 */
export const uploadImage = async (fileBuffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: `cathy-decor/${folder}`,
        ...(publicId && { public_id: publicId }),
        resource_type: 'auto',
        quality: 'auto:good',
        format: 'webp'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of image to delete
 * @returns {Object} Delete result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload multiple images in batch
 * @param {Array} files - Array of file buffers
 * @param {string} folder - Cloudinary folder
 * @returns {Array} Array of upload results
 */
export const uploadMultipleImages = async (files, folder) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadImage(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate optimized URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const generateOptimizedUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'webp'
  } = options;

  return cloudinary.v2.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    secure: true
  });
};

/**
 * Generate thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @param {number} size - Thumbnail size (default 300)
 * @returns {string} Thumbnail URL
 */
export const generateThumbnailUrl = (publicId, size = 300) => {
  return cloudinary.v2.url(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
    secure: true
  });
};

/**
 * Generate gallery URLs with multiple sizes
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} URLs for different sizes
 */
export const generateGalleryUrls = (publicId) => {
  return {
    thumbnail: generateThumbnailUrl(publicId, 300),
    medium: generateOptimizedUrl(publicId, { width: 600, height: 600 }),
    large: generateOptimizedUrl(publicId, { width: 1200, height: 900 }),
    original: cloudinary.v2.url(publicId, { secure: true })
  };
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string} Public ID
 */
export const extractPublicId = (url) => {
  const match = url.match(/\/([^/]+)\/([^/]+)$/);
  return match ? `${match[1]}/${match[2]}` : null;
};

export default {
  uploadImage,
  deleteImage,
  uploadMultipleImages,
  generateOptimizedUrl,
  generateThumbnailUrl,
  generateGalleryUrls,
  extractPublicId
};
