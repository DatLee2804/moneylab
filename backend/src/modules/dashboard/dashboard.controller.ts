import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('student/stats')
  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get summary stats for student' })
  async getStudentStats(@GetUser('id') userId: string) {
    return this.dashboardService.getStudentStats(userId);
  }

  @Get('instructor/stats')
  @Roles(Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Get summary stats for instructor' })
  async getInstructorStats(@GetUser('id') userId: string) {
    return this.dashboardService.getInstructorStats(userId);
  }

  @Get('admin/stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get global platform stats' })
  async getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('admin/report-data')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get comprehensive platform data for monthly reports' })
  async getFullReportData() {
    return this.dashboardService.getFullReportData();
  }
  @Get('admin/revenue-report')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get detailed revenue report for dashboard' })
  async getRevenueReport() {
    return this.dashboardService.getRevenueReport();
  }
}
