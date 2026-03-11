import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiMapPin, FiUpload, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useImageUpload } from '../hooks/useImageUpload';

export default function AdminSalles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { uploading, uploadToCloudinary } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    capacityMin: '',
    capacityMax: '',
    price: '',
    images: [],
    parking: false,
    ac: false,
    kitchen: false,
    outdoor: false,
    wifi: false,
    accessibility: false
  });

  const [filters, setFilters] = useState({
    city: '',
    search: ''
  });

  useEffect(() => {
    fetchSalles();
  }, [filters]);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/salles?${params}`);
      console.log('Salles API response:', response.data);
      const sallesData = response.data.data || response.data || [];
      console.log('Salles data:', sallesData);
      setSalles(Array.isArray(sallesData) ? sallesData : []);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
      console.error('Fetch salles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedImages = [];

      for (const file of files) {
        const imageUrl = await uploadToCloudinary(file, 'salles');
        if (imageUrl) {
          uploadedImages.push(imageUrl);
          console.log('✅ Image uploadée:', imageUrl);
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
      toast.error(error.message || 'Erreur lors de l\'upload des images');
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
    
    // Validate required fields
    if (!formData.name || !formData.city) {
      toast.error('Nom et ville sont obligatoires');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        address: formData.address,
        capacityMin: parseInt(formData.capacityMin) || 0,
        capacityMax: parseInt(formData.capacityMax) || 0,
        price: parseFloat(formData.price) || 0,
        images: formData.images || [],
        parking: formData.parking,
        ac: formData.ac,
        kitchen: formData.kitchen,
        outdoor: formData.outdoor,
        wifi: formData.wifi,
        accessibility: formData.accessibility
      };

      console.log('Sending payload:', payload);

      if (editingId) {
        await api.put(`/salles/${editingId}`, payload);
        toast.success('Salle mise à jour');
      } else {
        await api.post('/salles', payload);
        toast.success('Salle créée');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSalles();
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (salle) => {
    setFormData({
      name: salle.name || '',
      description: salle.description || '',
      city: salle.city || '',
      address: salle.address || '',
      capacityMin: salle.capacityMin || '',
      capacityMax: salle.capacityMax || '',
      price: salle.price || '',
      images: salle.images || [],
      parking: salle.parking || false,
      ac: salle.ac || false,
      kitchen: salle.kitchen || false,
      outdoor: salle.outdoor || false,
      wifi: salle.wifi || false,
      accessibility: salle.accessibility || false
    });
    setEditingId(salle.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await api.delete(`/salles/${id}`);
        toast.success('Salle supprimée');
        fetchSalles();
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      city: '',
      address: '',
      capacityMin: '',
      capacityMax: '',
      price: '',
      images: [],
      parking: false,
      ac: false,
      kitchen: false,
      outdoor: false,
      wifi: false,
      accessibility: false
    });
  };

  const amenitiesLabels = {
    parking: 'Parking',
    ac: 'Climatisation',
    kitchen: 'Cuisine',
    outdoor: 'Terrasse',
    wifi: 'WiFi',
    accessibility: 'Accessibilité'
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Salles</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          <FiPlus /> Ajouter
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
        <input
          type="text"
          placeholder="Ville..."
          value={filters.city}
          onChange={(e) => setFilters({...filters, city: e.target.value})}
          className="filter-input"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ville *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacité Min</label>
              <input
                type="number"
                min="0"
                value={formData.capacityMin}
                onChange={(e) => setFormData({...formData, capacityMin: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Capacité Max</label>
              <input
                type="number"
                min="0"
                value={formData.capacityMax}
                onChange={(e) => setFormData({...formData, capacityMax: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Prix par Jour (FCFA)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          {/* Images Upload */}
          <div className="form-group">
            <label>Photos de la salle</label>
            <div className="upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="file-input"
                id="salle-images-upload"
              />
              <label htmlFor="salle-images-upload" className="upload-label">
                <FiUpload size={24} />
                <span>{uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}</span>
              </label>
            </div>

            {/* Images Preview */}
            {formData.images && formData.images.length > 0 && (
              <div className="images-preview">
                <p className="images-count">
                  {formData.images.length} image(s) ajoutée(s)
                  <span className="first-image-hint"> (la 1ère sera l'image de couverture)</span>
                </p>
                <div className="images-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={img} 
                        alt={`Preview ${index}`}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23eee" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {index === 0 && <span className="badge-cover">Couverture</span>}
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Équipements</label>
            <div className="checkbox-group">
              {Object.entries(amenitiesLabels).map(([key, label]) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Mettre à jour' : 'Créer'}
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
      )}

      {/* Salles Table */}
      <div className="admin-table">
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : salles.length === 0 ? (
          <p className="empty">Aucune salle</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th><FiMapPin size={16} /> Ville</th>
                <th>Capacité</th>
                <th>Prix/Jour</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salles.map(salle => (
                <tr key={salle.id}>
                  <td>
                    {salle.images && salle.images.length > 0 ? (
                      <img 
                        src={salle.images[0]} 
                        alt={salle.name}
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '60px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{salle.name}</td>
                  <td>{salle.city || 'N/A'}</td>
                  <td>{salle.capacityMin || 0} - {salle.capacityMax || 0}</td>
                  <td>{salle.price ? `${Number(salle.price).toLocaleString()} FCFA` : 'N/A'}</td>
                  <td className="actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(salle)}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(salle.id)}
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
