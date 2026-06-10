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

variable "backend_image"  { type = string }
variable "worker_image"   { type = string }
variable "frontend_image" { type = string }
variable "database_url"   { type = string; sensitive = true }
variable "keycloak_url"   { type = string }
