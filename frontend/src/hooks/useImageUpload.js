import { useState } from 'react';

// Cloudinary config - unsigned upload (no backend needed)
const CLOUDINARY_CLOUD_NAME = 'dc9z1q1c8';
const CLOUDINARY_UPLOAD_PRESET = 'cathy_decor_unsigned';

/**
 * Custom hook for direct Cloudinary uploads
 * Uses unsigned upload preset - no backend signature needed
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload directly to Cloudinary (unsigned)
   * @param {File} file - The image file to upload
   * @param {string} folder - Destination folder
   * @returns {Promise<string>} The uploaded image URL
   */
  const uploadToCloudinary = async (file, folder = 'services') => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file
      if (!file) {
        throw new Error('Aucun fichier sélectionné');
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Format non supporté. Utilisez JPEG, PNG, GIF ou WebP');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Fichier trop volumineux (max 5MB)');
      }

      // Direct upload to Cloudinary with unsigned preset
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `cathy-decor/${folder}`);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Erreur upload Cloudinary');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      return result.secure_url;

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Upload multiple files
   */
  const uploadMultiple = async (files, folder = 'services') => {
    const urls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, folder);
      urls.push(url);
    }
    return urls;
  };

  return {
    uploading,
    uploadProgress,
    error,
    uploadToCloudinary,
    uploadMultiple,
    uploadSingle: uploadToCloudinary
  };
};

export default useImageUpload;
};

export default useImageUpload;
