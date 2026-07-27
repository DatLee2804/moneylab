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
}
