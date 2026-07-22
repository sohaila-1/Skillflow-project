import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';
import { randomUUID } from 'crypto';

export type WorkerMessage = {
  correlationId: string;
  type: 'CERTIFICATE_GENERATION' | 'SEND_EMAIL';
  payload: unknown;
};

@Injectable()
export class PubSubService {
  private readonly logger = new Logger(PubSubService.name);
  private readonly pubsub: PubSub;
  private readonly topic: string;

  constructor(config: ConfigService) {
    this.pubsub = new PubSub({
      projectId: config.get('PUBSUB_PROJECT_ID') ?? 'skillflow-local',
    });
    this.topic = config.get('PUBSUB_TOPIC_REQUESTS') ?? 'worker-requests';
  }

  async publish(type: WorkerMessage['type'], payload: unknown): Promise<void> {
    const message: WorkerMessage = { correlationId: randomUUID(), type, payload };
    const data = Buffer.from(JSON.stringify(message));
    try {
      await this.pubsub.topic(this.topic).publishMessage({ data });
      this.logger.log(`Published ${type} (${message.correlationId})`);
    } catch (err) {
      // Non-blocking: log and continue — certificate is already saved in DB
      this.logger.warn({ err }, `Failed to publish ${type} to PubSub`);
    }
  }
}
