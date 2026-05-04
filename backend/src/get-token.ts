import { google } from 'googleapis';
import * as readline from 'readline';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3001/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' // Quan trọng để lấy được Refresh Token
});

console.log('1. Mở trình duyệt và truy cập vào đường link này để cấp quyền:');
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('2. Sau khi đồng ý, trình duyệt sẽ chuyển hướng đến một trang lỗi (vì chưa có server chạy), hãy copy cái mã "code=..." trên thanh địa chỉ và dán vào đây: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Lỗi khi lấy token:', err);
    console.log('\n--- ĐÂY LÀ REFRESH TOKEN CỦA BẠN (HÃY COPY NÓ) ---');
    console.log(token?.refresh_token);
    console.log('--------------------------------------------------');
    console.log('\nSau đó hãy dán nó vào file .env: GOOGLE_REFRESH_TOKEN=cái-mã-vừa-copy');
  });
});
