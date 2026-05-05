import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [VideosModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
