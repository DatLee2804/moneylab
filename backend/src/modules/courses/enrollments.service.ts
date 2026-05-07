import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(studentId: string, courseId: string, bypassPaymentCheck = false) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (Number(course.price) > 0 && !course.isFree && !bypassPaymentCheck) {
      throw new ConflictException('This is a paid course. Enrollment must be done via payment flow.');
    }

    // Check if student exists
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId: courseId,
        },
      },
    });
    
    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    return this.prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId: courseId,
        status: EnrollmentStatus.ENROLLED,
      },
    });
  }

  async getStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getCourseEnrollments(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async completeLesson(studentId: string, lessonId: string) {
    // Tìm bài học để biết thuộc course nào
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true }
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    const courseId = lesson.section.courseId;

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Ghi nhận hoàn thành bài học
    await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: studentId,
          lessonId: lessonId,
        }
      },
      create: {
        userId: studentId,
        lessonId: lessonId,
      },
      update: {}
    });

    // Tính toán tiến độ thực tế
    const totalLessons = await this.prisma.lesson.count({
      where: { section: { courseId: courseId } }
    });

    const completedLessonsCount = await this.prisma.lessonProgress.count({
      where: {
        userId: studentId,
        lesson: {
          section: {
            courseId: courseId
          }
        }
      }
    });

    let newProgress = 0;
    if (totalLessons > 0) {
      newProgress = Math.min(100, Math.floor((completedLessonsCount / totalLessons) * 100));
    }

    let status: EnrollmentStatus = EnrollmentStatus.IN_PROGRESS;
    if (newProgress >= 100) {
      status = EnrollmentStatus.COMPLETED;
    }

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: newProgress,
        status,
      },
    });
  }

  async getInstructorStudents(instructorId: string) {
    // Get all courses owned by the instructor
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      select: { id: true },
    });

    const courseIds = courses.map(c => c.id);

    // Get all enrollments for these courses, including user info
    return this.prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
  