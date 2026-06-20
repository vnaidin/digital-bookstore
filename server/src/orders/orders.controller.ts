import { Controller, Get, Post, Put, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('orders')
@Controller('api')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get('all/orders')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  getOrders(@Query('status') status?: string) {
    return this.orders.getOrders(status);
  }

  @Get('orders/search')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  searchOrders(@Query('search') search: string) {
    return this.orders.searchOrders(search);
  }

  @Get('all/orders/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getOrdersOfUser(@Param('userId') userId: string) {
    return this.orders.getOrdersOfUser(+userId);
  }

  @Get('order/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getOrderById(@Param('id') id: string) {
    return this.orders.getOrderById(+id);
  }

  @Post('order')
  createOrder(@Body() body: any, @Req() req: any) {
    return this.orders.createOrder(body, req.headers.origin || '');
  }

  @Post('order/payment-update')
  updateOrderPaymentResult(@Body() body: { signature: string; data: string }) {
    return this.orders.updateOrderPaymentResult(body);
  }

  @Put('order/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  updateOrder(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.orders.updateOrder(+id, body, req.headers.origin || '');
  }

  @Delete('order/:promocode/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deleteOneTimePromocode(@Param('promocode') promocode: string, @Param('id') id: string) {
    return this.orders.deleteOneTimePromocode(promocode, +id);
  }

  @Delete('order/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  deleteOrder(@Param('id') id: string) {
    return this.orders.deleteOrder(+id);
  }
}
