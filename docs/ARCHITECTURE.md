# Architecture Technique - Cathy Décor

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     UTILISATEURS                                 │
│                   (Navigateurs Web)                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL (CDN Global)                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              FRONTEND - React + Vite                       │  │
│  │  • Pages: Home, Portfolio, Marketplace, Services, Salles   │  │
│  │  • Admin Dashboard                                         │  │
│  │  • Upload direct vers Cloudinary                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ API REST (HTTPS)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAILWAY                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              BACKEND - Express.js + Sequelize              │  │
│  │  • Routes API                                              │  │
│  │  • Authentification JWT                                    │  │
│  │  • Validation des données                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                           │  │
│  │  • Users, Decorations, Services, Salles, Produits          │  │
│  │  • Commandes, Testimonials, Favorites                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUDINARY (CDN)                             │
│  • Stockage des images                                           │
│  • Transformations automatiques (WebP, resize)                   │
│  • Upload direct depuis le navigateur (preset non signé)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend (React + Vite)

### Structure des dossiers

```
frontend/src/
├── pages/                    # Pages principales
│   ├── Home.jsx             # Accueil
│   ├── Portfolio.jsx        # Galerie projets + demande devis
│   ├── Marketplace.jsx      # Catalogue produits
│   ├── Services.jsx         # Services proposés
│   ├── Salles.jsx           # Salles partenaires + réservation
│   ├── About.jsx            # À propos
│   ├── Contact.jsx          # Contact
│   ├── Cart.jsx             # Panier
│   └── AdminLogin.jsx       # Connexion admin
│
├── components/               # Composants réutilisables
│   ├── Header.jsx           # Navigation
│   ├── Footer.jsx           # Pied de page
│   ├── AdminDashboard.jsx   # Dashboard admin complet
│   ├── AdminProducts.jsx    # Gestion décorations
│   ├── AdminProduits.jsx    # Gestion produits marketplace
│   ├── AdminSalles.jsx      # Gestion salles
│   ├── AdminOrders.jsx      # Gestion commandes
│   ├── AdminStats.jsx       # Statistiques
│   ├── ProductCard.jsx      # Carte produit
│   ├── ImageUploader.jsx    # Upload images
│   └── MiniCart.jsx         # Mini panier
│
├── hooks/                    # Hooks React personnalisés
│   ├── index.js             # useAuth, useCart, useFavorites
│   └── useImageUpload.js    # Upload direct Cloudinary
│
├── services/
│   └── api.js               # Instance Axios configurée
│
└── store/                    # State management (Zustand)
    └── ...                  # Stores pour cart, auth, favorites
```

### Technologies Frontend

| Technologie | Usage |
|-------------|-------|
| **React 18** | Framework UI |
| **Vite** | Build tool rapide |
| **Tailwind CSS** | Styles utilitaires |
| **React Router** | Navigation SPA |
| **Zustand** | State management |
| **Axios** | Requêtes HTTP |
| **React Hot Toast** | Notifications |
| **React Icons** | Icônes |

### Flux d'upload d'images

```
1. User sélectionne image
        │
        ▼
2. useImageUpload hook
        │
        ▼
3. Upload direct vers Cloudinary
   (sans passer par le backend)
   URL: https://api.cloudinary.com/v1_1/dc9z1q1c8/image/upload
   Preset: cathy_decor_unsigned
        │
        ▼
4. Cloudinary retourne URL
        │
        ▼
5. URL sauvée en base via API backend
```

---

## Backend (Express.js + Sequelize)

### Structure des dossiers

```
backend/src/
├── server.js                 # Point d'entrée
│
├── config/
│   ├── database.js          # Config MongoDB (legacy)
│   └── sequelize.js         # Config PostgreSQL/SQLite
│
├── models/                   # Modèles Sequelize
│   ├── User.js              # Utilisateurs/admins
│   ├── Decoration.js        # Projets portfolio
│   ├── Produit.js           # Produits marketplace
│   ├── Salle.js             # Salles partenaires
│   ├── Commande.js          # Commandes clients
│   ├── Testimonial.js       # Témoignages
│   └── Favorite.js          # Favoris
│
├── routes/                   # Routes API
│   ├── auth.js              # Authentification
│   ├── decorations.js       # CRUD décorations
│   ├── services.js          # CRUD services
│   ├── salles.js            # CRUD salles
│   ├── produits.js          # CRUD produits
│   ├── commandes.js         # Gestion commandes
│   ├── testimonials.js      # Témoignages
│   ├── favorites.js         # Favoris
│   ├── stats.js             # Statistiques admin
│   └── upload.js            # Upload images (legacy)
│
├── middleware/
│   ├── auth.js              # Vérification JWT
│   ├── upload.js            # Multer config
│   └── validation.js        # Validation données
│
├── services/
│   ├── cloudinaryService.js # Intégration Cloudinary
│   ├── localStorageService.js # Stockage local (dev)
│   └── whatsappService.js   # Messages WhatsApp
│
└── utils/
    └── errors.js            # Gestion erreurs
```

### Base de données

**Production**: PostgreSQL sur Railway  
**Développement**: SQLite local (`backend/data/cathy-decor.db`)

La connexion est automatique via Sequelize:
- Si `DATABASE_URL` existe → PostgreSQL
- Sinon → SQLite local

---

## Sécurité

### Authentification JWT

```javascript
// Header requis pour routes admin
Authorization: Bearer eyJhbGc...
```

### Middleware

1. **CORS** - Origines autorisées uniquement
2. **Helmet** - Headers de sécurité
3. **Rate Limiting** - Protection anti-spam
4. **Validation** - Validation des entrées

---

## Variables d'environnement

### Backend (.env)

```env
# Serveur
PORT=5000
NODE_ENV=development|production

# Base de données
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentification
JWT_SECRET=secret_très_long_et_complexe

# Cloudinary
CLOUDINARY_NAME=dc9z1q1c8
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Frontend
FRONTEND_URL=https://cathy-decor.vercel.app
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Déploiement

| Service | Plateforme | Configuration |
|---------|------------|---------------|
| Frontend | Vercel | Auto-deploy depuis GitHub |
| Backend | Railway | Auto-deploy depuis GitHub |
| Database | Railway | PostgreSQL managed |
| Images | Cloudinary | CDN global |

Voir [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) pour le guide complet.
