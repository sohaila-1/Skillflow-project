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

module "pubsub" {
  source      = "./modules/pubsub"
  environment = var.environment
}

module "cloud_run_backend" {
  source        = "./modules/cloud-run"
  environment   = var.environment
  service_name  = "skillflow-backend"
  image         = var.backend_image
  port          = 3000
  env_vars      = {
    NODE_ENV        = var.environment
    DATABASE_URL    = var.database_url
    KEYCLOAK_URL    = var.keycloak_url
    KEYCLOAK_REALM  = "skillflow"
  }
}

module "cloud_run_worker" {
  source       = "./modules/cloud-run"
  environment  = var.environment
  service_name = "skillflow-worker"
  image        = var.worker_image
  port         = 8080
  env_vars     = {
    NODE_ENV           = var.environment
    PUBSUB_PROJECT_ID  = var.project_id
  }
}

module "cloud_run_frontend" {
  source       = "./modules/cloud-run"
  environment  = var.environment
  service_name = "skillflow-frontend"
  image        = var.frontend_image
  port         = 4000
  env_vars     = {
    NEXT_PUBLIC_API_URL = module.cloud_run_backend.url
  }
}
