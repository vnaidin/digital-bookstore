import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { ItemsModule } from '@/items/items.module';
import { AuthorsModule } from '@/authors/authors.module';
import { NewsModule } from '@/news/news.module';
import { OrdersModule } from '@/orders/orders.module';
import { PromocodesModule } from '@/promocodes/promocodes.module';

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
