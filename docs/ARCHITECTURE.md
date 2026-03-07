# 🏗️ Architecture Technique - Cathy Décor

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│     React 18 + Vite (SPA)                              │
│     - Pages                                             │
│     - Composants réutilisables                         │
│     - State Management (Zustand)                       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/HTTPS (REST API)
                   │
┌──────────────────▼──────────────────────────────────────┐
│            BACKEND (Node.js + Express)                  │
│     - Routes REST API                                  │
│     - Middleware (Auth, Validation)                    │
│     - Controllers (Business Logic)                     │
│     - Services (WhatsApp, Emails, Images)              │
└──────────────────┬──────────────────────────────────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
      ▼            ▼            ▼
   MongoDB     Cloudinary    Twilio
   Database    (Images)    (WhatsApp)
```

## Détails des Couches

### 1. Frontend (React)

#### Structure des répertoires
```
frontend/src/
├── pages/
│   ├── Home.jsx              # Accueil
│   ├── Portfolio.jsx         # Portfolio avec filtres
│   ├── Marketplace.jsx       # Marketplace produits
│   ├── Services.jsx          # Détail services
│   ├── Salles.jsx           # Salles partenaires
│   ├── About.jsx            # À propos
│   ├── Contact.jsx          # Contact
│   ├── NotFound.jsx         # 404
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminSalles.jsx
│       ├── AdminOrders.jsx
│       └── AdminLogin.jsx
│
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   └── Button.jsx
│   │
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── ServicesOverview.jsx
│   │   ├── PortfolioPreview.jsx
│   │   ├── RoomsPreview.jsx
│   │   ├── Testimonials.jsx
│   │   └── CTA.jsx
│   │
│   ├── portfolio/
│   │   ├── GalleryFilter.jsx
│   │   ├── GalleryGrid.jsx
│   │   ├── ProjectModal.jsx
│   │   └── Lightbox.jsx
│   │
│   ├── marketplace/
│   │   ├── ProductCard.jsx
│   │   ├── ProductFilters.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── SearchBar.jsx
│   │   └── ProductDetail.jsx
│   │
│   ├── cart/
│   │   ├── CartIcon.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   │
│   └── forms/
│       ├── ContactForm.jsx
│       ├── OrderForm.jsx
│       └── SearchForm.jsx
│
├── hooks/
│   ├── useCart.js           # Gestion panier
│   ├── useFavorites.js      # Favoris
│   ├── useAuth.js           # Auth
│   ├── useProducts.js       # Produits
│   └── useFilters.js        # Filtres
│
├── services/
│   ├── api.js              # Instance Axios
│   ├── decorations.js      # API décorations
│   ├── salles.js           # API salles
│   ├── commandes.js        # API commandes
│   └── whatsapp.js         # Intégration WhatsApp
│
├── store/
│   ├── cartStore.js        # Zustand cart
│   ├── authStore.js        # Zustand auth
│   ├── filtersStore.js     # Zustand filters
│   └── favoritesStore.js   # Zustand favorites
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── responsive.css
│
└── App.jsx
```

#### Flux de données
```
User Action
    ↓
Component Event
    ↓
Zustand Store Update
    ↓
API Call (axios)
    ↓
Backend Response
    ↓
Component Re-render
```

### 2. Backend (Node.js/Express)

#### Structure des répertoires
```
backend/src/
├── models/
│   ├── Decoration.js       # Schéma décorations
│   ├── Salle.js           # Schéma salles
│   ├── Commande.js        # Schéma commandes
│   ├── User.js            # Schéma utilisateurs
│   ├── Testimonial.js     # Schéma témoignages
│   └── Favorite.js        # Schéma favoris
│
├── routes/
│   ├── auth.js            # Routes auth
│   ├── decorations.js     # Routes décorations
│   ├── salles.js          # Routes salles
│   ├── commandes.js       # Routes commandes
│   ├── services.js        # Routes services
│   ├── testimonials.js    # Routes témoignages
│   └── admin.js           # Routes admin
│
├── controllers/
│   ├── authController.js
│   ├── decorationController.js
│   ├── salleController.js
│   ├── commandeController.js
│   ├── adminController.js
│   └── serviceController.js
│
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── validation.js      # Input validation
│   ├── errorHandler.js    # Error handling
│   ├── admin.js           # Admin check
│   └── upload.js          # File upload (Multer)
│
├── services/
│   ├── whatsappService.js # Twilio WhatsApp
│   ├── emailService.js    # SMTP Emails
│   ├── cloudinaryService.js # Image upload
│   ├── commandeService.js # Commande logic
│   └── filterService.js   # Filtrage avancé
│
├── utils/
│   ├── validators.js      # Validation helpers
│   ├── formatters.js      # Format helpers
│   ├── errors.js          # Custom errors
│   └── constants.js       # Constants
│
├── config/
│   ├── database.js        # MongoDB connection
│   ├── cloudinary.js      # Cloudinary config
│   └── twilio.js          # Twilio config
│
└── server.js              # Entry point
```

#### Flux de requête
```
HTTP Request
    ↓
Express Middleware
    ↓
Route Handler
    ↓
Controller Logic
    ↓
Database/External Service
    ↓
Response JSON
```

### 3. Base de Données (MongoDB)

#### Collections et Schémas

##### Decorations (Produits/Services)
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  category: String, // mariage, anniversaire, etc
  theme: String,
  colors: [String],
  description: String,
  images: [URL],
  videos: [URL],
  price: Number,
  options: [
    { name: String, price: Number }
  ],
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

##### Salles (Partenaires)
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  images: [URL],
  videos: [URL],
  location: {
    city: String,
    address: String,
    coordinates: { lat, lng }
  },
  capacity: Number,
  price: Number,
  amenities: [String],
  parking: Boolean,
  ac: Boolean,
  kitchen: Boolean,
  outdoor: Boolean,
  createdAt: Date
}
```

##### Commandes (Orders)
```javascript
{
  _id: ObjectId,
  orderNumber: String,
  customer: {
    name: String,
    phone: String,
    email: String
  },
  event: {
    type: String,
    date: Date,
    location: String,
    guests: Number
  },
  items: [
    {
      decorationId: ObjectId,
      quantity: Number,
      options: [String],
      price: Number
    }
  ],
  notes: String,
  total: Number,
  status: String, // pending, confirmed, completed
  whatsappSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

##### Users (Admin)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String, // admin, editor
  name: String,
  createdAt: Date
}
```

### 4. Services Externes

#### Cloudinary (Images)
- Upload images depuis l'admin
- Transformation automatique
- CDN global
- Optimisation taille/qualité

#### Twilio/WhatsApp API
- Envoi messages WhatsApp structurés
- Webhook pour réceptions
- Confirmations d'ordre
- Suivi commande

## 🔐 Sécurité

- **HTTPS/SSL** : Chiffrement données en transit
- **JWT** : Authentification sans session
- **CORS** : Contrôle origines autorisées
- **Input Validation** : Validation côté serveur
- **Rate Limiting** : Prévention abuses
- **Password Hashing** : bcryptjs
- **CSRF Protection** : Tokens CSRF
- **SQL Injection** : Mongoose protection

## 📊 Performance

- **Frontend**
  - Code splitting avec Vite
  - Lazy loading images
  - Minification CSS/JS
  - Browser caching

- **Backend**
  - Compression gzip
  - Pagination API
  - Index MongoDB
  - Caching (Redis optionnel)

## 🚀 Déploiement

```
Frontend (Vercel/Netlify)
    ↓
CDN Global
    ↓
SPA React

Backend (Heroku/Railway)
    ↓
API REST
    ↓
MongoDB Atlas
    ↓
Cloudinary
    ↓
Twilio
```

## 🔄 CI/CD

```
Git Push
    ↓
GitHub Actions
    ↓
Tests + Builds
    ↓
Deployment
```

---

Voir [API.md](./API.md) pour documentation API  
Voir [DATABASE.md](./DATABASE.md) pour schémas détaillés
