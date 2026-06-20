import { Test } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { ItemsService } from './items.service';

const makePrismaMock = () => ({
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  item_managements: {
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
});

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ItemsService);
  });

  describe('getBookById', () => {
    it('returns null when the book does not exist', async () => {
      prisma.item.findUnique.mockResolvedValue(null);
      expect(await service.getBookById(999)).toBeNull();
    });

    it('flattens item_managements into item_management', async () => {
      prisma.item.findUnique.mockResolvedValue({
        id: 1,
        title: 'Test Book',
        item_managements: [{ amount: 5, comments: 'ok' }],
      });

      const result = await service.getBookById(1);
      expect(result).toMatchObject({ id: 1, item_management: { amount: 5 } });
      expect(result).not.toHaveProperty('item_managements');
    });
  });

  describe('getItemById', () => {
    it('calls prisma with the correct id', async () => {
      prisma.item.findUnique.mockResolvedValue({ id: 42, title: 'Thing' });
      await service.getItemById(42);
      expect(prisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 42 } });
    });
  });

  describe('deleteBook', () => {
    it('calls prisma.item.delete with the correct id', async () => {
      prisma.item.delete.mockResolvedValue({ id: 1 });
      await service.deleteBook(1);
      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('returns a success message', async () => {
      prisma.item.delete.mockResolvedValue({ id: 3 });
      const result = await service.deleteBook(3);
      expect(result.message).toMatch(/3/);
    });
  });

  describe('deleteMerch', () => {
    it('calls prisma.item.delete with the correct id', async () => {
      prisma.item.delete.mockResolvedValue({ id: 7 });
      await service.deleteMerch(7);
      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 7 } });
    });
  });

  describe('getBooks', () => {
    it('returns books, total, authors, publishers and minMaxPrice', async () => {
      prisma.item.findMany
        .mockResolvedValueOnce([{ id: 1, title: 'A', item_managements: [{ amount: 1, comments: '' }] }])
        .mockResolvedValueOnce([{ author: 'Author A', publisher: 'Pub A', price: 100 }]);
      prisma.item.count.mockResolvedValue(1);

      const result = await service.getBooks({});
      expect(result).toMatchObject({ total: 1, minMaxPrice: [100, 100] });
      expect(result.books[0]).toMatchObject({ id: 1, item_management: { amount: 1 } });
      expect(result.authors).toContain('Author A');
    });

    it('returns zero minMaxPrice when no items', async () => {
      prisma.item.findMany.mockResolvedValue([]);
      prisma.item.count.mockResolvedValue(0);
      const result = await service.getBooks({});
      expect(result.minMaxPrice).toEqual([0, 0]);
    });
  });
});
