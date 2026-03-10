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
    console.log('🔍 [AdminLogin] useEffect - user:', user);
    console.log('🔍 [AdminLogin] useEffect - user?.role:', user?.role);
    
    if (user && user.role === 'admin') {
      console.log('✅ [AdminLogin] User is admin, redirecting to /admin');
      navigate('/admin');
    } else {
      console.log('❌ [AdminLogin] Not admin or no user');
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
      console.log('📥 Réponse API complète:', JSON.stringify(response, null, 2));
      console.log('   - success:', response?.success);
      console.log('   - data:', response?.data);
      console.log('   - data.role:', response?.data?.role);
      console.log('   - token:', response?.token ? '✅ présent' : '❌ absent');

      // Vérification stricte
      if (!response?.success) {
        console.error('❌ success est false');
        toast.error(response?.message || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      if (!response?.data?.role) {
        console.error('❌ Pas de role dans response.data');
        toast.error('Données utilisateur invalides');
        setLoading(false);
        return;
      }

      if (response.data.role !== 'admin') {
        console.error('❌ Role n\'est pas admin:', response.data.role);
        toast.error('Accès administrateur requis');
        setLoading(false);
        return;
      }

      if (!response?.token) {
        console.error('❌ Token manquant');
        toast.error('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      console.log('✅ Tous les checks passent, mise à jour du store...');
      
      // Update auth store
      login(response.data, response.token);
      console.log('✅ Store mis à jour');
      console.log('   - user state:', response.data);
      console.log('   - localStorage token:', localStorage.getItem('cathy-auth-token') ? '✅' : '❌');
      
      toast.success('Connexion réussie!');
      
      // Navigate with error handling
      console.log('🔀 Navigation vers /admin...');
      try {
        navigate('/admin');
        console.log('✅ Navigation réussie');
      } catch (navError) {
        console.error('❌ Erreur navigation:', navError);
        toast.error('Erreur lors de la redirection');
      }
      
    } catch (error) {
      console.error('❌ ERREUR CATCH:', error);
      console.error('   - error.response:', error?.response);
      console.error('   - error.message:', error?.message);
      console.error('   - error.stack:', error?.stack);
      
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion';
      console.error('   - Message final:', message);
      toast.error(message);
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
