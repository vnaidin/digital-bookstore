import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { PromocodesService } from './promocodes.service';

@ApiTags('promocodes')
@Controller('api')
export class PromocodesController {
  constructor(private promos: PromocodesService) {}

  @Get('all/promo')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  getAllPromocodes() {
    return this.promos.getAllPromocodes();
  }

  @Get('promo')
  getPromoByName(@Query('name') name: string) {
    return this.promos.getPromoByName(name);
  }

  @Post('promo')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  createPromo(@Body() body: any) {
    return this.promos.createPromo(body);
  }

  @Delete('promo/:name')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deletePromo(@Param('name') name: string) {
    return this.promos.deletePromo(name);
  }
}
