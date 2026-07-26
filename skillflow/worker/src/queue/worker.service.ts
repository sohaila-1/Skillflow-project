import { PubSub, Subscription, Message } from '@google-cloud/pubsub';
import logger from '../shared/logger';
import { PermanentTaskError } from '../shared/task-error';
import { QuizCorrectionTask } from '../tasks/quiz-correction/quiz-correction.task';
import { CertificateGenerationTask } from '../tasks/certificate-generation/certificate-generation.task';

export type TaskType = 'QUIZ_CORRECTION' | 'CERTIFICATE_GENERATION' | 'SEND_EMAIL';

export type WorkerMessage = {
  correlationId: string;
  type: TaskType;
  payload: unknown;
};

/**
 * Per-task retry policy — criticality is decided by the worker, not the infra.
 *
 * - `maxAttempts`: how many Pub/Sub deliveries we tolerate before giving up.
 * - `retryable`:   whether TRANSIENT errors are worth retrying at all.
 *
 * A PermanentTaskError is NEVER retried regardless of this policy.
 */
type RetryPolicy = { maxAttempts: number; retryable: boolean };

const RETRY_POLICIES: Record<string, RetryPolicy> = {
  // Pure, deterministic computation — a failure means bad input. Retrying
  // is pointless, so fail fast and report back immediately.
  QUIZ_CORRECTION: { maxAttempts: 1, retryable: false },
  // PDF generation + SMTP delivery depend on external systems that can have
  // transient outages, so we retry a few times with the subscription backoff.
  CERTIFICATE_GENERATION: { maxAttempts: 5, retryable: true },
};

const DEFAULT_POLICY: RetryPolicy = { maxAttempts: 1, retryable: false };

export class WorkerService {
  private readonly pubsub: PubSub;
  private subscription!: Subscription;

  constructor() {
    this.pubsub = new PubSub({
      projectId: process.env.PUBSUB_PROJECT_ID,
    });
  }

  async start(): Promise<void> {
    const subName = process.env.PUBSUB_SUB_REQUESTS ?? 'worker-requests-sub';
    this.subscription = this.pubsub.subscription(subName);

    this.subscription.on('message', (msg: Message) => {
      void this.handleMessage(msg);
    });

    this.subscription.on('error', (err: unknown) => {
      logger.error({ err }, 'Pub/Sub subscription error');
    });

    logger.info({ subName }, 'Worker listening on subscription');
  }

  private async handleMessage(msg: Message): Promise<void> {
    let parsed: WorkerMessage;
    try {
      parsed = JSON.parse(msg.data.toString()) as WorkerMessage;
    } catch {
      logger.error({ msgId: msg.id }, 'Failed to parse message, acking to avoid poison pill');
      msg.ack();
      return;
    }

    const log = logger.child({ correlationId: parsed.correlationId, type: parsed.type });
    log.info('Processing message');

    try {
      let result: unknown;

      switch (parsed.type) {
        case 'QUIZ_CORRECTION':
          result = await QuizCorrectionTask.execute(parsed.payload);
          break;
        case 'CERTIFICATE_GENERATION':
          result = await CertificateGenerationTask.execute(parsed.payload);
          break;
        default:
          log.warn('Unknown task type — acking to discard');
          msg.ack();
          return;
      }

      await this.publishResponse(parsed.correlationId, parsed.type, 'success', result);
      msg.ack();
      log.info('Message processed successfully');
    } catch (err: unknown) {
      await this.handleFailure(msg, parsed, err);
    }
  }

  /**
   * Retry policy lives here, per task. We decide between:
   *  - PERMANENT failure (bad payload, or a non-retryable task) → report failure, ack.
   *  - TRANSIENT failure with attempts left → nack, let Pub/Sub redeliver with backoff.
   *  - TRANSIENT failure, attempts exhausted → report failure, ack (stop the loop).
   */
  private async handleFailure(
    msg: Message,
    parsed: WorkerMessage,
    err: unknown,
  ): Promise<void> {
    const log = logger.child({ correlationId: parsed.correlationId, type: parsed.type });
    const policy = RETRY_POLICIES[parsed.type] ?? DEFAULT_POLICY;
    const attempt = msg.deliveryAttempt ?? 1;
    const isPermanent = err instanceof PermanentTaskError || !policy.retryable;
    const exhausted = attempt >= policy.maxAttempts;
    const reason = err instanceof Error ? err.message : String(err);

    if (isPermanent || exhausted) {
      log.error(
        { err, attempt, maxAttempts: policy.maxAttempts, permanent: isPermanent },
        isPermanent ? 'Permanent failure — not retrying' : 'Retries exhausted — giving up',
      );
      // Always report a result — even on failure — so the backend is never left hanging.
      await this.publishResponse(parsed.correlationId, parsed.type, 'failure', null, reason);
      msg.ack();
    } else {
      log.warn(
        { err, attempt, maxAttempts: policy.maxAttempts },
        'Transient failure — nacking for retry',
      );
      msg.nack();
    }
  }

  private async publishResponse(
    correlationId: string,
    type: string,
    status: 'success' | 'failure',
    result: unknown,
    error?: string,
  ): Promise<void> {
    const topicName = process.env.PUBSUB_TOPIC_RESPONSES ?? 'worker-responses';
    const topic = this.pubsub.topic(topicName);
    const data = Buffer.from(
      JSON.stringify({ correlationId, type, status, result, error }),
    );
    await topic.publishMessage({ data });
  }
}
