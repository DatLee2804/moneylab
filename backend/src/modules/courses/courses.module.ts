import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { SectionsController } from './sections.controller';
import { LessonsController } from './lessons.controller';
import { VideosModule } from '../videos/videos.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [VideosModule, NotificationsModule],
  providers: [CoursesService, EnrollmentsService],
  controllers: [CoursesController, EnrollmentsController, SectionsController, LessonsController],
  exports: [CoursesService, EnrollmentsService],
})
export class CoursesModule {}
