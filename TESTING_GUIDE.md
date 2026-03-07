# 🧪 Testing Guide - Image Upload System

## Pre-Test Checklist

- [ ] Cloudinary credentials set in `backend/.env`
- [ ] Backend running: `npm start` (from backend directory)
- [ ] Frontend running: `npm run dev` (from frontend directory)
- [ ] Database seeded: Run `node backend/scripts/seed.js`
- [ ] Admin login credentials: `admin@cathyDecor.com` / `Admin123`

---

## Test 1: Health Check

**Verify Cloudinary Configuration**

```bash
curl http://localhost:5000/api/upload/health
```

**Expected Response:**
```json
{
  "success": true,
  "cloudinaryConfigured": true,
  "message": "Cloudinary configuré"
}
```

**If Failed:** Check Cloudinary env vars in `backend/.env`

---

## Test 2: Admin Login

**Navigate to:** `http://localhost:5173/admin-login`

**Login Steps:**
1. Email: `admin@cathyDecor.com`
2. Password: `Admin123`
3. Click "Se connecter"

**Expected:**
- ✅ Form submits
- ✅ Toast notification: "Connexion réussie"
- ✅ Redirects to `/admin`
- ✅ Token stored in localStorage

**Verify Token:**
```javascript
// In browser console
console.log(localStorage.getItem('cathy-auth-token'));
// Should return a JWT token
```

---

## Test 3: Single Image Upload (via Hook)

**Create Test File:** `test-upload.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Image Upload Test</title>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
  <input type="file" id="imageInput" accept="image/*" />
  <button onclick="uploadImage()">Upload</button>
  <div id="result"></div>

  <script>
    async function uploadImage() {
      const file = document.getElementById('imageInput').files[0];
      if (!file) {
        alert('Select an image first');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('cathy-auth-token');
        const response = await axios.post(
          'http://localhost:5000/api/upload/single/products',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('Upload successful:', response.data);
        document.getElementById('result').innerHTML = `
          <p>✅ Success!</p>
          <p>URL: ${response.data.data.url}</p>
          <p>PublicId: ${response.data.data.publicId}</p>
          <img src="${response.data.data.url}" style="max-width: 300px;">
        `;
      } catch (error) {
        console.error('Upload failed:', error);
        document.getElementById('result').innerHTML = `<p>❌ Error: ${error.response?.data?.message || error.message}</p>`;
      }
    }
  </script>
</body>
</html>
```

**Test Steps:**
1. Login first (to get token in localStorage)
2. Select an image (JPEG, PNG, GIF, WebP, max 5MB)
3. Click "Upload"
4. Verify image appears in result div
5. Copy URL and publicId

---

## Test 4: Multiple Image Upload

**Create Test Component:** `TestMultiUpload.jsx`

```jsx
import React, { useState } from 'react';
import useImageUpload from './hooks/useImageUpload';

function TestMultiUpload() {
  const [images, setImages] = useState([]);
  const { uploadMultiple, uploading, uploadProgress } = useImageUpload();

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    try {
      const results = await uploadMultiple(files, 'products');
      setImages(results);
      alert(`✅ Uploaded ${results.length} images`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading: {uploadProgress}%</p>}
      
      <div>
        {images.map((img, i) => (
          <div key={i}>
            <img src={img.url} style={{width: '100px'}} />
            <p>{img.width}x{img.height} - {(img.size/1024).toFixed(0)}KB</p>
            <p>{img.publicId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestMultiUpload;
```

**Expected:**
- ✅ Can select multiple files
- ✅ Progress bar appears
- ✅ All images shown after upload
- ✅ Image dimensions and size displayed
- ✅ publicId shown for each image

---

## Test 5: Image Deletion

**Delete Image via API**

```bash
# Replace with actual publicId from upload test
curl -X DELETE \
  'http://localhost:5000/api/upload/cathy-decor%2Fproducts%2Fxxx' \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image supprimée avec succès"
}
```

**Verify Deletion:** Try to access the image URL - should return 404

---

## Test 6: Gallery URLs

**Get Multiple Size URLs**

```bash
curl 'http://localhost:5000/api/upload/gallery/cathy-decor%2Fproducts%2Fxxx'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "thumbnail": "https://res.cloudinary.com/.../w_300,h_300,c_fill/...",
    "medium": "https://res.cloudinary.com/.../w_600,h_600,c_fill/...",
    "large": "https://res.cloudinary.com/.../w_1200,h_900,c_fill/...",
    "original": "https://res.cloudinary.com/.../...webp"
  }
}
```

**Verify:** Open each URL in browser - images should load at correct sizes

---

## Test 7: ImageUploader Component

**Test in Admin Form**

```jsx
import ImageUploader from '../components/ImageUploader';

function TestForm() {
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    // This would be the form submission
    console.log('Images to save:', images);
    // Images array contains: url, publicId, fileName, size, width, height
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploader
        folder="products"
        onUpload={setImages}
        multiple={true}
        maxFiles={5}
        preview={true}
      />
      <button type="submit">Save Products</button>
    </form>
  );
}
```

**Expected:**
- ✅ Can drop images on zone
- ✅ Can click to select files
- ✅ Progress bar during upload
- ✅ Thumbnails shown after upload
- ✅ Can delete individual images
- ✅ Can toggle preview on/off

---

## Test 8: Database Integration

**Create Product with Images**

```bash
curl -X POST http://localhost:5000/api/decorations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 1200,
    "category": "mariage",
    "images": [
      "https://res.cloudinary.com/.../test1.webp",
      "https://res.cloudinary.com/.../test2.webp"
    ],
    "description": "Test description"
  }'
```

**Expected:**
- ✅ Returns 201 Created
- ✅ Product saved with image URLs
- ✅ Can retrieve product: GET /api/decorations/:id
- ✅ Images display in product page

---

## Test 9: Marketplace Integration

**Navigate to:** `http://localhost:5173/marketplace`

**Expected:**
- ✅ Products load from API (not mock data)
- ✅ Images display properly
- ✅ Can filter by category
- ✅ Search functionality works
- ✅ Product cards show real data from database

**Verify in Console:**
```javascript
// Check API call
// Network tab → /api/decorations → verify response has real products
```

---

## Test 10: Permission Check

**Attempt Unauthorized Upload**

```bash
# Without token
curl -X POST http://localhost:5000/api/upload/single/products \
  -F "image=@test.jpg"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**With Invalid Token:**
```bash
curl -X POST http://localhost:5000/api/upload/single/products \
  -H "Authorization: Bearer invalid_token" \
  -F "image=@test.jpg"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cloudinary not configured" | Check env vars: CLOUDINARY_NAME, API_KEY, API_SECRET |
| "File too large" | Max 5MB. Compress image first. |
| "Format not supported" | Use JPEG, PNG, GIF, or WebP |
| "Permission denied (403)" | Missing Bearer token. Verify token is valid. |
| "Cannot POST /api/upload/single/..." | Check route is registered in server.js |
| "Images not showing in Marketplace" | Verify product was created with image URLs |
| "Upload timeout" | Check internet, try smaller file |

---

## Performance Baseline

**Expected Performance Metrics:**

| Operation | Time | Notes |
|-----------|------|-------|
| Upload 1MB image | <5 sec | Single image |
| Upload 5 images | <15 sec | Parallel uploads |
| Marketplace load | <2 sec | 24 products with images |
| Delete image | <1 sec | Cloudinary deletion |
| Gallery URL gen | <0.5 sec | URL builder |

---

## Regression Testing

**After Each Deploy:**

- [ ] Login works
- [ ] Upload single image succeeds
- [ ] Upload multiple images succeeds
- [ ] Delete image succeeds
- [ ] Marketplace displays images
- [ ] Admin form image upload functional

---

## Sign-Off Checklist

- [ ] All 10 tests passed
- [ ] No console errors
- [ ] Response times acceptable
- [ ] Images persisted in Cloudinary
- [ ] Database records correct
- [ ] Permissions working
- [ ] UI responsive on mobile
- [ ] Error messages helpful

---

**Test Date:** ___________
**Tester:** ___________
**Status:** ☐ Pass ☐ Fail

**Notes:** _________________________________________________

---

See Also:
- [IMAGE_UPLOAD_DOCS.md](./IMAGE_UPLOAD_DOCS.md) - Full documentation
- [SESSION_3_SUMMARY.md](./SESSION_3_SUMMARY.md) - What was built
- [QUICK_START.md](./QUICK_START.md) - Quick reference
