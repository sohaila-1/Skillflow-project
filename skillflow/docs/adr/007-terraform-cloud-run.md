# ADR-007 — Terraform + GCP Cloud Run comme infrastructure et plateforme de déploiement

**Date** : 2025-09-05  
**Statut** : Accepté

## Contexte

Le projet doit être déployé sur un cloud public et accessible via HTTPS. L'infrastructure doit être reproductible, versionnée, et capable de supporter plusieurs environnements (dev, prod). Les coûts doivent rester maîtrisés dans le cadre d'un projet étudiant.

## Décision

Utilisation de **Terraform** pour l'IaC et **Google Cloud Run** comme plateforme de déploiement des services conteneurisés.

- Cloud Run est serverless : facturation à la requête, scale-to-zero, zéro gestion de cluster. Idéal pour maîtriser les coûts.
- GCP offre un tier gratuit généreux (Cloud Run, Pub/Sub, Artifact Registry).
- Terraform permet de versionner l'infrastructure, de la reproduire sur différents environnements via des fichiers `.tfvars`, et de gérer les dépendances entre ressources.
- L'état Terraform est stocké dans un bucket GCS (`skillflow-tfstate`) pour le partage en équipe.

## Alternatives considérées

- **Kubernetes (GKE)** : Écarté car les coûts sont significatifs et la complexité opérationnelle est disproportionnée pour ce projet.
- **AWS Lambda + ECS** : Viable mais l'équipe est plus familière avec GCP. Les services GCP (Cloud Run, Pub/Sub) s'intègrent naturellement.
- **Pulumi** : Alternative à Terraform en TypeScript, mais Terraform a un écosystème de modules plus mûr pour GCP.

## Conséquences

- Les ressources sont organisées en modules Terraform réutilisables (`cloud-run`, `cloud-sql`, `pubsub`, `artifact-registry`).
- Chaque environnement a son propre fichier `terraform.tfvars` dans `infra/environments/<env>/`.
- `deletion_protection` doit être activé en production pour éviter la destruction accidentelle de la base de données.
- Les secrets (mots de passe DB, clés API) doivent être fournis via des variables `sensitive = true` et ne jamais être committés.
