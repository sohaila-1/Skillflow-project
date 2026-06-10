variable "service_name" { type = string }
variable "environment"  { type = string }
variable "image"        { type = string }
variable "port"         { type = number }
variable "env_vars"     { type = map(string); default = {} }

resource "google_cloud_run_v2_service" "this" {
  name     = "${var.service_name}-${var.environment}"
  location = "europe-west1"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.image
      ports { container_port = var.port }

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_v2_service.this.name
  location = google_cloud_run_v2_service.this.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "url" { value = google_cloud_run_v2_service.this.uri }
