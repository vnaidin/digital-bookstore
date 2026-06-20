import { Test } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { PromocodesService } from './promocodes.service';

const makePrismaMock = () => ({
  promoCode: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe('PromocodesService', () => {
  let service: PromocodesService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        PromocodesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(PromocodesService);
  });

  describe('getAllPromocodes', () => {
    it('returns a valid base64-encoded JSON array', async () => {
      const codes = [{ id: 1, name: 'SALE10', percent: 10 }];
      prisma.promoCode.findMany.mockResolvedValue(codes);

      const result = await service.getAllPromocodes();

      const decoded = JSON.parse(Buffer.from(result, 'base64').toString('utf8'));
      expect(decoded).toEqual(codes);
    });
  });

  describe('getPromoByName', () => {
    it('uppercases the name before querying', async () => {
      prisma.promoCode.findFirst.mockResolvedValue(null);

      await service.getPromoByName('sale10');

      expect(prisma.promoCode.findFirst).toHaveBeenCalledWith({
        where: { name: 'SALE10' },
      });
    });
  });

  describe('createPromo', () => {
    it('coerces percent to a number and converts date strings to Date objects', async () => {
      prisma.promoCode.create.mockResolvedValue({});

      await service.createPromo({
        name: 'SUMMER',
        percent: '15' as any,
        from: '2024-06-01',
        till: '2024-08-31',
      });

      expect(prisma.promoCode.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            percent: 15,
            from: new Date('2024-06-01'),
            till: new Date('2024-08-31'),
          }),
        }),
      );
    });

    it('returns a message containing the promo name', async () => {
      prisma.promoCode.create.mockResolvedValue({});

      const result = await service.createPromo({ name: 'TEST', percent: 5, from: '2024-01-01', till: '2024-12-31' });
      expect(result.message).toMatch(/TEST/);
    });
  });

  describe('deletePromo', () => {
    it('uppercases the name before deleting', async () => {
      prisma.promoCode.deleteMany.mockResolvedValue({ count: 1 });

      await service.deletePromo('summer');

      expect(prisma.promoCode.deleteMany).toHaveBeenCalledWith({ where: { name: 'SUMMER' } });
    });
  });
});
