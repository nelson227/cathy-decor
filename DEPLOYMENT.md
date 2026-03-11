# Guide de Déploiement - Cathy Décor

Ce guide explique comment déployer le projet sur **Vercel** (frontend) et **Railway** (backend + PostgreSQL).

---

## Architecture de Production

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEURS                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│   VERCEL                                                         │
│   https://cathy-decor.vercel.app                                 │
│   Frontend React/Vite                                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ API REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│   RAILWAY                                                        │
│   https://cathy-decor-production.up.railway.app                  │
│   Backend Express.js + PostgreSQL                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Étape 1: Déployer le Backend sur Railway

### 1.1 Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez **"Login with GitHub"**
3. Autorisez l'accès

### 1.2 Créer le projet

1. Cliquez **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez le repo `cathy-decor`
4. Railway détecte automatiquement le backend Node.js

### 1.3 Configurer le service

1. Cliquez sur le service créé
2. Allez dans **Settings**
3. Définissez le **Root Directory**: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

### 1.4 Ajouter PostgreSQL

1. Dans le projet Railway
2. Cliquez **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway crée automatiquement la base de données

### 1.5 Variables d'environnement

Dans le service backend → **Variables**:

```env
# Référence automatique à PostgreSQL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Configuration
NODE_ENV=production
JWT_SECRET=votre_secret_tres_long_et_complexe

# CORS
FRONTEND_URL=https://cathy-decor.vercel.app

# Cloudinary (optionnel - pour upload via backend)
CLOUDINARY_NAME=dc9z1q1c8
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 1.6 Déployer

1. Cliquez **"Deploy"**
2. Attendez que le build termine
3. Notez l'URL générée (ex: `cathy-decor-production.up.railway.app`)

---

## Étape 2: Déployer le Frontend sur Vercel

### 2.1 Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez **"Continue with GitHub"**

### 2.2 Importer le projet

1. Cliquez **"Add New..."** → **"Project"**
2. Importez le repo `cathy-decor`
3. Vercel détecte Vite automatiquement

### 2.3 Configuration

| Paramètre | Valeur |
|-----------|--------|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 2.4 Variables d'environnement

Dans **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://cathy-decor-production.up.railway.app/api
```

> Remplacez l'URL par celle de votre backend Railway.

### 2.5 Déployer

1. Cliquez **"Deploy"**
2. Attendez ~2 minutes
3. Votre site est live sur `https://cathy-decor.vercel.app`

---

## Étape 3: Configurer CORS

Sur Railway, vérifiez que `FRONTEND_URL` pointe vers votre domaine Vercel:

```env
FRONTEND_URL=https://cathy-decor.vercel.app
```

Redéployez le backend après modification.

---

## Vérification

### Tester l'API

```bash
curl https://cathy-decor-production.up.railway.app/api/health
```

Réponse attendue:
```json
{
  "success": true,
  "message": "API is running"
}
```

### Tester le frontend

1. Ouvrez https://cathy-decor.vercel.app
2. Vérifiez que les pages se chargent
3. Testez la connexion admin

---

## Mises à jour

Les deux plateformes redéploient automatiquement à chaque push sur GitHub.

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push
# → Vercel et Railway redéploient automatiquement
```

---

## Dépannage

### Erreur CORS

Vérifiez que `FRONTEND_URL` sur Railway correspond exactement à l'URL Vercel (sans `/` final).

### Erreur de connexion BDD

Vérifiez que `DATABASE_URL` est bien configuré comme `${{Postgres.DATABASE_URL}}`.

### Build échoue sur Vercel

Vérifiez le **Root Directory** = `frontend`.

### Build échoue sur Railway

Vérifiez le **Root Directory** = `backend`.

---

## Domaine personnalisé

### Vercel
1. Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS chez votre registrar

### Railway
1. Settings → Domains
2. Ajoutez un domaine personnalisé
3. Configurez les DNS

---

## Coûts

| Service | Plan Gratuit |
|---------|--------------|
| **Vercel** | 100 GB bandwidth/mois |
| **Railway** | $5 de crédits/mois |
| **Cloudinary** | 25 crédits/mois |

Pour un site à faible trafic, le plan gratuit suffit.
