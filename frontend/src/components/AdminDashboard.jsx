import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminStats from './AdminStats';
import AdminSalles from './AdminSalles';
import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'stats', label: 'Tableau de bord', icon: '📊' },
    { id: 'products', label: 'Décorations', icon: '🎨' },
    { id: 'salles', label: 'Salles', icon: '🏢' },
    { id: 'orders', label: 'Commandes', icon: '📦' }
  ];

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h1>Admin - Cathy Décor</h1>
          </div>
          <div className="admin-user-info">
            <span>{user?.name}</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="admin-main">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="admin-content">
          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'salles' && <AdminSalles />}
          {activeTab === 'orders' && <AdminOrders />}
        </main>
      </div>
    </div>
  );
}
