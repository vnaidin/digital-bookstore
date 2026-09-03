import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { PrismaService } from '@/prisma/prisma.service';

import { UsersService } from './users.service';

const makePrismaMock = () => ({
  user: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  role: { findMany: jest.fn() },
  userRole: {
    createMany: jest.fn(),
    upsert: jest.fn(),
  },
});

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('createUser', () => {
    beforeEach(() => {
      prisma.user.create.mockResolvedValue({ id: 5, email: 'x@y.com' });
    });

    it('assigns the default user role (id 1) via upsert when no roles are specified', async () => {
      prisma.userRole.upsert.mockResolvedValue({});

      await service.createUser({ name: 'A', email: 'a@b.com', password: 'pass' });

      expect(prisma.userRole.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { roleId_userId: { roleId: 1, userId: 5 } },
          create: { roleId: 1, userId: 5 },
        }),
      );
      expect(prisma.userRole.createMany).not.toHaveBeenCalled();
    });

    it('assigns specified roles via createMany when roles are provided', async () => {
      prisma.role.findMany.mockResolvedValue([{ id: 2, name: 'moderator' }]);
      prisma.userRole.createMany.mockResolvedValue({ count: 1 });

      await service.createUser({ name: 'B', email: 'b@b.com', password: 'pass', roles: ['moderator'] });

      expect(prisma.userRole.createMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: [{ roleId: 2, userId: 5 }] }),
      );
      expect(prisma.userRole.upsert).not.toHaveBeenCalled();
    });

    it('hashes the password before saving', async () => {
      prisma.userRole.upsert.mockResolvedValue({});

      await service.createUser({ name: 'C', email: 'c@b.com', password: 'plain-pass' });

      const saved = prisma.user.create.mock.calls[0][0].data;
      expect(saved.password).not.toBe('plain-pass');
      expect(saved.password).toMatch(/^\$2[aby]\$/);
    });

    it('returns a success message', async () => {
      prisma.userRole.upsert.mockResolvedValue({});
      const result = await service.createUser({ name: 'D', email: 'd@b.com', password: 'x' });
      expect(result.message).toMatch(/registered/i);
    });
  });

  describe('updateInfo', () => {
    it('calls prisma.user.update with the correct fields', async () => {
      prisma.user.update.mockResolvedValue({});

      await service.updateInfo(3, { name: 'NewName', phoneNumber: '0991112233' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 3 },
          data: expect.objectContaining({ name: 'NewName', phoneNumber: '0991112233' }),
        }),
      );
    });

    it('defaults wishlist to empty string when not provided', async () => {
      prisma.user.update.mockResolvedValue({});

      await service.updateInfo(3, { name: 'N' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ wishlist: '' }),
        }),
      );
    });
  });

  describe('deleteUser', () => {
    it('calls prisma.user.delete with the correct id', async () => {
      prisma.user.delete.mockResolvedValue({});
      await service.deleteUser(42);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 42 } });
    });

    it('returns a message containing the id', async () => {
      prisma.user.delete.mockResolvedValue({});
      const result = await service.deleteUser(42);
      expect(result.message).toMatch(/42/);
    });
  });
});
