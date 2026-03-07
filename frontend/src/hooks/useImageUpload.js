import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * Custom hook for image uploads to Cloudinary
 * Handles single and multiple file uploads with progress tracking
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload a single image
   * @param {File} file - The image file to upload
   * @param {string} folder - Destination folder (decorations, salles, etc.)
   * @returns {Promise<Object>} Upload result with url and publicId
   */
  const uploadSingle = async (file, folder = 'products') => {
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
        throw new Error('Format d\'image non supporté. Utilisez JPEG, PNG, GIF ou WebP');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier dépasse 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload with progress tracking
      const response = await api.post(`/upload/single/${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setUploading(false);
        setUploadProgress(0);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  /**
   * Upload multiple images
   * @param {FileList|File[]} files - Multiple image files
   * @param {string} folder - Destination folder
   * @returns {Promise<Array>} Array of upload results
   */
  const uploadMultiple = async (files, folder = 'products') => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate files
      if (!files || files.length === 0) {
        throw new Error('Aucun fichier sélectionné');
      }

      if (files.length > 10) {
        throw new Error('Maximum 10 images à la fois');
      }

      // Validate each file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      for (let file of files) {
        if (!validTypes.includes(file.type)) {
          throw new Error(`Format non supporté: ${file.name}`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name}: dépasse 5MB`);
        }
      }

      // Create FormData
      const formData = new FormData();
      for (let file of files) {
        formData.append('images', file);
      }

      // Upload with progress tracking
      const response = await api.post(`/upload/multiple/${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setUploading(false);
        setUploadProgress(0);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Delete result
   */
  const deleteImage = async (publicId) => {
    try {
      setError(null);

      const response = await api.delete(`/upload/${publicId}`);

      if (response.data.success) {
        toast.success(response.data.message);
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Get optimized image URLs for different sizes
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Gallery URLs (thumbnail, medium, large, original)
   */
  const getGalleryUrls = async (publicId) => {
    try {
      const response = await api.get(`/upload/gallery/${publicId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Check if Cloudinary is configured
   * @returns {Promise<boolean>} True if Cloudinary is configured
   */
  const checkCloudinary = async () => {
    try {
      const response = await api.get('/upload/health');
      return response.data.cloudinaryConfigured;
    } catch (err) {
      console.error('Cloudinary check error:', err);
      return false;
    }
  };

  return {
    uploading,
    uploadProgress,
    error,
    uploadSingle,
    uploadMultiple,
    deleteImage,
    getGalleryUrls,
    checkCloudinary
  };
};

export default useImageUpload;
