import { Test } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { NewsService } from './news.service';

jest.mock('@/common/utils/save-upload', () => ({
  saveUpload: jest.fn(),
}));

import { saveUpload } from '@/common/utils/save-upload';
const mockSaveUpload = saveUpload as jest.Mock;

const makePrismaMock = () => ({
  news: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
});

describe('NewsService', () => {
  let service: NewsService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(NewsService);
  });

  describe('getNews', () => {
    it('fetches without pagination when page is undefined', async () => {
      prisma.news.findMany.mockResolvedValue([]);
      prisma.news.count.mockResolvedValue(0);

      await service.getNews();

      expect(prisma.news.findMany).toHaveBeenCalledWith({});
    });

    it('skips page * PAGE_SIZE items when page > 0', async () => {
      prisma.news.findMany.mockResolvedValue([]);
      prisma.news.count.mockResolvedValue(0);

      await service.getNews('2');

      expect(prisma.news.findMany).toHaveBeenCalledWith({ skip: 24, take: 12 });
    });

    it('starts from 0 when page is "0"', async () => {
      prisma.news.findMany.mockResolvedValue([]);
      prisma.news.count.mockResolvedValue(0);

      await service.getNews('0');

      expect(prisma.news.findMany).toHaveBeenCalledWith({ skip: 0, take: 12 });
    });

    it('returns news and total', async () => {
      const fakeNews = [{ id: 1, title: 'Article' }];
      prisma.news.findMany.mockResolvedValue(fakeNews);
      prisma.news.count.mockResolvedValue(1);

      const result = await service.getNews();
      expect(result).toEqual({ news: fakeNews, total: 1 });
    });
  });

  describe('createNews', () => {
    const baseBody = { author: 'A', text: 'T', title: 'Title', publisher: 'P', category: 'C' };

    it('converts showImage string "true" to boolean true', async () => {
      prisma.news.create.mockResolvedValue({});

      await service.createNews({ ...baseBody, showImage: 'true' });

      expect(prisma.news.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ showImage: true }) }),
      );
    });

    it('converts showImage string "false" to boolean false', async () => {
      prisma.news.create.mockResolvedValue({});

      await service.createNews({ ...baseBody, showImage: 'false' });

      expect(prisma.news.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ showImage: false }) }),
      );
    });

    it('sets image to null when no file is provided', async () => {
      prisma.news.create.mockResolvedValue({});

      await service.createNews({ ...baseBody, showImage: 'false' });

      expect(prisma.news.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ image: null }) }),
      );
    });

    it('calls saveUpload and stores the filename when a file is provided', async () => {
      mockSaveUpload.mockResolvedValue('news-image.jpg');
      prisma.news.create.mockResolvedValue({});
      const file = { fieldname: 'image', mimetype: 'image/jpeg', buffer: Buffer.from('data') };

      await service.createNews({ ...baseBody, showImage: 'true' }, file);

      expect(mockSaveUpload).toHaveBeenCalledWith(file);
      expect(prisma.news.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ image: 'news-image.jpg' }) }),
      );
    });
  });

  describe('updateNews', () => {
    it('keeps the existing image value when no file is uploaded', async () => {
      prisma.news.update.mockResolvedValue({});

      await service.updateNews(1, { image: 'old.jpg' });

      expect(prisma.news.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ image: 'old.jpg' }) }),
      );
    });

    it('replaces the image when a new file is uploaded', async () => {
      mockSaveUpload.mockResolvedValue('new.jpg');
      prisma.news.update.mockResolvedValue({});
      const file = { fieldname: 'image', mimetype: 'image/jpeg', buffer: Buffer.from('data') };

      await service.updateNews(1, { image: 'old.jpg' }, file);

      expect(prisma.news.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ image: 'new.jpg' }) }),
      );
    });
  });

  describe('deleteNews', () => {
    it('calls prisma.news.delete with the correct id', async () => {
      prisma.news.delete.mockResolvedValue({});

      await service.deleteNews(5);

      expect(prisma.news.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    });
  });
});
