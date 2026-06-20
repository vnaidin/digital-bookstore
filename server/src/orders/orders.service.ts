import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';

const MAILING_STATUSES: Record<number, string> = { 2: 'Доставка', 3: 'Завершений', 4: 'Скасований' };

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getOrders(status?: string) {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      where: status ? { status: +status } : undefined,
      include: { orderItems: true, order_addresses: true },
    });
  }

  getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true, order_addresses: true },
    }).then((o) => [o]);
  }

  getOrdersOfUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: true, order_addresses: true },
    });
  }

  async createOrder(body: Record<string, any>, origin: string) {
    const {
      userId, name, surname, phoneNumber, receiverName, receiverSurname, receiverPhoneNumber,
      email, order_address, comments, status, order_items, paymentMethodId, price, promocode,
    } = body;

    const order = await this.prisma.order.create({
      data: {
        userId: userId ? +userId : undefined,
        name, surname, phoneNumber, receiverName, receiverSurname, receiverPhoneNumber,
        email, comments, status: status ? +status : undefined,
        paymentMethodId: paymentMethodId ? +paymentMethodId : undefined,
        price: price ? +price : undefined,
        promocode: promocode ? String(promocode).toUpperCase() : '',
        orderItems: {
          create: (order_items as any[]).map((i) => ({ itemId: +i.itemId, price: +i.price })),
        },
        order_addresses: order_address
          ? { create: { ...order_address, flatNr: order_address.flatNr ? +order_address.flatNr : undefined } }
          : undefined,
      },
      include: { orderItems: true, order_addresses: true },
    });

    const amountById = (order_items as any[])
      .map((i) => i.itemId)
      .reduce<Record<string, number>>((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});

    await this.prisma.$transaction(
      Object.entries(amountById).map(([itemId, n]) =>
        this.prisma.item_managements.updateMany({
          where: { itemId: +itemId },
          data: { amount: { decrement: n }, purchasesCount: { increment: n } },
        }),
      ),
    );

    this.mail.send({
      to: email,
      subject: 'Ваше замовлення',
      template: 'orderSuccess',
      context: {
        address: origin, name,
        nOfItems: order_items.length,
        sum: price,
        orderPage: `${origin}/order/${order.id}`,
      },
    });

    return { message: 'New order created', id: order.id };
  }

  async updateOrder(id: number, body: { status: number; ttn?: string }, origin: string) {
    await this.prisma.order.update({
      where: { id },
      data: { status: body.status, ttn: body.ttn },
    });

    const updated = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true, order_addresses: true },
    });

    if (body.status > 1 && body.status < 5) {
      this.mail.send({
        to: updated.email,
        subject: 'Ваше замовлення',
        template: 'orderStatusChange',
        context: {
          address: origin,
          orderPage: `${origin}/order/${id}`,
          status: MAILING_STATUSES[body.status],
          ttn: body.ttn,
          nOfItems: updated.orderItems.length,
        },
      });
    }

    return { message: `Order ${id} updated` };
  }

  async updateOrderPaymentResult(body: { signature: string; data: string }) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(process.env.LIQ_PAY_PRIVATE + body.data + process.env.LIQ_PAY_PRIVATE);
    if (body.signature !== sha1.digest('base64')) return;

    const parsed = JSON.parse(Buffer.from(body.data, 'base64').toString('utf8'));
    await this.prisma.order.update({
      where: { id: parsed.order_id },
      data: { hasPaid: true },
    });
  }

  async deleteOneTimePromocode(promocode: string, id: number) {
    await this.prisma.$transaction([
      this.prisma.promoCode.deleteMany({ where: { name: promocode.toUpperCase() } }),
      this.prisma.order.update({ where: { id }, data: { promocode: null } }),
    ]);
    return { message: `One-time promo ${promocode} deleted from both tables` };
  }

  async deleteOrder(id: number) {
    await this.prisma.order.delete({ where: { id } });
    return { message: `Deleted order ${id}` };
  }

  searchOrders(search: string) {
    return this.prisma.order.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { surname: { contains: search } },
          { phoneNumber: { contains: search } },
        ],
      },
      include: { orderItems: true, order_addresses: true },
    });
  }
}
