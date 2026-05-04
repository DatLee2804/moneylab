import { PrismaClient, Role, CourseStatus, EnrollmentStatus, TransactionType, TransactionStatus, TicketStatus, TicketType, ReportStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  // Deletion order to respect foreign keys
  await prisma.affiliateLink.deleteMany();
  await prisma.report.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');
  const password = await bcrypt.hash('123456', 10);

  // 1. Create Users (10 total)
  const adminEmail = 'admin@moneylab.vn';
  const userEmail = 'ledat2842004@gmail.com';
  const managerEmail = 'manager@moneylab.vn';

  const mainAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      password,
      name: 'System Admin',
      role: Role.ADMIN,
      status: 'ACTIVE',
    },
  });

  const leDat = await prisma.user.create({
    data: {
      email: userEmail,
      password,
      name: 'Le Dat',
      role: Role.ADMIN,
      status: 'ACTIVE',
    },
  });

  const mainManager = await prisma.user.create({
    data: {
      email: managerEmail,
      password,
      name: 'Manager User',
      role: Role.MANAGER,
      status: 'ACTIVE',
    },
  });

  // Create more users to reach 10
  const instructors = [];
  for (let i = 0; i < 3; i++) {
    const instructor = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password,
        name: faker.person.fullName(),
        role: Role.INSTRUCTOR,
        status: 'ACTIVE',
        balance: faker.number.int({ min: 1000000, max: 20000000 }),
        specialization: faker.person.jobTitle(),
        bio: faker.lorem.paragraph(),
        location: faker.location.city(),
      },
    });
    instructors.push(instructor);
  }

  const students = [];
  for (let i = 0; i < 3; i++) {
    const student = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password,
        name: faker.person.fullName(),
        role: Role.STUDENT,
        status: 'ACTIVE',
        balance: faker.number.int({ min: 0, max: 1000000 }),
      },
    });
    students.push(student);
  }

  const affiliate = await prisma.user.create({
    data: {
      email: 'affiliate@moneylab.vn',
      password,
      name: 'Affiliate Partner',
      role: Role.AFFILIATE,
      status: 'ACTIVE',
      affiliateCode: 'PARTNER10',
    },
  });

  // Total 10 users: 2 admin, 1 manager, 3 instructor, 3 student, 1 affiliate = 10.

  // 2. Create Courses (10 total)
  const courses = [];
  const categories = ['Finance', 'Programming', 'Marketing', 'Soft Skills', 'Design'];
  for (let i = 0; i < 10; i++) {
    const instructor = instructors[i % instructors.length];
    const course = await prisma.course.create({
      data: {
        title: faker.commerce.productName() + ' Masterclass',
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 100000, max: 5000000 }),
        category: faker.helpers.arrayElement(categories),
        status: faker.helpers.arrayElement([CourseStatus.APPROVED, CourseStatus.PENDING]),
        instructorId: instructor.id,
        isFree: faker.datatype.boolean(0.1),
      },
    });
    courses.push(course);
  }

  // 3. Create Course Sections (10 total)
  const sections = [];
  for (let i = 0; i < 10; i++) {
    const course = courses[i % courses.length];
    const section = await prisma.courseSection.create({
      data: {
        title: `Section ${i + 1}: ${faker.lorem.words(3)}`,
        order: i,
        courseId: course.id,
      },
    });
    sections.push(section);
  }

  // 4. Create Lessons (10 total)
  for (let i = 0; i < 10; i++) {
    const section = sections[i % sections.length];
    await prisma.lesson.create({
      data: {
        title: `Lesson ${i + 1}: ${faker.lorem.words(4)}`,
        content: faker.lorem.paragraphs(2),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: faker.number.int({ min: 5, max: 60 }),
        order: i,
        sectionId: section.id,
        isPreview: i === 0,
      },
    });
  }

  // 5. Create Enrollments (10 total)
  for (let i = 0; i < 10; i++) {
    const student = students[i % students.length];
    const course = courses[i % courses.length];
    // Use upsert to be safe even though we cleaned
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        progress: faker.number.int({ min: 0, max: 100 }),
        status: faker.helpers.arrayElement([EnrollmentStatus.ENROLLED, EnrollmentStatus.IN_PROGRESS, EnrollmentStatus.COMPLETED]),
      },
    });
  }

  // 6. Create Transactions (Linked to Enrollments)
  const allEnrollments = await prisma.enrollment.findMany({
    include: { course: true },
  });

  for (const enrollment of allEnrollments) {
    const course = enrollment.course;
    const price = Number(course.price);
    
    // 6.1 Create PAYMENT transaction for student
    await prisma.transaction.create({
      data: {
        amount: price,
        type: TransactionType.PAYMENT,
        status: TransactionStatus.COMPLETED,
        userId: enrollment.userId,
        courseId: course.id,
        description: `Thanh toán học phí: ${course.title}`,
      },
    });

    // 6.2 Create COMMISSION for Instructor (70%)
    await prisma.transaction.create({
      data: {
        amount: price * 0.7,
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
        userId: course.instructorId,
        courseId: course.id,
        description: `Hoa hồng giảng viên: ${course.title}`,
      },
    });

    // 6.3 Create COMMISSION for Affiliate (10%) (Randomly)
    if (Math.random() > 0.5) {
      await prisma.transaction.create({
        data: {
          amount: price * 0.1,
          type: TransactionType.COMMISSION,
          status: TransactionStatus.COMPLETED,
          userId: affiliate.id,
          courseId: course.id,
          description: `Hoa hồng Affiliate: ${course.title}`,
        },
      });
    }
  }

  // 6.4 Create 5 PENDING Withdrawal requests for Admin verification
  for (let i = 0; i < 5; i++) {
    const instructor = faker.helpers.arrayElement(instructors);
    await prisma.transaction.create({
      data: {
        amount: faker.number.int({ min: 500000, max: 2000000 }),
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        userId: instructor.id,
        description: `Yêu cầu rút tiền ${i + 1}`,
      },
    });
  }

  // 7. Create Support Tickets (10 total)
  for (let i = 0; i < 10; i++) {
    const user = faker.helpers.arrayElement(students);
    const isEscalated = i < 3; // Make the first 3 escalated for Admin
    await prisma.supportTicket.create({
      data: {
        subject: isEscalated ? `[ESCALATED] ${faker.lorem.sentence()}` : faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement([TicketType.GENERAL, TicketType.TECHNICAL, TicketType.BILLING]),
        status: faker.helpers.arrayElement([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]),
        senderId: user.id,
      },
    });
  }

  // 8. Create User Reports (10 total)
  for (let i = 0; i < 10; i++) {
    const reporter = faker.helpers.arrayElement(students);
    const reported = faker.helpers.arrayElement(instructors);
    const isEscalated = i < 3;
    await prisma.report.create({
      data: {
        reason: isEscalated ? `[ESCALATED] ${faker.lorem.sentence()}` : faker.lorem.sentence(),
        status: faker.helpers.arrayElement([ReportStatus.PENDING, ReportStatus.IN_PROGRESS]),
        reporterId: reporter.id,
        reportedUserId: reported.id,
      },
    });
  }

  // 9. Create Affiliate Links (10 total)
  for (let i = 0; i < 10; i++) {
    const course = courses[i % courses.length];
    await prisma.affiliateLink.create({
      data: {
        userId: affiliate.id,
        courseId: course.id,
        code: `AFF-${faker.string.alphanumeric(6).toUpperCase()}`,
        clicks: faker.number.int({ min: 0, max: 500 }),
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
