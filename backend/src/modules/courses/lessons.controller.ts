import { Controller, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { UpdateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a lesson detail internally' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getLessonDetail(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto
  ) {
    return this.coursesService.updateLesson(id, updateLessonDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.deleteLesson(id);
  }
}
