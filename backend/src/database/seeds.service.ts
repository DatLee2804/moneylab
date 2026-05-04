import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../modules/users/entities/user.entity';
import { Course, CourseStatus } from '../modules/courses/entities/course.entity';
import { SupportTicket, TicketStatus, TicketType } from '../modules/support/entities/support-ticket.entity';
import { Report, ReportStatus } from '../modules/reports/entities/report.entity';
import { Transaction, TransactionStatus, TransactionType } from '../modules/financial/entities/transaction.entity';
import { Enrollment, EnrollmentStatus } from '../modules/courses/entities/enrollment.entity';
import { CourseSection } from '../modules/courses/entities/section.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    @InjectRepository(SupportTicket) private readonly ticketRepository: Repository<SupportTicket>,
    @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Enrollment) private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(CourseSection) private readonly sectionRepository: Repository<CourseSection>,
    @InjectRepository(Lesson) private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    const hashedPassword = await bcrypt.hash('123456', 10);

    // 1. Seed Users
    this.logger.log('Seeding users...');
    const usersData = [
      {
        email: 'admin@moneylab.vn',
        password: hashedPassword,
        name: 'Quản trị viên',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'instructor@moneylab.vn',
        password: hashedPassword,
        name: 'Thầy Giáo B',
        role: UserRole.INSTRUCTOR,
        status: UserStatus.ACTIVE,
        bankName: 'Vietcombank',
        bankAccount: '1234567890',
        bankOwner: 'THAY GIAO B',
        balance: 15000000,
      },
      {
        email: 'student@moneylab.vn',
        password: hashedPassword,
        name: 'Học Viên A',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      },
    ];

    const savedUsers = [];
    for (const u of usersData) {
      let user = await this.userRepository.findOne({ where: { email: u.email } });
      if (!user) {
        user = await this.userRepository.save(this.userRepository.create(u));
      }
      savedUsers.push(user);
    }

    const instructor = savedUsers.find(u => u.role === UserRole.INSTRUCTOR);
    const student = savedUsers.find(u => u.role === UserRole.STUDENT);

    // 2. Seed Courses
    this.logger.log('Seeding courses...');
    const coursesData = [
      {
        title: 'Xây Dựng Website Bằng AI',
        description: 'Hướng dẫn chi tiết từ Zero đến Hero cách sử dụng AI để lập trình website nhanh chóng.',
        coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        price: 499000,
        isFree: false, // PAID course
        category: 'Lập trình',
        status: CourseStatus.APPROVED,
        instructorId: instructor.id,
      },
      {
        title: 'Thiết kế UI/UX Hiện Đại',
        description: 'Khám phá bí quyết tạo ra giao diện người dùng đẹp mắt và trải nghiệm người dùng tuyệt vời.',
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
        price: 0,
        isFree: true, // FREE course
        category: 'Thiết kế',
        status: CourseStatus.APPROVED,
        instructorId: instructor.id,
      },
    ];

    const savedCourses = [];
    for (const c of coursesData) {
      let existing = await this.courseRepository.findOne({ where: { title: c.title } });
      if (!existing) {
        existing = await this.courseRepository.save(this.courseRepository.create(c));
      } else {
        // Update existing to ensure pricing is seeded
        existing.isFree = c.isFree;
        existing.price = c.price;
        await this.courseRepository.save(existing);
      }
      savedCourses.push(existing);
    }

    // 3. Seed Sections & Lessons
    this.logger.log('Seeding curriculum (Sections & Lessons)...');
    for (const course of savedCourses) {
      // Check if sections already exist
      const existingSections = await this.sectionRepository.find({ where: { courseId: course.id } });
      if (existingSections.length === 0) {
        const sectionsData = course.isFree 
          ? [
              { title: 'Chương 1: Cơ bản về UI/UX', order: 1 },
              { title: 'Chương 2: Thực hành Figma', order: 2 }
            ]
          : [
              { title: 'Chương 1: Tổng quan về AI', order: 1 },
              { title: 'Chương 2: Vibe Coding nâng cao', order: 2 },
              { title: 'Chương 3: Triển khai Website', order: 3 }
            ];

        for (const sData of sectionsData) {
          const section = await this.sectionRepository.save(this.sectionRepository.create({
            ...sData,
            courseId: course.id
          }));

          // Create 2-3 lessons per section
          for (let i = 1; i <= 3; i++) {
            await this.lessonRepository.save(this.lessonRepository.create({
              title: `Bài học ${i}: Nội dung chi tiết của ${sData.title}`,
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              duration: 10 + i * 5,
              order: i,
              isPreview: !course.isFree && sData.order === 1 && i === 1, // Preview only for 1st lesson of 1st section in PAID courses
              sectionId: section.id
            }));
          }
        }
      }
    }

    // 4. Seed Enrollments
    this.logger.log('Seeding enrollments...');
    if (student && savedCourses.length > 0) {
      for (const course of savedCourses) {
        const existing = await this.enrollmentRepository.findOne({ 
          where: { userId: student.id, courseId: course.id } 
        });
        if (!existing) {
          await this.enrollmentRepository.save(this.enrollmentRepository.create({
            userId: student.id,
            courseId: course.id,
            progress: Math.floor(Math.random() * 80),
            status: EnrollmentStatus.IN_PROGRESS,
          }));
        }
      }
    }

    // 5. Seed Support Tickets
    this.logger.log('Seeding support tickets...');
    const tickets = [
      {
        subject: 'Cần hỗ trợ kích hoạt khóa học',
        content: 'Tôi đã thanh toán nhưng khóa học vẫn đang ở trạng thái chờ kích hoạt.',
        type: TicketType.BILLING,
        status: TicketStatus.OPEN,
        senderId: student.id,
      },
    ];

    for (const t of tickets) {
      const existing = await this.ticketRepository.findOne({ where: { subject: t.subject, senderId: t.senderId } });
      if (!existing) {
        await this.ticketRepository.save(this.ticketRepository.create(t));
      }
    }

    // 6. Seed Reports
    this.logger.log('Seeding reports...');
    const reports = [
      {
        reason: 'Có dấu hiệu spam trong bình luận khóa học.',
        status: ReportStatus.PENDING,
        reporterId: student.id,
        reportedUserId: instructor.id,
      },
    ];

    for (const r of reports) {
      const existing = await this.reportRepository.findOne({ where: { reporterId: r.reporterId, reportedUserId: r.reportedUserId } });
      if (!existing) {
        await this.reportRepository.save(this.reportRepository.create(r));
      }
    }

    // 7. Seed Transactions
    this.logger.log('Seeding transactions...');
    const transactions = [
      {
        amount: 5000000,
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
        userId: instructor.id,
      },
    ];

    for (const tr of transactions) {
      const existing = await this.transactionRepository.findOne({ where: { userId: tr.userId, amount: tr.amount, type: tr.type } });
      if (!existing) {
        await this.transactionRepository.save(this.transactionRepository.create(tr));
      }
    }

    this.logger.log('Database seeding completed!');
    return { message: 'Seeding completed successfully' };
  }
}
