import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';

import { AuthService } from './auth.service';

const makePrismaMock = () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  role: { findMany: jest.fn() },
  userRole: {
    createMany: jest.fn(),
    upsert: jest.fn(),
  },
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-token') } },
        { provide: MailService, useValue: { send: jest.fn() } },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('signup', () => {
    it('throws BadRequestException when email is already in use', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com' });

      await expect(
        service.signup({ email: 'a@b.com', password: '123', name: 'A' }, 'http://localhost'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for an invalid role', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.signup(
          { email: 'a@b.com', password: '123', name: 'A', roles: ['superadmin'] },
          'http://localhost',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates a user and returns a success message', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, email: 'a@b.com', name: 'A' });
      prisma.userRole.upsert.mockResolvedValue({});

      const result = await service.signup(
        { email: 'a@b.com', password: '123', name: 'A' },
        'http://localhost',
      );

      expect(result.message).toMatch(/registered/i);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('assigns provided valid roles after creation', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 2, email: 'b@b.com', name: 'B' });
      prisma.role.findMany.mockResolvedValue([{ id: 2, name: 'moderator' }]);
      prisma.userRole.createMany.mockResolvedValue({ count: 1 });

      await service.signup(
        { email: 'b@b.com', password: '123', name: 'B', roles: ['moderator'] },
        'http://localhost',
      );

      expect(prisma.userRole.createMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: [{ roleId: 2, userId: 2 }] }),
      );
    });
  });

  describe('signin', () => {
    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.signin({ email: 'a@b.com', password: '123' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws UnauthorizedException for a wrong password', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1, password: 'not-a-real-hash' });

      await expect(service.signin({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('requestResetPassword', () => {
    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.requestResetPassword('unknown@b.com', 'http://localhost'),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns early if reset is already in progress', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1, resetToken: 'existing-token' });

      const result = await service.requestResetPassword('a@b.com', 'http://localhost');
      expect(result.message).toMatch(/already in process/i);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword(99, 'token', 'newpass', 'http://localhost'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when reset token is missing', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, resetToken: null });

      await expect(
        service.resetPassword(1, 'token', 'newpass', 'http://localhost'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
