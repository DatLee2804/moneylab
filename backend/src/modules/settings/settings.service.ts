import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Seed default commission rate if not exists
    await this.ensureSetting('instructor_commission_rate', '70');
  }

  private async ensureSetting(key: string, defaultValue: string) {
    const existing = await this.prisma.systemSetting.findUnique({ where: { key } });
    if (!existing) {
      await this.prisma.systemSetting.create({
        data: { key, value: defaultValue }
      });
    }
  }

  async getSetting(key: string) {
    const setting = await this.prisma.systemSetting.findUnique({ where: { key } });
    return setting?.value || null;
  }

  async getAllSettings() {
    return this.prisma.systemSetting.findMany();
  }

  async updateSetting(key: string, value: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
}
