import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BunnyService } from './bunny.service';
import { GoogleDriveService } from './google-drive.service';

import { VideosController } from './videos.controller';

@Module({
  imports: [ConfigModule],
  providers: [BunnyService, GoogleDriveService],
  controllers: [VideosController],
  exports: [BunnyService, GoogleDriveService],
})
export class VideosModule {}
