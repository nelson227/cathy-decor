# Cathy Décor - Plateforme de Décoration Événementielle

Site web complet pour une entreprise de décoration événementielle au Cameroun.

## Fonctionnalités

- **Décorations** - Galerie de projets avec filtres et demande de devis
- **Marketplace** - Catalogue de produits de décoration
- **Services** - Présentation des services (mariage, anniversaire, baptême, funéraire)
- **Salles Partenaires** - Location de salles avec galerie photos et formulaire de réservation
- **Panier** - Ajout au panier et commande via WhatsApp
- **Dashboard Admin** - Gestion complète (produits, services, salles, commandes)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│   Frontend (React + Vite)                               │
│   Déployé sur: Vercel                                   │
│   URL: https://cathy-decor.vercel.app                   │
└───────────────────────┬─────────────────────────────────┘
                        │ API REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│   Backend (Express.js + Sequelize)                      │
│   Déployé sur: Railway                                  │
│   Base de données: PostgreSQL                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│   Cloudinary (Stockage Images)                          │
│   Upload direct depuis le navigateur                    │
│   Cloud Name: dc9z1q1c8                                 │
└─────────────────────────────────────────────────────────┘
```

## Technologies

| Couche | Technologies |
|--------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Zustand |
| **Backend** | Node.js 18+, Express.js, Sequelize ORM |
| **Base de données** | PostgreSQL (production), SQLite (développement) |
| **Images** | Cloudinary (upload direct avec preset non signé) |
| **Déploiement** | Vercel (frontend), Railway (backend + PostgreSQL) |

## Structure du Projet

```
cathy-decor-site/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── pages/           # Pages (Home, Portfolio, Marketplace, etc.)
│   │   ├── components/      # Composants (Header, Footer, Admin*)
│   │   ├── hooks/           # Hooks personnalisés (useImageUpload, useCart)
│   │   ├── services/        # Service API (axios)
│   │   └── store/           # State management (Zustand)
│   └── package.json
│
├── backend/                  # API Express.js
│   ├── src/
│   │   ├── models/          # Modèles Sequelize
│   │   ├── routes/          # Routes API
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── services/        # Cloudinary, WhatsApp
│   │   └── server.js
│   └── package.json
│
└── docs/                     # Documentation technique
    ├── API.md               # Documentation API
    ├── ARCHITECTURE.md      # Architecture détaillée
    └── DATABASE.md          # Schémas base de données
```

## Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/nelson227/cathy-decor.git
cd cathy-decor-site

# 2. Installer les dépendances frontend
cd frontend
npm install

# 3. Installer les dépendances backend
cd ../backend
npm install
```

### Configuration

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=votre_secret_jwt

# PostgreSQL (production) ou rien pour SQLite (dev)
DATABASE_URL=postgresql://...

# Cloudinary (pour upload via backend - optionnel)
CLOUDINARY_NAME=dc9z1q1c8
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Lancer en développement

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Connexion Admin

- **URL**: `/admin-login`
- **Email**: `admin@cathydecor.com`
- **Mot de passe**: `Admin123`

## Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Guide de démarrage rapide |
| [IMAGE_UPLOAD_DOCS.md](./IMAGE_UPLOAD_DOCS.md) | Système d'upload d'images |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Déploiement Vercel + Railway |
| [docs/API.md](./docs/API.md) | Documentation API complète |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Architecture technique |
| [docs/DATABASE.md](./docs/DATABASE.md) | Schémas base de données |

## Déploiement

Le projet est déployé sur:
- **Frontend**: [Vercel](https://vercel.com) - Déploiement automatique depuis GitHub
- **Backend**: [Railway](https://railway.app) - Node.js + PostgreSQL
- **Images**: [Cloudinary](https://cloudinary.com) - CDN avec upload direct

Voir [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) pour le guide complet.

## Auteur

Cathy Décor - Yaoundé, Cameroun
