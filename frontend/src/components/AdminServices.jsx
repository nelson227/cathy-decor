import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Mariage',
    slug: 'mariage',
    image: '/images/services/mariage.png',
    description: 'Services spécialisés pour créer la décoration de votre jour parfait.',
    includes: ['Décor salle', 'Table de mariage', 'Arche florale', 'Détails personnalisés']
  },
  {
    id: 2,
    name: 'Anniversaire',
    slug: 'anniversaire',
    image: '/images/services/anniversaire.png',
    description: 'Décoration festive et élégante pour célébrer vos moments spéciaux.',
    includes: ['Thématique personnalisée', 'Installation complète', 'Coordination', 'Démontage']
  },
  {
    id: 3,
    name: 'Baptême',
    slug: 'bapteme',
    image: '/images/services/bapteme.png',
    description: 'Services délicats et gracieux pour marquer cette belle occasion.',
    includes: ['Décor salle', 'Arrangements floraux', 'Éclairage doux', 'Mise en place']
  },
  {
    id: 4,
    name: 'Funéraires',
    slug: 'funeraires',
    image: '/images/services/funeraires.png',
    description: 'Services respectueux et dignifiés pour les cérémonies funéraires.',
    includes: ['Arrangement floral', 'Éclairage sobre', 'Draperies', 'Coordination']
  }
];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    includes: '',
    image: ''
  });

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    if (imgUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return baseUrl.replace('/api', '') + imgUrl;
    }
    return imgUrl;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services?limit=100');
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
        console.log('✅ Services chargés:', response.data.length);
      }
    } catch (error) {
      console.error('Erreur fetch services:', error);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // Upload identique à AdminProduits
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const file = files[0]; // Un seul fichier pour les services
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const response = await api.post('/upload/single/services', formDataUpload);
      const uploadedUrl = response?.url || response?.data?.url;
      
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, image: uploadedUrl }));
        toast.success('Photo ajoutée');
      } else {
        toast.error('Erreur: URL non retournée');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.description?.trim()) {
      toast.error('Nom et description sont obligatoires');
      return;
    }

    const includes = formData.includes
      .split('\n')
      .map(item => item.trim())
      .filter(item => item);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        includes,
        image: formData.image || '/images/services/default.png'
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        toast.success('Service mis à jour');
      } else {
        await api.post('/services', payload);
        toast.success('Service ajouté');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      description: service.description || '',
      includes: Array.isArray(service.includes) ? service.includes.join('\n') : '',
      image: service.image || ''
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await api.delete(`/services/${id}`);
        toast.success('Service supprimé');
        fetchServices();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      includes: '',
      image: ''
    });
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Services</h2>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setEditingId(null); setShowForm(!showForm); }}
        >
          <FiPlus /> Ajouter un service
        </button>
      </div>

      {/* Form - même structure que AdminProduits */}
      {showForm && (
        <div className="admin-form-wrapper">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Modifier le service' : 'Ajouter un nouveau service'}</h3>

            <div className="form-group">
              <label>Nom du service *</label>
              <input
                type="text"
                placeholder="Ex: Mariage"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Décrivez le service en détail..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Éléments inclus (un par ligne)</label>
              <textarea
                placeholder="Décor salle&#10;Table de mariage&#10;Arche florale"
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                rows={4}
                className="form-control"
              />
            </div>

            {/* Photo - exactement comme AdminProduits */}
            <div className="form-group">
              <label>Photo</label>
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="file-input"
                  id="service-file-upload"
                />
                <label htmlFor="service-file-upload" className="upload-label">
                  <FiUpload size={24} />
                  <span>{uploading ? 'Upload en cours...' : 'Cliquez pour ajouter une photo'}</span>
                </label>
              </div>

              {formData.image && (
                <div className="images-preview">
                  <div className="images-grid">
                    <div className="image-item">
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Preview"
                        crossOrigin="anonymous"
                        onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23eee" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E'; }}
                      />
                      <button type="button" className="btn-remove" onClick={removeImage}>
                        <FiX />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Mettre à jour' : 'Ajouter le service'}
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
        ) : services.length === 0 ? (
          <p className="empty">Aucun service — ajoutez vos services</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Inclus</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>
                    <img 
                      src={getImageUrl(service.image)} 
                      alt={service.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      crossOrigin="anonymous"
                      onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23eee" width="60" height="60"/%3E%3C/svg%3E'; }}
                    />
                  </td>
                  <td><strong>{service.name}</strong></td>
                  <td style={{ maxWidth: '300px' }}>
                    {service.description?.substring(0, 100)}
                    {service.description?.length > 100 && '...'}
                  </td>
                  <td>
                    {Array.isArray(service.includes) && service.includes.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                        {service.includes.slice(0, 3).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                        {service.includes.length > 3 && <li>+{service.includes.length - 3} autres</li>}
                      </ul>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-icon btn-edit" onClick={() => handleEdit(service)} title="Modifier">
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-icon btn-delete" onClick={() => handleDelete(service.id)} title="Supprimer">
                        <FiTrash2 />
                      </button>
                    </div>
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
