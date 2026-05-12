import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(studentId: string, courseId: string, bypassPaymentCheck = false) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({ 
      where: { id: courseId },
      include: { includedCourses: true }
    });
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

    return this.prisma.$transaction(async (tx) => {
      // Check if already enrolled
      const existingEnrollment = await tx.enrollment.findUnique({
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

      const coursesToEnroll = new Set<string>();
      coursesToEnroll.add(courseId);
      
      if (course.isCombo && course.includedCourses) {
        course.includedCourses.forEach(c => coursesToEnroll.add(c.id));
      }

      let primaryEnrollment = null;

      for (const cId of coursesToEnroll) {
        const existing = await tx.enrollment.findUnique({
          where: {
            userId_courseId: { userId: studentId, courseId: cId }
          }
        });

        if (!existing) {
          const newEnrollment = await tx.enrollment.create({
            data: {
              userId: studentId,
              courseId: cId,
              status: EnrollmentStatus.ENROLLED,
            }
          });
          if (cId === courseId) primaryEnrollment = newEnrollment;
        }
      }

      return primaryEnrollment;
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
    const enrollments = await this.prisma.enrollment.findMany({
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
      },
      orderBy: { enrolledAt: 'asc' },
    });

    // Group by user
    const studentMap = new Map<string, any>();

    for (const en of enrollments) {
      if (!studentMap.has(en.userId)) {
        studentMap.set(en.userId, {
          id: en.userId, // use userId as the unique ID for the list
          user: en.user,
          createdAt: en.enrolledAt, // earliest enrollment date
          courseCount: 0,
          totalProgress: 0,
        });
      }
      
      const st = studentMap.get(en.userId);
      st.courseCount += 1;
      st.totalProgress += en.progress;
    }

    return Array.from(studentMap.values()).map(st => ({
      id: st.id,
      user: st.user,
      createdAt: st.createdAt,
      courseCount: st.courseCount,
      progress: Math.floor(st.totalProgress / st.courseCount),
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
  