import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
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
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    includes: ''
  });

  useEffect(() => {
    // Les services sont en mémoire pour l'admin
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      includes: ''
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      includes: Array.isArray(service.includes) ? service.includes.join('\n') : ''
    });
    setShowModal(true);
  };

  const handleSaveService = () => {
    if (!formData.name?.trim() || !formData.description?.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const includes = formData.includes
      .split('\n')
      .map(item => item.trim())
      .filter(item => item);

    if (editingService) {
      // Modifier
      setServices(services.map(s =>
        s.id === editingService.id
          ? { ...s, name: formData.name, description: formData.description, includes }
          : s
      ));
      toast.success('Service modifié avec succès');
    } else {
      // Ajouter
      const newService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        image: '/images/services/default.png',
        includes
      };
      setServices([...services, newService]);
      toast.success('Service ajouté avec succès');
    }

    setShowModal(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(services.filter(s => s.id !== id));
      toast.success('Service supprimé avec succès');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
              {editingService && editingService.image && (
                <div className="modal-image-section">
                  <img 
                    src={editingService.image} 
                    alt={editingService.name}
                    className="modal-image"
                  />
                </div>
              )}
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
                    rows={5}
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
                    rows={4}
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
