# Gestion des Breaking Changes

## Stratégie

SkillFlow utilise le **versionning URI** pour gérer les breaking changes côté backend sans impact sur le frontend en production.

- Version courante : `/v1/...`
- Nouvelle version : `/v2/...`
- Les deux versions coexistent dans le même déploiement backend.

## Procédure lors d'une Breaking Change

### 1. Créer la nouvelle version de la route

```typescript
// Ancienne route
@Controller({ path: 'courses', version: '1' })
export class CoursesV1Controller { ... }

// Nouvelle route (breaking change)
@Controller({ path: 'courses', version: '2' })
export class CoursesV2Controller { ... }
```

### 2. Rédiger un ADR

Documenter la décision dans `docs/adr/XXX-breaking-change-<description>.md`.

### 3. Déployer le backend

Le backend est déployé **une seule fois** avec les deux versions. Le frontend continue d'utiliser `/v1`.

### 4. Mettre à jour le frontend

Une PR frontend migre les appels de `/v1` vers `/v2`. Une fois mergée et déployée, `/v1` peut être dépréciée.

### 5. Déprécier l'ancienne version

Après confirmation que plus aucun client n'utilise `/v1`, supprimer le contrôleur V1.

## Exemple de démonstration (rendu final)

La route `GET /v1/courses/:id` retourne la réponse complète avec le tableau `sections[]` contenant toutes les leçons.

La route `GET /v2/courses/:id` retourne une réponse enrichie et restructurée :

```json
{
  "id": "...",
  "title": "Python for Beginners",
  "description": "...",
  "category": "Programming",
  "level": "Beginner",
  "published": true,
  "curriculum": [
    { "sectionTitle": "Introduction", "lessonCount": 3, "totalDurationMinutes": 45 }
  ],
  "stats": {
    "totalSections": 4,
    "totalLessons": 12,
    "totalDurationMinutes": 180
  }
}
```

Les sections détaillées (`sections[].lessons[]`) sont supprimées et remplacées par `curriculum[]` (résumé par section) et `stats` (agrégats globaux). C'est un **breaking change** : un client qui accède aux leçons via `sections[].lessons[]` sera cassé.

Le frontend peut être déployé en version v1 ou v2 sans redéploiement du backend.

## Vérification rapide

```bash
# v1 — retourne sections[] avec les leçons
curl https://api.skillflow.io/v1/courses/<id>

# v2 — retourne curriculum[] + stats (breaking change)
curl https://api.skillflow.io/v2/courses/<id>
```
