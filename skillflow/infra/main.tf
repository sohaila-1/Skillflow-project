terraform {
  required_version = ">= 1.8"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {
    bucket = "skillflow-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Artifact Registry ─────────────────────────────────────
module "artifact_registry" {
  source     = "./modules/artifact-registry"
  region     = var.region
  project_id = var.project_id
}

# ── Cloud SQL (PostgreSQL) ────────────────────────────────
module "cloud_sql" {
  source      = "./modules/cloud-sql"
  environment = var.environment
  region      = var.region
  db_password = var.db_password
}

# ── Pub/Sub ───────────────────────────────────────────────
module "pubsub" {
  source      = "./modules/pubsub"
  environment = var.environment
}

# ── Cloud Run — Backend ───────────────────────────────────
module "cloud_run_backend" {
  source       = "./modules/cloud-run"
  environment  = var.environment
  service_name = "skillflow-backend"
  image        = var.backend_image
  port         = 3000
  env_vars = {
    NODE_ENV       = var.environment
    DATABASE_URL   = module.cloud_sql.database_url
    KEYCLOAK_URL   = var.keycloak_url
    KEYCLOAK_REALM = "skillflow"
  }
}

# ── Cloud Run — Worker ────────────────────────────────────
module "cloud_run_worker" {
  source       = "./modules/cloud-run"
  environment  = var.environment
  service_name = "skillflow-worker"
  image        = var.worker_image
  port         = 8080
  env_vars = {
    NODE_ENV          = var.environment
    PUBSUB_PROJECT_ID = var.project_id
  }
}

# ── Cloud Run — Frontend ──────────────────────────────────
module "cloud_run_frontend" {
  source       = "./modules/cloud-run"
  environment  = var.environment
  service_name = "skillflow-frontend"
  image        = var.frontend_image
  port         = 4000
  env_vars = {
    NEXT_PUBLIC_API_URL            = module.cloud_run_backend.url
    NEXT_PUBLIC_KEYCLOAK_URL       = var.keycloak_url
    NEXT_PUBLIC_KEYCLOAK_REALM     = "skillflow"
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "skillflow-frontend"
  }
}

# ── Outputs ───────────────────────────────────────────────
output "backend_url"        { value = module.cloud_run_backend.url }
output "frontend_url"       { value = module.cloud_run_frontend.url }
output "worker_url"         { value = module.cloud_run_worker.url }
output "registry_url"       { value = module.artifact_registry.repository_url }
output "db_connection_name" { value = module.cloud_sql.connection_name }
