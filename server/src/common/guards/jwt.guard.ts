import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth: string = request.headers['authorization'] ?? '';
    if (!auth.startsWith('Bearer ')) throw new UnauthorizedException();
    try {
      request.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'bezkoder-secret-key');
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
