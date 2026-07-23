variable "environment" { type = string }
variable "project_id"   { type = string }

resource "google_pubsub_topic" "requests" {
  name = "worker-requests-${var.environment}"
}

resource "google_pubsub_topic" "responses" {
  name = "worker-responses-${var.environment}"
}

# Dead-letter topic for unprocessable worker requests
resource "google_pubsub_topic" "requests_dlq" {
  name = "worker-requests-dlq-${var.environment}"
}

resource "google_pubsub_subscription" "worker_requests" {
  name  = "worker-requests-sub-${var.environment}"
  topic = google_pubsub_topic.requests.name

  ack_deadline_seconds = 60

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.requests_dlq.id
    max_delivery_attempts = 5
  }
}

# Subscription on the DLQ for manual inspection / alerting
resource "google_pubsub_subscription" "requests_dlq_sub" {
  name  = "worker-requests-dlq-sub-${var.environment}"
  topic = google_pubsub_topic.requests_dlq.name

  ack_deadline_seconds = 600
}

# Allow Pub/Sub to forward dead-lettered messages to the DLQ topic
resource "google_pubsub_topic_iam_member" "dlq_publisher" {
  topic  = google_pubsub_topic.requests_dlq.name
  role   = "roles/pubsub.publisher"
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

data "google_project" "project" {
  project_id = var.project_id
}

resource "google_pubsub_subscription" "backend_responses" {
  name  = "backend-responses-sub-${var.environment}"
  topic = google_pubsub_topic.responses.name

  ack_deadline_seconds = 30
}

output "requests_topic_name" { value = google_pubsub_topic.requests.name }
output "responses_topic_name" { value = google_pubsub_topic.responses.name }
