# ADR-001 — Choix de NestJS + TypeScript pour le Backend

**Date :** 2025-09-01  
**Statut :** Accepté

## Contexte

Le projet requiert un backend avec annotations de types obligatoires et évaluation statique du typage. Plusieurs options ont été envisagées : NestJS (TypeScript), FastAPI (Python + MyPy), Spring Boot (Java).

## Décision

Utilisation de **NestJS** avec **TypeScript strict** (`strict: true`, sans `any`).

Raisons :
- TypeScript natif avec support complet des décorateurs (IoC/DI)
- Écosystème cohérent avec le frontend (Next.js)
- Support natif de l'injection de dépendances facilitant l'isolation des dépendances externes
- Grande communauté et maintenabilité

## Conséquences

- ✅ Type safety end-to-end
- ✅ DI native facilite les tests unitaires (mocking)
- ✅ Swagger intégré via `@nestjs/swagger`
- ⚠️ Courbe d'apprentissage pour les décorateurs
