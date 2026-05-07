import { NestFactory } from '@nestjs/core';
import { GoogleDriveService } from './modules/videos/google-drive.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const driveService = app.get(GoogleDriveService);
  
  try {
    const folderId = '1BUATn16CPdzxPZPA4m73Onwxvl_yudNg';
    // @ts-ignore - accessing private drive for testing
    const response = await driveService.drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id, emailAddress, role)',
    });
    console.log('--- FOLDER PERMISSIONS ---');
    console.log(JSON.stringify(response.data.permissions, null, 2));
    console.log('---------------------------');
  } catch (error) {
    console.error('Error listing permissions:', error.message);
  } finally {
    await app.close();
  }
}
bootstrap();