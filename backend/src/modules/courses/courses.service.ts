import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../common/mail.service';
import { BunnyService } from '../videos/bunny.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly bunnyService: BunnyService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createCourseDto: any, instructorId: string) {
    const { includedCourseIds, ...restDto } = createCourseDto;
    
    const data: any = {
      ...restDto,
      instructorId,
      status: CourseStatus.PENDING,
    };

    if (restDto.isCombo && includedCourseIds?.length > 0) {
      data.includedCourses = {
        connect: includedCourseIds.map((id: string) => ({ id }))
      };
    }

    const course = await this.prisma.course.create({
      data,
      include: {
        _count: { select: { enrollments: true } },
        sections: { include: { _count: { select: { lessons: true } } } },
        includedCourses: true,
      }
    });
    return this.formatCourse(course);
  }

  async update(id: string, updateCourseDto: any) {
    const { includedCourseIds, ...restDto } = updateCourseDto;
    
    const data: any = { ...restDto };

    if (restDto.isCombo && includedCourseIds) {
      data.includedCourses = {
        set: includedCourseIds.map((courseId: string) => ({ id: courseId }))
      };
    }

    const updated = await this.prisma.course.update({
      where: { id },
      data,
      include: {
        _count: { select: { enrollments: true } },
        sections: { include: { _count: { select: { lessons: true } } } },
        includedCourses: true,
      }
    });
    return this.formatCourse(updated);
  }

  async delete(id: string) {
    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private formatCourse(course: any) {
    if (!course) return null;
    return {
      ...course,
      students: course._count?.enrollments || 0,
      lessons: course.sections?.reduce((acc: number, section: any) => {
        const count = section._count?.lessons ?? section.lessons?.length ?? 0;
        return acc + count;
      }, 0) || 0,
    };
  }

  async findAll(status?: CourseStatus) {
    const courses = await this.prisma.course.findMany({
      where: {
        ...(status ? { status } : {}),
        deletedAt: null,
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { enrollments: true },
        },
        sections: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map(course => this.formatCourse(course));
  }

  async findAllPage(status?: CourseStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: {
          ...(status ? { status } : {}),
          deletedAt: null,
        },
        skip,
        take: limit,
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { enrollments: true },
          },
          sections: {
            include: {
              _count: {
                select: { lessons: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({
        where: {
          ...(status ? { status } : {}),
          deletedAt: null,
        },
      })
    ]);

    const data = courses.map(course => this.formatCourse(course));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findByInstructor(instructorId: string, isCombo?: boolean) {
    const courses = await this.prisma.course.findMany({
      where: { 
        instructorId, 
        deletedAt: null,
        ...(isCombo !== undefined ? { isCombo: isCombo === true || String(isCombo) === 'true' } : {}) 
      },
      include: {
        _count: {
          select: { enrollments: true },
        },
        sections: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
        includedCourses: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map(course => this.formatCourse(course));
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: {
        instructor: {
          select: { 
            id: true, 
            name: true, 
            avatar: true, 
            bio: true, 
            specialization: true 
          },
        },
        _count: {
          select: { enrollments: true }
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Compute total duration (in minutes)
    const totalDuration = course.sections.reduce((acc, section) => 
      acc + section.lessons.reduce((lAcc, lesson) => lAcc + (lesson.duration || 0), 0), 0);

    // Compute total lessons
    const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

    // Compute student count formula: 250 + actual
    const displayStudents = 250 + course._count.enrollments;

    return {
      ...course,
      totalDuration,
      totalLessons,
      displayStudents,
    };
  }

  async updateStatus(id: string, status: CourseStatus, reason?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: { select: { email: true } } },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: { status },
    });

    // Send email notification to instructor
    if (course.instructor?.email) {
      await this.mailService.sendCourseStatus(
        course.instructor.email,
        course.title,
        status as 'APPROVED' | 'REJECTED',
        reason
      );
    }

    // Emit in-app notification
    await this.notificationsService.createNotification(
      course.instructorId,
      status === CourseStatus.APPROVED ? 'Khóa học được duyệt' : 'Khóa học bị từ chối',
      `Khóa học "${course.title}" của bạn đã ${status === CourseStatus.APPROVED ? 'được duyệt' : 'bị từ chối'}.${reason ? ` Lý do: ${reason}` : ''}`,
      'COURSE_APPROVED'
    );

    return updatedCourse;
  }

  // Section Management
  async createSection(courseId: string, data: any) {
    return this.prisma.courseSection.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  async updateSection(id: string, data: any) {
    return this.prisma.courseSection.update({
      where: { id },
      data,
    });
  }

  async deleteSection(id: string) {
    return this.prisma.courseSection.delete({
      where: { id },
    });
  }

  // Lesson Management
  async createLesson(sectionId: string, data: any) {
    return this.prisma.lesson.create({
      data: {
        ...data,
        sectionId,
      },
    });
  }

  async updateLesson(id: string, data: any) {
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  async getLessonDetail(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ 
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: {
              select: { isFree: true }
            }
          }
        }
      }
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    // Logic: If course is free, always allow video signature generation
    let videoEmbedUrl = null;
    if (lesson.bunnyVideoId) {
      videoEmbedUrl = this.bunnyService.generateSignedUrl(lesson.bunnyVideoId);
    }

    return {
      ...lesson,
      videoEmbedUrl,
    };
  }
}
