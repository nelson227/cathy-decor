# Schémas Base de Données - Cathy Décor

**ORM**: Sequelize  
**Production**: PostgreSQL  
**Développement**: SQLite  

---

## Tables

### Users

Utilisateurs et administrateurs.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| email | STRING | Email (unique) |
| password | STRING | Mot de passe hashé (bcrypt) |
| name | STRING | Nom complet |
| role | ENUM | 'user' ou 'admin' |
| active | BOOLEAN | Compte actif |
| created_at | DATE | Date création |
| updated_at | DATE | Date modification |

---

### Decorations

Projets du portfolio (décorations réalisées).

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | STRING | Nom du projet |
| category | STRING | mariage, anniversaire, bapteme, funeraire |
| theme | STRING | Thème (ex: Luxueux, Champêtre) |
| description | TEXT | Description détaillée |
| images | JSON | Array d'URLs Cloudinary |
| price | DECIMAL | Prix indicatif |
| included | JSON | Array d'éléments inclus |
| available | BOOLEAN | Visible sur le site |
| created_at | DATE | Date création |
| updated_at | DATE | Date modification |

**Exemple:**
```json
{
  "id": "uuid-xxx",
  "name": "Mariage Gold & White",
  "category": "mariage",
  "theme": "Luxueux",
  "description": "Décoration complète pour mariage...",
  "images": [
    "https://res.cloudinary.com/dc9z1q1c8/image/upload/v.../img1.jpg",
    "https://res.cloudinary.com/dc9z1q1c8/image/upload/v.../img2.jpg"
  ],
  "price": 750000,
  "included": ["Arche florale", "Centre de table x10", "Chemin de table"],
  "available": true
}
```

---

### Services

Services proposés par l'entreprise.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | STRING | Nom du service |
| slug | STRING | URL-friendly (unique) |
| description | TEXT | Description |
| image | STRING | URL image Cloudinary |
| price | DECIMAL | Prix de base |
| features | JSON | Array de caractéristiques |
| available | BOOLEAN | Service actif |
| created_at | DATE | Date création |
| updated_at | DATE | Date modification |

**Services types:**
- Décoration Mariage
- Décoration Anniversaire
- Décoration Baptême
- Services Funéraires

---

### Salles

Salles partenaires disponibles à la location.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | STRING | Nom de la salle |
| description | TEXT | Description |
| images | JSON | Array d'URLs (photos de la salle) |
| capacity | INTEGER | Capacité en personnes |
| location | STRING | Adresse/quartier |
| price | DECIMAL | Prix de location |
| amenities | JSON | Équipements ['Parking', 'Climatisation', etc.] |
| available | BOOLEAN | Disponible |
| created_at | DATE | Date création |
| updated_at | DATE | Date modification |

**Exemple:**
```json
{
  "id": "uuid-xxx",
  "name": "Salle des Fêtes Royal",
  "description": "Grande salle climatisée...",
  "images": [
    "https://res.cloudinary.com/.../salle1.jpg",
    "https://res.cloudinary.com/.../salle2.jpg",
    "https://res.cloudinary.com/.../salle3.jpg"
  ],
  "capacity": 500,
  "location": "Yaoundé, Bastos",
  "price": 250000,
  "amenities": ["Parking", "Climatisation", "Cuisine équipée", "Sono"],
  "available": true
}
```

---

### Produits

Produits disponibles sur le marketplace.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | STRING | Nom du produit |
| category | STRING | Catégorie (fleurs, nappes, etc.) |
| description | TEXT | Description |
| image | STRING | URL image Cloudinary |
| price | DECIMAL | Prix unitaire |
| stock | INTEGER | Quantité en stock |
| available | BOOLEAN | En vente |
| created_at | DATE | Date création |
| updated_at | DATE | Date modification |

---

### Commandes

Commandes passées par les clients.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| order_number | STRING | Numéro de commande (CMD-DATE-xxx) |
| items | JSON | Produits commandés |
| customer | JSON | Infos client {name, phone, email} |
| delivery_address | STRING | Adresse de livraison |
| subtotal | DECIMAL | Sous-total |
| tax | DECIMAL | Taxes |
| total | DECIMAL | Total |
| status | ENUM | pending, confirmed, completed, cancelled |
| notes | TEXT | Notes spéciales |
| created_at | DATE | Date commande |
| updated_at | DATE | Date modification |

**Statuts:**
- `pending` - En attente de confirmation
- `confirmed` - Confirmée
- `completed` - Livrée/terminée
- `cancelled` - Annulée

---

### Testimonials

Témoignages clients.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | STRING | Nom du client |
| event_type | STRING | Type d'événement |
| rating | INTEGER | Note (1-5) |
| content | TEXT | Contenu du témoignage |
| verified | BOOLEAN | Approuvé par admin |
| created_at | DATE | Date soumission |
| updated_at | DATE | Date modification |

---

### Favorites

Favoris des utilisateurs.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| user_id | UUID | Référence utilisateur |
| item_id | UUID | ID de l'élément |
| item_type | STRING | decoration, salle, produit |
| created_at | DATE | Date ajout |

**Index unique:** (user_id, item_id, item_type) pour éviter les doublons.

---

## Relations

```
Users
  │
  └── Favorites (user_id)
        │
        └── item_type: decoration | salle | produit

Commandes
  └── items: JSON (références produits)
```

---

## Migration

Sequelize gère automatiquement la création des tables avec `sequelize.sync()`.

**En développement:**
```javascript
await sequelize.sync({ alter: true }); // Met à jour les tables
```

**En production:**
```javascript
await sequelize.sync(); // Crée seulement si n'existe pas
```
