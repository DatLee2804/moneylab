import { NestFactory } from '@nestjs/core';
import { VideosModule } from './modules/videos/videos.module';
import { GoogleDriveService } from './modules/videos/google-drive.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const driveService = app.get(GoogleDriveService);
  
  try {
    const folders = await driveService.listFolders();
    console.log('--- FOUND FOLDERS ---');
    console.log(JSON.stringify(folders, null, 2));
    console.log('----------------------');
  } catch (error) {
    console.error('Error listing folders:', error.message);
  } finally {
    await app.close();
  }
}
bootstrap();
