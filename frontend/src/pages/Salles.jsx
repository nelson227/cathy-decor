import React from 'react';
import { FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';

function Salles() {
  const salles = Array(6).fill(0).map((_, i) => ({
    id: i + 1,
    name: `Salle ${i + 1} - ${['Le Grand Palais', 'Villa Royale', 'Riad Luxe', 'Château Élégance', 'Oasis Prestige', 'Palais Or'][i]}`,
    city: ['Marrakech', 'Casablanca', 'Fès', 'Agadir', 'Rabat', 'Tanger'][i],
    capacity: 50 + (i * 30),
    pricePerHour: 500 + (i * 100),
    pricePerDay: 3000 + (i * 500),
    amenities: ['WiFi', 'Parking', 'Climatisé', 'Cuisine', 'Espace extérieur'],
    image: null
  }));

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salles.map((salle) => (
            <div key={salle.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-gold/30 to-gold/10 overflow-hidden flex items-center justify-center">
                {salle.image ? (
                  <img src={salle.image} alt={salle.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-2">🏛️</div>
                    <p className="text-sm text-gray-600">{salle.name.split(' - ')[1] || 'Salle'}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{salle.name}</h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FiMapPin size={18} className="text-gold" />
                  <span>{salle.city}</span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-gold" />
                      <span className="text-sm">Capacité</span>
                    </div>
                    <span className="font-bold">{salle.capacity} personnes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-gold" />
                      <span className="text-sm">Prix</span>
                    </div>
                    <span className="font-bold">{salle.pricePerDay} DH/jour</span>
                  </div>
                </div>

                {/* Amenities */}
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

                {/* CTA */}
                <button className="w-full btn-primary">
                  Voir détails & Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Salles;
