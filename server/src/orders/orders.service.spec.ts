import { Test } from '@nestjs/testing';
import * as crypto from 'crypto';
import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';

import { OrdersService } from './orders.service';

const makePrismaMock = () => {
  const mock: any = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    item_managements: { updateMany: jest.fn() },
    promoCode: { deleteMany: jest.fn() },
  };
  mock.$transaction = jest.fn().mockImplementation((fn) => {
    if (typeof fn === 'function') return fn(mock);
    return Promise.resolve(fn);
  });
  return mock;
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: ReturnType<typeof makePrismaMock>;
  let mail: { send: jest.Mock };

  beforeAll(() => {
    process.env.LIQ_PAY_PRIVATE = 'test-private-key';
  });

  beforeEach(async () => {
    prisma = makePrismaMock();
    mail = { send: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mail },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  describe('createOrder', () => {
    const baseBody = {
      name: 'Ivan', surname: 'Test', phoneNumber: '0991234567',
      receiverName: 'Ivan', receiverSurname: 'Test', receiverPhoneNumber: '0991234567',
      email: 'a@b.com', order_address: null, comments: '',
      status: '1', order_items: [{ itemId: '10', price: '200' }, { itemId: '10', price: '200' }],
      paymentMethodId: '1', price: '400', promocode: 'summer',
    };

    beforeEach(() => {
      prisma.order.create.mockResolvedValue({ id: 1, email: 'a@b.com', orderItems: [] });
    });

    it('uppercases the promocode', async () => {
      await service.createOrder(baseBody, 'http://localhost');

      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ promocode: 'SUMMER' }),
        }),
      );
    });

    it('stores empty string when promocode is absent', async () => {
      await service.createOrder({ ...baseBody, promocode: undefined }, 'http://localhost');

      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ promocode: '' }),
        }),
      );
    });

    it('decrements stock for each unique item id', async () => {
      prisma.item_managements.updateMany.mockResolvedValue({ count: 1 });

      await service.createOrder(baseBody, 'http://localhost');

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.item_managements.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { itemId: 10 },
          data: { amount: { decrement: 2 }, purchasesCount: { increment: 2 } },
        }),
      );
    });

    it('sends a confirmation email', async () => {
      await service.createOrder(baseBody, 'http://localhost');

      expect(mail.send).toHaveBeenCalledWith(
        expect.objectContaining({ template: 'orderSuccess', to: 'a@b.com' }),
      );
    });

    it('returns the new order id', async () => {
      const result = await service.createOrder(baseBody, 'http://localhost');
      expect(result).toMatchObject({ id: 1 });
    });
  });

  describe('updateOrder', () => {
    const updatedOrder = { email: 'a@b.com', orderItems: [{ id: 1 }] };

    beforeEach(() => {
      prisma.order.update.mockResolvedValue({});
      prisma.order.findUnique.mockResolvedValue(updatedOrder);
    });

    it.each([2, 3, 4])('sends a status-change email for status %i', async (status) => {
      await service.updateOrder(1, { status }, 'http://localhost');

      expect(mail.send).toHaveBeenCalledWith(
        expect.objectContaining({ template: 'orderStatusChange', to: 'a@b.com' }),
      );
    });

    it.each([1, 5])('does not send an email for status %i', async (status) => {
      await service.updateOrder(1, { status }, 'http://localhost');

      expect(mail.send).not.toHaveBeenCalled();
    });

    it('includes the correct title in the email context', async () => {
      await service.updateOrder(1, { status: 2 }, 'http://localhost');

      expect(mail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({ title: 'Статус: Доставка' }),
        }),
      );
    });

    it('returns a success message', async () => {
      const result = await service.updateOrder(5, { status: 1 }, 'http://localhost');
      expect(result.message).toMatch(/5/);
    });
  });

  describe('updateOrderPaymentResult', () => {
    it('ignores calls with an invalid signature', async () => {
      const data = Buffer.from(JSON.stringify({ order_id: 42 })).toString('base64');

      await service.updateOrderPaymentResult({ signature: 'wrong', data });

      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('marks order as paid when signature is valid', async () => {
      const key = 'test-private-key';
      const data = Buffer.from(JSON.stringify({ order_id: 42 })).toString('base64');
      const hash = crypto.createHash('sha1');
      hash.update(key + data + key);
      const signature = hash.digest('base64');

      prisma.order.update.mockResolvedValue({});

      await service.updateOrderPaymentResult({ signature, data });

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 }, data: { hasPaid: true } }),
      );
    });
  });

  describe('deleteOneTimePromocode', () => {
    it('deletes the promo and nullifies it on the order in one transaction', async () => {
      prisma.promoCode.deleteMany.mockResolvedValue({ count: 1 });
      prisma.order.update.mockResolvedValue({});

      const result = await service.deleteOneTimePromocode('promo10', 7);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.promoCode.deleteMany).toHaveBeenCalledWith({ where: { name: 'PROMO10' } });
      expect(result.message).toMatch(/promo10/i);
    });
  });

  describe('deleteOrder', () => {
    it('calls prisma.order.delete with the correct id', async () => {
      prisma.order.delete.mockResolvedValue({});

      await service.deleteOrder(99);

      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });
});
