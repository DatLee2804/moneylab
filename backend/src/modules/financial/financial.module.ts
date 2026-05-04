import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { CoursesModule } from '../courses/courses.module';
import { CommunicationsModule } from '../communications/communications.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MomoService } from './momo.service';

@Module({
  imports: [CoursesModule, CommunicationsModule, NotificationsModule],
  providers: [FinancialService, MomoService],
  controllers: [FinancialController],
  exports: [FinancialService, MomoService],
})
export class FinancialModule {}
