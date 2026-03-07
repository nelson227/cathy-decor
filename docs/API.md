# 📡 API Documentation - Cathy Décor

**Base URL** : `http://localhost:5000/api`  
**Version** : 1.0.0  
**Authentication** : JWT Bearer Token

---

## 📋 Endpoints (À implémenter)

### 🔐 Authentification

#### Register (Enregistrement)
```
POST /auth/register
Content-Type: application/json

{
  "email": "admin@cathydecor.com",
  "password": "password123",
  "name": "Admin Name"
}

Response: 
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id", "email", "name" }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@cathydecor.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id", "email", "name" }
}
```

#### Refresh Token
```
POST /auth/refresh
Authorization: Bearer <token>

Response:
{
  "success": true,
  "token": "new_token"
}
```

---

### 🎨 Décorations (Produits/Services)

#### Lister toutes les décorations
```
GET /decorations?category=mariage&price_max=5000&page=1&limit=12

Query Parameters:
- category: string (mariage, anniversaire, etc)
- theme: string
- price_min: number
- price_max: number
- search: string
- page: number (default: 1)
- limit: number (default: 12)

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Décoration Mariage Gold",
      "category": "mariage",
      "price": 2500,
      "images": ["url1", "url2"],
      "rating": 4.8
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 4
  }
}
```

#### Obtenir une décoration
```
GET /decorations/:id

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Décoration Mariage Gold",
    "category": "mariage",
    "theme": "luxueux",
    "colors": ["gold", "white"],
    "description": "...",
    "images": ["url1", "url2"],
    "videos": ["video_url"],
    "price": 2500,
    "options": [
      { "name": "Extension pour 50 invités", "price": 500 }
    ],
    "included": ["Décoration tables", "Arche floral", "Centre table"],
    "rating": 4.8,
    "reviewCount": 24
  }
}
```

#### Créer une décoration (Admin)
```
POST /decorations
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Décoration Anniversaire",
  "category": "anniversaire",
  "theme": "moderne",
  "price": 1500,
  "description": "...",
  "colors": ["rose", "gold"],
  "included": ["Balloons", "Banners"],
  "options": []
}

Response: { "success": true, "data": { "_id": "...", ... } }
```

#### Mettre à jour une décoration (Admin)
```
PUT /decorations/:id
Authorization: Bearer <admin_token>

{
  "name": "Nouveau nom",
  "price": 2000
}

Response: { "success": true, "data": { ... } }
```

#### Supprimer une décoration (Admin)
```
DELETE /decorations/:id
Authorization: Bearer <admin_token>

Response: { "success": true, "message": "Décoration supprimée" }
```

---

### 🏍️ Salles (Partenaires)

#### Lister les salles
```
GET /salles?city=Marrakech&capacity_min=50&capacity_max=200

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Salle Le Grand Palais",
      "location": { "city": "Marrakech", "address": "..." },
      "capacity": { "min": 50, "max": 300 },
      "pricePerHour": 500,
      "amenities": ["wifi", "parking", "kitchen"],
      "images": ["url1", "url2"]
    }
  ]
}
```

#### Obtenir détails d'une salle
```
GET /salles/:id

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Salle Le Grand Palais",
    "description": "...",
    "images": ["url1", "url2"],
    "videos": ["video_url"],
    "location": {
      "city": "Marrakech",
      "address": "123 Rue...",
      "coordinates": { "lat": 31.6, "lng": -8.0 }
    },
    "capacity": { "min": 50, "max": 300 },
    "pricePerHour": 500,
    "pricePerDay": 3000,
    "amenities": ["wifi", "parking", "kitchen", "ac"],
    "contact": { "phone": "+212...", "email": "..." }
  }
}
```

---

### 🛒 Commandes (Orders)

#### Créer une commande
```
POST /commandes
Content-Type: application/json

{
  "customer": {
    "name": "Jean Dupont",
    "phone": "+212 6XX XXX XXX",
    "email": "jean@example.com"
  },
  "event": {
    "type": "mariage",
    "date": "2026-06-15",
    "location": "Marrakech",
    "guests": 150
  },
  "items": [
    {
      "decorationId": "...",
      "quantity": 1,
      "options": ["Extension 50 invités"]
    }
  ],
  "notes": "Ajouter des touches personnelles"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "orderNumber": "CMD-20260306-001",
    "total": 3000,
    "status": "pending",
    "whatsappLink": "https://api.whatsapp.com/send?phone=212xxxxxxxxx&text=..."
  }
}
```

#### Obtenir détails d'une commande
```
GET /commandes/:id

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "orderNumber": "CMD-20260306-001",
    "customer": { "name": "Jean Dupont", ... },
    "event": { "type": "mariage", "date": "2026-06-15", ... },
    "items": [ ... ],
    "total": 3000,
    "status": "pending",
    "createdAt": "2026-03-06T10:00:00Z"
  }
}
```

#### Lister les commandes (Admin)
```
GET /commandes?status=pending&page=1

Response:
{
  "success": true,
  "data": [ ... ],
  "pagination": { "total": 25, "page": 1, "pages": 3 }
}
```

#### Mettre à jour statut commande (Admin)
```
PUT /commandes/:id
Authorization: Bearer <admin_token>

{
  "status": "confirmed"
}

Response: { "success": true, "data": { ... } }
```

---

### ⭐ Témoignages

#### Lister les témoignages
```
GET /testimonials?verified=true&sort=rating

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "author": "Client Satisfait",
      "content": "Service excellent!",
      "rating": 5,
      "eventType": "mariage",
      "verified": true
    }
  ]
}
```

---

### ❤️ Favoris

#### Ajouter aux favoris
```
POST /favorites
Authorization: Bearer <token>

{
  "itemId": "...",
  "itemType": "decoration"
}

Response: { "success": true }
```

#### Supprimer des favoris
```
DELETE /favorites/:itemId
Authorization: Bearer <token>

Response: { "success": true }
```

---

## 🔄 Status Codes

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 403 | Forbidden - Permission refusée |
| 404 | Not Found - Ressource non trouvée |
| 500 | Server Error - Erreur serveur |

---

## 🔐 Authentification

Tous les endpoints protégés nécessitent un header:

```
Authorization: Bearer <jwt_token>
```

Le token est reçu lors du login et doit être stocké dans `localStorage`.

---

## 📝 Erreur Formats

```javascript
{
  "success": false,
  "message": "Description de l'erreur",
  "error": { 
    "code": "VALIDATION_ERROR",
    "details": { "field": "error message" }
  }
}
```

---

## 🚀 Implémentation Statut

| Endpoint | Statut | Description |
|----------|--------|-------------|
| POST /auth/register | ⏳ TODO | Enregistrement |
| POST /auth/login | ⏳ TODO | Connexion |
| GET /decorations | ⏳ TODO | Lister produits |
| POST /decorations | ⏳ TODO | Créer (Admin) |
| GET /salles | ⏳ TODO | Lister salles |
| POST /commandes | ⏳ TODO | Créer commande |
| POST /favorites | ⏳ TODO | Ajouter favoris |

---

**Dernière mise à jour** : 6 mars 2026  
**Next Step** : Implémenter les endpoints dans server.js
