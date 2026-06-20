import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';

import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

const VALID_ROLES = ['user', 'admin', 'moderator', 'seller'];

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  async signup(dto: SignUpDto, origin: string) {
    const existing = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email is already in use!');

    if (dto.roles) {
      for (const r of dto.roles) {
        if (!VALID_ROLES.includes(r)) throw new BadRequestException(`Role does not exist: ${r}`);
      }
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 8),
      },
    });

    if (dto.roles) {
      const roles = await this.prisma.role.findMany({ where: { name: { in: dto.roles } } });
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

    this.mail.send({
      to: dto.email,
      subject: 'Успішна реєстрація',
      template: 'registration',
      context: { address: origin, name: dto.name },
    });

    return { message: 'User was registered successfully!' };
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User Not found.');

    const valid = bcrypt.compareSync(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid Password!');

    const token = this.jwt.sign({ id: user.id });

    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } },
    });
    const authorities = userWithRoles.roles.map((r) => `ROLE_${r.role.name.toUpperCase()}`);

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      wishlist: user.wishlist,
      roles: authorities,
      accessToken: token,
    };
  }

  async requestResetPassword(email: string, origin: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException('User Not found.');
    if (user.resetToken) return { message: 'Password Reset is already in process!' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);
    const expires = Date.now() + 1_800_000;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hash, expireToken: String(expires) },
    });

    const link = `${origin}/passwordReset?token=${resetToken}&id=${user.id}`;
    this.mail.send({
      to: email,
      subject: 'Запит на зміну пароля',
      template: 'resetPassRequest',
      context: { name: user.name || 'користувачу', link, address: origin },
    });

    return { message: 'Check your email', link };
  }

  async resetPassword(id: number, token: string, password: string, origin: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User Not found.');
    if (!user.resetToken) throw new BadRequestException('Invalid or expired password reset token');

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) throw new BadRequestException('Invalid or expired password reset token');

    const hash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hash, resetToken: null, expireToken: null },
    });

    this.mail.send({
      to: user.email,
      subject: 'Зміна пароля',
      template: 'resetPass',
      context: { name: user.name || 'користувачу', address: origin },
    });

    return { message: 'Password Reset Successfully' };
  }
}
