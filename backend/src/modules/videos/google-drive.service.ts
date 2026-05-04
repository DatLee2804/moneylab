import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as stream from 'stream';

@Injectable()
export class GoogleDriveService {
  private drive;
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor(private configService: ConfigService) {
    this.initDrive();
  }

  private initDrive() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');

    if (refreshToken) {
      this.logger.log('Initializing Google Drive with OAuth2...');
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        this.configService.get<string>('GOOGLE_CALLBACK_URL')
      );

      oauth2Client.setCredentials({ refresh_token: refreshToken });
      this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    } else {
      this.logger.log('Initializing Google Drive with Service Account...');
      const clientEmail = this.configService.get<string>('GOOGLE_DRIVE_CLIENT_EMAIL');
      let privateKey = this.configService.get<string>('GOOGLE_DRIVE_PRIVATE_KEY');
      
      if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/^'|'$/g, '');
      }

      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']
      });

      this.drive = google.drive({ version: 'v3', auth });
    }
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    
    const fileMetadata = {
      name: `video_${Date.now()}_${file.originalname}`,
      parents: folderId && folderId !== 'your-folder-id-here' ? [folderId] : [],
    };

    const media = {
      mimeType: file.mimetype,
      body: stream.Readable.from(file.buffer),
    };

    try {
      this.logger.log(`Uploading file ${file.originalname} to Google Drive...`);
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
        supportsAllDrives: true,
      });

      const fileId = response.data.id;
      this.logger.log(`File uploaded successfully. ID: ${fileId}`);
      
      // Cấp quyền xem cho mọi người
      try {
        await this.drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      } catch (permError) {
        this.logger.warn(`Could not set public permissions for file ${fileId}: ${permError.message}`);
      }

      return fileId;
    } catch (error) {
      this.logger.error('Failed to upload to Google Drive', error);
      // Nếu lỗi do token hết hạn hoặc sai, có thể log cụ thể hơn
      throw error;
    }
  }

  async listFolders() {
    try {
      const response = await this.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name)',
      });
      return response.data.files;
    } catch (error) {
      this.logger.error('Failed to list folders', error);
      throw error;
    }
  }
}
