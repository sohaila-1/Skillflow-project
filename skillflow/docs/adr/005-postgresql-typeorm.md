# ADR-005 — PostgreSQL + TypeORM comme base de données

**Date** : 2025-09-01  
**Statut** : Accepté

## Contexte

Le backend doit persister plusieurs entités métier (cours, enrollements, certificats, quiz, utilisateurs) avec des relations entre elles. Il faut une base de données relationnelle fiable, un ORM TypeScript-natif pour éviter les requêtes SQL brutes, et une solution compatible avec le déploiement sur GCP.

## Décision

Utilisation de **PostgreSQL 16** comme SGBD et **TypeORM** comme ORM.

- PostgreSQL est proposé en service managé sur GCP (Cloud SQL), avec sauvegardes automatiques et haute disponibilité.
- TypeORM offre un support natif TypeScript avec décorateurs, migrations, et un mode `synchronize` pratique en développement.
- La séparation Repository Port / Implémentation TypeORM permet d'isoler le domaine de l'ORM (pattern Ports & Adapters).

## Alternatives considérées

- **MongoDB** : Écarté car le schéma est bien défini et les relations entre entités sont nombreuses. Un SGBD relationnel est plus adapté.
- **Prisma** : Bonne alternative mais génère du code, ce qui complexifie les tests et le DDD. TypeORM avec des décorateurs s'intègre mieux avec NestJS.

## Conséquences

- `synchronize: true` en développement uniquement — les migrations TypeORM doivent être utilisées en production.
- L'interface `RepositoryPort` doit être implémentée pour chaque entité afin de maintenir l'isolation du domaine.
- Cloud SQL sur GCP implique un coût mensuel même en tier minimal.
