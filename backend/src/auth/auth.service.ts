import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      if (user.status !== 'ACTIVE') {
        return null; // Or could throw an error if preferred
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    return this.usersService.create(userData);
  }

  async googleLogin(reqUser: any) {
    if (!reqUser) {
      throw new UnauthorizedException('No user from google');
    }

    // Find if user already exists
    let user = await this.usersService.findByEmail(reqUser.email);

    if (!user) {
      // Create new user if not exists
      // We generate a random password to satisfy schema requirements
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await this.usersService.create({
        email: reqUser.email,
        name: reqUser.name,
        password: randomPassword,
        avatar: reqUser.picture,
        role: reqUser.role || 'STUDENT', // Role from Google OAuth state
      });
    }

    // Issue JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
