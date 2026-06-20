import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { AuthorsModule } from '@/authors/authors.module';
import { ItemsModule } from '@/items/items.module';
import { MailModule } from '@/mail/mail.module';
import { NewsModule } from '@/news/news.module';
import { OrdersModule } from '@/orders/orders.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { PromocodesModule } from '@/promocodes/promocodes.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    AuthorsModule,
    NewsModule,
    OrdersModule,
    PromocodesModule,
  ],
})
export class AppModule {}
