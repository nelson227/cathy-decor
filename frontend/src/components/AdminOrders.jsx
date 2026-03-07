import { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: ''
  });

  const [statusUpdate, setStatusUpdate] = useState({
    orderId: null,
    newStatus: ''
  });

  const statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    'in-progress': 'En cours',
    completed: 'Complétée',
    cancelled: 'Annulée'
  };

  const statusColors = {
    pending: '#FFA500',
    confirmed: '#4169E1',
    'in-progress': '#32CD32',
    completed: '#228B22',
    cancelled: '#DC143C'
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/commandes?${params}`);
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = statusUpdate.newStatus || selectedOrder?.status;
    if (!newStatus) return;

    try {
      await api.put(`/commandes/${orderId}`, { status: newStatus });
      toast.success('Statut mis à jour');
      setStatusUpdate({ orderId: null, newStatus: '' });
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des Commandes</h2>
        <p className="total">{orders.length} commandes</p>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="admin-table">
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="empty">Aucune commande</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customer.name}</td>
                  <td>{order.customer.phone}</td>
                  <td>{order.total} DH</td>
                  <td>
                    <span 
                      className="badge"
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn-icon view"
                      onClick={() => setSelectedOrder(order)}
                      title="Détails"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la commande</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="order-section">
                <h4>Client</h4>
                <p><strong>Nom:</strong> {selectedOrder.customer.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                <p><strong>Téléphone:</strong> {selectedOrder.customer.phone}</p>
              </div>

              <div className="order-section">
                <h4>Événement</h4>
                <p><strong>Type:</strong> {selectedOrder.event.type}</p>
                <p><strong>Date:</strong> {formatDate(selectedOrder.event.date)}</p>
                <p><strong>Lieu:</strong> {selectedOrder.event.location}</p>
                <p><strong>Invités:</strong> {selectedOrder.event.guests}</p>
              </div>

              <div className="order-section">
                <h4>Articles ({selectedOrder.items.length})</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Qté</th>
                      <th>Prix</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price} DH</td>
                        <td>{item.price * item.quantity} DH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-section summary">
                <p><strong>Sous-total:</strong> {selectedOrder.subtotal} DH</p>
                <p><strong>Taxe:</strong> {selectedOrder.tax} DH</p>
                <p className="total-price"><strong>Total:</strong> {selectedOrder.total} DH</p>
              </div>

              <div className="order-section">
                <h4>Statut</h4>
                <div className="status-update">
                  <select
                    value={statusUpdate.newStatus || selectedOrder.status}
                    onChange={(e) => setStatusUpdate({...statusUpdate, newStatus: e.target.value})}
                    className="status-select"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(selectedOrder._id)}
                  >
                    <FiCheck /> Mettre à jour
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
