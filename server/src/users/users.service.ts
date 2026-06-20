import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
    });
  }

  getModerators() {
    return this.prisma.user.findMany({
      where: { roles: { some: { roleId: 2 } } },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async createUser(body: { name: string; email: string; password: string; roles?: string[] }) {
    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 8),
      },
    });

    if (body.roles) {
      const roles = await this.prisma.role.findMany({ where: { name: { in: body.roles } } });
      await this.prisma.userRole.createMany({
        data: roles.map((r) => ({ roleId: r.id, userId: user.id })),
        skipDuplicates: true,
      });
    } else {
      await this.prisma.userRole.upsert({
        where: { roleId_userId: { roleId: 1, userId: user.id } },
        update: {},
        create: { roleId: 1, userId: user.id },
      });
    }

    return { message: 'User was registered successfully!' };
  }

  async updateInfo(id: number, body: { name?: string; surname?: string; phoneNumber?: string; wishList?: string }) {
    await this.prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        surname: body.surname,
        phoneNumber: body.phoneNumber,
        wishlist: body.wishList ?? '',
      },
    });
    return { message: 'User info was updated' };
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: `Deleted user ${id}` };
  }
}
