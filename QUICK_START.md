# Guide de Démarrage Rapide - Cathy Décor

## Prérequis

- Node.js 18+
- npm ou yarn
- Git

---

## Installation en 5 minutes

### 1. Cloner le projet

```bash
git clone https://github.com/nelson227/cathy-decor.git
cd cathy-decor-site
```

### 2. Installer les dépendances

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Configuration Backend

Créer `backend/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=mon_secret_jwt_super_long_et_complexe
```

> En développement, SQLite est utilisé automatiquement (pas besoin de PostgreSQL).

### 4. Lancer les serveurs

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Accéder au site

- **Site public:** http://localhost:5173
- **Admin:** http://localhost:5173/admin-login
- **API:** http://localhost:5000/api

---

## Connexion Admin

| Champ | Valeur |
|-------|--------|
| Email | `admin@cathydecor.com` |
| Mot de passe | `Admin123` |

---

## Pages disponibles

| URL | Description |
|-----|-------------|
| `/` | Accueil |
| `/portfolio` | Galerie de décorations + demande de devis |
| `/marketplace` | Catalogue de produits |
| `/services` | Services proposés |
| `/salles` | Salles partenaires + réservation |
| `/about` | À propos |
| `/contact` | Contact |
| `/cart` | Panier |
| `/admin-login` | Connexion admin |
| `/admin` | Dashboard admin (protégé) |

---

## Dashboard Admin

Depuis `/admin`, vous pouvez gérer:

- **Décorations** - Portfolio de projets réalisés
- **Services** - Services proposés
- **Salles** - Salles partenaires
- **Produits** - Marketplace
- **Commandes** - Commandes clients

---

## Upload d'images

Les images sont uploadées directement vers **Cloudinary** depuis le navigateur.

Configuration actuelle:
- **Cloud Name:** `dc9z1q1c8`
- **Preset:** `cathy_decor_unsigned`

Voir [IMAGE_UPLOAD_DOCS.md](./IMAGE_UPLOAD_DOCS.md) pour plus de détails.

---

## Structure des dossiers

```
cathy-decor-site/
├── frontend/          # React + Vite
│   └── src/
│       ├── pages/     # Pages
│       ├── components/# Composants
│       └── hooks/     # Hooks (useImageUpload, etc.)
│
├── backend/           # Express.js + Sequelize
│   └── src/
│       ├── models/    # Modèles BDD
│       ├── routes/    # Routes API
│       └── middleware/# Auth, validation
│
└── docs/              # Documentation
```

---

## Scripts utiles

### Frontend

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
```

### Backend

```bash
npm run dev      # Serveur avec nodemon
npm start        # Serveur production
```

---

## Prochaines étapes

1. **Développement local** - Modifier le code, tester
2. **Déploiement** - Voir [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Documentation API** - Voir [docs/API.md](./docs/API.md)
