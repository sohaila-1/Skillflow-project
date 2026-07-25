# Git Flow — SkillFlow

## Branches

| Branche | Rôle |
|---------|------|
| `main` | Production — protégée, merge via PR uniquement |
| `develop` | Intégration — base pour les features |
| `feature/<nom>` | Développement d'une fonctionnalité |
| `fix/<nom>` | Correction de bug |
| `release/<version>` | Préparation d'une release |
| `hotfix/<nom>` | Correction urgente en prod |

## Workflow

```
feature/* ──→ develop ──→ release/* ──→ main
                                    ↗
hotfix/* ─────────────────────────
```

### Nouvelle feature

```bash
git checkout develop
git pull
git checkout -b feature/ma-feature
# ... commits ...
git push -u origin feature/ma-feature
# Ouvrir une PR vers develop
```

### Règles de PR

- Au moins **1 review** obligatoire
- Les pipelines CI doivent être vertes (lint + typecheck + tests + build)
- Commits en anglais, format : `type(scope): message`
  - Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`
  - Exemple : `feat(courses): add lesson ordering`

### Merge vers main

- Passer par une branche `release/x.y.z`
- Ouvrir une PR de `release/x.y.z` vers `main`
- Après merge, créer un tag git : `git tag v1.2.3 && git push origin v1.2.3`

## CI/CD

- **Pipeline automatique** : chaque push sur `main` déclenche pour chaque service (backend / worker / frontend) : lint → typecheck → tests → build → push Docker Hub
- **Pipeline de déploiement** : workflow `deploy.yml` — déclenché manuellement via `workflow_dispatch` ou automatiquement sur push vers `main`. Il construit et pousse les images vers GCP Artifact Registry puis met à jour les services Cloud Run via `gcloud run deploy`.

> Note : le déploiement automatique sur `main` permet un flux trunk-based simplifié. Pour un environnement de production strict, il est recommandé de restreindre le trigger `deploy.yml` à un `workflow_dispatch` manuel uniquement.
