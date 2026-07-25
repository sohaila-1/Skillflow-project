import http from 'http';
import { setupPubSub } from './setup';
import { WorkerService } from './queue/worker.service';
import logger from './shared/logger';

async function main(): Promise<void> {
  logger.info('SkillFlow Worker starting...');

  // Cloud Run requires listening on PORT
  const port = process.env.PORT ?? '8080';
  const server = http.createServer((_, res) => {
    res.writeHead(200);
    res.end('ok');
  });
  server.listen(port, () => logger.info(`Health server on :${port}`));

  await setupPubSub();
  const worker = new WorkerService();
  await worker.start();
}

main().catch((err: unknown) => {
  logger.error({ err }, 'Worker failed to start');
  process.exit(1);
});
