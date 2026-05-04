import { Controller, Post, Body, Param, Get, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('courses/:courseId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @GetUser('id') userId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(userId, courseId, createReviewDto);
  }

  @Get()
  findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.reviewsService.findByCourse(courseId);
  }
}
