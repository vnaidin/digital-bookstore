import { Injectable } from '@nestjs/common';

import { FileUpload,saveUpload } from '@/common/utils/save-upload';
import { PrismaService } from '@/prisma/prisma.service';

const PAGE_SIZE = 12;

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async getAuthors(page?: string) {
    const p = page ? +page : 0;
    const pagination = page
      ? { skip: p > 0 ? PAGE_SIZE * p : 0, take: PAGE_SIZE }
      : {};

    const [authors, total] = await Promise.all([
      this.prisma.author.findMany(pagination as any),
      this.prisma.author.count(),
    ]);
    return { authors, total };
  }

  getAuthorById(id: number) {
    return this.prisma.author.findUnique({ where: { id } });
  }

  async createAuthor(body: Record<string, any>, file?: FileUpload) {
    const { fullName, pseudo, birthday, death, bio } = body;
    await this.prisma.author.create({
      data: { fullName, pseudo, birthday, death, bio, image: file ? await saveUpload(file) : null },
    });
    return { message: `${fullName} created` };
  }

  async updateAuthor(id: number, body: Record<string, any>, file?: FileUpload) {
    await this.prisma.author.update({
      where: { id },
      data: { ...body, image: file ? await saveUpload(file) : body.image },
    });
    return { message: `Author with id:${id} updated` };
  }

  async deleteAuthor(id: number) {
    await this.prisma.author.delete({ where: { id } });
    return { message: `Deleted author ${id}` };
  }
}
