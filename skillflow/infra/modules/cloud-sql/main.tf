variable "environment" { type = string }
variable "region"      { type = string; default = "europe-west1" }
variable "db_password"  { type = string; sensitive = true }

resource "google_sql_database_instance" "postgres" {
  name             = "skillflow-db-${var.environment}"
  database_version = "POSTGRES_16"
  region           = var.region
  deletion_protection = false

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = var.environment == "prod"
    }

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        value = "0.0.0.0/0"
        name  = "all"
      }
    }
  }
}

resource "google_sql_database" "skillflow" {
  name     = "skillflow"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_database" "keycloak" {
  name     = "keycloak"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app" {
  name     = "skillflow"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

output "connection_name" { value = google_sql_database_instance.postgres.connection_name }
output "public_ip"       { value = google_sql_database_instance.postgres.public_ip_address }
output "database_url"    {
  value     = "postgresql://skillflow:${var.db_password}@${google_sql_database_instance.postgres.public_ip_address}:5432/skillflow"
  sensitive = true
}
