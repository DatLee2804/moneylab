import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonCommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, lessonId: string, content: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lessonComment.create({
      data: {
        content,
        userId,
        lessonId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.lessonComment.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByInstructorStudent(instructorId: string, studentId: string) {
    // Find all courses owned by the instructor
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      select: { id: true },
    });
    const courseIds = courses.map(c => c.id);

    // Find all lessons in those courses
    const sections = await this.prisma.courseSection.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true },
    });
    const sectionIds = sections.map(s => s.id);

    const lessons = await this.prisma.lesson.findMany({
      where: { sectionId: { in: sectionIds } },
      select: { id: true },
    });
    const lessonIds = lessons.map(l => l.id);

    // Find comments by this student in these lessons
    return this.prisma.lessonComment.findMany({
      where: {
        lessonId: { in: lessonIds },
        userId: studentId,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            section: {
              select: {
                course: {
                  select: {
                    title: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
