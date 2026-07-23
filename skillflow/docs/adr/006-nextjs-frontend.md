# ADR-006 — Next.js 14 comme framework frontend

**Date** : 2025-09-01  
**Statut** : Accepté

## Contexte

L'interface utilisateur doit être une application web moderne, performante, avec du routage côté client, un typage statique (TypeScript), et une intégration simple avec Keycloak pour la gestion de l'authentification.

## Décision

Utilisation de **Next.js 14** (App Router) avec TypeScript.

- Next.js fournit le routage par fichiers, le rendu hybride SSR/SSG/CSR, et une configuration TypeScript zero-config.
- L'App Router (React Server Components) permet d'optimiser le chargement initial des pages publiques (liste de cours, page d'accueil).
- Le pattern `'use client'` explicite force la séparation entre composants serveur et client, ce qui améliore la réflexion sur l'architecture.
- La couche API est centralisée dans `lib/api.ts` (`apiFetch`) pour isoler les dépendances réseau du reste du code.

## Alternatives considérées

- **React SPA (Vite)** : Plus simple mais sans SSR ni routing intégré. Requiert plus de configuration.
- **Vue.js / Nuxt** : Bonne alternative mais l'équipe est plus familière avec React/Next.js.

## Conséquences

- Les composants utilisant Keycloak (client-only) doivent être explicitement marqués `'use client'`.
- Les variables d'environnement publiques doivent être préfixées `NEXT_PUBLIC_`.
- Le build de production génère un répertoire `.next` qui doit être copié dans le Dockerfile production.
