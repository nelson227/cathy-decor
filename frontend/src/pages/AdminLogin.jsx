import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks';
import api from '../services/api';
import toast from 'react-hot-toast';
import '../styles/auth.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in and is admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Email et mot de passe requis');
      return;
    }

    try {
      setLoading(true);
      console.log('📤 Envoi login:', formData);
      
      const response = await api.post('/auth/login', formData);
      console.log('📥 Réponse API:', response);
      console.log('   - success:', response.success);
      console.log('   - data:', response.data);
      console.log('   - token:', response.token ? '✅ présent' : '❌ absent');

      if (response.success && response.data?.role === 'admin') {
        console.log('✅ Connexion valide, sauvegarde...');
        console.log('   User data:', response.data);
        
        // Update auth store (sauvegarde aussi dans localStorage)
        login(response.data, response.token);
        console.log('✅ Store mis à jour, naviguer...');
        
        toast.success('Connexion réussie!');
        // Navigate immédiatement sans timeout
        navigate('/admin');
      } else if (response.success) {
        console.log('❌ Pas d\'accès admin');
        toast.error('Accès administrateur requis');
      } else {
        console.log('❌ success=false');
        toast.error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.log('❌ Erreur:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Logo/Brand */}
        <div className="auth-header">
          <h1 className="auth-title">💎 Cathy Décor</h1>
          <p className="auth-subtitle">Espace Admin</p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FiMail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@cathyDecor.com"
              className="form-input"
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FiLock size={18} />
              <span>Mot de passe</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? '🔄 Connexion...' : '🔓 Se Connecter'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="auth-info">
          <p className="info-title">🔑 Identifiants de référence:</p>
          <div className="demo-credentials">
            <p><strong>Email:</strong> admin@cathyDecor.com</p>
            <p><strong>Mot de passe:</strong> Admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>Accès réservé aux administrateurs</p>
          <a href="/" className="back-link">← Retour à l'accueil</a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="auth-decoration">
        <div className="decoration-circle deco-1"></div>
        <div className="decoration-circle deco-2"></div>
        <div className="decoration-circle deco-3"></div>
      </div>
    </div>
  );
}
