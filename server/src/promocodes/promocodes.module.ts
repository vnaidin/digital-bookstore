import { Module } from '@nestjs/common';

import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  providers: [PromocodesService],
  controllers: [PromocodesController],
})
export class PromocodesModule {}
