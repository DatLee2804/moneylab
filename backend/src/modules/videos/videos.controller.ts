import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GoogleDriveService } from './google-drive.service';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload video to Google Drive' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|mpeg|quicktime|x-msvideo|x-flv|x-matroska|webm)$/)) {
          return cb(new BadRequestException('Only video files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }
    
    try {
      const fileId = await this.googleDriveService.uploadVideo(file);
      // Trả về URL dạng trực tiếp hoặc ID để frontend xử lý
      // User muốn "trả lại 1 URL cho web để gắn vào bài giảng"
      // URL xem trực tiếp của Drive thường là https://drive.google.com/file/d/[ID]/view
      const videoUrl = `https://drive.google.com/file/d/${fileId}/view`;
      
      return {
        id: fileId,
        url: videoUrl,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload video to Google Drive: ' + error.message);
    }
  }

  // API hỗ trợ tìm folder ID (chỉ admin mới dùng được, nhưng tạm thời để hở để test)
  @Post('list-folders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listFolders() {
    return this.googleDriveService.listFolders();
  }
}
