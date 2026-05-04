import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketStatus, TicketType, Role } from '@prisma/client';
import { MailService } from '../../common/mail.service';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createTicketDto: any, senderId: string) {
    return this.prisma.supportTicket.create({
      data: {
        ...createTicketDto,
        senderId,
        status: TicketStatus.OPEN,
      },
    });
  }

  async findAll(role?: string) {
    const where: any = {};
    if (role === Role.ADMIN) {
      where.subject = { contains: '[ESCALATED]' };
    }

    return this.prisma.supportTicket.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySender(senderId: string) {
    return this.prisma.supportTicket.findMany({
      where: { senderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: TicketStatus, response?: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { sender: { select: { email: true } } },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    
    const updatedTicket = await this.prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    if (ticket.sender?.email) {
      const statusLabel = status === TicketStatus.CLOSED ? 'Đã xử lý' : 'Đang xử lý';
      let message = `Yêu cầu hỗ trợ của bạn đã được chuyển sang trạng thái: <strong>${statusLabel}</strong>.`;
      
      if (response) {
        message += `<br/><br/><strong>Phản hồi từ đội ngũ hỗ trợ:</strong><br/>${response.replace(/\n/g, '<br/>')}`;
      }

      await this.mailService.sendCustomGeneral(
        ticket.sender.email,
        `Cập nhật trạng thái hỗ trợ: ${ticket.subject}`,
        message
      );
    }

    return updatedTicket;
  }

  async escalateToAdmin(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.prisma.supportTicket.update({
      where: { id },
      data: { 
        type: TicketType.TECHNICAL, // Mark as technical for admin attention
        subject: `[ESCALATED] ${ticket.subject}`
      },
    });
  }

  async close(id: string) {
    return this.updateStatus(id, TicketStatus.CLOSED);
  }
}
