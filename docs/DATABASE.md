# 🗄️ Schémas Base de Données - Cathy Décor

## Collections MongoDB

### 1. Decorations (Produits/Services)

```javascript
db.createCollection("decorations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "price"],
      properties: {
        _id: { bsonType: "objectId" },
        
        // Infos de base
        name: {
          bsonType: "string",
          description: "Nom du service/produit"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug"
        },
        category: {
          enum: ["mariage", "anniversaire", "baby-shower", "bapteme", 
                  "funeraire", "corporate", "exterieur", "interieur"],
          description: "Catégorie du produit"
        },
        
        // Description & Media
        description: {
          bsonType: "string",
          description: "Description détaillée"
        },
        shortDescription: {
          bsonType: "string",
          description: "Description courte"
        },
        images: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "URLs des images"
        },
        videos: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "URLs des vidéos"
        },
        
        // Détails visuel
        theme: {
          bsonType: "string",
          description: "Thème (classique, moderne, bohème, etc)"
        },
        colors: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Couleurs utilisées"
        },
        
        // Pricing
        price: {
          bsonType: "number",
          description: "Prix de base"
        },
        options: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              price: { bsonType: "number" },
              description: { bsonType: "string" }
            }
          },
          description: "Options supplémentaires avec prix"
        },
        
        // Informations supplémentaires
        included: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Ce qui est inclus"
        },
        duration: {
          bsonType: "string",
          description: "Durée de service"
        },
        
        // Statut
        available: {
          bsonType: "bool",
          description: "Disponible ou non"
        },
        stock: {
          bsonType: "int",
          description: "Stock disponible (-1 = illimité)"
        },
        
        // Métadonnées
        rating: {
          bsonType: "double",
          description: "Note moyenne"
        },
        reviewCount: {
          bsonType: "int",
          description: "Nombre d'avis"
        },
        
        // Timestamps
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Index
db.decorations.createIndex({ category: 1 });
db.decorations.createIndex({ slug: 1 }, { unique: true });
db.decorations.createIndex({ theme: 1 });
db.decorations.createIndex({ price: 1 });
db.decorations.createIndex({ available: 1 });
```

### 2. Salles (Partenaires)

```javascript
db.createCollection("salles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "location", "capacity"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        slug: { bsonType: "string" },
        description: { bsonType: "string" },
        
        // Media
        images: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        videos: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        
        // Localisation
        location: {
          bsonType: "object",
          properties: {
            city: { bsonType: "string" },
            address: { bsonType: "string" },
            coordinates: {
              bsonType: "object",
              properties: {
                type: { enum: ["Point"] },
                coordinates: {
                  bsonType: "array",
                  items: { bsonType: "number" }
                }
              }
            }
          }
        },
        
        // Capacité
        capacity: {
          bsonType: "object",
          properties: {
            min: { bsonType: "int" },
            max: { bsonType: "int" }
          }
        },
        
        // Tarification
        pricePerHour: { bsonType: "number" },
        pricePerDay: { bsonType: "number" },
        
        // Équipements
        amenities: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        parking: { bsonType: "bool" },
        ac: { bsonType: "bool" },
        kitchen: { bsonType: "bool" },
        outdoor: { bsonType: "bool" },
        wifi: { bsonType: "bool" },
        accessibility: { bsonType: "bool" },
        
        // Contact & horaires
        contact: {
          bsonType: "object",
          properties: {
            phone: { bsonType: "string" },
            email: { bsonType: "string" }
          }
        },
        
        // Timestamps
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.salles.createIndex({ "location.coordinates": "2dsphere" });
db.salles.createIndex({ slug: 1 }, { unique: true });
db.salles.createIndex({ capacity: 1 });
```

### 3. Commandes

```javascript
db.createCollection("commandes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orderNumber", "customer", "items"],
      properties: {
        _id: { bsonType: "objectId" },
        orderNumber: {
          bsonType: "string",
          description: "Numéro commande unique"
        },
        
        // Client
        customer: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            phone: { bsonType: "string" },
            email: { bsonType: "string" },
            notes: { bsonType: "string" }
          }
        },
        
        // Événement
        event: {
          bsonType: "object",
          properties: {
            type: { bsonType: "string" },
            date: { bsonType: "date" },
            time: { bsonType: "string" },
            location: { bsonType: "string" },
            guests: { bsonType: "int" },
            budget: { bsonType: "number" }
          }
        },
        
        // Items
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              decorationId: { bsonType: "objectId" },
              name: { bsonType: "string" },
              quantity: { bsonType: "int" },
              price: { bsonType: "number" },
              options: {
                bsonType: "array",
                items: { bsonType: "string" }
              }
            }
          }
        },
        
        // Pricing
        subtotal: { bsonType: "number" },
        tax: { bsonType: "number" },
        total: { bsonType: "number" },
        
        // Status
        status: {
          enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
          description: "Statut commande"
        },
        
        // WhatsApp
        whatsappMessage: { bsonType: "string" },
        whatsappSent: { bsonType: "bool" },
        whatsappSentAt: { bsonType: "date" },
        
        // Timestamps
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.commandes.createIndex({ orderNumber: 1 }, { unique: true });
db.commandes.createIndex({ "customer.phone": 1 });
db.commandes.createIndex({ status: 1 });
db.commandes.createIndex({ createdAt: 1 });
```

### 4. Users (Admin)

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: { bsonType: "string" },
        role: {
          enum: ["admin", "editor", "viewer"],
          description: "Rôle utilisateur"
        },
        name: { bsonType: "string" },
        avatar: { bsonType: "string" },
        active: { bsonType: "bool" },
        
        lastLogin: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
```

### 5. Testimonials (Témoignages)

```javascript
db.createCollection("testimonials", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["author", "content", "rating"],
      properties: {
        _id: { bsonType: "objectId" },
        author: { bsonType: "string" },
        content: { bsonType: "string" },
        rating: {
          bsonType: "int",
          minimum: 1,
          maximum: 5
        },
        image: { bsonType: "string" },
        eventType: { bsonType: "string" },
        verified: { bsonType: "bool" },
        
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.testimonials.createIndex({ createdAt: -1 });
db.testimonials.createIndex({ rating: -1 });
db.testimonials.createIndex({ verified: 1 });
```

### 6. Favorites (Favoris)

```javascript
db.createCollection("favorites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "itemId", "itemType"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        itemId: { bsonType: "objectId" },
        itemType: {
          enum: ["decoration", "salle", "service"],
          description: "Type d'article favorité"
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.favorites.createIndex({ userId: 1, itemId: 1 }, { unique: true });
db.favorites.createIndex({ createdAt: -1 });
```

## Données Initiales

### Catégories Décorations
```javascript
[
  "mariage",
  "anniversaire",
  "baby-shower",
  "bapteme",
  "funeraire",
  "corporate",
  "exterieur",
  "interieur"
]
```

### Thèmes
```javascript
[
  "classique",
  "moderne",
  "bohème",
  "vintage",
  "minimaliste",
  "luxueux",
  "tropical",
  "champêtre"
]
```

### Statuts Commande
```javascript
pending    // En attente
confirmed  // Confirmée
in-progress // En cours
completed  // Complétée
cancelled  // Annulée
```

---

**Dernière mise à jour** : 6 mars 2026
