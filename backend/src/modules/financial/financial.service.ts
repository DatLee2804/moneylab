import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { SettingsService } from '../settings/settings.service';
import { MailService } from '../../common/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FinancialService {
  private readonly logger = new Logger(FinancialService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return { balance: Number(user.balance) };
  }

  async deposit(userId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const txRecord = await tx.transaction.create({
        data: {
          userId,
          amount,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.COMPLETED,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { balance: Number(user.balance) + amount },
      });

      return txRecord;
    });
  }

  private generateOrderCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ML';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createTransaction(userId: string, amount: number, type: TransactionType, idempotencyKey?: string) {
    this.logger.log(`Creating transaction: type=${type}, amount=${amount}, userId=${userId}`);
    if (idempotencyKey) {
      const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey } });
      if (existing) {
        return existing; // Chặn double-spending, trả về bản ghi cũ
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      
      if (type === TransactionType.WITHDRAWAL && Number(user.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Generate a unique orderCode
      let orderCode = this.generateOrderCode();
      let isUnique = false;
      while (!isUnique) {
        const existing = await tx.transaction.findUnique({ where: { orderCode } });
        if (!existing) {
          isUnique = true;
        } else {
          orderCode = this.generateOrderCode();
        }
      }

      return tx.transaction.create({
        data: {
          userId,
          amount,
          type,
          status: TransactionStatus.PENDING,
          idempotencyKey,
          orderCode,
        },
      });
    });
  }

  async completeTransaction(id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction already processed');
    }

    // Use a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: transaction.userId } });
      if (!user) throw new NotFoundException('User not found');

      const newBalance = transaction.type === TransactionType.WITHDRAWAL
        ? Number(user.balance) - Number(transaction.amount)
        : Number(user.balance) + Number(transaction.amount);

      await tx.user.update({
        where: { id: user.id },
        data: { balance: newBalance },
      });

      return tx.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });
    });
  }

  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processMoMoPayment(transactionId: string, courseId: string, userId: string, paidAmount: number) {
    this.logger.log(`Processing MoMo payment: transactionId=${transactionId}, amount=${paidAmount}, userId=${userId}`);
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { course: { include: { includedCourses: true } } }
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    
    // Idempotency check: If already completed, just return success
    if (transaction.status === TransactionStatus.COMPLETED) {
      return { status: 'ALREADY_PROCESSED', transaction };
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not in PENDING state');
    }

    // Amount verification: Compare paidAmount with transaction amount
    if (Number(transaction.amount) !== paidAmount) {
      console.error(`Amount mismatch for transaction ${transactionId}: Expected ${transaction.amount}, Received ${paidAmount}`);
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { 
          status: TransactionStatus.FAILED,
          description: `Amount mismatch. Received: ${paidAmount}, Expected: ${transaction.amount}`
        }
      });
      throw new BadRequestException('Paid amount does not match transaction amount');
    }

    // Atomic update status and create enrollment
    return this.prisma.$transaction(async (tx) => {
      // 1. Complete transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.COMPLETED }
      });

      // 2. Create enrollment(s)
      const coursesToEnroll = new Set<string>();
      coursesToEnroll.add(courseId);
      
      if (transaction.course?.isCombo && transaction.course?.includedCourses) {
        transaction.course.includedCourses.forEach(c => coursesToEnroll.add(c.id));
      }

      for (const cId of coursesToEnroll) {
        const existingEnrollment = await tx.enrollment.findUnique({
          where: {
            userId_courseId: { userId, courseId: cId }
          }
        });

        if (!existingEnrollment) {
          await tx.enrollment.create({
            data: {
              userId,
              courseId: cId,
              status: 'ENROLLED'
            }
          });
        }
      }

      // 3. Create Commission for Instructor
      if (transaction.courseId) {
        const course = await tx.course.findUnique({
          where: { id: transaction.courseId },
          select: { instructorId: true }
        });

        if (course) {
          const rateStr = await this.settingsService.getSetting('instructor_commission_rate');
          const ratePercentage = rateStr ? parseInt(rateStr) : 70;
          const commissionAmount = (paidAmount * ratePercentage) / 100;

          await tx.transaction.create({
            data: {
              userId: course.instructorId,
              courseId: transaction.courseId,
              amount: commissionAmount,
              type: TransactionType.COMMISSION,
              status: TransactionStatus.COMPLETED,
              description: `Hoa hồng từ khóa học: ${transaction.courseId} (${ratePercentage}%)`,
            }
          });

          // Update instructor balance
          await tx.user.update({
            where: { id: course.instructorId },
            data: {
              balance: { increment: commissionAmount }
            }
          });

          // Emit notification
          await this.notificationsService.createNotification(
            course.instructorId,
            'Hoa hồng mới',
            `Bạn vừa nhận được ${commissionAmount} VNĐ hoa hồng từ khóa học.`,
            'COMMISSION'
          );
        }
      }

      return { status: 'SUCCESS', transaction: updatedTransaction };
    });
  }

  async rejectTransaction(id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction already processed');
    }

    return this.prisma.$transaction(async (tx) => {
      // Refund balance if this was a rejected withdrawal
      if (transaction.type === TransactionType.WITHDRAWAL) {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { balance: { increment: transaction.amount } }
        });
      }

      return tx.transaction.update({
        where: { id },
        data: { status: TransactionStatus.FAILED },
      });
    });
  }

  async getInstructorRevenueStats(userId: string) {
    const now = new Date();
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const calculateSum = async (startDate: Date) => {
      const aggregate = await this.prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.COMMISSION,
          status: TransactionStatus.COMPLETED,
          createdAt: { gte: startDate }
        },
        _sum: { amount: true }
      });
      return Number(aggregate._sum.amount || 0);
    };

    const [weekly, monthly, yearly] = await Promise.all([
      calculateSum(startOfWeek),
      calculateSum(startOfMonth),
      calculateSum(startOfYear)
    ]);

    return { weekly, monthly, yearly };
  }

  async getInstructorRevenueDetails(instructorId: string) {
    const commissions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.COMMISSION,
        userId: instructorId,
        status: TransactionStatus.COMPLETED
      },
      include: {
        course: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = [];
    for (const commission of commissions) {
      const payment = await this.prisma.transaction.findFirst({
        where: {
          type: TransactionType.PAYMENT,
          status: TransactionStatus.COMPLETED,
          courseId: commission.courseId,
          createdAt: {
            gte: new Date(commission.createdAt.getTime() - 60000),
            lte: new Date(commission.createdAt.getTime() + 60000)
          }
        },
        include: {
          user: { select: { name: true, email: true } }
        }
      });

      result.push({
        id: commission.id,
        date: commission.createdAt,
        courseName: commission.course?.title || 'Unknown',
        studentName: payment?.user?.name || 'Unknown',
        studentEmail: payment?.user?.email || 'Unknown',
        coursePrice: payment ? Number(payment.amount) : 0,
        revenue: Number(commission.amount)
      });
    }
    return result;
  }

  async requestWithdrawal(userId: string, amount: number) {
    this.logger.log(`Processing withdrawal request for user ${userId}: amount=${amount}`);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (Number(user.balance) < amount) throw new BadRequestException('Insufficient balance');

    const bankInfoText = `${user.bankName} - ${user.bankAccount} (${user.bankOwner})`;

    return this.prisma.$transaction(async (tx) => {
      // Deduct balance immediately
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });

      const transaction = await tx.transaction.create({
        data: {
          userId,
          amount,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          bankInfo: bankInfoText,
        },
      });

      // Send mail to Admin
      await this.mailService.sendWithdrawalRequest('ledat2842004@gmail.com', user.name, amount);

      return transaction;
    });
  }

  async approveWithdrawal(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== TransactionStatus.PENDING) throw new BadRequestException('Transaction already processed');
    if (transaction.type !== TransactionType.WITHDRAWAL) throw new BadRequestException('Not a withdrawal transaction');

    return this.prisma.$transaction(async (tx) => {
      // Balance was already deducted when request was created
      const updated = await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date()
        }
      });

      // Send mail to Instructor
      await this.mailService.sendWithdrawalSuccess(transaction.user.email, Number(transaction.amount));

      return updated;
    });
  }

  async getPendingWithdrawals() {
    return this.prisma.transaction.findMany({
      where: {
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            bankName: true,
            bankAccount: true,
            bankOwner: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
