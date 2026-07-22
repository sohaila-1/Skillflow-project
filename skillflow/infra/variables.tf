variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west1"
}

variable "environment" {
  description = "Deployment environment (dev | prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be 'dev' or 'prod'."
  }
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "keycloak_url" {
  description = "Keycloak base URL"
  type        = string
}

variable "backend_image"  { type = string; description = "Backend Docker image URL" }
variable "worker_image"   { type = string; description = "Worker Docker image URL" }
variable "frontend_image" { type = string; description = "Frontend Docker image URL" }
