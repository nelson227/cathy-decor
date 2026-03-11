# Documentation API - Cathy Décor

**Base URL**: `http://localhost:5000/api` (dev) | `https://[votre-backend].railway.app/api` (prod)

## Authentification

Toutes les routes admin nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentification

#### POST /auth/login
Connexion utilisateur/admin.

**Body:**
```json
{
  "email": "admin@cathydecor.com",
  "password": "Admin123"
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "admin@cathydecor.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

#### POST /auth/register
Créer un nouveau compte.

**Body:**
```json
{
  "email": "user@email.com",
  "password": "password123",
  "name": "Nom Utilisateur"
}
```

---

### Décorations (Portfolio)

#### GET /decorations
Liste toutes les décorations.

**Query params:**
- `category` - Filtrer par catégorie (mariage, anniversaire, bapteme, funeraire)
- `limit` - Nombre de résultats (défaut: 50)

**Réponse:**
```json
[
  {
    "id": "uuid",
    "name": "Décoration Mariage Gold",
    "category": "mariage",
    "theme": "Luxueux",
    "description": "Description...",
    "images": ["https://res.cloudinary.com/..."],
    "price": 500000,
    "included": ["Tables", "Chaises", "Arche"],
    "available": true
  }
]
```

#### GET /decorations/:id
Détails d'une décoration.

#### POST /decorations (Admin)
Créer une décoration.

**Body:**
```json
{
  "name": "Nom",
  "category": "mariage",
  "theme": "Thème",
  "description": "Description",
  "images": ["url1", "url2"],
  "price": 500000,
  "included": ["Element 1", "Element 2"],
  "available": true
}
```

#### PUT /decorations/:id (Admin)
Modifier une décoration.

#### DELETE /decorations/:id (Admin)
Supprimer une décoration.

---

### Services

#### GET /services
Liste tous les services.

**Réponse:**
```json
[
  {
    "id": "uuid",
    "name": "Décoration Mariage",
    "slug": "mariage",
    "description": "Description du service",
    "image": "https://res.cloudinary.com/...",
    "price": 500000,
    "features": ["Feature 1", "Feature 2"]
  }
]
```

#### GET /services/:id
Détails d'un service.

#### POST /services (Admin)
Créer un service.

#### PUT /services/:id (Admin)
Modifier un service.

#### DELETE /services/:id (Admin)
Supprimer un service.

---

### Salles

#### GET /salles
Liste toutes les salles partenaires.

**Réponse:**
```json
[
  {
    "id": "uuid",
    "name": "Salle des Fêtes Royal",
    "description": "Description...",
    "images": ["url1", "url2", "url3"],
    "capacity": 500,
    "location": "Yaoundé, Bastos",
    "price": 250000,
    "amenities": ["Parking", "Climatisation", "Cuisine"],
    "available": true
  }
]
```

#### GET /salles/:id
Détails d'une salle.

#### POST /salles (Admin)
Créer une salle.

**Body:**
```json
{
  "name": "Nom de la salle",
  "description": "Description",
  "images": ["url1", "url2"],
  "capacity": 300,
  "location": "Adresse",
  "price": 200000,
  "amenities": ["Parking", "Climatisation"],
  "available": true
}
```

#### PUT /salles/:id (Admin)
Modifier une salle.

#### DELETE /salles/:id (Admin)
Supprimer une salle.

---

### Produits (Marketplace)

#### GET /produits
Liste tous les produits du marketplace.

**Query params:**
- `category` - Catégorie de produit
- `minPrice`, `maxPrice` - Fourchette de prix

**Réponse:**
```json
[
  {
    "id": "uuid",
    "name": "Bouquet de Fleurs",
    "category": "fleurs",
    "description": "Description",
    "image": "https://res.cloudinary.com/...",
    "price": 25000,
    "stock": 50,
    "available": true
  }
]
```

#### POST /produits (Admin)
Créer un produit.

#### PUT /produits/:id (Admin)
Modifier un produit.

#### DELETE /produits/:id (Admin)
Supprimer un produit.

---

### Commandes

#### GET /commandes (Admin)
Liste toutes les commandes.

**Query params:**
- `status` - Filtrer par statut (pending, confirmed, completed, cancelled)

#### POST /commandes
Créer une commande.

**Body:**
```json
{
  "items": [
    { "id": "uuid", "name": "Produit", "price": 25000, "quantity": 2 }
  ],
  "customer": {
    "name": "Nom Client",
    "phone": "+237699999999",
    "email": "client@email.com"
  },
  "deliveryAddress": "Adresse de livraison",
  "notes": "Instructions spéciales"
}
```

#### PUT /commandes/:id (Admin)
Mettre à jour le statut.

---

### Témoignages

#### GET /testimonials
Liste les témoignages approuvés.

#### POST /testimonials
Soumettre un témoignage.

**Body:**
```json
{
  "name": "Nom Client",
  "eventType": "mariage",
  "rating": 5,
  "content": "Excellent service!"
}
```

#### PUT /testimonials/:id (Admin)
Approuver/modifier un témoignage.

#### DELETE /testimonials/:id (Admin)
Supprimer un témoignage.

---

### Stats (Admin)

#### GET /stats
Statistiques du dashboard admin.

**Réponse:**
```json
{
  "totalDecorations": 25,
  "totalSalles": 8,
  "totalCommandes": 150,
  "totalProduits": 45,
  "commandesPending": 12
}
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |
