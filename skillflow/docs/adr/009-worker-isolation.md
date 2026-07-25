# ADR-009 — Isolation complète du Worker vis-à-vis du Backend

**Date** : 2025-09-10  
**Statut** : Accepté

## Contexte

Le sujet impose que le Worker soit complètement isolé du Backend : pas d'accès à la base de données du backend, pas d'appels synchrones vers le backend. La communication doit se faire exclusivement via une queue (Pub/Sub).

## Décision

Le Worker est un **service Node.js indépendant** qui :

- N'a aucune dépendance vers TypeORM, Prisma, ou tout autre ORM.
- N'a pas de variable `DATABASE_URL` dans son environnement.
- Reçoit toutes les données nécessaires à son traitement **dans le message Pub/Sub** (pas de requête vers une API ou une DB).
- Publie ses résultats sur le topic `worker-responses` que le Backend consomme.
- Ne peut pas appeler le Backend de manière synchrone (HTTP interdit).

### Communication

```
Backend → (Pub/Sub: worker-requests) → Worker
Worker  → (Pub/Sub: worker-responses) → Backend
```

Le Backend est le seul responsable de la persistance (mise à jour du statut `emailSent` sur le certificat après confirmation du Worker).

### Politique de retry

Définie au niveau de la souscription Pub/Sub (Terraform) :
- Backoff minimum : 10s, maximum : 600s
- Maximum de tentatives : 5
- Dead-letter topic dédié : `worker-requests-dlq` pour les messages non traitables

## Alternatives considérées

- **Worker avec accès en lecture seule à la DB** : Écarté car crée un couplage implicite sur le schéma de la base. Le contrat de communication (message Pub/Sub) est plus stable et explicite.
- **Appel HTTP synchrone du Worker vers le Backend** : Écarté car viole le principe d'isolation et crée une dépendance de disponibilité circulaire.

## Conséquences

- Le message Pub/Sub doit contenir toutes les informations nécessaires au Worker (userId, email, courseTitle, score, etc.).
- Le Backend doit gérer le cas où la réponse du Worker n'arrive jamais (timeout ou message perdu en production).
- Les tâches du Worker doivent être idempotentes : un retry ne doit pas envoyer deux emails pour le même certificat.
