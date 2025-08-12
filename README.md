# Natura Afrika - Boutique de Beauté Naturelle

## À propos du projet

Natura Afrika est une boutique en ligne spécialisée dans les produits de beauté naturels made in Africa. Notre plateforme propose des soins visage, cheveux et des box personnalisées avec des ingrédients authentiques africains.

## Technologies utilisées

Ce projet est construit avec :

- **Vite** - Outil de build rapide
- **TypeScript** - Typage statique
- **React** - Bibliothèque UI
- **shadcn-ui** - Composants UI modernes
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation
- **React Query** - Gestion d'état serveur
- **Sonner** - Notifications toast

## Installation et développement

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```sh
# 1. Cloner le repository
git clone <URL_DU_REPO>

# 2. Naviguer vers le répertoire du projet
cd afro-boutique

# 3. Installer les dépendances
npm install

# 4. Démarrer le serveur de développement
npm run dev
```

Le serveur de développement sera accessible à l'adresse `http://localhost:8080`

### Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run build:dev` - Construit l'application en mode développement
- `npm run lint` - Lance l'analyseur de code
- `npm run preview` - Prévisualise la build de production

## Structure du projet

```
src/
├── components/     # Composants React
│   ├── admin/     # Interface d'administration
│   ├── auth/      # Authentification
│   ├── client/    # Interface client
│   └── ui/        # Composants UI réutilisables
├── pages/         # Pages de l'application
├── services/      # Services API
├── hooks/         # Hooks personnalisés
├── types/         # Définitions TypeScript
└── providers/     # Providers React
```

## Fonctionnalités

- **Catalogue de produits** - Navigation et recherche de produits
- **Panier d'achat** - Gestion du panier avec persistance
- **Authentification** - Inscription et connexion utilisateur
- **Commandes** - Suivi des commandes et historique
- **Interface admin** - Gestion des produits et commandes
- **Support client** - Système de support intégré

## Déploiement

Le projet peut être déployé sur n'importe quelle plateforme supportant les applications React statiques :

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
