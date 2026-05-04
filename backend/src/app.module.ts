import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { SupportModule } from './modules/support/support.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FinancialModule } from './modules/financial/financial.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { MailModule } from './common/mail.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { VideosModule } from './modules/videos/videos.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    SupportModule,
    ReportsModule,
    FinancialModule,
    DashboardModule,
    AffiliateModule,
    MailModule,
    UploadsModule,
    VideosModule,
    CommunicationsModule,
    SettingsModule,
    NotificationsModule,
    ReviewsModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

