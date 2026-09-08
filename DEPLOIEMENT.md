# ISO Network — Guide de déploiement Vercel

## Étape 1 — Configurer le Vercel Blob Store

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur **Storage** → **Create Database** → choisissez **Blob**
3. Donnez un nom (ex : `iso-network-blob`)
4. Notez le `BLOB_READ_WRITE_TOKEN` généré

## Étape 2 — Déployer le projet

```bash
# Dans le dossier du projet
cd C:\Users\bk\.gemini\antigravity\scratch\iso-network

# Initialiser git (si pas déjà fait)
git add .
git commit -m "feat: ISO Network V1 — catalogue + admin CMS"

# Pousser sur GitHub (créer le repo d'abord sur github.com)
git remote add origin https://github.com/VOTRE_USERNAME/iso-network.git
git branch -M main
git push -u origin main
```

Ou utiliser directement la Vercel CLI :
```bash
npm install -g vercel
vercel --prod
```

## Étape 3 — Variables d'environnement sur Vercel

Dans **Project Settings → Environment Variables**, ajouter :

| Variable | Valeur |
|----------|--------|
| `BLOB_READ_WRITE_TOKEN` | Token du Blob Store (étape 1) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Votre numéro WhatsApp (ex: `2250700000000`) |
| `ADMIN_PASSWORD` | Mot de passe admin de votre choix |

> ⚠️ Si vous liez le Blob Store directement au projet Vercel (Dashboard → Project → Storage → Connect), `BLOB_READ_WRITE_TOKEN` est injecté automatiquement.

## Étape 4 — Vérification

- `https://votre-site.vercel.app/` → Page d'accueil avec le catalogue
- `https://votre-site.vercel.app/catalogue` → Catalogue filtrable
- `https://votre-site.vercel.app/admin/login` → Connexion admin
- `https://votre-site.vercel.app/admin` → Dashboard (après connexion)

## Espace Admin — Fonctionnalités

| Action | Comment |
|--------|---------|
| Ajouter un produit | Bouton **+ Ajouter** → Remplir le formulaire |
| Photos | Glisser-déposer des images → Upload automatique vers Vercel Blob |
| Modifier | Icône crayon sur n'importe quel produit |
| Supprimer | Icône poubelle + confirmation |
| Mettre en avant | Cocher "Mettre en avant sur la page d'accueil" |
| Se déconnecter | Bouton en haut à droite |

## Structure du projet

```
iso-network/
├── app/
│   ├── page.tsx              ← Page d'accueil
│   ├── catalogue/page.tsx    ← Catalogue filtrable
│   ├── admin/
│   │   ├── page.tsx          ← Dashboard admin
│   │   └── login/page.tsx    ← Connexion
│   └── api/
│       ├── products/route.ts ← CRUD produits (Vercel Blob)
│       ├── upload/route.ts   ← Upload images (Vercel Blob)
│       └── auth/route.ts     ← Login/logout
├── components/
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── CategoriesSection.tsx
│   ├── FeaturedProducts.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── CatalogueClient.tsx
│   ├── QuoteModal.tsx
│   ├── WhyISONetwork.tsx
│   ├── ProSection.tsx
│   ├── Footer.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       └── ProductFormModal.tsx
├── lib/
│   ├── blob.ts               ← Client Vercel Blob
│   ├── utils.ts              ← Utilitaires (prix, WhatsApp URL)
│   └── seed-data.ts          ← 8 produits de démo
├── types/index.ts
├── middleware.ts             ← Protection route /admin
└── .env.example
```
