import { Controller, Post, Get, Body, Param, Put, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('join/:courseId')
  @ApiOperation({ summary: 'Enroll current student in a course' })
  @ApiResponse({ status: 201, description: 'Successfully enrolled.' })
  async enroll(@Param('courseId') courseId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.enroll(userId, courseId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all courses current student is enrolled in' })
  async getMyCourses(@GetUser('id') userId: string) {
    return this.enrollmentsService.getStudentEnrollments(userId);
  }

  @Get('instructor/students')
  @Roles(UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Get all students enrolled in current instructor courses' })
  async getMyStudents(@GetUser('id') userId: string) {
    return this.enrollmentsService.getInstructorStudents(userId);
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Get all students enrolled in a specific course (Admin/Instructor only)' })
  async getCourseStudents(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseEnrollments(courseId);
  }

  @Patch('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Mark a lesson as completed' })
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @GetUser('id') userId: string,
  ) {
    return this.enrollmentsService.completeLesson(userId, lessonId);
  }
}
