import { Controller, Get, Post, Delete, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PromocodesService } from './promocodes.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

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
