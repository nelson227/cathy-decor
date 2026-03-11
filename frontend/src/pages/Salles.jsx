import React, { useState, useEffect } from 'react';
import { FiMapPin, FiUsers, FiDollarSign, FiX, FiChevronLeft, FiChevronRight, FiWifi, FiCheck } from 'react-icons/fi';
import { FaCar, FaSnowflake, FaUtensils, FaTree, FaWheelchair } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

function Salles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const [rentalForm, setRentalForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateDebut: '',
    dateFin: '',
    nombrePersonnes: '',
    typeEvenement: '',
    message: ''
  });

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/salles');
      const data = response.data.data || response.data || [];
      setSalles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des salles');
      setSalles([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    if (imgUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return baseUrl.replace('/api', '') + imgUrl;
    }
    return imgUrl;
  };

  const openSalleModal = (salle) => {
    setSelectedSalle(salle);
    setCurrentImageIndex(0);
  };

  const closeSalleModal = () => {
    setSelectedSalle(null);
    setCurrentImageIndex(0);
  };

  const openRentalForm = () => {
    setRentalForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateDebut: '',
      dateFin: '',
      nombrePersonnes: '',
      typeEvenement: '',
      message: ''
    });
    setShowRentalForm(true);
  };

  const closeRentalForm = () => {
    setShowRentalForm(false);
  };

  const nextImage = () => {
    if (selectedSalle?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedSalle.images.length);
    }
  };

  const prevImage = () => {
    if (selectedSalle?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedSalle.images.length) % selectedSalle.images.length);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    
    if (!rentalForm.nom || !rentalForm.prenom || !rentalForm.telephone || !rentalForm.dateDebut) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call - you can replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send to backend (optional - create endpoint if needed)
      // await api.post('/rental-requests', {
      //   salleId: selectedSalle.id,
      //   salleName: selectedSalle.name,
      //   ...rentalForm
      // });

      toast.success('Votre demande de location a été envoyée avec succès!');
      closeRentalForm();
      closeSalleModal();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const amenitiesIcons = {
    parking: { icon: FaCar, label: 'Parking' },
    ac: { icon: FaSnowflake, label: 'Climatisation' },
    kitchen: { icon: FaUtensils, label: 'Cuisine' },
    outdoor: { icon: FaTree, label: 'Terrasse' },
    wifi: { icon: FiWifi, label: 'WiFi' },
    accessibility: { icon: FaWheelchair, label: 'Accessibilité' }
  };

  const getAmenities = (salle) => {
    const amenities = [];
    Object.entries(amenitiesIcons).forEach(([key, value]) => {
      if (salle[key]) {
        amenities.push(value);
      }
    });
    return amenities;
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-12 mb-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos salles partenaires</h1>
          <p className="text-lg text-gray-300">
            Découvrez nos lieux partenaires pour vos événements
          </p>
        </div>
      </section>

      <div className="container-custom">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des salles...</p>
          </div>
        ) : salles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune salle disponible pour le moment</p>
            <p className="text-gray-400 mt-2">Revenez bientôt pour découvrir nos partenaires</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {salles.map((salle) => (
              <div key={salle.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gold/30 to-gold/10 overflow-hidden flex items-center justify-center">
                  {salle.images && salle.images.length > 0 ? (
                    <img 
                      src={getImageUrl(salle.images[0])} 
                      alt={salle.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl mb-2">🏛️</div>
                      <p className="text-sm text-gray-600">{salle.name}</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{salle.name}</h3>

                  {/* Location */}
                  {salle.city && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FiMapPin size={18} className="text-gold" />
                      <span>{salle.city}</span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded">
                    {(salle.capacityMin || salle.capacityMax) && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiUsers className="text-gold" />
                          <span className="text-sm">Capacité</span>
                        </div>
                        <span className="font-bold">{salle.capacityMin} - {salle.capacityMax} personnes</span>
                      </div>
                    )}
                    {salle.price && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-gold" />
                          <span className="text-sm">Prix</span>
                        </div>
                        <span className="font-bold">{Number(salle.price).toLocaleString()} FCFA/jour</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {salle.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{salle.description}</p>
                  )}

                  {/* CTA */}
                  <button 
                    onClick={() => openSalleModal(salle)}
                    className="block w-full btn-primary text-center"
                  >
                    Voir la salle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Détails de la salle */}
      {selectedSalle && !showRentalForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button 
              onClick={closeSalleModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <FiX size={24} />
            </button>

            {/* Image Gallery */}
            <div className="relative h-64 md:h-96 bg-gray-200">
              {selectedSalle.images && selectedSalle.images.length > 0 ? (
                <>
                  <img 
                    src={getImageUrl(selectedSalle.images[currentImageIndex])} 
                    alt={selectedSalle.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image counter */}
                  {selectedSalle.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {selectedSalle.images.length}
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {selectedSalle.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                      >
                        <FiChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">🏛️</div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedSalle.images && selectedSalle.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                {selectedSalle.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-2">{selectedSalle.name}</h2>
              
              {/* Location */}
              {(selectedSalle.city || selectedSalle.address) && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <FiMapPin className="text-gold" />
                  <span>
                    {selectedSalle.address && `${selectedSalle.address}, `}
                    {selectedSalle.city}
                  </span>
                </div>
              )}

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {(selectedSalle.capacityMin || selectedSalle.capacityMax) && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <FiUsers className="text-gold text-2xl mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Capacité</p>
                    <p className="font-bold">{selectedSalle.capacityMin} - {selectedSalle.capacityMax}</p>
                  </div>
                )}
                {selectedSalle.price && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <FiDollarSign className="text-gold text-2xl mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Prix / Jour</p>
                    <p className="font-bold">{Number(selectedSalle.price).toLocaleString()} FCFA</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedSalle.description && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedSalle.description}</p>
                </div>
              )}

              {/* Équipements */}
              {getAmenities(selectedSalle).length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">Équipements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getAmenities(selectedSalle).map((amenity, idx) => {
                      const Icon = amenity.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Icon className="text-green-600 text-xl" />
                          <span className="font-medium">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button 
                onClick={openRentalForm}
                className="w-full bg-gold text-dark font-bold py-4 rounded-lg hover:bg-amber-500 transition text-lg"
              >
                Louer la salle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Formulaire de location */}
      {showRentalForm && selectedSalle && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative my-8">
            {/* Close button */}
            <button 
              onClick={closeRentalForm}
              className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
            >
              <FiX size={24} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-dark to-gray-800 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">Formulaire de Location</h2>
              <p className="text-gray-300 mt-1">Remplissez ce formulaire pour réserver la salle</p>
            </div>

            {/* Salle Info Summary */}
            <div className="bg-gold/10 p-4 border-b">
              <div className="flex items-center gap-4">
                {selectedSalle.images && selectedSalle.images.length > 0 && (
                  <img 
                    src={getImageUrl(selectedSalle.images[0])} 
                    alt={selectedSalle.name}
                    className="w-20 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg">{selectedSalle.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedSalle.city} • {selectedSalle.price ? `${Number(selectedSalle.price).toLocaleString()} FCFA/jour` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRentalSubmit} className="p-6 space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">1</span>
                  Informations personnelles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={rentalForm.nom}
                      onChange={(e) => setRentalForm({...rentalForm, nom: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={rentalForm.prenom}
                      onChange={(e) => setRentalForm({...rentalForm, prenom: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={rentalForm.email}
                      onChange={(e) => setRentalForm({...rentalForm, email: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={rentalForm.telephone}
                      onChange={(e) => setRentalForm({...rentalForm, telephone: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Détails de la réservation */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">2</span>
                  Détails de la réservation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de début *</label>
                    <input
                      type="date"
                      required
                      value={rentalForm.dateDebut}
                      onChange={(e) => setRentalForm({...rentalForm, dateDebut: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={rentalForm.dateFin}
                      onChange={(e) => setRentalForm({...rentalForm, dateFin: e.target.value})}
                      min={rentalForm.dateDebut || new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de personnes</label>
                    <input
                      type="number"
                      min="1"
                      value={rentalForm.nombrePersonnes}
                      onChange={(e) => setRentalForm({...rentalForm, nombrePersonnes: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder={`Max: ${selectedSalle.capacityMax || '?'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d'événement</label>
                    <select
                      value={rentalForm.typeEvenement}
                      onChange={(e) => setRentalForm({...rentalForm, typeEvenement: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="mariage">Mariage</option>
                      <option value="anniversaire">Anniversaire</option>
                      <option value="bapteme">Baptême</option>
                      <option value="conference">Conférence</option>
                      <option value="seminaire">Séminaire</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">3</span>
                  Message (optionnel)
                </h4>
                <textarea
                  value={rentalForm.message}
                  onChange={(e) => setRentalForm({...rentalForm, message: e.target.value})}
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                  placeholder="Précisez vos besoins ou questions..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      Soumettre la demande
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Nous vous contacterons dans les 24h pour confirmer votre réservation
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salles;
