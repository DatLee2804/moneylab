import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'strong_pass123' },
        name: { type: 'string', example: 'Nguyen Van A' },
        phone: { type: 'string', example: '0123456789' },
        role: { type: 'string', enum: ['STUDENT', 'INSTRUCTOR'], example: 'STUDENT' }
      },
      required: ['email', 'password', 'name']
    }
  })
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'strong_pass123' }
      },
      required: ['email', 'password']
    }
  })
  async login(@Body() loginData: any) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.googleLogin(req.user);
    
    // Convert user object to base64 or encode component to pass via URL
    const userStr = encodeURIComponent(JSON.stringify(result.user));
    
    // Redirect to frontend callback page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${result.access_token}&user=${userStr}`);
  }
}
