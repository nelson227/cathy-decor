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
   * @param {File} file - The image or video file to upload
   * @param {string} folder - Destination folder
   * @returns {Promise<string>} The uploaded file URL
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

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
      const isImage = validImageTypes.includes(file.type);
      const isVideo = validVideoTypes.includes(file.type);

      if (!isImage && !isVideo) {
        throw new Error('Format non supporté. Utilisez JPEG, PNG, GIF, WebP pour les images ou MP4, WebM, MOV pour les vidéos');
      }

      // Limite de taille : 5MB pour images, 100MB pour vidéos
      const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`Fichier trop volumineux (max ${isVideo ? '100MB' : '5MB'})`);
      }

      // Direct upload to Cloudinary with unsigned preset
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `cathy-decor/${folder}`);

      // Utiliser l'endpoint approprié selon le type de fichier
      const resourceType = isVideo ? 'video' : 'image';
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

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
