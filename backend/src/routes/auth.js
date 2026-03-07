import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'cathy-decor-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// LOGIN - Simple et robuste
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n========== LOGIN ==========');
    console.log('Email:', email);
    console.log('Password:', password ? '(fourni)' : '(manquant)');

    // Validation
    if (!email || !password) {
      console.log('❌ Email ou password manquant');
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Chercher utilisateur
    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: emailLower } });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ User trouvé:', user.email, 'role:', user.role);

    // Vérifier admin
    if (user.role !== 'admin') {
      console.log('❌ Pas admin');
      return res.status(403).json({
        success: false,
        message: 'Accès administrateur requis'
      });
    }

    // Vérifier actif
    if (!user.active) {
      console.log('❌ Compte désactivé');
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été désactivé'
      });
    }

    // Comparer password
    console.log('🔑 Vérification password...');
    const isValid = await bcryptjs.compare(password, user.password);
    console.log('   Résultat:', isValid ? '✅ OK' : '❌ FAIL');

    if (!isValid) {
      console.log('❌ Password invalide');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour lastLogin
    await user.update({ lastLogin: new Date() });

    // Générer token
    const token = generateToken(user.id, user.role);

    console.log('✅ LOGIN RÉUSSI');
    console.log('==========================\n');

    return res.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.log('==========================\n');
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// TEST - Vérifier admin
router.get('/test', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: 'admin@cathyDecor.com' }
    });

    if (!user) {
      return res.json({ success: false, message: 'Admin NOT FOUND' });
    }

    const isValid = await bcryptjs.compare('Admin123', user.password);

    return res.json({
      success: true,
      admin: {
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active
      },
      passwordTest: { password: 'Admin123', match: isValid }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
