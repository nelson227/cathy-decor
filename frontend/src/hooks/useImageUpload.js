import { useState } from 'react';
import api from '../services/api';

/**
 * Custom hook for direct Cloudinary uploads
 * Bypasses backend multipart to avoid HTTP/2 issues
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload directly to Cloudinary
   * @param {File} file - The image file to upload
   * @param {string} folder - Destination folder (decorations, salles, services, etc.)
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

      // Step 1: Get signature from backend (simple GET, no multipart)
      const signatureResponse = await api.get(`/upload/signature/${folder}`);
      
      if (!signatureResponse.success || !signatureResponse.data) {
        throw new Error('Impossible d\'obtenir la signature');
      }

      const { signature, timestamp, folder: cloudFolder, cloudName, apiKey } = signatureResponse.data;

      // Step 2: Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', cloudFolder);
      formData.append('quality', 'auto:good');
      formData.append('format', 'webp');

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur Cloudinary');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      return result.secure_url;

    } catch (err) {
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
    // Alias for backwards compatibility
    uploadSingle: uploadToCloudinary
  };
};

export default useImageUpload;
