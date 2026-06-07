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
- Tag git créé sur main : `git tag v1.2.3`
- Le tag déclenche la pipeline de déploiement

## CI/CD

- Chaque push sur `main` déclenche : lint → typecheck → tests → build → push Docker
- Le déploiement sur GCP Cloud Run est manuel (workflow `deploy-production.yml`)
