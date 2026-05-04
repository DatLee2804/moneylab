import { Controller, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly coursesService: CoursesService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course section' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: CreateSectionDto
  ) {
    return this.coursesService.updateSection(id, updateSectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course section' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.deleteSection(id);
  }
}
