import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiEye } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useImageUpload from '../hooks/useImageUpload';
import './ImageUploader.css';

/**
 * Reusable Image Uploader Component
 * Handles single or multiple image uploads to Cloudinary
 * 
 * Props:
 * - folder: string - Destination folder (decorations, salles, products, etc.)
 * - onUpload: function - Callback with uploaded image data
 * - multiple: boolean - Allow multiple files
 * - maxFiles: number - Max number of files (default 10)
 * - preview: boolean - Show image preview (default true)
 * - disabled: boolean - Disable uploader
 */
const ImageUploader = ({
  folder = 'products',
  onUpload,
  multiple = false,
  maxFiles = 10,
  preview = true,
  disabled = false
}) => {
  const inputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  
  const { uploadSingle, uploadMultiple, deleteImage, uploading, uploadProgress, error } = useImageUpload();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;

    try {
      if (multiple) {
        if (files.length > maxFiles) {
          alert(`Maximum ${maxFiles} fichiers autorisés`);
          return;
        }
        const results = await uploadMultiple(files, folder);
        setUploadedImages(prev => [...prev, ...results]);
        if (onUpload) onUpload(results);
      } else {
        const result = await uploadSingle(files[0], folder);
        setUploadedImages([result]);
        if (onUpload) onUpload(result);
      }

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleRemoveImage = async (publicId, index) => {
    try {
      await deleteImage(publicId);
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    if (!imageFiles.length) {
      alert('Veuillez déposer des images uniquement');
      return;
    }

    try {
      if (multiple) {
        if (imageFiles.length > maxFiles) {
          alert(`Maximum ${maxFiles} fichiers autorisés`);
          return;
        }
        const results = await uploadMultiple(imageFiles, folder);
        setUploadedImages(prev => [...prev, ...results]);
        if (onUpload) onUpload(results);
      } else {
        const result = await uploadSingle(imageFiles[0], folder);
        setUploadedImages([result]);
        if (onUpload) onUpload(result);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="image-uploader">
      {/* Upload Zone */}
      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div className="upload-loading">
            <AiOutlineLoading3Quarters className="spinner" />
            <p>Upload en cours... {uploadProgress}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            <FiUpload className="upload-icon" />
            <p className="upload-title">
              {multiple ? 'Déposez vos images ici' : 'Déposez votre image ici'}
            </p>
            <p className="upload-subtitle">
              ou cliquez pour parcourir (max 10MB)
            </p>
            <p className="upload-formats">
              Formats: JPEG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="upload-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {preview && uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <div className="images-header">
            <h4>{uploadedImages.length} image(s) uploadée(s)</h4>
            {uploadedImages.length > 1 && (
              <button
                className="preview-button"
                onClick={() => setShowPreview(!showPreview)}
              >
                <FiEye /> {showPreview ? 'Masquer' : 'Montrer'}
              </button>
            )}
          </div>

          {showPreview && (
            <div className="images-grid">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item"
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img src={image.url} alt={`Upload ${index + 1}`} />
                  
                  {hoveredImage === index && (
                    <div className="image-overlay">
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveImage(image.publicId, index)}
                        title="Supprimer"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}

                  <div className="image-info">
                    <p className="image-size">
                      {(image.size / 1024).toFixed(0)}KB
                    </p>
                    <p className="image-dimensions">
                      {image.width}×{image.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Compact List View */}
          {!showPreview && (
            <div className="images-list">
              {uploadedImages.map((image, index) => (
                <div key={index} className="image-list-item">
                  <span className="image-name">
                    {image.fileName || `Image ${index + 1}`}
                  </span>
                  <span className="image-meta">
                    {image.width}×{image.height} • {(image.size / 1024).toFixed(0)}KB
                  </span>
                  <button
                    className="delete-icon"
                    onClick={() => handleRemoveImage(image.publicId, index)}
                    title="Supprimer"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Export */}
      {uploadedImages.length > 0 && (
        <div className="uploader-footer">
          <p className="uploader-note">
            ✓ Image(s) prête(s) à être utilisée(s) dans le formulaire
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
