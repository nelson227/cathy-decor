import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useImageUpload } from '../hooks/useImageUpload';

// New categories matching the marketplace
const CATEGORIES = [
  { id: 'buffets-rechauds', name: 'Buffets & Réchauds' },
  { id: 'couverts', name: 'Couverts' },
  { id: 'decoration-table', name: 'Décoration de Table' },
  { id: 'mobilier', name: 'Mobilier' },
  { id: 'structures-chapiteaux', name: 'Structures & Chapiteaux' },
  { id: 'vaisselle-verrerie', name: 'Vaisselle & Verrerie' },
  { id: 'autres', name: 'Autres' },
];

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Use the direct Cloudinary upload hook
  const { uploading, uploadToCloudinary } = useImageUpload();
  
  // New characteristic management
  const [newCharacteristicKey, setNewCharacteristicKey] = useState('');
  const [newCharacteristicOptions, setNewCharacteristicOptions] = useState('');
  
  const [formData, setFormData] = useState({
    category: 'buffets-rechauds',
    name: '',
    description: '',
    price: '',
    images: [],
    characteristics: {},
    stock: -1,
    featured: false
  });

  const [filters, setFilters] = useState({ category: '', search: '' });

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

  // Upload direct vers Cloudinary (contourne HTTP/2 issues)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedImages = [];
      for (const file of files) {
        const uploadedUrl = await uploadToCloudinary(file, 'produits');
        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl);
        }
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      toast.success(`${uploadedImages.length} photo(s) ajoutée(s)`);
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error.message || 'Erreur lors de l\'upload');
    }
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  // Add a new characteristic
  const addCharacteristic = () => {
    if (!newCharacteristicKey.trim()) {
      toast.error('Entrez un nom de caractéristique');
      return;
    }
    if (!newCharacteristicOptions.trim()) {
      toast.error('Entrez les options (séparées par des virgules)');
      return;
    }

    const key = newCharacteristicKey.trim().toLowerCase().replace(/\s+/g, '_');
    const options = newCharacteristicOptions.split(',').map(opt => opt.trim()).filter(Boolean);

    if (options.length === 0) {
      toast.error('Au moins une option est requise');
      return;
    }

    setFormData(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: options
      }
    }));

    setNewCharacteristicKey('');
    setNewCharacteristicOptions('');
    toast.success(`Caractéristique "${newCharacteristicKey}" ajoutée`);
  };

  // Remove a characteristic
  const removeCharacteristic = (key) => {
    const newChars = { ...formData.characteristics };
    delete newChars[key];
    setFormData(prev => ({ ...prev, characteristics: newChars }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.name || !formData.price) {
      toast.error('Nom, catégorie et prix sont obligatoires');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        images: formData.images,
        characteristics: formData.characteristics,
        stock: formData.stock === '' ? -1 : parseInt(formData.stock),
        featured: formData.featured
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
      images: produit.images || [],
      characteristics: produit.characteristics || {},
      stock: produit.stock ?? -1,
      featured: produit.featured || false
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
    setFormData({
      category: 'buffets-rechauds',
      name: '',
      description: '',
      price: '',
      images: [],
      characteristics: {},
      stock: -1,
      featured: false
    });
    setNewCharacteristicKey('');
    setNewCharacteristicOptions('');
  };

  const filteredProduits = produits.filter(p => {
    const matchCat = !filters.category || p.category === filters.category;
    const matchSearch = !filters.search || p.name?.toLowerCase().includes(filters.search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Format characteristic key for display
  const formatCharKey = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Produits Location</h2>
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
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-wrapper">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h3>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-control"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Prix (FCFA) *</label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  required
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nom du produit *</label>
              <input
                type="text"
                placeholder="Ex: Marmite Chauffante Ronde"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Décrivez le produit en détail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="form-control"
              />
            </div>

            {/* Characteristics Section */}
            <div className="form-group" style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>
                Caractéristiques (optionnel)
              </label>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                Ajoutez des caractéristiques que le client devra choisir (ex: Couleur, Modèle, Taille)
              </p>

              {/* Existing characteristics */}
              {Object.keys(formData.characteristics).length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {Object.entries(formData.characteristics).map(([key, options]) => (
                    <div key={key} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.5rem', 
                      background: '#f3f4f6', 
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>{formatCharKey(key)}:</strong>
                      <span style={{ flex: 1 }}>{options.join(', ')}</span>
                      <button 
                        type="button" 
                        onClick={() => removeCharacteristic(key)}
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new characteristic */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nom</label>
                  <input
                    type="text"
                    placeholder="Ex: Couleur"
                    value={newCharacteristicKey}
                    onChange={(e) => setNewCharacteristicKey(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Options (séparées par virgules)</label>
                  <input
                    type="text"
                    placeholder="Ex: Argent, Or, Noir"
                    value={newCharacteristicOptions}
                    onChange={(e) => setNewCharacteristicOptions(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={addCharacteristic}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <FiPlus size={16} /> Ajouter
                </button>
              </div>
            </div>

            {/* Stock and Featured */}
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label>Stock (optionnel)</label>
                <input
                  type="number"
                  placeholder="-1 = illimité"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="form-control"
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Laissez -1 pour stock illimité</span>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <label htmlFor="featured" style={{ cursor: 'pointer' }}>Produit mis en avant</label>
              </div>
            </div>

            {/* Photos */}
            <div className="form-group">
              <label>Photos</label>
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
          <p className="empty">Aucun produit — ajoutez vos articles avec leurs prix et caractéristiques</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Caractéristiques</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProduits.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontSize: '0.875rem' }}>
                      {CATEGORIES.find(c => c.id === p.category)?.name || p.category}
                    </span>
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.featured && <span style={{ marginLeft: '0.5rem', background: '#fbbf24', color: '#000', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.7rem' }}>★</span>}
                  </td>
                  <td><strong>{Number(p.price).toLocaleString('fr-FR')} FCFA</strong></td>
                  <td>
                    {p.characteristics && Object.keys(p.characteristics).length > 0 ? (
                      <div style={{ fontSize: '0.75rem' }}>
                        {Object.entries(p.characteristics).map(([key, opts]) => (
                          <div key={key}><strong>{formatCharKey(key)}:</strong> {opts.length} options</div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Aucune</span>
                    )}
                  </td>
                  <td>
                    {p.images?.[0] ? (
                      <img 
                        src={getImageUrl(p.images[0])} 
                        alt={p.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Aucune</span>
                    )}
                  </td>
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
