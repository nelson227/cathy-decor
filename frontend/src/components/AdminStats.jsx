import { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalSalles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch orders
      const ordersResponse = await api.get('/commandes');
      const orders = ordersResponse.data.data || [];

      // Fetch products
      const productsResponse = await api.get('/decorations');
      const products = productsResponse.data.data || [];

      // Fetch salles
      const sallesResponse = await api.get('/salles');
      const salles = sallesResponse.data.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const completedOrders = orders.filter(o => o.status === 'completed').length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        completedOrders,
        pendingOrders,
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalSalles: Array.isArray(salles) ? salles.length : 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: '#003d82'
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')} DH`,
      icon: FiTrendingUp,
      color: '#228B22'
    },
    {
      title: 'Commandes Complétées',
      value: stats.completedOrders,
      icon: FiCheckCircle,
      color: '#32CD32'
    },
    {
      title: 'En Attente',
      value: stats.pendingOrders,
      icon: FiUsers,
      color: '#FFA500'
    }
  ];

  const resourceCards = [
    {
      title: 'Décorations',
      value: stats.totalProducts,
      icon: '🎨'
    },
    {
      title: 'Salles',
      value: stats.totalSalles,
      icon: '🏢'
    }
  ];

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Tableau de Bord</h2>
      </div>

      {loading ? (
        <p className="loading">Chargement des statistiques...</p>
      ) : (
        <>
          {/* Main Stats */}
          <div className="stats-grid">
            {statCards.map((card, idx) => (
              <div key={idx} className="stat-card" style={{ borderLeftColor: card.color }}>
                <div className="stat-icon" style={{ color: card.color }}>
                  <card.icon size={28} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">{card.title}</p>
                  <p className="stat-value">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="resources-section">
            <h3>Ressources</h3>
            <div className="resource-grid">
              {resourceCards.map((card, idx) => (
                <div key={idx} className="resource-card">
                  <div className="resource-icon">{card.icon}</div>
                  <div className="resource-content">
                    <p>{card.title}</p>
                    <p className="resource-value">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-section">
            <h3>Actions Rapides</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                ➕ Ajouter une décoration
              </button>
              <button className="quick-action-btn">
                ➕ Ajouter une salle
              </button>
              <button className="quick-action-btn">
                📊 Voir toutes les commandes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
