# ADR-004 — Gestion des Breaking Changes par versionning URI

**Date :** 2025-09-01  
**Statut :** Accepté

## Contexte

Le frontend et le backend peuvent évoluer à des rythmes différents. Une breaking change du backend ne doit pas bloquer le frontend en production.

## Décision

Utilisation du **versionning par URI** (`/v1/...`, `/v2/...`) natif à NestJS (`VersioningType.URI`).

Procédure documentée dans `docs/BREAKING_CHANGES.md`.

## Conséquences

- ✅ Deux versions coexistent dans le même binaire — pas de redéploiement backend nécessaire
- ✅ Le frontend choisit sa version via l'URL
- ✅ Simple à implémenter et comprendre
- ⚠️ Maintenance de N versions en parallèle — déprecier rapidement les anciennes
