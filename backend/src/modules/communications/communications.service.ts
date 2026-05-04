import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createDto: CreateCommunicationDto, senderId: string) {
    // 1. Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: createDto.receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    // 2. Log message to database
    const communication = await this.prisma.communication.create({
      data: {
        subject: createDto.subject,
        content: createDto.content,
        senderId: senderId,
        receiverId: createDto.receiverId,
        status: 'PENDING',
      },
    });

    // 3. Emit event for background sending
    this.eventEmitter.emit('communication.created', {
      communicationId: communication.id,
      email: receiver.email,
      subject: createDto.subject,
      content: createDto.content,
    });

    // 4. Return success immediately
    return {
      message: 'Email has been queued for delivery',
      id: communication.id,
      status: 'PENDING'
    };
  }

  async sendPaymentSuccessEmail(userId: string, courseTitle: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    
    const subject = `[Money Lab] Thanh toán thành công khóa học ${courseTitle}`;
    const content = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #baff02; background: #000; padding: 10px;">Thanh toán thành công!</h2>
        <p>Xin chào <strong>${user.name}</strong>,</p>
        <p>Chúc mừng bạn đã đăng ký thành công khóa học <strong>${courseTitle}</strong> trên Money Lab.</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Chi tiết giao dịch:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li>Khóa học: ${courseTitle}</li>
            <li>Số tiền: ${formattedAmount}</li>
            <li>Trạng thái: Hoàn thành</li>
          </ul>
        </div>
        <p>Bây giờ bạn đã có thể truy cập vào khóa học trong trang Dashboard của mình.</p>
        <p>Chúc bạn có những trải nghiệm học tập tuyệt vời!</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Đây là email tự động từ hệ thống Money Lab, vui lòng không phản hồi email này.</p>
      </div>
    `;

    // Find an admin to be the "sender" of the system email
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    return this.create({
      receiverId: userId,
      subject,
      content,
    }, admin?.id || userId); // Fallback to userId if no admin found
  }

  async findAll() {
    return this.prisma.communication.findMany({
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
