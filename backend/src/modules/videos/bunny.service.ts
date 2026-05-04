import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class BunnyService {
  constructor(private configService: ConfigService) {}

  // Hàm tạo link có chữ ký để xem video, chống tải lậu
  generateSignedUrl(videoId: string) {
    const libraryId = this.configService.get<string>('BUNNY_LIBRARY_ID');
    const securityKey = this.configService.get<string>('BUNNY_SECURITY_KEY'); // Key này lấy trong phần Token Auth của Bunny
    
    // Nếu chưa có config thì trả về null hoặc link demo
    if (!libraryId || !securityKey) return `https://iframe.mediadelivery.net/play/demo/${videoId}`;

    // Link có hiệu lực trong 2 giờ
    const expires = Math.floor(Date.now() / 1000) + 7200; 
    
    // Công thức băm của Bunny.net
    const tokenData = securityKey + videoId + expires;
    const token = crypto.createHash('sha256').update(tokenData).digest('hex');

    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}`;
  }
}
