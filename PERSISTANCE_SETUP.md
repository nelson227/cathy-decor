# 🗄️ Configuration Persistance des Données (Railway)

## ⚠️ Problème résolu
Les données ne persistaient pas car :
1. **SQLite** stocke les données dans un fichier local
2. **Les images** étaient sauvegardées sur le serveur local

Sur les plateformes serverless (Railway, Vercel), les fichiers sont effacés à chaque redéploiement.

**Solution** : 
- **PostgreSQL** sur Railway pour les données
- **Cloudinary** pour les images

---

## 🚀 Étape 1 : Ajouter PostgreSQL sur Railway

### 1.1 Créer la base de données

1. Allez sur [railway.app](https://railway.app) et connectez-vous
2. Ouvrez votre projet **cathy-decor**
3. Cliquez sur **+ New** → **Database** → **Add PostgreSQL**
4. Railway va créer une base de données PostgreSQL automatiquement

### 1.2 Connecter le Backend à PostgreSQL

1. Dans votre projet Railway, cliquez sur le service **backend** (pas la DB)
2. Allez dans l'onglet **Variables**
3. Cliquez sur **Add Variable Reference** ou **+ New Variable**
4. Ajoutez cette variable :
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
   *(Railway va automatiquement remplacer par l'URL réelle)*

5. Cliquez **Deploy** pour redéployer le backend

---

## 🖼️ Étape 2 : Configurer Cloudinary (Images)

### 2.1 Créer un compte Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com) et créez un compte gratuit
2. Une fois connecté, allez dans **Dashboard**
3. Copiez les informations :
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2.2 Ajouter les variables sur Railway

1. Dans votre projet Railway, cliquez sur le service **backend**
2. Allez dans **Variables**
3. Ajoutez ces 3 variables :
   ```
   CLOUDINARY_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

4. Cliquez **Deploy** pour redéployer

---

## 📝 Variables d'environnement complètes

Sur Railway (backend), vous devez avoir :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `CLOUDINARY_NAME` | Votre cloud name |
| `CLOUDINARY_API_KEY` | Votre API key |
| `CLOUDINARY_API_SECRET` | Votre API secret |
| `JWT_SECRET` | Un secret aléatoire |
| `FRONTEND_URL` | `https://cathy-decor.vercel.app` |
| `NODE_ENV` | `production` |

---

## ✅ Vérification

Après le redéploiement :
1. Allez sur votre site
2. Connectez-vous à Admin
3. Ajoutez une décoration/produit avec une image
4. Vérifiez que c'est visible depuis un autre appareil (téléphone)
5. Attendez quelques minutes, actualisez - les données doivent persister

---

## 🔧 En cas de problème

Vérifiez les logs Railway : Projet → Backend → Logs

✅ Vous devez voir :
```
🔌 Connecting to PostgreSQL database...
✅ PostgreSQL Database Connected
```

❌ Si vous voyez `Using SQLite`, vérifiez la variable `DATABASE_URL`

✅ Pour les images, si Cloudinary fonctionne :
```
📤 Uploading to Cloudinary...
```

❌ Si vous voyez `Uploading to local storage`, vérifiez les variables Cloudinary
