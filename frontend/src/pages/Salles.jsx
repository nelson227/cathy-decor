import React, { useState, useEffect } from 'react';
import { FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

function Salles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/salles');
      setSalles(response.data || []);
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
                    {salle.capacity && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiUsers className="text-gold" />
                          <span className="text-sm">Capacité</span>
                        </div>
                        <span className="font-bold">{salle.capacity} personnes</span>
                      </div>
                    )}
                    {(salle.pricePerDay || salle.price) && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-gold" />
                          <span className="text-sm">Prix</span>
                        </div>
                        <span className="font-bold">{salle.pricePerDay || salle.price} FCFA/jour</span>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  {salle.amenities && salle.amenities.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-sm mb-2">Équipements</h4>
                      <div className="flex flex-wrap gap-2">
                        {salle.amenities.map((amenity, idx) => (
                          <span key={idx} className="text-xs bg-gold/20 text-dark px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {salle.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{salle.description}</p>
                  )}

                  {/* CTA */}
                  <a href="/contact" className="block w-full btn-primary text-center">
                    Demander un devis
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Salles;
