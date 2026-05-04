import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  UseGuards, 
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role, ReportStatus } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a report against another user' })
  @ApiResponse({ status: 201, description: 'Report successfully submitted.' })
  async create(
    @Body() createReportDto: CreateReportDto, 
    @GetUser('id') userId: string
  ) {
    return this.reportsService.create(createReportDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'List all reports (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'Return all reports in the system.' })
  async findAll(@GetUser('role') role: string) {
    return this.reportsService.findAll(role);
  }

  @Get('my-reports')
  @ApiOperation({ summary: 'Get reports submitted by current user' })
  async findMyReports(@GetUser('id') userId: string) {
    return this.reportsService.findByReporter(userId);
  }

  @Patch(':id/resolve')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update report resolution status (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'UUID of the report' })
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ReportStatus
  ) {
    return this.reportsService.resolve(id, status);
  }

  @Patch(':id/escalate')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Escalate report to Admin' })
  async escalate(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.escalateToAdmin(id);
  }

  @Post(':id/notify')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Send notification email to reported user' })
  async notify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('message') message: string
  ) {
    return this.reportsService.notifyUser(id, message);
  }
}
