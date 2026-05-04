import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { MailService } from '../../common/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(userData: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findInstructors() {
    return this.prisma.user.findMany({
      where: {
        role: Role.INSTRUCTOR,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  async findAll(role?: Role) {
    const users = await this.prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        deletedAt: null,
      },
      include: {
        ...(role === Role.INSTRUCTOR ? {
          courses: {
            include: {
              _count: {
                select: { enrollments: true }
              }
            }
          }
        } : {}),
        ...(role === Role.STUDENT ? {
          enrollments: true
        } : {})
      },
      orderBy: { createdAt: 'desc' },
    });

    if (role === Role.INSTRUCTOR) {
      return users.map(user => {
        const courses = (user as any).courses || [];
        const instructorStats = {
          courses: courses.length,
          students: courses.reduce((acc: number, c: any) => acc + (c._count?.enrollments || 0), 0),
          revenue: parseFloat(user.balance.toString()),
          rating: 4.5 + Math.random() * 0.5, // Mock rating until system implemented
        };
        
        const { courses: _, ...userData } = user as any;
        return {
          ...userData,
          ...instructorStats,
        };
      });
    }

    if (role === Role.STUDENT) {
      return users.map(user => {
        const enrollments = (user as any).enrollments || [];
        const studentStats = {
          enrolledCourses: enrollments.length,
          completedCourses: enrollments.filter((e: any) => e.progress === 100).length,
          affiliateRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(user.balance.toString())),
        };

        const { enrollments: _, ...userData } = user as any;
        return {
          ...userData,
          ...studentStats,
        };
      });
    }

    return users;
  }

  async update(id: string, updateData: any) {
    const user = await this.findById(id);
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Notify if locked
    if (updateData.status === 'BLOCKED' && user.status !== 'BLOCKED') {
      await this.mailService.sendAccountLocked(
        user.email,
        updateData.lockReason || 'Vi Phạm Quy Định của phần mềm'
      );
    }

    return updatedUser;
  }

  async remove(id: string) {
    try {
      const user = await this.findById(id);
      
      await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      return { 
        message: 'Đã xóa tài khoản thành công',
        status: 'DELETED' 
      };
    } catch (error: any) {
      console.error('Lỗi khi xóa tài khoản:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Người dùng không tồn tại.');
      }
      throw new ConflictException(`Lỗi không thể xóa tài khoản: ${error.message}`);
    }
  }
}
