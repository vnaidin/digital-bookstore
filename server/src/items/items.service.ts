import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { FileUpload,saveUpload } from '@/common/utils/save-upload';
import { PrismaService } from '@/prisma/prisma.service';

const PAGE_SIZE = 12;

function getPagination(page?: string) {
  const p = page ? +page : 0;
  return {
    skip: p > 0 ? PAGE_SIZE * p : 0,
    take: page ? PAGE_SIZE : undefined,
  };
}

function parseOrder(order?: string): Prisma.ItemOrderByWithRelationInput | undefined {
  if (!order || order === '0') return undefined;
  const [field, dir] = order.split(',');
  return { [field]: dir } as Prisma.ItemOrderByWithRelationInput;
}

function categoryFilter(cat?: string): Prisma.ItemWhereInput {
  if (!cat) return {};
  return {
    OR: [
      { category: { startsWith: `${cat},` } },
      { category: { endsWith: `,${cat}` } },
      { category: { contains: `,${cat},` } },
      { category: { equals: cat } },
    ],
  };
}

const mgmtInclude = { item_managements: { select: { amount: true, comments: true } } } as const;

function flattenMgmt<T extends { item_managements?: { amount: number | null; comments: string | null }[] }>(
  item: T,
): Omit<T, 'item_managements'> & { item_management: { amount: number | null; comments: string | null } } {
  const { item_managements, ...rest } = item;
  return { ...rest, item_management: item_managements?.[0] ?? { amount: null, comments: null } };
}

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: Record<string, string>) {
    const { cat, page, order, priceRange, author, publisher, language } = query;

    const priceFilter: Prisma.ItemWhereInput = priceRange
      ? { price: { gte: +priceRange.split(',')[0], lte: +priceRange.split(',')[1] } }
      : {};

    const where: Prisma.ItemWhereInput = {
      AND: [
        { itemType: 'book' },
        categoryFilter(cat),
        priceFilter,
        author ? { author: { contains: author } } : {},
        publisher ? { publisher } : {},
        language ? { lang: language } : {},
      ],
    };

    const whereForMeta: Prisma.ItemWhereInput = {
      AND: [
        { itemType: 'book' },
        categoryFilter(cat),
        priceFilter,
        author ? { author: { contains: author } } : {},
        publisher ? { publisher } : {},
      ],
    };

    const [items, count, metaItems] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        orderBy: parseOrder(order),
        include: mgmtInclude,
        ...getPagination(page),
      }),
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({
        where: whereForMeta,
        select: { author: true, publisher: true, price: true },
      }),
    ]);

    const prices = metaItems.map((i) => i.price ?? 0);
    return {
      books: items.map(flattenMgmt),
      total: count,
      authors: [...new Set(metaItems.map((i) => i.author).filter(Boolean))],
      publishers: [...new Set(metaItems.map((i) => i.publisher).filter(Boolean))],
      minMaxPrice: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
    };
  }

  async getBookById(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id }, include: mgmtInclude });
    return item ? flattenMgmt(item) : null;
  }

  async createBook(body: Record<string, any>, files: Record<string, FileUpload[]>) {
    const { pageCount, isReducedNow, price, reducedPrice, author, coverType, lang,
      annotation, isbn, title, tags, publisher, year, category, amount, comments } = body;

    const [image, coverFront, coverBack] = await Promise.all([
      files?.image?.[0] ? saveUpload(files.image[0]) : null,
      files?.cover_front?.[0] ? saveUpload(files.cover_front[0]) : null,
      files?.cover_back?.[0] ? saveUpload(files.cover_back[0]) : null,
    ]);

    await this.prisma.item.create({
      data: {
        itemType: 'book',
        pageCount: +pageCount, isReducedNow: isReducedNow === 'true', price: +price,
        reducedPrice: +reducedPrice, author, lang, coverType: +coverType,
        annotation, isbn, title, tags, publisher, year: +year, category,
        image,
        covers: coverFront && coverBack ? `${coverFront},${coverBack}` : null,
        item_managements: { create: { amount: +amount, comments } },
      },
    });
    return { message: `Book ${title} created` };
  }

  async updateBook(id: number, body: Record<string, any>, files: Record<string, FileUpload[]>) {
    const { pageCount, isReducedNow, price, reducedPrice, author, lang, annotation,
      isbn, title, tags, publisher, year, category, amount, comments, coverType, image, covers } = body;

    const [newImage, coverFront, coverBack] = await Promise.all([
      files?.image?.[0] ? saveUpload(files.image[0]) : null,
      files?.cover_front?.[0] ? saveUpload(files.cover_front[0]) : null,
      files?.cover_back?.[0] ? saveUpload(files.cover_back[0]) : null,
    ]);

    await this.prisma.$transaction([
      this.prisma.item.update({
        where: { id },
        data: {
          pageCount: pageCount ? +pageCount : undefined, isReducedNow: isReducedNow === 'true',
          price: price ? +price : undefined, reducedPrice: reducedPrice ? +reducedPrice : undefined,
          author, lang, annotation, isbn, title, tags, publisher,
          year: year ? +year : undefined, category, coverType: coverType ? +coverType : undefined,
          image: newImage ?? image,
          covers: coverFront && coverBack ? `${coverFront},${coverBack}` : covers,
        },
      }),
      this.prisma.item_managements.updateMany({
        where: { itemId: id },
        data: { amount: amount ? +amount : undefined, comments },
      }),
    ]);
    return { message: `Book ${author}-${title} updated` };
  }

  async deleteBook(id: number) {
    await this.prisma.item.delete({ where: { id } });
    return { message: `Deleted book ${id}` };
  }

  async getMerch(query: Record<string, string>) {
    const { page, order, priceRange } = query;

    const priceFilter: Prisma.ItemWhereInput = priceRange
      ? { price: { gte: +priceRange.split(',')[0], lte: +priceRange.split(',')[1] } }
      : {};

    const where: Prisma.ItemWhereInput = { AND: [{ itemType: 'merch' }, priceFilter] };

    const [items, count, metaItems] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        orderBy: parseOrder(order),
        include: mgmtInclude,
        ...getPagination(page),
      }),
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({ where, select: { price: true } }),
    ]);

    const prices = metaItems.map((i) => i.price ?? 0);
    return {
      merch: items.map(flattenMgmt),
      total: count,
      minMaxPrice: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
    };
  }

  getMerchById(id: number) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async createMerch(body: Record<string, any>, file?: FileUpload) {
    const { isReducedNow, price, reducedPrice, annotation, title, tags, amount, comments } = body;
    await this.prisma.item.create({
      data: {
        itemType: 'merch',
        isReducedNow: isReducedNow === 'true', price: +price, reducedPrice: +reducedPrice,
        annotation, title, tags, image: file ? await saveUpload(file) : null,
        item_managements: { create: { amount: +amount, comments } },
      },
    });
    return { message: `Merch ${title} created` };
  }

  async updateMerch(id: number, body: Record<string, any>, file?: FileUpload) {
    const { isReducedNow, price, reducedPrice, annotation, title, tags, amount, comments, image } = body;
    await this.prisma.$transaction([
      this.prisma.item.update({
        where: { id },
        data: {
          isReducedNow: isReducedNow === 'true',
          price: price ? +price : undefined, reducedPrice: reducedPrice ? +reducedPrice : undefined,
          annotation, title, tags, image: file ? await saveUpload(file) : image,
        },
      }),
      this.prisma.item_managements.updateMany({
        where: { itemId: id },
        data: { amount: amount ? +amount : undefined, comments },
      }),
    ]);
    return { message: `Merch ${title} updated` };
  }

  async deleteMerch(id: number) {
    await this.prisma.item.delete({ where: { id } });
    return { message: `Deleted merch ${id}` };
  }

  getItemById(id: number) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  searchBooks(search: string) {
    return this.prisma.item.findMany({
      where: {
        itemType: 'book',
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
          { publisher: { contains: search } },
        ],
      },
      include: mgmtInclude,
    }).then((books) => ({ books: books.map(flattenMgmt) }));
  }

  searchMerch(search: string) {
    return this.prisma.item.findMany({
      where: { itemType: 'merch', title: { contains: search } },
      include: mgmtInclude,
    }).then((merch) => ({ merch: merch.map(flattenMgmt) }));
  }
}
