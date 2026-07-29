import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.query.code) {
      const role = request.query.role || 'STUDENT';
      return {
        state: JSON.stringify({ role }),
      };
    }
    return undefined;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const response = context.switchToHttp().getResponse();
      const frontendUrl = process.env.FRONTEND_URL || 'https://moneylab.vn';
      const errorMessage = err?.message || info?.message || 'google_auth_failed';
      
      console.error('[GoogleAuthGuard Error]:', errorMessage, err);
      return response.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(errorMessage)}`);
    }
    return user;
  }
}
