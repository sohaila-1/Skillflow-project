import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub, Message } from '@google-cloud/pubsub';
import { IssueCertificateUseCase } from '@modules/certificates/application/issue-certificate.use-case';

type WorkerResponse = {
  correlationId: string;
  type: 'CERTIFICATE_GENERATION' | 'QUIZ_CORRECTION';
  result: unknown;
};

type CertificateResult = {
  userId: string;
  courseId: string;
  emailSent: boolean;
};

type QuizCorrectionResult = {
  submissionId: string;
  score: number;
  total: number;
  passed: boolean;
};

@Injectable()
export class WorkerResponseSubscriber implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkerResponseSubscriber.name);
  private readonly pubsub: PubSub;
  private readonly subscriptionName: string;
  private readonly topicName: string;

  constructor(
    config: ConfigService,
    private readonly issueCertificate: IssueCertificateUseCase,
  ) {
    this.pubsub = new PubSub({
      projectId: config.get<string>('PUBSUB_PROJECT_ID') ?? 'skillflow-local',
    });
    this.subscriptionName = config.get<string>('PUBSUB_SUB_RESPONSES') ?? 'worker-responses-sub';
    this.topicName = config.get<string>('PUBSUB_TOPIC_RESPONSES') ?? 'worker-responses';
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.ensureSubscriptionExists();
    const subscription = this.pubsub.subscription(this.subscriptionName);
    subscription.on('message', (msg: Message) => void this.handleMessage(msg));
    subscription.on('error', (err: unknown) => {
      this.logger.error({ err }, 'worker-responses subscription error');
    });
    this.logger.log(`Listening on ${this.subscriptionName}`);
  }

  private async ensureSubscriptionExists(): Promise<void> {
    try {
      const topic = this.pubsub.topic(this.topicName);
      const [subs] = await topic.getSubscriptions();
      const names = subs.map((s) => s.name.split('/').pop()!);
      if (!names.includes(this.subscriptionName)) {
        await topic.createSubscription(this.subscriptionName);
        this.logger.log(`Created subscription ${this.subscriptionName}`);
      }
    } catch (err) {
      this.logger.warn(
        { err },
        'Could not ensure subscription exists — worker may not have run setup yet',
      );
    }
  }

  private async handleMessage(msg: Message): Promise<void> {
    let parsed: WorkerResponse;
    try {
      parsed = JSON.parse(msg.data.toString()) as WorkerResponse;
    } catch {
      this.logger.error(
        { msgId: msg.id },
        'Unparseable worker response — acking to discard poison pill',
      );
      msg.ack();
      return;
    }

    try {
      switch (parsed.type) {
        case 'CERTIFICATE_GENERATION': {
          const result = parsed.result as CertificateResult;
          await this.issueCertificate.markEmailStatus(
            result.userId,
            result.courseId,
            result.emailSent,
          );
          if (result.emailSent) {
            this.logger.log(
              {
                correlationId: parsed.correlationId,
                userId: result.userId,
                courseId: result.courseId,
              },
              'Certificate email sent successfully',
            );
          } else {
            this.logger.warn(
              {
                correlationId: parsed.correlationId,
                userId: result.userId,
                courseId: result.courseId,
              },
              'Certificate email failed — cert already in DB, email not delivered',
            );
          }
          break;
        }
        case 'QUIZ_CORRECTION': {
          const result = parsed.result as QuizCorrectionResult;
          this.logger.log(
            {
              correlationId: parsed.correlationId,
              submissionId: result.submissionId,
              score: result.score,
              total: result.total,
              passed: result.passed,
            },
            'Quiz correction result received',
          );
          break;
        }
        default: {
          const unknownType = (parsed as WorkerResponse).type;
          this.logger.warn({ type: unknownType }, 'Unknown worker response type');
          break;
        }
      }
      msg.ack();
    } catch (err) {
      this.logger.error(
        { err, correlationId: parsed.correlationId },
        'Error handling worker response — nacking for retry',
      );
      msg.nack();
    }
  }
}
