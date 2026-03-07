import { useState, useEffect } from 'react';
import { FiTrash2,FiEdit2, FiPlus, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminSalles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      city: '',
      address: '',
      coordinates: [0, 0]
    },
    capacity: {
      min: '',
      max: ''
    },
    pricePerDay: '',
    amenities: [],
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
      setSalles(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/salles/${editingId}`, formData);
        toast.success('Salle mise à jour');
      } else {
        await api.post('/salles', formData);
        toast.success('Salle créée');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSalles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (salle) => {
    setFormData(salle);
    setEditingId(salle._id);
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
      location: {
        city: '',
        address: '',
        coordinates: [0, 0]
      },
      capacity: {
        min: '',
        max: ''
      },
      pricePerDay: '',
      amenities: [],
      parking: false,
      ac: false,
      kitchen: false,
      outdoor: false,
      wifi: false,
      accessibility: false
    });
  };

  const amenitiesList = ['Parking', 'Climatisation', 'Cuisine', 'Terrasse', 'WiFi', 'Accessibilité'];

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
            <label>Nom</label>
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
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ville</label>
              <input
                type="text"
                required
                value={formData.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {...formData.location, city: e.target.value}
                })}
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                required
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {...formData.location, address: e.target.value}
                })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacité Min</label>
              <input
                type="number"
                min="1"
                required
                value={formData.capacity.min}
                onChange={(e) => setFormData({
                  ...formData,
                  capacity: {...formData.capacity, min: e.target.value}
                })}
              />
            </div>

            <div className="form-group">
              <label>Capacité Max</label>
              <input
                type="number"
                min="1"
                required
                value={formData.capacity.max}
                onChange={(e) => setFormData({
                  ...formData,
                  capacity: {...formData.capacity, max: e.target.value}
                })}
              />
            </div>

            <div className="form-group">
              <label>Prix par Jour (DH)</label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={formData.pricePerDay}
                onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Équipements</label>
            <div className="checkbox-group">
              {['parking', 'ac', 'kitchen', 'outdoor', 'wifi', 'accessibility'].map(key => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                  />
                  <span>{amenitiesList[['parking', 'ac', 'kitchen', 'outdoor', 'wifi', 'accessibility'].indexOf(key)]}</span>
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
                <th>Nom</th>
                <th><FiMapPin size={16} /> Ville</th>
                <th>Capacité</th>
                <th>Prix/Jour</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salles.map(salle => (
                <tr key={salle._id}>
                  <td>{salle.name}</td>
                  <td>{salle.location?.city || 'N/A'}</td>
                  <td>{salle.capacity?.min || '0'} - {salle.capacity?.max || '0'}</td>
                  <td>{salle.pricePerDay} DH</td>
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
                      onClick={() => handleDelete(salle._id)}
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
