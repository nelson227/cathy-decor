import React, { useState } from 'react';
import { FiTrash2, FiMinus, FiPlus, FiSend } from 'react-icons/fi';
import { useCart } from '../hooks';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    guests: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [sending, setSending] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.eventDate || cart.items.length === 0) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setSending(true);
    try {
      const response = await api.post('/whatsapp/send-order', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        guests: formData.guests,
        notes: formData.notes,
        items: cart.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: cart.getTotal()
      });
      toast.success(response.message || 'Commande envoyée avec succès !');
      cart.clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">Explorez notre marketplace pour ajouter des articles</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn-primary"
          >
            Retour à la marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              {/* Header */}
              <div className="bg-gold/10 px-6 py-4 border-b flex justify-between items-center">
                <span className="font-bold">{cart.items.length} article(s) dans le panier</span>
              </div>

              {/* Items List */}
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-gold font-bold text-lg">
                        {(item.price * item.quantity).toLocaleString('fr-FR')} DH
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.price.toLocaleString('fr-FR')} DH x {item.quantity}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-200 transition"
                      >
                        <FiMinus size={18} />
                      </button>
                      <span className="px-3 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-200 transition"
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => cart.removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition p-2"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleCheckout} className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Commander</h2>

              {/* Summary */}
              <div className="bg-white p-4 rounded mb-6 border-2 border-gold">
                <div className="flex justify-between mb-3">
                  <span>Sous-total</span>
                  <span className="font-bold">{cart.getTotal().toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span>Taxes</span>
                  <span className="font-bold">TTC</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="text-gold font-bold">{cart.getTotal().toLocaleString('fr-FR')} DH</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Nom *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Type d'événement *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="mariage">Mariage</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="bapteme">Baptême</option>
                    <option value="corporate">Corporate</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Date de l'événement *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Lieu de l'événement *</label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Nombre d'invités</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Notes spéciales</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded outline-none focus:border-gold resize-none"
                  />
                </div>

                <button type="submit" disabled={sending} className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending ? (
                    <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Envoi en cours...</>
                  ) : (
                    <><FiSend size={18} /> Envoyer la commande</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/marketplace')}
                  className="w-full btn-secondary py-2"
                >
                  Continuer les achats
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
