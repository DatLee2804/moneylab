import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunicationsService } from './communications.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Communications')
@Controller('communications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Send email to instructor or student (Admin/Manager only)' })
  async create(
    @Body() createDto: CreateCommunicationDto, 
    @GetUser('id') userId: string
  ) {
    return this.communicationsService.create(createDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get communication history' })
  async findAll() {
    return this.communicationsService.findAll();
  }
}
