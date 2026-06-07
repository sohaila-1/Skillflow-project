import { PubSub, Subscription } from '@google-cloud/pubsub';
import logger from '../shared/logger';
import { QuizCorrectionTask } from '../tasks/quiz-correction/quiz-correction.task';
import { CertificateGenerationTask } from '../tasks/certificate-generation/certificate-generation.task';

export type WorkerMessage = {
  correlationId: string;
  type: 'QUIZ_CORRECTION' | 'CERTIFICATE_GENERATION' | 'SEND_EMAIL';
  payload: unknown;
};

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

    this.subscription.on('message', (msg) => {
      void this.handleMessage(msg);
    });

    this.subscription.on('error', (err: unknown) => {
      logger.error({ err }, 'Pub/Sub subscription error');
    });

    logger.info({ subName }, 'Worker listening on subscription');
  }

  private async handleMessage(msg: {
    id: string;
    data: Buffer;
    ack: () => void;
    nack: () => void;
  }): Promise<void> {
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
          log.warn('Unknown task type');
          msg.ack();
          return;
      }

      await this.publishResponse(parsed.correlationId, parsed.type, result);
      msg.ack();
      log.info('Message processed successfully');
    } catch (err: unknown) {
      log.error({ err }, 'Task failed');
      // Nack — let Pub/Sub retry according to subscription retry policy
      msg.nack();
    }
  }

  private async publishResponse(
    correlationId: string,
    type: string,
    result: unknown,
  ): Promise<void> {
    const topicName = process.env.PUBSUB_TOPIC_RESPONSES ?? 'worker-responses';
    const topic = this.pubsub.topic(topicName);
    const data = Buffer.from(JSON.stringify({ correlationId, type, result }));
    await topic.publishMessage({ data });
  }
}
