# Cathy Décor - Site Web Professionnel

**Status** : 🔥 EN DÉVELOPPEMENT  
**Version** : 1.0.0  
**Date démarrage** : 6 mars 2026

Plateforme digitale complète pour une entreprise de décoration événementielle.

## 🎯 Fonctionnalités Principales

- 🎨 **Portfolio multimédia** - Galeries photos/vidéos avec filtres dynamiques
- 🛍️ **Marketplace** - Catalogue de services et décorations
- 🛒 **Panier intégré** - Sélection et personnalisation
- 💬 **Commande WhatsApp** - Envoi automatisé via WhatsApp
- 📍 **Salles partenaires** - Localisation et réservation
- 👤 **Dashboard Admin** - Gestion complète
- 📱 **Mobile-first** - Responsive et optimisé
- 🔍 **SEO optimisé** - Structure sémantique

## 📁 Structure du Projet

```
cathy-decor-site/
├── frontend/              # Application React/Vite
│   ├── src/
│   │   ├── pages/        # Pages principales
│   │   ├── components/   # Composants réutilisables
│   │   ├── layouts/      # Layouts (Header, Footer)
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── services/     # Services API
│   │   ├── store/        # Gestion d'état (Zustand)
│   │   ├── styles/       # Styles globaux
│   │   └── App.jsx
│   ├── public/           # Assets statiques
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── models/       # Schémas MongoDB (Mongoose)
│   │   ├── routes/       # Routes API
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Middleware (auth, validation)
│   │   ├── services/     # Services (emails, WhatsApp)
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/                 # Documentation
│   ├── API.md           # Documentation API
│   ├── DATABASE.md      # Schémas DB
│   ├── SETUP.md         # Guide installation
│   └── ARCHITECTURE.md  # Architecture technique
│
├── PROGRESSION.md       # Ce fichier de suivi
└── README.md           # Readme principal
```

## 🚀 Démarrage Rapide

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Database
MongoDB (local ou Atlas)

## 📚 Documentation

- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Setup Guide](./docs/SETUP.md)
- [Architecture](./docs/ARCHITECTURE.md)

## 🔧 Technologies

**Frontend** : React 18, Vite, Tailwind CSS, React Router, Zustand  
**Backend** : Node.js, Express, MongoDB, Mongoose  
**Services** : Twilio (WhatsApp), Cloudinary (images)  
**Hosting** : Vercel (frontend), Heroku/Railway (backend)

## 📊 Progression

Voir [PROGRESSION.md](./PROGRESSION.md) pour un suivi détaillé.

## 👤 Contact

Cathy Décor - [Contact Info]

---

**Généré** : 6 mars 2026 | Maintenu par [Votre Équipe]
