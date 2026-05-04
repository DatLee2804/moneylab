import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../../common/mail.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CommunicationListener {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('communication.created', { async: true })
  async handleCommunicationCreated(payload: any) {
    const { communicationId, email, subject, content } = payload;
    
    console.log(`[ Communication Listener ] Processing email for ${email} (subject: ${subject})`);
    
    try {
      // Perform the actual SMTP send
      await this.mailService.sendCustomGeneral(email, subject, content);
      
      // Update status to SENT
      await this.prisma.communication.update({
        where: { id: communicationId },
        data: { status: 'SENT' },
      });
      
      console.log(`[ Communication Listener ] Success: Email sent to ${email}`);
    } catch (error) {
      console.error(`[ Communication Listener ] Failed to send email to ${email}:`, error);
      
      // Update status to FAILED
      await this.prisma.communication.update({
        where: { id: communicationId },
        data: { status: 'FAILED' },
      });
    }
  }
}
