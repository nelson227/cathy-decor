# Configuration Vercel ↔️ Railway

## ✅ Étapes déjà configurées:

### 1. CORS au Backend (Express)
Le backend déjà a CORS configuré dans `backend/src/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 2. API Frontend utilise variables d'environnement
Le frontend déjà utilise `import.meta.env.VITE_API_URL` dans `frontend/src/services/api.js`

---

## 🚀 À faire maintenant:

### Sur Railway (Backend Deployment):

1. Allez sur votre projet Railway
2. Allez dans **Variables** 
3. Ajoutez cette variable:
   ```
   FRONTEND_URL=https://cathy-decor.vercel.app
   ```
   *(Remplacez par votre URL Vercel réelle)*

4. Cliquez sur **Deploy** pour redéployer avec les nouveaux paramètres

### Sur Vercel (Frontend Deployment):

1. Allez sur votre projet Vercel (cathy-decor)
2. Allez dans **Settings** → **Environment Variables**
3. Ajoutez cette variable:
   ```
   VITE_API_URL=https://cathy-decor-backend.up.railway.app/api
   ```
   *(Remplacez avec votre URL Railway réelle)*

4. Redéployez: allez dans **Deployments** et cliquez sur **Redeploy** pour le dernier déploiement

---

## 📝 Comment trouver les URLs:

- **Railway URL**: Dans votre projet Railway → **Connect** → copie le lien du service
- **Vercel URL**: Dans votre projet Vercel → copie le lien en haut

---

## ✨ Après configuration:

Le frontend Vercel pourra faire des requêtes au backend Railway sans erreurs CORS!
