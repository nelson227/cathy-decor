import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiUsers, FiMessageSquare, FiSend, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

function Services() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    nombreInvites: '',
    theme: '',
    lieu: '',
    date: '',
    description: ''
  });

  // Services par défaut (fallback)
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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services?limit=100');
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
        console.log('✅ Services chargés:', response.data.length);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch (error) {
      console.error('Erreur fetch services:', error);
      // Fallback to default services
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const openQuoteModal = (service) => {
    setSelectedService(service);
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      nombreInvites: '',
      theme: '',
      lieu: '',
      date: '',
      description: ''
    });
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    document.body.style.overflow = 'auto';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [sending, setSending] = useState(false);

  const handleSubmitQuote = async () => {
    setSending(true);
    try {
      const response = await api.post('/whatsapp/send-quote', {
        serviceName: selectedService?.name,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        date: formData.date,
        nombreInvites: formData.nombreInvites,
        theme: formData.theme,
        lieu: formData.lieu,
        description: formData.description
      });
      toast.success(response.message || 'Demande envoyée avec succès !');
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-12 mb-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-lg text-gray-300">
            Une gamme complète pour vos événements mémorables
          </p>
        </div>
      </section>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Image Header */}
              <div className="h-72 bg-gradient-to-r from-gold/10 to-sky-light/10 flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>

              {/* Title overlay on image */}
              <div className="relative -mt-12 mx-6 bg-white rounded-lg shadow-lg p-4 z-10 border-b-4 border-gold">
                <h3 className="text-2xl font-bold text-dark text-center">{service.name}</h3>
              </div>

              {/* Content */}
              <div className="p-6 pt-2">
                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* Includes */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm mb-2 text-gold">Inclus:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-gold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button 
                  className="w-full btn-primary"
                  onClick={() => openQuoteModal(service)}
                >
                  Demander un devis
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-16 bg-gold/10 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Service personnalisé</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Vous ne trouvez pas le service que vous recherchez? Contactez-nous pour un package sur mesure.
          </p>
          <a href="/contact" className="btn-primary">
            Contactez-nous
          </a>
        </section>
      </div>

      {/* Quote Request Modal */}
      {showModal && selectedService && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gold to-sky-light p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">Demande de Devis</h2>
                  <p className="text-white/80 mt-1">Service: {selectedService.name}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Service Info (readonly) */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Type d'événement</p>
                <p className="font-bold text-dark text-lg">{selectedService.name}</p>
                <p className="text-gold font-semibold mt-1">{selectedService.price}</p>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline mr-1" /> Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Votre prénom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiPhone className="inline mr-1" /> Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de l'événement
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUsers className="inline mr-1" /> Nombre d'invités
                  </label>
                  <input
                    type="number"
                    name="nombreInvites"
                    value={formData.nombreInvites}
                    onChange={handleInputChange}
                    placeholder="Ex: 150"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thème souhaité
                </label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  placeholder="Ex: Romantique, Moderne, Champêtre..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiMapPin className="inline mr-1" /> Lieu de l'événement
                </label>
                <input
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                  placeholder="Adresse ou nom du lieu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiMessageSquare className="inline mr-1" /> Description de votre besoin
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre projet, vos attentes, vos inspirations..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuote}
                disabled={!formData.nom || !formData.prenom || !formData.telephone || sending}
                className="w-full bg-gold hover:bg-gold/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {sending ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Envoi en cours...</>
                ) : (
                  <><FiSend size={20} /> Envoyer la demande</>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Votre demande sera traitée et nous vous recontacterons rapidement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
