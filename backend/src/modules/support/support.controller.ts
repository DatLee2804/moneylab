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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role, TicketStatus } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Support')
@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket successfully created.' })
  async create(
    @Body() createTicketDto: CreateTicketDto, 
    @GetUser('id') userId: string
  ) {
    return this.supportService.create(createTicketDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'List all support tickets (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'Return all tickets in the system.' })
  async findAll(@GetUser('role') role: string) {
    return this.supportService.findAll(role);
  }

  @Get('my-tickets')
  @ApiOperation({ summary: 'Get current user tickets' })
  async findMyTickets(@GetUser('id') userId: string) {
    return this.supportService.findBySender(userId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update ticket status (Admin/Manager only)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: TicketStatus,
    @Body('response') response?: string
  ) {
    return this.supportService.updateStatus(id, status, response);
  }

  @Patch(':id/escalate')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Escalate a ticket to Admin (Manager only)' })
  async escalate(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.escalateToAdmin(id);
  }
}
