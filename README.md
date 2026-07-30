# BookMemo

Catalogue personnel de résumés de livres : idées clés, ce qu'il faut retenir, astuces et comment les appliquer. Classé par thème, lisible confortablement sur téléphone, tablette et ordinateur.

[Read this in English](./README.en.md)

## Fonctionnalités

- Catalogue de livres classés par thème, avec recherche et filtres (thème, statut de lecture)
- Fiche de lecture par livre avec sections repliables : idées clés, ce qu'il faut retenir, astuces, comment l'appliquer
- Ajout de livre avec génération automatique d'un brouillon de résumé (via l'API Claude), à relire et ajuster
- Récupération automatique de la couverture du livre (Open Library)
- Statut de lecture (à lire / en cours / lu) et note personnelle
- Export d'une fiche en PDF (impression du navigateur)
- Suggestions de livres pertinents à ajouter, adaptées aux centres d'intérêt
- Interface bilingue français / anglais
- Données stockées en local (localStorage du navigateur), rien n'est envoyé à un serveur en dehors de la génération de brouillon et de la recherche de couverture

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- next-intl pour le bilingue français / anglais
- Anthropic SDK (Claude) pour la génération de brouillon de résumé
- Open Library pour la recherche de couverture
- Stockage localStorage (pas de base de données en v1)

## Développement local

```bash
npm install
npm run dev
```

L'application est disponible sur [http://localhost:3450](http://localhost:3450).

## Variables d'environnement

Copier `.env.local.example` vers `.env.local` et renseigner une clé API Anthropic pour activer la génération automatique de brouillon de résumé :

```
ANTHROPIC_API_KEY=sk-ant-...
```

Sans cette clé, l'application fonctionne normalement mais le bouton "Générer un brouillon" affichera une erreur ; la saisie manuelle reste disponible.

## Tests et qualité

```bash
npm run lint
npx tsc --noEmit
```

## Déploiement

Déployé sur Vercel. Penser à configurer `ANTHROPIC_API_KEY` dans les variables d'environnement du projet Vercel pour que la génération de brouillon fonctionne en production.

## Licence

© 2026 Riadh MNASRI
