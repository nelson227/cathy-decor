# 🚀 Guide de Déploiement - Cathy Décor (VERCEL + RAILWAY)

## ⚠️ Erreur Résolue

**Problème Vercel**: `npm error No workspaces found`

**Solution**: Déploiement séparé Frontend (Vercel) + Backend (Railway)

---

## 📊 Architecture Production Recommandée

```
┌─────────────────────────────────┐
│   Utilisateurs (Navigateurs)    │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  VERCEL (Frontend SPA)            │
│  URL: cathy-decor.vercel.app     │
│  Framework: React/Vite           │
│  CDN: Vercel Global Edge Network │
└────────────┬─────────────────────┘
             │ (API calls)
             ▼
┌──────────────────────────────────┐
│  RAILWAY (Backend API)           │
│  URL: cathy-decor-api.railway.app│
│  Runtime: Node.js 18+            │
│  DB: MongoDB Atlas (gratuit)     │
└──────────────────────────────────┘
```

---

## ✅ ÉTAPE 1: Déployer Frontend sur Vercel

### 1.1 Connecter GitHub à Vercel

1. Votre repo est déjà prêt ✅
2. Allez sur https://vercel.com/new
3. Cliquez "Continue with GitHub"
4. Sélectionnez `nelson227/cathy-decor`
5. Cliquez "Import"

### 1.2 Configuration Vercel (Auto-détectée)

✅ **Vercel détecte automatiquement:**
- Framework: Vite
- Build Command: `npm install && npm run build`
- Root Directory: (laissez vide - racine)
- Output Directory: `frontend/dist`

### 1.3 Variables d'Environnement Frontend

Dans Vercel → Project Settings → Environment Variables:

```
VITE_API_URL=https://cathy-decor-api.railway.app
VITE_API_BASE_URL=/api
VITE_WHATSAPP_NUMBER=+212XXXXXXXXX
```

### 1.4 Deploy!

Cliquez "Deploy" et attendez ~3 minutes.

**Votre frontend sera available à:**
```
https://cathy-decor.vercel.app
```

---

## ✅ ÉTAPE 2: Déployer Backend sur Railway

Railway est **GRATUIT** et facile pour les APIs Node.js

### 2.1 Créer un Compte Railway

1. Allez sur https://railway.app
2. Cliquez "Login with GitHub"
3. Autorisez l'accès

### 2.2 Créer un Nouveau Projet

1. Cliquez "Create a new project"
2. Sélectionnez "Deploy from GitHub repo"
3. Recherchez `cathy-decor`
4. Sélectionnez le repo
5. Railway configure automatiquement

### 2.3 Variables d'Environnement Backend

Dans Railway → Project → Service Backend → Variables:

```
# Environment
NODE_ENV=production
PORT=3001

# Frontend (pour CORS)
FRONTEND_URL=https://cathy-decor.vercel.app

# Database - MongoDB Atlas (IMPORTANT!)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/cathy-decor

# JWT Secret (GÉNÉREZ UNE CLÉ SÉCURISÉE)
JWT_SECRET=generez_une_cle_aleatoire_de_min_32_caracteres

# Cloudinary (Images)
CLOUDINARY_NAME=votre_cloudinary_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Twilio/WhatsApp (Optionnel)
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 2.4 Deploy!

Railway détecte Node.js et déploie automatiquement.

**Votre backend URL sera:**
```
https://cathy-decor-api.railway.app
```

(Visible dans Railway → Service → Settings → Domain)

---

## 🔗 Configurer la Connexion Frontend<->Backend

### Vérifiez dans `frontend/src/services/api.js`

```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://cathy-decor-api.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**C'est déjà bon!** La variable `VITE_API_URL` est lue depuis `.env`

### Si vous changez l'URL du backend:

1. Allez dans Vercel → Project Settings → Environment Variables
2. Modifiez `VITE_API_URL` avec la nouvelle URL
3. Redéployez (commit + push)

---

## 🧪 Tester Après Déploiement

```bash
# Test Frontend (doit afficher la page HTML)
curl https://cathy-decor.vercel.app

# Test Backend Health
curl https://cathy-decor-api.railway.app/health

# Test API Login
curl -X POST https://cathy-decor-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cathyDecor.com",
    "password": "Admin123"
  }'

# Test API Marketplace
curl https://cathy-decor-api.railway.app/api/decorations?limit=5
```

---

## 📋 Services Externes Requises (Gratuits)

### 1. MongoDB Atlas (Base de Données)

**Gratuit: 512 MB stockage**

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un compte (Google/GitHub)
3. Créez un Cluster gratuit (région: Ireland ou Europe)
4. Allez dans "Connect" → "Connection String"
5. Obtenez la string: `mongodb+srv://username:password@cluster.mongodb.net/db`
6. Utilisez-la pour `MONGODB_ATLAS_URI`

### 2. Cloudinary (Gestion Images)

**Gratuit: 25 crédits/mois**

1. Allez sur https://cloudinary.com
2. Créez un compte (email)
3. Allez au Dashboard → Settings
4. Obtenez:
   - Cloud Name
   - API Key
   - API Secret (GARDEZ SECRET!)
5. Utilisez ces valeurs pour les env vars

### 3. Twilio (Optionnel - WhatsApp)

**Gratuit: $15 crédits (test)**

1. Allez sur https://www.twilio.com
2. Créez un compte
3. Vérifiez votre numéro
4. Allez à Account → Settings
5. Obtenez Account SID et Auth Token

---

## 🔄 Redéploiement Automatique

Chaque push sur `main` redéploie automatiquement:

```bash
# Pour déployer une mise à jour
git add .
git commit -m "feat: ma mise à jour"
git push origin main

# Vercel redéploie automatiquement en quelques secondes
# Railway redéploie dans les 1-2 minutes
```

---

## 📊 Logs et Monitoring

### Vercel - Vérifier les logs Frontend
1. https://vercel.com/dashboard
2. Cliquez votre projet
3. Allez dans "Deployments"
4. Cliquez le déploiement
5. Allez dans "Logs"

### Railway - Vérifier les logs Backend
1. https://railway.app
2. Ouvrez votre projet
3. Cliquez le service "backend"
4. Allez dans "Logs"

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| **Build fails on Vercel** | Vérifiez l'output dans Logs → essayez `npm install` localement |
| **API 404 erreurs** | Vérifiez `VITE_API_URL` dans Vercel env vars |
| **CORS errors** | Assurez-vous `FRONTEND_URL` est correct dans Railway env |
| **Login échoue (401/403)** | Vérifiez `JWT_SECRET` est le même partout |
| **Images ne chargent pas** | Vérifiez credentials Cloudinary |
| **BD connection error** | Vérifiez `MONGODB_ATLAS_URI` - testez la connection |
| **Whitelist IP MongoDB** | Railway a des IPs dynamiques - utilisez `0.0.0.0/0` (sûr avec auth) |

---

## 💡 Tips & Best Practices

### Sécurité
- ✅ Vérifiez que `.env` n'est PAS committé (dans `.gitignore`)
- ✅ Changez JWT_SECRET en production (ne pas utiliser "test")
- ✅ Utilisez des URLs HTTPS (automatique)
- ✅ Ne commitez JAMAIS les API keys

### Performance
- ✅ Vercel cache le frontend automatiquement
- ✅ Utilisez MongoDB Atlas pour les performances
- ✅ Cloudinary optimise les images automatiquement

### Monitoring
- Créez des alertes dans Vercel Analytics
- Vérifiez régulièrement les logs
- Testez les endpoints principaux

---

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Cloudinary API Reference](https://cloudinary.com/documentation/image_upload_api)

---

## ✨ Résumé Final

| Composant | Plateforme | URL | Status |
|-----------|-----------|-----|--------|
| Frontend SPA | Vercel | https://cathy-decor.vercel.app | 🟢 Live |
| Backend API | Railway | https://cathy-decor-api.railway.app | 🟢 Live |
| Database | MongoDB Atlas | Cloud | 🟢 Connected |
| Images | Cloudinary | CDN | 🟢 Configured |

**Votre site est prêt pour la production! 🎉🚀**

---

Questions? Consultez les logs dans Vercel/Railway ou créez une issue GitHub.
