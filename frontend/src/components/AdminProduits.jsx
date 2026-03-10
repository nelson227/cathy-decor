import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'mariage',
    name: '',
    description: '',
    price: '',
    images: []
  });

  const [filters, setFilters] = useState({ category: '', search: '' });

  const categories = ['mariage', 'anniversaire', 'bapteme', 'funeraire', 'corporate', 'exterieur', 'interieur'];

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    if (imgUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return baseUrl.replace('/api', '') + imgUrl;
    }
    return imgUrl;
  };

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/produits?limit=1000');
      setProduits(res.data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduits(); }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedImages = [];
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        const response = await api.post('/upload/single/produits', formDataUpload);
        const uploadedUrl = response?.url || response?.data?.url;
        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl);
        }
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      toast.success(`${uploadedImages.length} photo(s) ajoutée(s)`);
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.name || !formData.price || !formData.description || formData.images.length === 0) {
      toast.error('Remplissez tous les champs et ajoutez au moins une image');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        images: formData.images
      };

      if (editingId) {
        await api.put(`/produits/${editingId}`, payload);
        toast.success('Produit mis à jour');
      } else {
        await api.post('/produits', payload);
        toast.success('Produit ajouté');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchProduits();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (produit) => {
    setFormData({
      category: produit.category,
      name: produit.name || '',
      description: produit.description || '',
      price: produit.price || '',
      images: produit.images || []
    });
    setEditingId(produit.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await api.delete(`/produits/${id}`);
        toast.success('Produit supprimé');
        fetchProduits();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({ category: 'mariage', name: '', description: '', price: '', images: [] });
  };

  const filteredProduits = produits.filter(p => {
    const matchCat = !filters.category || p.category === filters.category;
    const matchSearch = !filters.search || p.name?.toLowerCase().includes(filters.search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Produits Marketplace</h2>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setEditingId(null); setShowForm(!showForm); }}
        >
          <FiPlus /> Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="filter-input"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-wrapper">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h3>

            <div className="form-group">
              <label>Catégorie *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-control"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Nom du produit *</label>
              <input
                type="text"
                placeholder="Ex: Bouquet de mariage blanc"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Prix (DH) *</label>
              <input
                type="number"
                placeholder="Ex: 1500"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Décrivez le produit..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  id="produit-file-upload"
                />
                <label htmlFor="produit-file-upload" className="upload-label">
                  <FiUpload size={24} />
                  <span>{uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}</span>
                </label>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="images-preview">
                  <p className="images-count">
                    {formData.images.length} image(s) ajoutée(s)
                    <span className="first-image-hint"> (la 1ère sera l'affichage principal)</span>
                  </p>
                  <div className="images-grid">
                    {formData.images.map((img, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={getImageUrl(img)}
                          alt={`Preview ${index}`}
                          crossOrigin="anonymous"
                          onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23eee" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E'; }}
                        />
                        {index === 0 && <span className="badge-cover">Couverture</span>}
                        <button type="button" className="btn-remove" onClick={() => removeImage(index)}>
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
                {editingId ? 'Mettre à jour' : 'Ajouter le produit'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-table">
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : filteredProduits.length === 0 ? (
          <p className="empty">Aucun produit — ajoutez vos articles avec leurs prix</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Description</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProduits.map(p => (
                <tr key={p.id}>
                  <td>{p.category}</td>
                  <td>{p.name}</td>
                  <td><strong>{Number(p.price).toLocaleString('fr-FR')} DH</strong></td>
                  <td>{p.description?.substring(0, 50)}...</td>
                  <td><span className="badge">{p.images?.length || 0} image(s)</span></td>
                  <td className="actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(p)} title="Modifier">
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Supprimer">
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
