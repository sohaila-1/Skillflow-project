variable "environment" { type = string }

resource "google_pubsub_topic" "requests" {
  name = "worker-requests-${var.environment}"
}

resource "google_pubsub_topic" "responses" {
  name = "worker-responses-${var.environment}"
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
    dead_letter_topic     = google_pubsub_topic.requests.id
    max_delivery_attempts = 5
  }
}

resource "google_pubsub_subscription" "backend_responses" {
  name  = "backend-responses-sub-${var.environment}"
  topic = google_pubsub_topic.responses.name

  ack_deadline_seconds = 30
}
