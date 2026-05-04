import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { SupportTicket } from '../modules/support/entities/support-ticket.entity';
import { Report } from '../modules/reports/entities/report.entity';
import { Transaction } from '../modules/financial/entities/transaction.entity';
import { Enrollment } from '../modules/courses/entities/enrollment.entity';
import { CourseSection } from '../modules/courses/entities/section.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { SeedsService } from './seeds.service';
import { DatabaseController } from './database.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER') || 'user_nguyen',
        password: configService.get<string>('DB_PASSWORD') || 'password_nguyen',
        database: configService.get<string>('DB_NAME') || 'academy',
        entities: [User, Course, SupportTicket, Report, Transaction, Enrollment, CourseSection, Lesson],
        synchronize: true, // Chỉ dùng trong quá trình dev
      }),
    }),
    TypeOrmModule.forFeature([User, Course, SupportTicket, Report, Transaction, Enrollment, CourseSection, Lesson]),
  ],
  providers: [SeedsService],
  controllers: [DatabaseController],
  exports: [TypeOrmModule, SeedsService],
})
export class DatabaseModule {}
