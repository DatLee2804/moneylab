import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportStatus } from '@prisma/client';
import { MailService } from '../../common/mail.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createReportDto: { reportedEmail: string; reason: string }, reporterId: string) {
    const reportedUser = await this.prisma.user.findUnique({
      where: { email: createReportDto.reportedEmail },
    });

    if (!reportedUser) {
      throw new NotFoundException('User with the specified email not found');
    }

    return this.prisma.report.create({
      data: {
        reason: createReportDto.reason,
        reporterId,
        reportedUserId: reportedUser.id,
        status: ReportStatus.PENDING,
      },
    });
  }

  async findAll(role?: string) {
    const where: any = {};
    if (role === 'ADMIN') {
      where.reason = { contains: '[ESCALATED]' };
    }

    return this.prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByReporter(reporterId: string) {
    return this.prisma.report.findMany({
      where: { reporterId },
      include: {
        reportedUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolve(id: string, status: ReportStatus) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    
    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  async escalateToAdmin(id: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.report.update({
      where: { id },
      data: { 
        reason: `[ESCALATED] ${report.reason}`
      },
    });
  }

  async notifyUser(id: string, message: string) {
    const report = await this.prisma.report.findUnique({ 
      where: { id },
      include: {
        reportedUser: true
      }
    });

    if (!report || !report.reportedUser) {
      throw new NotFoundException('Report or reported user not found');
    }

    await this.mailService.sendCustomGeneral(
      report.reportedUser.email,
      'Thông báo cảnh báo vi phạm - Money Lab',
      message
    );

    return { success: true };
  }
}
