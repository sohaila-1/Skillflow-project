variable "region"     { type = string; default = "europe-west1" }
variable "project_id" { type = string }

resource "google_artifact_registry_repository" "skillflow" {
  location      = var.region
  repository_id = "skillflow"
  format        = "DOCKER"
  description   = "SkillFlow Docker images"
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/skillflow"
}
