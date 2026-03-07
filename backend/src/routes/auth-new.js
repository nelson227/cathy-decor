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

/**
 * ADMIN LOGIN - Simple et robuste
 * POST /api/auth/admin-login
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n========== ADMIN LOGIN ==========');
    console.log('Email reçu:', email);
    console.log('Password reçu:', password ? '(fourni)' : '(manquant)');

    // ✅ ÉTAPE 1: Validation
    if (!email || !password) {
      console.log('❌ Validation échouée: email ou password manquant');
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // ✅ ÉTAPE 2: Chercher l'utilisateur
    const emailLower = email.toLowerCase().trim();
    console.log('Recherche utilisateur:', emailLower);
    
    const user = await User.findOne({ 
      where: { email: emailLower }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active
    });

    // ✅ ÉTAPE 3: Vérifier que c'est un admin
    if (user.role !== 'admin') {
      console.log('❌ Utilisateur n\'est pas admin:', user.role);
      return res.status(403).json({
        success: false,
        message: 'Accès administrateur requis'
      });
    }

    // ✅ ÉTAPE 4: Vérifier que le compte est actif
    if (!user.active) {
      console.log('❌ Compte désactivé');
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été désactivé'
      });
    }

    // ✅ ÉTAPE 5: Comparer les mots de passe
    console.log('Comparaison des mots de passe...');
    console.log('  Hash stocké:', user.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    
    console.log('  Résultat:', isPasswordValid ? '✅ VALIDE' : '❌ INVALIDE');
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // ✅ ÉTAPE 6: Générer le token
    const token = generateToken(user.id, user.role);
    console.log('✅ Token généré');

    // ✅ ÉTAPE 7: Mettre à jour lastLogin
    await user.update({ lastLogin: new Date() });

    // ✅ SUCCÈS!
    console.log('✅ LOGIN RÉUSSI pour:', user.email);
    console.log('==================================\n');

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
    console.error('❌ ERREUR LOGIN:', error);
    console.log('==================================\n');
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur: ' + error.message
    });
  }
});

/**
 * TEST - Vérifier que l'admin existe
 * GET /api/auth/test-admin
 */
router.get('/test-admin', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: 'admin@cathyDecor.com' }
    });

    if (!user) {
      return res.json({
        success: false,
        message: 'Admin NOT FOUND'
      });
    }

    // Tester le mot de passe
    const testPassword = 'Admin123';
    const isValid = await bcryptjs.compare(testPassword, user.password);

    return res.json({
      success: true,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        passwordHash: user.password.substring(0, 20) + '...'
      },
      passwordTest: {
        testedPassword: testPassword,
        isValid: isValid
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
