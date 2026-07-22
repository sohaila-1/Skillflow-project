import { Global, Module } from '@nestjs/common';
import { CertificatesModule } from '@modules/certificates/certificates.module';
import { PubSubService } from './pubsub.service';
import { WorkerResponseSubscriber } from './worker-response.subscriber';

@Global()
@Module({
  imports: [CertificatesModule],
  providers: [PubSubService, WorkerResponseSubscriber],
  exports: [PubSubService],
})
export class PubSubModule {}
