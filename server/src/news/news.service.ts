import { Injectable } from '@nestjs/common';

import { FileUpload,saveUpload } from '@/common/utils/save-upload';
import { PrismaService } from '@/prisma/prisma.service';

const PAGE_SIZE = 12;

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getNews(page?: string) {
    const p = page ? +page : 0;
    const pagination = page
      ? { skip: p > 0 ? PAGE_SIZE * p : 0, take: PAGE_SIZE }
      : {};

    const [news, total] = await Promise.all([
      this.prisma.news.findMany(pagination as any),
      this.prisma.news.count(),
    ]);
    return { news, total };
  }

  getNewsById(id: number) {
    return this.prisma.news.findUnique({ where: { id } });
  }

  async createNews(body: Record<string, any>, file?: FileUpload) {
    const { author, text, title, publisher, showImage, category } = body;
    await this.prisma.news.create({
      data: { author, text, title, publisher, category, showImage: showImage === 'true', image: file ? await saveUpload(file) : null },
    });
    return { message: `${title} created` };
  }

  async updateNews(id: number, body: Record<string, any>, file?: FileUpload) {
    await this.prisma.news.update({
      where: { id },
      data: { ...body, image: file ? await saveUpload(file) : body.image },
    });
    return { message: `News with id:${id} updated` };
  }

  async deleteNews(id: number) {
    await this.prisma.news.delete({ where: { id } });
    return { message: `Deleted news ${id}` };
  }
}
