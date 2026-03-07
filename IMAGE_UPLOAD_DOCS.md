# 📸 Image Upload System - Documentation

## Overview

Complete image upload infrastructure using **Cloudinary CDN** with Multer middleware. Includes:
- Single & multiple file uploads
- Image optimization (WebP, auto-resize)
- Admin-only access control
- React component for seamless integration
- Progress tracking and error handling

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React)                                   │
│  - ImageUploader.jsx (component)                    │
│  - useImageUpload.js (hook)                         │
│  - Example: AdminProductFormExample.jsx             │
└──────────────┬──────────────────────────────────────┘
               │ FormData (multipart/form-data)
               ▼
┌─────────────────────────────────────────────────────┐
│  Backend (Express.js)                               │
│  - routes/upload.js (endpoints)                     │
│  - middleware/upload.js (multer config)             │
│  - services/cloudinaryService.js (transformations)  │
└──────────────┬──────────────────────────────────────┘
               │ Stream upload
               ▼
┌─────────────────────────────────────────────────────┐
│  Cloudinary CDN                                     │
│  - Image storage                                    │
│  - WebP optimization                                │
│  - Auto-transformations                             │
│  - URL generation                                   │
└─────────────────────────────────────────────────────┘
```

---

## Setup & Configuration

### 1. Environment Variables

Create or update `.env` in backend root:

```env
# Cloudinary Configuration (REQUIRED)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Get from: https://dashboard.cloudinary.com/settings/c/account
```

### 2. Backend Integration

Routes are already configured in `server.js`:

```javascript
import uploadRoutes from './routes/upload.js';
app.use('/api/upload', uploadRoutes);
```

**Verify the route is registered:**
```bash
# Check server logs for "🚀 Cathy Décor API Server Started"
# and verify /api/upload is available
```

### 3. Frontend Setup

No additional setup needed. All hooks and components are ready to use.

---

## API Endpoints

### POST /api/upload/single/:folder
Upload single image to Cloudinary

**Authentication:** Admin only (Bearer token required)

**Parameters:**
```
:folder = 'decorations' | 'salles' | 'products' | 'testimonials'
```

**Request:**
```javascript
const formData = new FormData();
formData.append('image', fileObject);

const response = await fetch('/api/upload/single/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../cathy-decor/products/xxx.webp",
    "publicId": "cathy-decor/products/xxx",
    "fileName": "image.jpg",
    "size": 245832,
    "width": 1920,
    "height": 1080
  },
  "message": "Image uploadée avec succès"
}
```

---

### POST /api/upload/multiple/:folder
Upload multiple images (max 10)

**Authentication:** Admin only

**Parameters:**
```
:folder = destination folder
```

**Request:**
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('images', file3);
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/.../xxx.webp",
      "publicId": "cathy-decor/products/xxx",
      ...
    },
    ...
  ],
  "count": 3,
  "message": "3 image(s) uploadée(s) avec succès"
}
```

---

### DELETE /api/upload/:publicId
Delete image from Cloudinary

**Authentication:** Admin only

**Parameters:**
```
:publicId = "cathy-decor/products/xxx"
```

**Response:**
```json
{
  "success": true,
  "message": "Image supprimée avec succès"
}
```

---

### GET /api/upload/gallery/:publicId
Get optimized image URLs for multiple sizes

**Authentication:** Public (no auth required)

**Response:**
```json
{
  "success": true,
  "data": {
    "thumbnail": "https://.../w_300,h_300,c_fill/...",
    "medium": "https://.../w_600,h_600,c_fill/...",
    "large": "https://.../w_1200,h_900,c_fill/...",
    "original": "https://.../...webp"
  }
}
```

---

## Frontend Usage

### 1. Using ImageUploader Component

**Basic Single Image Upload:**

```jsx
import ImageUploader from '../components/ImageUploader';

function MyForm() {
  const [mainImage, setMainImage] = useState(null);

  return (
    <ImageUploader
      folder="products"
      onUpload={(image) => setMainImage(image)}
      multiple={false}
      preview={true}
    />
  );
}
```

**Multiple Images Upload:**

```jsx
<ImageUploader
  folder="products"
  onUpload={(images) => setFormData({...formData, images})}
  multiple={true}
  maxFiles={5}
  preview={true}
/>
```

**Component Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `folder` | string | 'products' | Destination folder on Cloudinary |
| `onUpload` | function | - | Callback with uploaded data |
| `multiple` | boolean | false | Allow multiple files |
| `maxFiles` | number | 10 | Max file count |
| `preview` | boolean | true | Show image previews |
| `disabled` | boolean | false | Disable uploader |

**Callback Data Structure:**

```javascript
// Single image
{
  url: "https://...", // CDN URL
  publicId: "cathy-decor/products/xxx", // For deletion
  fileName: "image.jpg",
  size: 245832, // bytes
  width: 1920,
  height: 1080
}

// Multiple images - array of above
```

---

### 2. Using useImageUpload Hook

```jsx
import useImageUpload from '../hooks/useImageUpload';

function MyComponent() {
  const { uploadSingle, uploadMultiple, deleteImage, uploading, uploadProgress } = useImageUpload();

  // Upload single image
  const handleUpload = async (file) => {
    try {
      const result = await uploadSingle(file, 'products');
      console.log('Uploaded:', result.url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Upload multiple
  const handleMultiUpload = async (files) => {
    try {
      const results = await uploadMultiple(files, 'products');
      console.log('Uploaded', results.length, 'images');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Delete image
  const handleDelete = async (publicId) => {
    try {
      await deleteImage(publicId);
      console.log('Image deleted');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploading && <p>Progress: {uploadProgress}%</p>}
    </div>
  );
}
```

**Hook Methods:**

```javascript
const {
  uploading,        // boolean - upload in progress
  uploadProgress,   // number - 0-100
  error,            // string - error message
  uploadSingle,     // (file, folder) => Promise
  uploadMultiple,   // (files, folder) => Promise
  deleteImage,      // (publicId) => Promise
  getGalleryUrls,   // (publicId) => Promise
  checkCloudinary   // () => Promise
} = useImageUpload();
```

---

## Complete Example: Product Form with Images

```jsx
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import api from '../services/api';
import toast from 'react-hot-toast';

function AdminProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    images: []
  });

  // Handle image upload
  const handleImageUpload = (uploadedData) => {
    const imageArray = Array.isArray(uploadedData) ? uploadedData : [uploadedData];
    setFormData(prev => ({
      ...prev,
      images: imageArray.map(img => ({
        url: img.url,
        publicId: img.publicId
      }))
    }));
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/decorations', {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        images: formData.images.map(img => img.url) // Send URLs array
      });

      if (response.data.success) {
        toast.success('Produit créé!');
        // Reset form
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nom du produit"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Prix (DH)"
        onChange={(e) => setFormData({...formData, price: e.target.value})}
        required
      />

      <select
        name="category"
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        required
      >
        <option value="">Sélectionner catégorie</option>
        <option value="mariage">Mariage</option>
        <option value="anniversaire">Anniversaire</option>
        {/* ... */}
      </select>

      {/* Image Upload */}
      <ImageUploader
        folder="products"
        onUpload={handleImageUpload}
        multiple={true}
        maxFiles={5}
      />

      <button type="submit">Créer produit</button>
    </form>
  );
}

export default AdminProductForm;
```

---

## File Validation

**Allowed File Types:**
- image/jpeg
- image/png
- image/gif
- image/webp

**File Size Limits:**
- Single file: 5MB max
- Batch upload: 10 files max, 5MB each

**Validation Errors:**
```json
{
  "success": false,
  "message": "La taille du fichier dépasse 5MB"
}
```

---

## Image Optimization

All images are automatically:
1. **Converted to WebP** for optimal compression
2. **Auto-quality** adjusted based on content
3. **Progressive loading** enabled
4. **Secure URLs** enforced

**Example Transformations:**

```javascript
// Thumbnail (300x300)
https://res.cloudinary.com/.../w_300,h_300,c_fill/...

// Medium (600x600)
https://res.cloudinary.com/.../w_600,h_600,c_fill/...

// Original
https://res.cloudinary.com/.../...
```

---

## Testing

### Test Upload via cURL

```bash
curl -X POST \
  http://localhost:5000/api/upload/single/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Test in React DevTools

1. Open browser console
2. Test with useImageUpload hook:

```javascript
const { uploadSingle } = window.useImageUpload;
const file = document.querySelector('input[type="file"]').files[0];
uploadSingle(file, 'products').then(console.log);
```

---

## Troubleshooting

### "Cloudinary not configured"

**Solution:**
```env
CLOUDINARY_NAME=required
CLOUDINARY_API_KEY=required
CLOUDINARY_API_SECRET=required
```

### "File too large"

- Max 5MB per file
- Use image compression tools first

### "Format not supported"

- Only JPEG, PNG, GIF, WebP allowed
- Convert image to supported format

### "Upload timeout"

- Check internet connection
- Verify Cloudinary credentials
- Try with smaller file

### "Permission denied" (403)

- Verify admin token is valid
- Check token hasn't expired
- Ensure user role is 'admin'

---

## File Structure

```
frontend/src/
├── components/
│   ├── ImageUploader.jsx      ← Main component
│   └── ImageUploader.css      ← Styling
├── hooks/
│   └── useImageUpload.js      ← Upload hook
└── pages/
    └── AdminProductFormExample.jsx ← Integration example

backend/src/
├── routes/
│   └── upload.js             ← API endpoints
├── middleware/
│   └── upload.js             ← Multer configuration
├── services/
│   └── cloudinaryService.js   ← Cloudinary integration
└── server.js                  ← Route registration
```

---

## Next Steps

1. ✅ Setup Cloudinary credentials in `.env`
2. ✅ Test `/api/upload/health` endpoint
3. ✅ Integrate ImageUploader in AdminProductForm
4. ✅ Test file upload → Cloudinary
5. ✅ Verify URLs in database
6. ✅ Test image deletion
7. ✅ Deploy to production

---

## Security Notes

- ✅ Admin-only endpoints (Bearer token + role verification)
- ✅ File type validation (MIME type checking)
- ✅ File size limits (5MB per file)
- ✅ Secure Cloudinary URLs enforced
- ✅ Rate limiting recommended for production

---

## Support & Issues

For issues or questions:
1. Check Cloudinary dashboard for API status
2. Verify environment variables are set correctly
3. Check browser console for detailed error messages
4. Check backend logs for server-side errors

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
