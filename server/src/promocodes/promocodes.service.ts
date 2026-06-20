import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PromocodesService {
  constructor(private prisma: PrismaService) {}

  async getAllPromocodes() {
    const codes = await this.prisma.promoCode.findMany();
    return Buffer.from(JSON.stringify(codes)).toString('base64');
  }

  async getPromoByName(name: string) {
    return this.prisma.promoCode.findFirst({
      where: { name: name.toUpperCase() },
    });
  }

  async createPromo(body: { name: string; percent: number; from: string; till: string }) {
    await this.prisma.promoCode.create({
      data: {
        name: body.name,
        percent: +body.percent,
        from: new Date(body.from),
        till: new Date(body.till),
      },
    });
    return { message: `PromoCode ${body.name} created` };
  }

  async deletePromo(name: string) {
    await this.prisma.promoCode.deleteMany({
      where: { name: name.toUpperCase() },
    });
    return { message: `Deleted PromoCode ${name}` };
  }
}
