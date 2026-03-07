/**
 * Example: Using ImageUploader in Admin Product Form
 * This demonstrates how to integrate image uploads with product creation/editing
 */

import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminProductFormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    images: [] // Will store uploaded image URLs and public IDs
  });

  const [loading, setLoading] = useState(false);

  /**
   * Handle image upload callback
   * Receives uploaded image data from ImageUploader component
   */
  const handleImageUpload = (uploadedData) => {
    // uploadedData can be a single object or array depending on single/multiple mode
    const imageArray = Array.isArray(uploadedData) ? uploadedData : [uploadedData];
    
    setFormData(prev => ({
      ...prev,
      images: imageArray.map(img => ({
        url: img.url,
        publicId: img.publicId,
        fileName: img.fileName
      }))
    }));

    console.log('Images ready for submission:', imageArray);
  };

  /**
   * Handle form field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Submit product with images to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      if (formData.images.length === 0) {
        toast.error('Veuillez uploader au moins une image');
        return;
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        images: formData.images.map(img => img.url) // Send just URLs to backend
      };

      console.log('Submitting:', submissionData);

      // Send to backend API
      const response = await api.post('/decorations', submissionData);

      if (response.data.success) {
        toast.success('Produit créé avec succès!');
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          category: '',
          description: '',
          images: []
        });

        // Redirect or refresh list
        // navigate('/admin/products');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error('Erreur: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <h2>Ajouter un nouveau produit</h2>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Basic Info Section */}
        <div className="form-section">
          <h3>Informations de base</h3>

          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Mariage Élégante"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Prix (DH) *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1200"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="mariage">Mariage</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="bapteme">Baptême</option>
                <option value="corporate">Corporate</option>
                <option value="funeraire">Funéraire</option>
                <option value="exterieur">Extérieur</option>
                <option value="interieur">Intérieur</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails du produit..."
              rows={4}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-section">
          <h3>Images du produit</h3>
          <p className="section-subtitle">
            Téléchargez au moins une image principale. Vous pouvez ajouter plusieurs images pour la galerie.
          </p>

          <ImageUploader
            folder="products"
            onUpload={handleImageUpload}
            multiple={true}
            maxFiles={5}
            preview={true}
            disabled={loading}
          />
        </div>

        {/* Image Preview in Form */}
        {formData.images.length > 0 && (
          <div className="form-section">
            <h3>Aperçu des images ({formData.images.length})</h3>
            <div className="image-preview-grid">
              {formData.images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={img.url} alt={`Preview ${idx + 1}`} />
                  <p className="preview-name">{img.fileName || `Image ${idx + 1}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Création en cours...' : 'Créer le produit'}
          </button>
          <button type="reset" className="cancel-btn">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormExample;

/**
 * INTEGRATION GUIDE:
 * 
 * 1. For Single Image Upload:
 *    <ImageUploader
 *      folder="products"
 *      onUpload={(img) => setFormData({...formData, mainImage: img})}
 *      multiple={false}
 *      preview={true}
 *    />
 * 
 * 2. For Multiple Images:
 *    <ImageUploader
 *      folder="products"
 *      onUpload={(images) => setFormData({...formData, images})}
 *      multiple={true}
 *      maxFiles={10}
 *    />
 * 
 * 3. Access uploaded data:
 *    - image.url - Cloudinary CDN URL
 *    - image.publicId - Cloudinary public ID (for deletion)
 *    - image.fileName - Original file name
 *    - image.size - File size in bytes
 *    - image.width / image.height - Image dimensions
 * 
 * 4. Backend expects:
 *    {
 *      name: string,
 *      price: number,
 *      category: string,
 *      description: string,
 *      images: string[] // Array of image URLs
 *    }
 * 
 * 5. For Updates/Deletes:
 *    - Use the publicId from uploadedData to delete via API
 *    - Store publicId with image URLs for future references
 */
