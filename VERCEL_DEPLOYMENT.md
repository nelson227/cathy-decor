# 🚀 Guide de Déploiement Vercel - Cathy Décor

Ce guide vous aidera à déployer l'application Cathy Décor sur Vercel.

## ✅ Prérequis

- Compte Vercel (https://vercel.com)
- Repo GitHub connecté (✅ Déjà fait)
- Variables d'environnement prêtes

## 📋 Étapes de Déploiement

### 1. **Connecter à Vercel**

1. Allez sur https://vercel.com/new
2. Cliquez "Continue with GitHub"
3. Recherchez et sélectionnez `cathy-decor`
4. Cliquez "Import"

### 2. **Configurer les Variables d'Environnement**

Avant de déployer, ajoutez les variables dans le tableau **Environment Variables** :

#### Frontend (Vite)
```
VITE_API_URL=https://cathy-decor-backend.vercel.app
VITE_API_BASE_URL=/api
VITE_WHATSAPP_NUMBER=+212XXXXXXXXX
```

#### Backend (Node.js)
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://cathy-decor.vercel.app

# Database
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/cathy-decor

# JWT
JWT_SECRET=your_production_secret_key_here_change_this

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 3. **Étapes de Build**

Vercel détectera automatiquement la structure monorepo et :
- Installera les dépendances
- Buildera le frontend (Vite → HTML/CSS/JS)
- Déploiera le backend comme serverless function
- Creera des URLs de déploiement

### 4. **Déploiement Initial**

1. Cliquez "Deploy"
2. Attendez que le build se termine (~3-5 minutes)
3. Obtenez votre URL : `https://cathy-decor.vercel.app`

## 🔗 Configuration Recommandée

### Frontend Deploy
- **Framework**: Auto-detected (Vite)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend Deploy (Serverless Functions)
- **Root Directory**: `backend`
- **Functions**: `/api/**`

## 📝 Variables d'Environnement en Production

### Obtenir les Credentials

#### MongoDB Atlas
1. Créez un account sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit
3. Copiez la chaîne de connexion
4. Remplacez `username:password` par vos identifiants

#### Cloudinary
1. Allez sur https://cloudinary.com
2. Inscrivez-vous (gratuit avec limites)
3. Allez au Dashboard → Settings
4. Copiez: Cloud Name, API Key, API Secret

#### Twilio (WhatsApp)
1. Allez sur https://www.twilio.com
2. Créez un account
3. Vérifiez votre numéro WhatsApp Business
4. Obtenez Account SID et Auth Token

## 🧪 Tester Après Déploiement

```bash
# Test Frontend
curl https://cathy-decor.vercel.app

# Test Backend Health
curl https://cathy-decor-api.vercel.app/health

# Test Login
curl -X POST https://cathy-decor-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cathyDecor.com",
    "password": "Admin123"
  }'
```

## 🔄 Mise à Jour Automatique

Chaque push sur la branche `main` déclenche un redéploiement automatique.

```bash
# Pour faire un commit et push
git add .
git commit -m "feat: your changes"
git push origin main
```

## ⚙️ Post-Déploiement

1. **Mise à jour de l'environnement frontend**:
   - Dans `frontend/src/services/api.js`, changez les URLs API
   - Redéployez le frontend

2. **SSL/HTTPS**: Vercel fournit automatiquement un certificat SSL

3. **Custom Domain** (optionnel):
   - Allez dans Vercel Project Settings → Domains
   - Ajoutez votre domaine personnalisé
   - Suivez les instructions DNS

4. **Analytics & Logs**:
   - Dashbooard Vercel → Analytics
   - Dashbooard Vercel → Logs

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Build fails | Vérifiez les env vars et les dépendances |
| API not working | Vérifiez MONGODB_URI + JWT_SECRET |
| Images not loading | Vérifiez CLOUDINARY credentials |
| 404 errors | Les routes frontend aren't configured |
| Timeout | Augmentez le timeout dans vercel.json |

## 📚 Documentation Supplémentaire

- [Vercel Docs](https://vercel.com/docs)
- [Guide Monorepo](https://vercel.com/docs/concepts/monorepos)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎯 Prochaines Étapes

1. ✅ Push sur GitHub
2. 📦 Déployer frontend sur Vercel
3. 🔌 Déployer backend sur Vercel
4. 🔐 Configurer variables d'environnement
5. 🧪 Tester en production
6. 🚀 Lancer le site !

---

**Besoin d'aide ?** Consultez le README racine ou la documentation du projet.
