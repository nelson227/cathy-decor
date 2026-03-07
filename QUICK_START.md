# ⚡ Quick Start Guide - Cathy Décor

## 🎯 Session 3 Status: 65% Complete ✅

Le projet **Cathy Décor** a avancé significativement avec l'ajout du système complet d'authentification et d'upload d'images!

### ✅ Session 3 Accomplishments

```
✅ Admin Login Page (JWT authentication)
✅ Database Seeding (20 test items)
✅ Marketplace API Integration (real data)
✅ Cloudinary Image Upload Infrastructure
✅ Image Upload Routes & Components
✅ Complete Documentation + Examples
```

**Progress:** 50% → 65% (+15% overall)

---

## 🚀 Démarrer Rapidement

### 1. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
# Ouvre http://localhost:5173
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer .env (copier depuis .env.example)
# Configurer MongoDB URI et autres variables
cp .env.example .env

# Démarrer le serveur
npm run dev
# Écoute sur http://localhost:5000/health
```

### 3. Variables d'Environnement

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=+212XXXXXXXXX
```

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cathy-decor
JWT_SECRET=your_secret_key_change_in_production

# ⭐ CLOUDINARY (Required for image uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Ajouter autres services (Twilio, Email, etc)
```

---

## 📸 Image Upload - NEW (Session 3)

### Quick Setup (2 min)

```bash
# 1. Get Cloudinary credentials: https://dashboard.cloudinary.com/settings/c/account
# 2. Add to backend/.env
CLOUDINARY_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# 3. Test health endpoint
curl http://localhost:5000/api/upload/health
# Response: { cloudinaryConfigured: true }
```

### Use ImageUploader Component

```jsx
import ImageUploader from '../components/ImageUploader';

<ImageUploader
  folder="products"
  onUpload={(images) => setFormData({...formData, images})}
  multiple={true}
  maxFiles={5}
/>
```

**See:** [IMAGE_UPLOAD_DOCS.md](./IMAGE_UPLOAD_DOCS.md) for full documentation

---

## 📂 Structure Actuelle

```
cathy-decor-site/
├── frontend/                  # Application React
│   ├── src/
│   │   ├── pages/            # Home.jsx
│   │   ├── components/       # Header, Footer
│   │   ├── store/            # Zustand (cart, auth)
│   │   ├── services/         # API client
│   │   └── app.jsx           # Main app
│   ├── package.json          # ✅ Prêt
│   └── vite.config.js        # ✅ Configuré
│
├── backend/                   # API Express
│   ├── src/
│   │   ├── server.js         # ✅ Express setup
│   │   ├── models/           # Prêt pour Mongoose
│   │   ├── routes/           # À implémenter
│   │   ├── controllers/      # À implémenter
│   │   └── services/         # À implémenter
│   └── package.json          # ✅ Prêt
│
├── docs/
│   ├── ARCHITECTURE.md       # 📘 Complet
│   ├── DATABASE.md           # 📘 Schémas
│   └── API.md               # À compléter
│
├── PROGRESSION.md            # 📊 Suivi détaillé
└── README.md                 # 📖 Vue d'ensemble
```

---

## 🔄 Flux de Travail Recommandé

```
1. npm install (frontend + backend)
2. Configurer MongoDB
3. Implémenter les modèles Mongoose
4. Créer les routes et controllers API
5. Créer les pages React (Portfolio, Marketplace, etc)
6. Intégrer Cloudinary pour images
7. Intégrer Twilio pour WhatsApp
8. Dashboard Admin
9. Tests et optimisation
10. Déploiement
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** ⚛️
- **Vite** ⚡ (fast build tool)
- **Tailwind CSS** 🎨
- **Zustand** 📦 (state management)
- **React Router** 🔀
- **Axios** 📡 (HTTP client)

### Backend
- **Node.js** 🟢
- **Express** 🚂
- **MongoDB** 🗄️
- **JWT** 🔐
- **Twilio** 💬 (WhatsApp)
- **Cloudinary** 🖼️ (Images)

---

## 📚 Documentation

| Document | Contenu |
|----------|---------|
| [README.md](./README.md) | Vue d'ensemble projet |
| [PROGRESSION.md](./PROGRESSION.md) | Suivi détaillé des tâches |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Architecture technique complète |
| [docs/DATABASE.md](./docs/DATABASE.md) | Schémas MongoDB détaillés |
| [backend/README.md](./backend/README.md) | Guide démarrage backend |

---

## 🎯 Prochaines Grandes Étapes

### 1️⃣ Configuration (1-2 jours)
- [x] Structure
- [x] Dépendances
- [ ] MongoDB setup
- [ ] Fichiers .env

### 2️⃣ Pages Frontend (3-4 jours)
- [x] Accueil
- [ ] Portfolio
- [ ] Marketplace
- [ ] Contact
- [ ] Services
- [ ] Salles

### 3️⃣ Backend API (3-4 jours)
- [ ] Modèles Mongoose
- [ ] Routes et Controllers
- [ ] Authentification JWT
- [ ] Validation inputs

### 4️⃣ Intégrations (2-3 jours)
- [ ] Cloudinary (images)
- [ ] Twilio (WhatsApp)
- [ ] Emails

### 5️⃣ Dashboard Admin (2-3 jours)
- [ ] Interface CRUD
- [ ] Gestion produits
- [ ] Gestion commandes
- [ ] Analytics

### 6️⃣ Tests & Polish (2-3 jours)
- [ ] Responsive design
- [ ] Performance
- [ ] SEO
- [ ] Sécurité

### 7️⃣ Déploiement (1-2 jours)
- [ ] Frontend → Vercel/Netlify
- [ ] Backend → Heroku/Railway
- [ ] Database → MongoDB Atlas
- [ ] Domaine & SSL

---

## 🐛 Troubleshooting

### Port 5000 déjà utilisé?
```bash
# Trouver le process
netstat -tulpn | grep 5000

# Ou utiliser un autre port
PORT=5001 npm run dev
```

### MongoDB ne se connecte pas?
```bash
# Vérifier MongoDB est en cours d'exécution
mongosh

# Ou utiliser MongoDB Atlas
# Mettre à jour MONGODB_URI dans .env
```

### Npm modules non installés?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Contact & Support

Pour questions ou problèmes:
- Voir PROGRESSION.md pour l'état actuel
- Voir architecture.md pour le design
- Commenter directement dans les fichiers

---

## ✨ À Savoir

- Le projet utilise **ES6+ module syntax** (`import/export`)
- Tailwind CSS est préconfigurés avec couleurs personnalisées (gold, rose, beige)
- Les stores Zustand utilisent `localStorage` pour la persistance
- Les requêtes API utilisent Axios avec intercepteurs pour JWT

---

**Début du développement** : 6 mars 2026  
**Status** : 🟢 Prêt pour développement  
**Prochaine étape** : Implémenter routes API
