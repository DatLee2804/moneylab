import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Affiliate')
@Controller('affiliate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post(['generate', 'generate/:courseId'])
  @ApiOperation({ summary: 'Generate an affiliate link (Global or Course-specific)' })
  async generateLink(
    @GetUser('id') userId: string,
    @Param('courseId') courseId?: string,
  ) {
    return this.affiliateService.createLink(userId, courseId);
  }

  @Get('my-links')
  @ApiOperation({ summary: 'Get all affiliate links for the current user' })
  async getMyLinks(@GetUser('id') userId: string) {
    return this.affiliateService.findByUser(userId);
  }

  @Get('click/:code')
  @ApiOperation({ summary: 'Record a click on an affiliate link and redirect' })
  async recordClick(@Param('code') code: string) {
    await this.affiliateService.recordClick(code);
    // Ideally this would return a 302 redirect via Res() object, but for MVP:
    return {
      message: 'Click recorded',
      action: 'REDIRECT',
      redirectTo: '/courses?ref=' + code
    };
  }
}
