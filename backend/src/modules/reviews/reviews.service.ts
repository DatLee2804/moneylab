import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, courseId: string, createReviewDto: CreateReviewDto) {
    // 1. Check if course exists
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // 2. Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You can only review courses you have enrolled in.');
    }

    // 3. Optional: Check if already reviewed (if we only want 1 review per user per course)
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this course.');
    }

    // 4. Create review
    return this.prisma.review.create({
      data: {
        content: createReviewDto.content,
        rating: createReviewDto.rating,
        userId,
        courseId,
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.review.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
