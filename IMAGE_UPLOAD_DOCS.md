# Système d'Upload d'Images - Cathy Décor

## Architecture

Le système utilise **Cloudinary** avec un **upload direct depuis le navigateur** (sans passer par le backend). Cela évite les problèmes de timeout et de protocole HTTP/2 avec les hébergeurs serverless.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Navigateur (React)                          │
│                                                                   │
│   1. User sélectionne image                                       │
│   2. useImageUpload hook                                          │
│   3. Upload direct vers Cloudinary                                │
└───────────────────────────┬───────────────────────────────────────┘
                            │ POST FormData
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Cloudinary                               │
│                                                                   │
│   URL: https://api.cloudinary.com/v1_1/dc9z1q1c8/image/upload    │
│   Preset: cathy_decor_unsigned (non signé)                       │
│   Dossier: cathy-decor/{services|decorations|salles|produits}    │
│                                                                   │
│   Retourne: URL de l'image uploadée                               │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                                  │
│                                                                   │
│   L'URL Cloudinary est sauvée en base de données                  │
│   avec les autres données du formulaire                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration Cloudinary

| Paramètre | Valeur |
|-----------|--------|
| Cloud Name | `dc9z1q1c8` |
| Upload Preset | `cathy_decor_unsigned` |
| Type | Unsigned (pas de signature requise) |
| Dossier | `cathy-decor/` |

Pour créer un preset unsigned sur Cloudinary:
1. Allez sur [console.cloudinary.com](https://console.cloudinary.com)
2. Settings → Upload → Upload presets
3. Add upload preset
4. Signing Mode: **Unsigned**
5. Folder: `cathy-decor`
6. Name: `cathy_decor_unsigned`

---

## Hook useImageUpload

Le hook centralise toute la logique d'upload.

**Fichier:** `frontend/src/hooks/useImageUpload.js`

### Utilisation basique

```jsx
import { useImageUpload } from '../hooks/useImageUpload';

function MonComponent() {
  const { uploadToCloudinary, uploading, error, uploadProgress } = useImageUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToCloudinary(file, 'services');
      console.log('Image uploadée:', imageUrl);
      // Sauvegarder imageUrl dans le state du formulaire
    } catch (err) {
      console.error('Erreur:', err.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {uploading && <p>Upload en cours... {uploadProgress}%</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### Paramètres

```javascript
uploadToCloudinary(file, folder)
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| file | File | Fichier image à uploader |
| folder | string | Sous-dossier Cloudinary (services, decorations, salles, produits) |

### Retour

| Propriété | Type | Description |
|-----------|------|-------------|
| uploadToCloudinary | function | Fonction d'upload |
| uploading | boolean | Upload en cours |
| uploadProgress | number | Progression (0-100) |
| error | string | Message d'erreur |
| resetError | function | Réinitialiser l'erreur |

### Validations automatiques

- **Types acceptés:** JPEG, PNG, GIF, WebP
- **Taille max:** 5 MB
- **Vérification** du fichier avant upload

---

## Exemples par composant

### AdminServices.jsx

```jsx
const { uploadToCloudinary, uploading } = useImageUpload();

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = await uploadToCloudinary(file, 'services');
    setFormData({ ...formData, image: url });
  }
};
```

### AdminSalles.jsx (plusieurs images)

```jsx
const handleAddImage = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = await uploadToCloudinary(file, 'salles');
    setFormData({ 
      ...formData, 
      images: [...formData.images, url] 
    });
  }
};

const handleRemoveImage = (index) => {
  setFormData({
    ...formData,
    images: formData.images.filter((_, i) => i !== index)
  });
};
```

### AdminProducts.jsx (Portfolio)

```jsx
const handleAddImage = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = await uploadToCloudinary(file, 'decorations');
    setFormData({ 
      ...formData, 
      images: [...formData.images, url] 
    });
  }
};
```

---

## Affichage des images

Les URLs Cloudinary peuvent être utilisées directement dans les balises `<img>`:

```jsx
<img 
  src={imageUrl} 
  alt="Description"
  className="w-full h-64 object-cover"
/>
```

### Transformations Cloudinary

Vous pouvez ajouter des transformations à l'URL pour optimiser:

```javascript
// Image originale
const url = "https://res.cloudinary.com/dc9z1q1c8/image/upload/v123/cathy-decor/services/image.jpg";

// Miniature 200x200
const thumbnail = url.replace('/upload/', '/upload/w_200,h_200,c_fill/');

// WebP automatique
const webp = url.replace('/upload/', '/upload/f_auto,q_auto/');
```

---

## Gestion des erreurs

Le hook gère automatiquement les erreurs:

```jsx
const { uploadToCloudinary, error, resetError } = useImageUpload();

// Afficher l'erreur
{error && (
  <div className="bg-red-100 text-red-700 p-2 rounded">
    {error}
    <button onClick={resetError}>×</button>
  </div>
)}

// Erreurs possibles:
// - "Aucun fichier sélectionné"
// - "Format non supporté. Utilisez JPEG, PNG, GIF ou WebP"
// - "Fichier trop volumineux (max 5MB)"
// - "Erreur upload Cloudinary"
```

---

## Avantages de cette approche

1. **Pas de timeout** - Upload direct, pas de limite serveur
2. **Pas d'erreur HTTP/2** - Évite les problèmes Railway
3. **Plus rapide** - Connexion directe au CDN Cloudinary
4. **Moins de charge backend** - Le serveur ne gère pas les fichiers
5. **Optimisation automatique** - Cloudinary transforme en WebP

## Limitations

1. **Preset public** - N'importe qui peut uploader (acceptable pour admin)
2. **Pas de validation serveur** - Validation uniquement côté client
3. **Quotas Cloudinary** - Plan gratuit: 25 crédits/mois (~25 GB bandwidth)
