import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Placeholder configuration - User to fill SMTP credentials later
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get('SMTP_PORT') || 587,
      secure: false, 
      auth: {
        user: this.configService.get('SMTP_USER') || 'ledat2842004@gmail.com',
        pass: this.configService.get('SMTP_PASS') || 'your-app-password',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    // Real sending logic
    try {
      await this.transporter.sendMail({
        from: '"Money Lab" <ledat2842004@gmail.com>',
        to,
        subject,
        html,
      });
      console.log(`[MAIL SUCCESS] Sent to: ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendAccountLocked(to: string, reason: string) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #ef4444;">Tài khoản của bạn đã bị khóa</h2>
        <p>Chào bạn,</p>
        <p>Tài khoản của bạn trên hệ thống Money Lab đã bị khóa bởi người quản lý.</p>
        <p><strong>Lý do:</strong> ${reason}</p>
        <p>Nếu bạn có thắc mắc, vui lòng phản hồi lại email này hoặc liên hệ bộ phận hỗ trợ.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Đây là email tự động, vui lòng không trả lời trực tiếp.</p>
      </div>
    `;
    return this.sendMail(to, 'Thông báo khóa tài khoản - Money Lab', html);
  }

  async sendCourseStatus(to: string, courseTitle: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    const statusText = status === 'APPROVED' ? 'đã được duyệt' : 'bị từ chối';
    const statusColor = status === 'APPROVED' ? '#10b981' : '#ef4444';

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2>Thông báo trạng thái khóa học</h2>
        <p>Chào giảng viên,</p>
        <p>Khóa học <strong>"${courseTitle}"</strong> của bạn <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>.</p>
        ${reason ? `<p><strong>Lý do/Ghi chú:</strong> ${reason}</p>` : ''}
        <p>Cảm ơn bạn đã đóng góp nội dung cho Money Lab.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Money Lab Team</p>
      </div>
    `;
    return this.sendMail(to, `Thông báo trạng thái khóa học: ${courseTitle}`, html);
  }

  async sendCustomGeneral(to: string, subject: string, message: string) {
     const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2>Thông báo từ Money Lab</h2>
        <p>Chào bạn,</p>
        <p>${message}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Money Lab Team</p>
      </div>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendWithdrawalRequest(adminEmail: string, instructorName: string, amount: number) {
    const amountText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #6366f1;">Yêu cầu rút tiền mới</h2>
        <p>Chào Admin,</p>
        <p>Giảng viên <strong>${instructorName}</strong> vừa gửi một yêu cầu rút tiền mới.</p>
        <p><strong>Số tiền:</strong> <span style="font-size: 18px; font-weight: bold; color: #10b981;">${amountText}</span></p>
        <p>Vui lòng đăng nhập vào hệ thống quản trị để xử lý yêu cầu này.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Hệ thống Money Lab</p>
      </div>
    `;
    return this.sendMail(adminEmail, `Yêu cầu rút tiền mới từ ${instructorName}`, html);
  }

  async sendWithdrawalSuccess(to: string, amount: number) {
    const amountText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #10b981;">Thanh toán thành công</h2>
        <p>Chào giảng viên,</p>
        <p>Yêu cầu rút tiền của bạn đã được phê duyệt và xử lý thành công.</p>
        <p><strong>Số tiền đã chuyển:</strong> <span style="font-size: 18px; font-weight: bold; color: #10b981;">${amountText}</span></p>
        <p>Cảm ơn bạn đã đồng hành cùng Money Lab. Số tiền sẽ sớm được cập nhật vào tài khoản ngân hàng của bạn.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Hệ thống chuyển khoản tự động Money Lab</p>
      </div>
    `;
    return this.sendMail(to, 'Thông báo: Thanh toán hoàn thành - Money Lab', html);
  }
}
