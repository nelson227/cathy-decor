import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    toast.success('Votre message a été envoyé!');
    setFormData({ name: '', email: '', phone: '', eventType: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-300">
            Nous sommes à votre écoute pour tous vos événements
          </p>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="flex gap-4">
              <div className="text-gold text-2xl flex-shrink-0">
                <FiPhone />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Téléphone</h3>
                <p className="text-gray-600">+237 675 036 937</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="text-gold text-2xl flex-shrink-0">
                <FiMail />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-gray-600">tchuenchecatherine@gmail.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4">
              <div className="text-gold text-2xl flex-shrink-0">
                <FiMapPin />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Localisation</h3>
                <p className="text-gray-600">Carrefour Mbog-Abang, Odza</p>
                <p className="text-gray-600">Yaoundé, Cameroun</p>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-lg mb-4">Nous suivre</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gold hover:text-gold/80 transition text-2xl">
                  <FiInstagram />
                </a>
                <a href="#" className="text-gold hover:text-gold/80 transition text-2xl">
                  <FiFacebook />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gold"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gold"
                    placeholder="jean@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gold"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Type d'événement</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gold"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="mariage">Mariage</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="bapteme">Baptême</option>
                    <option value="corporate">Corporate</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gold resize-none"
                  placeholder="Décrivez votre événement..."
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-600">Carte Google Maps à intégrer</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
