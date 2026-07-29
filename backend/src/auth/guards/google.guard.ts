import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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

  handleRequest(err: any, user: any, info: any, context?: ExecutionContext) {
    if (err || !user) {
      const request = context?.switchToHttp().getRequest();
      const errorMessage = err?.message || info?.message || (typeof info === 'string' ? info : null) || 'google_auth_failed';
      console.error('[GoogleAuthGuard Error]:', errorMessage, { 
        url: request?.url || request?.originalUrl,
        query: request?.query,
        err, 
        info 
      });
      throw err || new UnauthorizedException(errorMessage);
    }
    return user;
  }
}
