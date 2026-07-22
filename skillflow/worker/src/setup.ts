import { PubSub } from '@google-cloud/pubsub';
import logger from './shared/logger';

const REQUESTS_TOPIC = 'worker-requests';
const RESPONSES_TOPIC = 'worker-responses';
const REQUESTS_SUB = 'worker-requests-sub';
const RESPONSES_SUB = 'worker-responses-sub';

export async function setupPubSub(): Promise<void> {
  const pubsub = new PubSub({
    projectId: process.env.PUBSUB_PROJECT_ID ?? 'skillflow-local',
  });

  const [topics] = await pubsub.getTopics();
  const topicNames = topics.map((t) => t.name.split('/').pop()!);

  if (!topicNames.includes(REQUESTS_TOPIC)) {
    await pubsub.createTopic(REQUESTS_TOPIC);
    logger.info({ topic: REQUESTS_TOPIC }, 'Created topic');
  }
  if (!topicNames.includes(RESPONSES_TOPIC)) {
    await pubsub.createTopic(RESPONSES_TOPIC);
    logger.info({ topic: RESPONSES_TOPIC }, 'Created topic');
  }

  const requestsTopic = pubsub.topic(REQUESTS_TOPIC);
  const [requestsSubs] = await requestsTopic.getSubscriptions();
  const requestsSubNames = requestsSubs.map((s) => s.name.split('/').pop()!);

  if (!requestsSubNames.includes(REQUESTS_SUB)) {
    await requestsTopic.createSubscription(REQUESTS_SUB);
    logger.info({ sub: REQUESTS_SUB }, 'Created subscription');
  }

  const responsesTopic = pubsub.topic(RESPONSES_TOPIC);
  const [responsesSubs] = await responsesTopic.getSubscriptions();
  const responsesSubNames = responsesSubs.map((s) => s.name.split('/').pop()!);

  if (!responsesSubNames.includes(RESPONSES_SUB)) {
    await responsesTopic.createSubscription(RESPONSES_SUB);
    logger.info({ sub: RESPONSES_SUB }, 'Created subscription');
  }

  logger.info('PubSub setup complete');
}
