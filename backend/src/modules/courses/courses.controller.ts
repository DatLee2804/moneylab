import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete,
  UseGuards, 
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role, CourseStatus } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course (Instructor/Admin only)' })
  async create(
    @Body() createCourseDto: CreateCourseDto, 
    @GetUser('id') userId: string
  ) {
    return this.coursesService.create(createCourseDto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course details' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: any
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination' })
  async findAll(
    @Query('status') status?: CourseStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    return this.coursesService.findAllPage(status, pageNumber, limitNumber);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  @ApiBearerAuth()
  async findMyCourses(
    @GetUser('id') userId: string,
    @Query('isCombo') isCombo?: boolean
  ) {
    return this.coursesService.findByInstructor(userId, isCombo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course approval status (Admin/Manager only)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: CourseStatus,
    @Body('reason') reason?: string
  ) {
    return this.coursesService.updateStatus(id, status, reason);
  }

  // Section Management
  @Post(':id/sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course section' })
  async createSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSectionDto: CreateSectionDto
  ) {
    return this.coursesService.createSection(id, createSectionDto);
  }

  // Lessons and Sections creation only
  // Modification and Deletion of Sections/Lessons are handled in SectionsController and LessonsController

  // Lesson Management
  @Post('sections/:sectionId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a lesson in a section' })
  async createLesson(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() createLessonDto: CreateLessonDto
  ) {
    return this.coursesService.createLesson(sectionId, createLessonDto);
  }

  // Modification and Deletion of Lessons are handled in LessonsController
}
