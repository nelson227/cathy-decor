# Backend API - Cathy Décor

API REST Node.js/Express pour la plateforme Cathy Décor.

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer dépendances
npm install

# Créer fichier .env
cp .env.example .env

# Configurer les variables dans .env
```

### Variables d'environnement requises

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cathy-decor
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── models/          # Schémas MongoDB
│   ├── routes/          # Routes API
│   ├── controllers/     # Logique métier
│   ├── services/        # Services externes
│   ├── middleware/      # Middleware
│   ├── utils/           # Utilitaires
│   ├── config/          # Configuration
│   └── server.js        # Entry point
├── .env.example
├── package.json
└── README.md
```

## 🔌 Endpoints API (à implémenter)

### Authentification
- `POST /api/auth/register` - Enregistrement
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Actualiser token

### Décorations
- `GET /api/decorations` - Lister tous
- `GET /api/decorations/:id` - Détails
- `POST /api/decorations` - Créer (admin)
- `PUT /api/decorations/:id` - Modifier (admin)
- `DELETE /api/decorations/:id` - Supprimer (admin)

### Commandes
- `POST /api/commandes` - Créer commande
- `GET /api/commandes/:id` - Détails commande
- `GET /api/commandes` - Lister (admin)
- `PUT /api/commandes/:id` - Mettre à jour (admin)

### Salles
- `GET /api/salles` - Lister
- `GET /api/salles/:id` - Détails
- `POST /api/salles` - Créer (admin)
- `PUT /api/salles/:id` - Modifier (admin)

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Les tokens doivent être envoyés dans le header:

```
Authorization: Bearer <token>
```

## 🗄️ Base de Données

MongoDB est utilisé pour la persistence des données.

Collections:
- `decorations` - Produits/services
- `salles` - Partenaires
- `commandes` - Orders
- `users` - Admin
- `testimonials` - Avis
- `favorites` - Favoris

Voir [DATABASE.md](../docs/DATABASE.md) pour le schéma complet.

## 🔗 Services Externes

- **Cloudinary** - Gestion images (upload, transformation, CDN)
- **Twilio** - Intégration WhatsApp
- **MongoDB** - Base de données NoSQL

## 🧪 Tests

```bash
npm test
```

## 📚 Documentation

- [API Reference](../docs/API.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Database Schema](../docs/DATABASE.md)

## 🚨 Erreurs Communes

### Connexion MongoDB
- Vérifier `MONGODB_URI` dans .env
- Vérifier que MongoDB est en cours d'exécution

### Cloudinary
- Configurer les credentials dans .env
- Vérifier les permissions du compte

### CORS
- Vérifier l'URL du frontend dans le middleware CORS
- Ajouter le domaine au fichier server.js

## 📝 Logs

Les logs sont gérés par Morgan. Mode développement = plus verbeux.

## 🤝 Contribution

Voir le fichier CONTRIBUTING.md pour les directives.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 6 mars 2026
