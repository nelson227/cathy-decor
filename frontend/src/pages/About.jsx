import React from 'react';
import { FiAward, FiUsers, FiHeart } from 'react-icons/fi';

function About() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos de Cathy Décor</h1>
          <p className="text-lg text-gray-300">Une histoire de passion et de dévouement à vos événements</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">Notre Histoire</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Cathy Décor a été fondée en 2010 par Cathy avec une vision simple mais puissante : transformer chaque événement en un moment inoubliable grâce à une décoration exquise.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Pendant plus d'une décennie, nous avons travaillé avec des milliers de clients satisfaits, créant des mariages de rêve, des anniversaires mémorables et des événements corporatifs exceptionnels.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Notre engagement envers l'excellence et l'innovation nous a permis de devenir les décorateurs de référence dans la région.
              </p>
            </div>
            <div className="h-96 bg-gradient-to-br from-gold to-rose rounded-lg"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y">
            <div className="text-center">
              <div className="text-5xl font-bold text-gold mb-2">1000+</div>
              <p className="text-gray-600">Événements réalisés</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold mb-2">98%</div>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold mb-2">15+</div>
              <p className="text-gray-600">Années d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <FiHeart className="text-gold text-4xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Notre Mission</h3>
              <p className="text-gray-600">
                Transformer vos rêves en réalité en fournissant des services de décoration de classe mondiale et une expérience client inégalée.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <FiAward className="text-gold text-4xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nos Valeurs</h3>
              <p className="text-gray-600">
                Créativité, Excellence, Intégrité, Respect et Innovation. Chaque décision que nous prenons reflète ces valeurs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <FiUsers className="text-gold text-4xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Notre Équipe</h3>
              <p className="text-gray-600">
                Une équipe passionnée de décorateurs, designers et coordinateurs dédiés à votre satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Cathy', 'Designer', 'Coordinateur', 'Technicien'].map((role, i) => (
              <div key={i} className="text-center">
                <div className="h-48 bg-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Photo</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{role === 'Cathy' ? 'Cathy' : `${role} ${i}`}</h3>
                <p className="text-gray-600 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold/10">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre projet?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons rendre votre événement mémorable.
          </p>
          <a href="/contact" className="btn-primary">
            Demander une consultation
          </a>
        </div>
      </section>
    </div>
  );
}

export default About;
