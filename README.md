# SkillFlow 🎓

Plateforme de formation en ligne permettant aux formateurs de créer des cours et aux étudiants de les suivre à leur rythme.

## Architecture

```
skillflow/
├── backend/     # NestJS API REST (TypeScript)
├── frontend/    # Next.js (TypeScript)
├── worker/      # Worker asynchrone (TypeScript)
├── infra/       # IaC Terraform (GCP)
└── docs/        # Documentation & ADR
```

## Services

| Service    | Tech          | Port  |
|------------|---------------|-------|
| Backend    | NestJS        | 3000  |
| Frontend   | Next.js       | 4000  |
| Worker     | Node.js       | —     |
| IAM        | Keycloak      | 8080  |
| Queue      | GCP Pub/Sub (local: emulator) | — |
| DB         | PostgreSQL    | 5432  |

## Démarrage local

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp worker/.env.example worker/.env

docker-compose up
```

## Docs

- [Gitflow](./docs/GITFLOW.md)
- [Breaking Changes](./docs/BREAKING_CHANGES.md)
- [ADR](./docs/adr/)
