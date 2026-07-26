/**
 * Marks a task failure as PERMANENT — retrying will never succeed
 * (e.g. malformed payload, missing required fields, business-invalid input).
 *
 * The worker never re-queues a PermanentTaskError: it reports the failure
 * to the backend on the response queue and acks the message immediately.
 *
 * Any other thrown error is treated as TRANSIENT (infra hiccup, SMTP down…)
 * and is retried according to the task's RetryPolicy.
 */
export class PermanentTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermanentTaskError';
  }
}
