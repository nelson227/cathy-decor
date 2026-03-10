import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'mariage',
    theme: '',
    images: []
  });

  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  // Services disponibles (même que la page d'accueil)
  const services = ['mariage', 'anniversaire', 'bapteme', 'funeraire'];

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    
    // Si c'est déjà une URL complète
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    // Si c'est une URL relative /uploads/...
    if (imgUrl.startsWith('/uploads')) {
      // Construire l'URL complète vers le backend pour les uploads
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const backendDomain = baseUrl.replace('/api', ''); // Enlever /api pour avoir le domaine
      return `${backendDomain}${imgUrl}`;
    }
    
    return imgUrl;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedImages = [];

      for (const file of files) {
        const formDataFile = new FormData();
        formDataFile.append('image', file); // ⚠️ IMPORTANT: doit être 'image' pas 'file'

        const response = await api.post('/upload/single/decorations', formDataFile);

        // La réponse contient directement { url, fileName, size, folder }
        console.log('Upload response structure:', response.data);
        
        // Accéder à l'URL directement depuis response.data.url
        const uploadedUrl = response.data?.url;
        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl);
          console.log('✅ URL sauvegardée:', uploadedUrl);
        } else {
          console.warn('⚠️ URL non trouvée dans:', response.data);
        }
      }

      if (uploadedImages.length > 0) {
        setFormData({
          ...formData,
          images: [...(formData.images || []), ...uploadedImages]
        });
        toast.success(`${uploadedImages.length} image(s) uploadée(s)`);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || formData.images.length === 0) {
      toast.error('Remplissez tous les champs et ajoutez au moins une image');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        theme: formData.theme || '',
        images: formData.images
      };

      if (editingId) {
        await api.put(`/decorations/${editingId}`, payload);
        toast.success('Décoration mise à jour');
      } else {
        await api.post('/decorations', payload);
        toast.success('Décoration ajoutée');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      theme: product.theme || '',
      images: product.images || []
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await api.delete(`/decorations/${id}`);
        toast.success('Décoration supprimée');
        fetchProducts();
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'mariage',
      theme: '',
      images: []
    });
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Décorations</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          <FiPlus /> Ajouter une décoration
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="filter-input"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {services.map(service => (
            <option key={service} value={service}>
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-wrapper">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Modifier la décoration' : 'Ajouter une nouvelle décoration'}</h3>

            <div className="form-group">
              <label>Nom du service *</label>
              <input
                type="text"
                placeholder="Ex: Blanc Vert Or Emeraude"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Catégorie *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-control"
              >
                {services.map(service => (
                  <option key={service} value={service}>
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Thème *</label>
              <input
                type="text"
                placeholder="Ex: Romantique, Classique, Moderne"
                required
                value={formData.theme}
                onChange={(e) => setFormData({...formData, theme: e.target.value})}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Décrivez la décoration..."
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Photos *</label>
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <FiUpload size={24} />
                  <span>{uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}</span>
                </label>
              </div>

              {/* Images Preview */}
              {formData.images && formData.images.length > 0 && (
                <div className="images-preview">
                  <p className="images-count">
                    {formData.images.length} image(s) ajoutée(s)
                    {formData.images.length > 0 && <span className="first-image-hint"> (la 1ère sera l'affichage principal)</span>}
                  </p>
                  <div className="images-grid">
                    {formData.images.map((img, index) => (
                      <div key={index} className="image-item">
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Preview ${index}`}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error(`Erreur chargement image ${index}:`, img);
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23eee" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        {index === 0 && <span className="badge-cover">Couverture</span>}
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeImage(index)}
                          title="Supprimer cette image"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Mettre à jour' : 'Créer la décoration'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-table">
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="empty">Aucune décoration</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Thème</th>
                <th>Description</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.category}</td>
                  <td>{product.theme || 'N/A'}</td>
                  <td>{product.description?.substring(0, 50)}...</td>
                  <td>
                    <span className="badge">
                      {product.images?.length || 0} image(s)
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(product)}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(product._id)}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
