import { CanActivate, ExecutionContext,Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '@/prisma/prisma.service';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } },
    });
    const userRoles = dbUser?.roles.map((r) => r.role.name) ?? [];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
