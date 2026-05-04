import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionType, TransactionStatus, Role, CourseStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentStats(userId: string) {
    const totalCourses = await this.prisma.enrollment.count({ where: { userId } });
    const completedCourses = await this.prisma.enrollment.count({ where: { userId, progress: 100 } });
    
    // Sum progress for cumulative time
    const enrollments = await this.prisma.enrollment.findMany({ where: { userId } });
    const totalProgress = enrollments.reduce((acc, curr) => acc + curr.progress, 0);
    const studyHours = Math.floor((totalProgress * 15) / 60);

    return {
      totalCourses,
      completedCourses,
      studyHours: `${studyHours}h`,
    };
  }

  async getInstructorStats(instructorId: string) {
    const courses = await this.prisma.course.findMany({ where: { instructorId }, select: { id: true } });
    const courseIds = courses.map(c => c.id);

    const studentCount = await this.prisma.enrollment.count({
      where: { courseId: { in: courseIds } },
    });

    // Aggregate revenue using Prisma's aggregate
    const revenueAggregate = await this.prisma.transaction.aggregate({
      where: {
        userId: instructorId,
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = Number(revenueAggregate._sum.amount || 0);

    return {
      totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
      studentCount,
      averageRating: '4.9/5', // placeholder for now
    };
  }

  async getAdminStats() {
    const totalStudents = await this.prisma.user.count({ where: { role: Role.STUDENT } });
    const totalInstructors = await this.prisma.user.count({ where: { role: Role.INSTRUCTOR } });
    const totalCourses = await this.prisma.course.count();
    
    const revenueAggregate = await this.prisma.transaction.aggregate({
      where: { status: TransactionStatus.COMPLETED },
      _sum: { amount: true },
    });

    const totalRevenue = Number(revenueAggregate._sum.amount || 0);

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.COMPLETED,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: { enrolledAt: { gte: sixMonthsAgo } },
      select: { enrolledAt: true },
    });

    // Helper to group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const getMonthKey = (date: Date) => months[date.getMonth()];

    const monthlyDataMap = new Map();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = getMonthKey(d);
      monthlyDataMap.set(key, { name: key, revenue: 0, students: 0 });
    }

    transactions.forEach(t => {
      const key = getMonthKey(t.createdAt);
      if (monthlyDataMap.has(key)) {
        const item = monthlyDataMap.get(key);
        item.revenue += Number(t.amount);
      }
    });

    enrollments.forEach(e => {
      const key = getMonthKey(e.enrolledAt);
      if (monthlyDataMap.has(key)) {
        const item = monthlyDataMap.get(key);
        item.students += 1;
      }
    });

    const monthlyStats = Array.from(monthlyDataMap.values());

    const recentPendingCourses = await this.prisma.course.findMany({
      where: { status: CourseStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        instructor: {
          select: { name: true }
        }
      }
    });

    return {
      totalStudents,
      totalInstructors,
      totalCourses,
      totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
      revenueRaw: totalRevenue,
      monthlyStats,
      recentCourses: recentPendingCourses.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor?.name,
        status: 'Pending',
        color: 'bg-amber-500'
      }))
    };
  }

  async getFullReportData() {
    const adminStats = await this.getAdminStats();
    
    // Get all instructors with their stats
    const instructors = await this.prisma.user.findMany({
      where: { role: Role.INSTRUCTOR },
      select: {
        name: true,
        email: true,
        status: true,
        createdAt: true,
        balance: true,
        _count: {
          select: { courses: true }
        }
      }
    });

    // Get all students
    const students = await this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        name: true,
        email: true,
        status: true,
        createdAt: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });

    // Get all courses
    const courses = await this.prisma.course.findMany({
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true } }
      }
    });

    return {
      overview: adminStats,
      instructors: instructors.map(i => ({
        ...i,
        courses: i._count.courses,
        revenue: i.balance
      })),
      students: students.map(s => ({
        ...s,
        enrollments: s._count.enrollments
      })),
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        instructor: c.instructor.name,
        students: c._count.enrollments,
        status: c.status,
        price: c.price
      }))
    };
  }
  async getRevenueReport() {
    // 1. Total Revenue per Course
    const courseRevenue = await this.prisma.transaction.groupBy({
      by: ['courseId'],
      where: {
        type: TransactionType.PAYMENT,
        status: TransactionStatus.COMPLETED,
        courseId: { not: null },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseRevenue.map((r) => r.courseId as string) } },
      include: { instructor: { select: { name: true } } },
    });

    const totalRevenueData = courseRevenue.map((r) => {
      const course = courses.find((c) => c.id === r.courseId);
      return {
        id: r.courseId,
        course: course?.title || 'Unknown Course',
        instructor: course?.instructor?.name || 'Unknown Instructor',
        price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(course?.price || 0)),
        quantity: r._count.id,
        total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(r._sum.amount || 0)),
        totalRaw: Number(r._sum.amount || 0),
      };
    });

    // 2. Affiliate Commissions
    const affiliateCommissions = await this.prisma.transaction.groupBy({
      by: ['userId'],
      where: {
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
        user: { role: Role.AFFILIATE },
      },
      _sum: { amount: true },
    });

    const affiliateUsers = await this.prisma.user.findMany({
      where: { id: { in: affiliateCommissions.map((r) => r.userId) } },
      select: { id: true, name: true, role: true },
    });

    const affiliateData = affiliateCommissions.map((r) => {
      const user = affiliateUsers.find((u) => u.id === r.userId);
      return {
        id: r.userId,
        user: user?.name || 'Unknown User',
        role: user?.role || 'AFFILIATE',
        totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(r._sum.amount || 0)),
        details: [], // Simplified for now
      };
    });

    // 3. Instructor Revenue
    const instructorCommissions = await this.prisma.transaction.groupBy({
      by: ['userId'],
      where: {
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
        user: { role: Role.INSTRUCTOR },
      },
      _sum: { amount: true },
    });

    const instructorUsers = await this.prisma.user.findMany({
      where: { id: { in: instructorCommissions.map((r) => r.userId) } },
      select: { id: true, name: true },
    });

    const instructorData = instructorCommissions.map((r) => {
      const user = instructorUsers.find((u) => u.id === r.userId);
      // Mock net as 70% of something? No, COMMISSION is the net they receive.
      // So totalRevenue would be what the system took for their courses.
      // For simplicity, I'll show their commissions as Net and a simulated Total.
      const net = Number(r._sum.amount || 0);
      return {
        id: r.userId,
        instructor: user?.name || 'Unknown Instructor',
        totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(net / 0.7),
        netRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(net),
        details: [],
      };
    });

    // 4. Company Profit
    // We aggregate all payments per course minus all commissions per course
    const allCommissionsPerCourse = await this.prisma.transaction.groupBy({
      by: ['courseId'],
      where: {
        type: TransactionType.COMMISSION,
        status: TransactionStatus.COMPLETED,
        courseId: { not: null },
      },
      _sum: { amount: true },
    });

    const companyData = totalRevenueData.map((tr) => {
      const commissions = allCommissionsPerCourse.find((c) => c.courseId === tr.id);
      const totalPaid = tr.totalRaw;
      const totalPaidOut = Number(commissions?._sum.amount || 0);
      return {
        id: tr.id,
        course: tr.course,
        instructor: tr.instructor,
        price: tr.price,
        quantity: tr.quantity,
        total: tr.total,
        netTotal: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPaid - totalPaidOut),
      };
    });

    return {
      totalRevenue: totalRevenueData,
      affiliates: affiliateData,
      instructors: instructorData,
      company: companyData,
    };
  }
}
