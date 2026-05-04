import { Module } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CommunicationsController } from './communications.controller';
import { CommunicationListener } from './listeners/communication.listener';
import { MailModule } from '../../common/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CommunicationListener],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
