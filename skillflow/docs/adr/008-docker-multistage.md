# ADR-008 — Docker multi-stage build pour les images de production

**Date** : 2025-09-05  
**Statut** : Accepté

## Contexte

Les services (backend, worker, frontend) doivent être livrés sous forme de conteneurs Docker. Les images doivent être légères, sécurisées, et optimisées pour la production tout en restant utilisables en développement avec hot-reload.

## Décision

Utilisation d'un **Dockerfile multi-stage** à 4 étapes pour chaque service :

1. **`deps`** — installe uniquement les dépendances de production (`npm ci --omit=dev`).
2. **`build`** — installe toutes les dépendances et compile TypeScript (`npm run build`).
3. **`development`** — image de développement avec hot-reload (`npm run start:dev`).
4. **`production`** — copie uniquement le résultat compilé de `build` et les `node_modules` de `deps`. Lance avec `node dist/main` (pas de `npm`). Utilisateur non-root `skillflow`.

Image de base : `node:20.16.0-alpine` — image officielle Node.js, version LTS épinglée, basée sur Alpine pour minimiser la taille.

## Alternatives considérées

- **Image unique** : Plus simple mais inclut les devDependencies et le code source TypeScript non compilé en production. Taille d'image significativement plus grande et surface d'attaque plus large.
- **`node:20-alpine` (tag flottant)** : Écarté car un tag flottant peut changer entre deux builds, rendant les builds non reproductibles.

## Conséquences

- Les images de production ne contiennent pas de code source TypeScript ni de devDependencies.
- La commande de démarrage est `node dist/main` (pas `npm start`) pour éviter un processus npm intermédiaire et permettre une gestion propre des signaux Unix (SIGTERM).
- Un `.dockerignore` est présent pour chaque service afin d'exclure `node_modules`, `.env`, et `dist` du contexte de build.
- La cible `development` est utilisée dans `docker-compose.yml` pour le développement local.
