import { Controller, Get, Post, Body, Param, Put, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('public/instructors')
  @ApiOperation({ summary: 'Get all instructors (Public)' })
  @ApiResponse({ status: 200, description: 'Return all active instructors.' })
  async findInstructors(): Promise<User[]> {
    return this.usersService.findInstructors();
  }
  
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user profile.' })
  async getMe(@GetUser('id') userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all users (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'Return all users in the system.' })
  async findAll(@Query('role') role?: Role): Promise<User[]> {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        bankName: { type: 'string' },
        bankAccount: { type: 'string' },
        bankOwner: { type: 'string' }
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateData: Partial<User>): Promise<User> {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
