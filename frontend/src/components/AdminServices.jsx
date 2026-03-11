import { useState, useEffect, useRef } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Mariage',
    image: '/images/services/mariage.png',
    description: 'Services spécialisés pour créer la décoration de votre jour parfait.',
    includes: ['Décor salle', 'Table de mariage', 'Arche florale', 'Détails personnalisés']
  },
  {
    id: 2,
    name: 'Anniversaire',
    image: '/images/services/anniversaire.png',
    description: 'Décoration festive et élégante pour célébrer vos moments spéciaux.',
    includes: ['Thématique personnalisée', 'Installation complète', 'Coordination', 'Démontage']
  },
  {
    id: 3,
    name: 'Baptême',
    image: '/images/services/bapteme.png',
    description: 'Services délicats et gracieux pour marquer cette belle occasion.',
    includes: ['Décor salle', 'Arrangements floraux', 'Éclairage doux', 'Mise en place']
  },
  {
    id: 4,
    name: 'Funéraires',
    image: '/images/services/funeraires.png',
    description: 'Services respectueux et dignifiés pour les cérémonies funéraires.',
    includes: ['Arrangement floral', 'Éclairage sobre', 'Draperies', 'Coordination']
  }
];

export default function AdminServices() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    includes: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Récupérer les services depuis l'API
    fetchServices();
  }, []);

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
      // Fallback to default services if API fails
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      includes: '',
      image: ''
    });
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      includes: Array.isArray(service.includes) ? service.includes.join('\n') : '',
      image: service.image
    });
    setImagePreview(service.image);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const response = await api.post('/upload/single/services', formDataUpload);
      const uploadedUrl = response?.url || response?.data?.url;
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, image: uploadedUrl }));
        setImagePreview(uploadedUrl);
        toast.success('Image téléchargée avec succès');
      } else {
        toast.error('URL image non retournée');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveService = async () => {
    if (!formData.name?.trim() || !formData.description?.trim()) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const includes = formData.includes
      .split('\n')
      .map(item => item.trim())
      .filter(item => item);

    try {
      setLoading(true);

      if (editingService) {
        // Modifier
        const response = await api.put(`/services/${editingService.id}`, {
          name: formData.name,
          description: formData.description,
          includes,
          image: formData.image
        });

        if (response.success) {
          // Recharger les services depuis l'API
          await fetchServices();
          toast.success('Service modifié avec succès');
        }
      } else {
        // Ajouter
        const response = await api.post('/services', {
          name: formData.name,
          description: formData.description,
          includes,
          image: formData.image || '/images/services/default.png'
        });

        if (response.success) {
          // Recharger les services depuis l'API
          await fetchServices();
          toast.success('Service ajouté avec succès');
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error('Erreur save service:', error);
      toast.error('Erreur lors de la sauvegarde du service');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        setLoading(true);
        const response = await api.delete(`/services/${id}`);

        if (response.success) {
          // Recharger les services
          await fetchServices();
          toast.success('Service supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur delete service:', error);
        toast.error('Erreur lors de la suppression du service');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="admin-section">
      <div className="admin-header-section">
        <div>
          <h2>Gestion des Services</h2>
          <p className="section-subtitle">Gérez les services proposés par Cathy Décor</p>
        </div>
        <button
          className="admin-btn btn-primary"
          onClick={openAddModal}
        >
          <FiPlus /> Ajouter un service
        </button>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-image-wrapper">
              <img 
                src={service.image} 
                alt={service.name}
                className="service-image"
              />
              <div className="service-actions-overlay">
                <button
                  className="action-btn edit-btn"
                  onClick={() => openEditModal(service)}
                  title="Modifier"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteService(service.id)}
                  title="Supprimer"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <div className="service-content">
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              {service.includes && service.includes.length > 0 && (
                <div className="service-includes">
                  <h4>Inclus:</h4>
                  <ul>
                    {service.includes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-services" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Modifier le service' : 'Ajouter un service'}</h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="modal-body-services">
              {/* Image Upload Section */}
              <div className="modal-image-upload-section">
                <label className="image-section-label">Photo de couverture</label>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu service"
                        className="preview-image-large"
                      />
                      <button
                        type="button"
                        className="btn-change-image"
                        onClick={triggerFileInput}
                        disabled={uploading}
                      >
                        <FiUpload size={16} /> Changer la photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-upload-image"
                      onClick={triggerFileInput}
                      disabled={uploading}
                    >
                      <FiUpload size={32} />
                      <span>Ajouter une photo</span>
                      <small>PNG, JPG jusqu'à 5MB</small>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>

              {/* Form Section */}
              <div className="modal-form-section">
                <div className="form-group">
                  <label>Nom du service *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Mariage"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez le service en détail..."
                    rows={4}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Éléments inclus (un par ligne)</label>
                  <textarea
                    name="includes"
                    value={formData.includes}
                    onChange={handleInputChange}
                    placeholder="Décor salle&#10;Table de mariage&#10;Arche florale&#10;Détails personnalisés"
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveService}
                disabled={uploading}
              >
                {editingService ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
