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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    includes: []
  });

  useEffect(() => {
    // Les services sont en mémoire pour l'admin
    // Vous pouvez ajouter une API endpoint si vous voulez les persister en base de données
  }, []);

  const handleAddService = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      includes: []
    });
    setShowForm(true);
  };

  const handleEditService = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      includes: service.includes || []
    });
    setShowForm(true);
  };

  const handleSaveService = () => {
    if (!formData.name || !formData.description) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (editingId) {
      // Modifier un service existant
      setServices(services.map(s =>
        s.id === editingId
          ? { ...s, ...formData }
          : s
      ));
      toast.success('Service modifié avec succès');
    } else {
      // Ajouter un nouveau service
      const newService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        ...formData,
        image: '/images/services/default.png'
      };
      setServices([...services, newService]);
      toast.success('Service ajouté avec succès');
    }

    setShowForm(false);
  };

  const handleDeleteService = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(services.filter(s => s.id !== id));
      toast.success('Service supprimé avec succès');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncludesChange = (e) => {
    const value = e.target.value;
    const includes = value.split('\n').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, includes }));
  };

  return (
    <div className="admin-section">
      <div className="admin-header-section">
        <h2>Gestion des Services</h2>
        <button
          className="admin-btn btn-primary"
          onClick={handleAddService}
        >
          <FiPlus /> Ajouter un service
        </button>
      </div>

      {/* Services Grid */}
      <div className="admin-grid">
        {services.map(service => (
          <div key={service.id} className="admin-card">
            <div className="card-header">
              <h3>{service.name}</h3>
              <div className="card-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleEditService(service)}
                  title="Modifier"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDeleteService(service.id)}
                  title="Supprimer"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="description">{service.description}</p>
              <div className="includes">
                <h4>Inclus:</h4>
                <ul>
                  {service.includes && service.includes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Modifier le service' : 'Ajouter un service'}</h2>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nom du service *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Mariage"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez le service..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Éléments inclus (un par ligne)</label>
                <textarea
                  name="includes"
                  value={formData.includes.join('\n')}
                  onChange={handleIncludesChange}
                  placeholder="Décor salle&#10;Table de mariage&#10;Arche florale"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveService}
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
