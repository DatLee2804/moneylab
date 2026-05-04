import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all system settings (Admin only)' })
  async findAll() {
    const settings = await this.settingsService.getAllSettings();
    return settings;
  }

  @Patch()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a system setting (Admin only)' })
  async update(@Body() data: { key: string, value: string }) {
    return this.settingsService.updateSetting(data.key, data.value);
  }
}
