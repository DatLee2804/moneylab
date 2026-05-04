import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get('seed')
  @ApiOperation({ summary: 'Seed database with mock data' })
  @ApiResponse({ status: 200, description: 'Seeding completed successfully.' })
  async seed() {
    return this.seedsService.seed();
  }
}
