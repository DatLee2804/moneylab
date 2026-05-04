import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AffiliateService {
  constructor(private readonly prisma: PrismaService) {}

  async createLink(userId: string, courseId?: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Generate a short-ish unique code
    const code = uuidv4().split('-')[0].toUpperCase();

    return this.prisma.affiliateLink.create({
      data: {
        userId,
        courseId: courseId || null,
        code,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.affiliateLink.findMany({
      where: { userId },
      include: {
        course: {
          select: { title: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordClick(code: string) {
    const link = await this.prisma.affiliateLink.findUnique({ where: { code } });
    if (!link) throw new NotFoundException('Affiliate link not found');

    return this.prisma.affiliateLink.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
      },
    });
  }
}
