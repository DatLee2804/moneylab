import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { LessonCommentsService } from './lesson-comments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('lesson-comments')
export class LessonCommentsController {
  constructor(private readonly lessonCommentsService: LessonCommentsService) {}

  @Post(':lessonId')
  @UseGuards(JwtAuthGuard)
  create(
    @GetUser('id') userId: string,
    @Param('lessonId') lessonId: string,
    @Body('content') content: string,
  ) {
    return this.lessonCommentsService.create(userId, lessonId, content);
  }

  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.lessonCommentsService.findByLesson(lessonId);
  }

  @Get('instructor/student/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  findByInstructorStudent(
    @GetUser('id') instructorId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.lessonCommentsService.findByInstructorStudent(instructorId, studentId);
  }
}
