import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'test-client-id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'test-client-secret',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'https://api.moneylab.vn/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
      proxy: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const emails = profile?.emails || [];
      const email = emails[0]?.value;
      
      if (!email) {
        return done(new Error('No email found from Google profile'), false);
      }

      const givenName = profile?.name?.givenName || '';
      const familyName = profile?.name?.familyName || '';
      const fullName = (givenName + ' ' + familyName).trim() || profile?.displayName || email.split('@')[0];
      const picture = profile?.photos?.[0]?.value || null;

      let selectedRole = 'STUDENT';
      try {
        if (req.query.state) {
          const state = JSON.parse(req.query.state as string);
          if (state.role) {
            selectedRole = state.role;
          }
        }
      } catch(e) {}

      const user = {
        email,
        name: fullName,
        picture,
        role: selectedRole,
        accessToken,
      };
      done(null, user);
    } catch (err) {
      done(err as Error, false);
    }
  }
}
