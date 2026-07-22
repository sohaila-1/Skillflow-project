import { setupPubSub } from './setup';
import { WorkerService } from './queue/worker.service';
import logger from './shared/logger';

async function main(): Promise<void> {
  logger.info('SkillFlow Worker starting...');
  await setupPubSub();
  const worker = new WorkerService();
  await worker.start();
}

main().catch((err: unknown) => {
  logger.error({ err }, 'Worker failed to start');
  process.exit(1);
});
