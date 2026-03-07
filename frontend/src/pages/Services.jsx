import React from 'react';

function Services() {
  const services = [
    {
      id: 1,
      name: 'Décoration événementielle',
      description: 'Transformation complète de votre espace avec nos services de décoration premium.',
      includes: ['Conception du design', 'Installation', 'Démontage', 'Coordination'],
      price: 'À partir de 2000 DH'
    },
    {
      id: 2,
      name: 'Organisation d\'événements',
      description: 'Gestion complète de votre événement de A à Z.',
      includes: ['Planning', 'Coordination vendors', 'Logistique', 'Suivi jour J'],
      price: 'À partir de 5000 DH'
    },
    {
      id: 3,
      name: 'Décoration de mariage',
      description: 'Services spécialisés pour mariages - bride et groom packages.',
      includes: ['Décor salle', 'Table de mariage', 'Arche florale', 'Détails personnalisés'],
      price: 'À partir de 3500 DH'
    },
    {
      id: 4,
      name: 'Décoration funéraire',
      description: 'Services respectueux et dignifiés pour cérémonies funéraires.',
      includes: ['Arrangement floral', 'Éclairage sobre', 'Draperies', 'Coordination'],
      price: 'À partir de 1500 DH'
    },
    {
      id: 5,
      name: 'Service traiteur',
      description: 'Partenaires traiteur pour repas et cocktails.',
      includes: ['Menu personnalisé', 'Service', 'Matériel', 'Chef pâtissier'],
      price: 'À partir de 150 DH/personne'
    },
    {
      id: 6,
      name: 'Location de matériel',
      description: 'Tables, chaises, éclairage, sons et décors.',
      includes: ['Livraison', 'Installation', 'Reprise', 'Support technique'],
      price: 'À partir de 500 DH'
    },
    {
      id: 7,
      name: 'Planification complète',
      description: 'Consultation et planification pour votre événement sur mesure.',
      includes: ['Consultation gratuite', 'Devis détaillé', 'Timeline', 'Follow-up'],
      price: 'Gratuit'
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
              {/* Header */}
              <div className="h-32 bg-gradient-to-r from-gold to-rose flex items-center p-6">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
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

                {/* Price */}
                <div className="border-t pt-4 mb-4">
                  <p className="text-lg font-bold text-gold">{service.price}</p>
                </div>

                {/* CTA */}
                <button className="w-full btn-primary">
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
    </div>
  );
}

export default Services;
